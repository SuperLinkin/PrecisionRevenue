import './config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initDB } from "./init-db";
import { runMigrations } from "./migrations";
import { config } from './config';
// Remove @xenova/transformers import since it's not found
import { TextAnalysisService } from './services/TextAnalysisService';

// Define error types
interface AppError extends Error {
  status?: number;
  statusCode?: number;
  path?: string;
  method?: string;
}

// Define log data interface
interface LogData {
  timestamp: string;
  method: string;
  path: string;
  status: number;
  duration: string;
  userAgent?: string;
  ip?: string;
  response?: any;
}

const app = express();

// Configure CORS headers manually until cors package is installed
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Increase payload size limit for contract uploads (50mb)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Simplified request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  const method = req.method;
  
  // Store original methods
  const originalJson = res.json;
  const originalSend = res.send;
  
  // Override json method to capture response
  res.json = function(body: any) {
    // Log the response
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      const logData: LogData = {
        timestamp: new Date().toISOString(),
        method,
        path,
        status: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get('user-agent') || undefined,
        ip: req.ip || undefined,
        response: body
      };
      
      log(JSON.stringify(logData));
    }
    
    // Call original method
    return originalJson.call(this, body);
  };
  
  // Override send method to capture response
  res.send = function(body: any) {
    // Log the response if it's JSON
    const duration = Date.now() - start;
    if (path.startsWith("/api") && typeof body === 'string') {
      try {
        const jsonBody = JSON.parse(body);
        const logData: LogData = {
          timestamp: new Date().toISOString(),
          method,
          path,
          status: res.statusCode,
          duration: `${duration}ms`,
          userAgent: req.get('user-agent') || undefined,
          ip: req.ip || undefined,
          response: jsonBody
        };
        
        log(JSON.stringify(logData));
      } catch (e) {
        // Not JSON, just log basic info
        const logData: LogData = {
          timestamp: new Date().toISOString(),
          method,
          path,
          status: res.statusCode,
          duration: `${duration}ms`,
          userAgent: req.get('user-agent') || undefined,
          ip: req.ip || undefined
        };
        
        log(JSON.stringify(logData));
      }
    }
    
    // Call original method
    return originalSend.call(this, body);
  };

  next();
});

// Initialize text analysis service
const textAnalysisService = new TextAnalysisService();

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy' });
});

// Contract analysis endpoint
app.post('/analyze', async (_req, res) => {
  try {
    const { text } = _req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const analysis = await textAnalysisService.analyzeContract(text);
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing contract:', error);
    res.status(500).json({ error: 'Failed to analyze contract' });
  }
});

(async () => {
  try {
    console.log('Starting server initialization...');
    
    // Initialize database
    console.log('Initializing database...');
    await initDB();
    console.log('Database initialized successfully');
    
    // Run any necessary migrations
    console.log('Running migrations...');
    await runMigrations();
    console.log('Migrations completed successfully');
    
    console.log('Registering routes...');
    const server = await registerRoutes(app);
    console.log('Routes registered successfully');

    // Improved error handling middleware
    app.use((err: AppError, _req: Request, res: Response, _next: NextFunction) => {
      console.error('Error:', {
        message: err.message,
        stack: err.stack,
        status: err.status || err.statusCode,
        path: err.path || 'unknown',
        method: err.method || 'unknown'
      });

      // Don't expose internal error details in production
      const message = process.env.NODE_ENV === 'production' 
        ? 'Internal Server Error' 
        : err.message || 'Internal Server Error';

      const status = err.status || err.statusCode || 500;
      
      res.status(status).json({ 
        error: {
          message,
          status,
          // Only include stack trace in development
          ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
        }
      });
    });

    // Setup Vite or static serving
    if (app.get("env") === "development") {
      console.log('Setting up Vite...');
      await setupVite(app, server);
      console.log('Vite setup completed');
    } else {
      console.log('Setting up static file serving...');
      serveStatic(app);
      console.log('Static file serving setup completed');
    }

    // Use port from config
    const port = config.port;
    console.log(`Starting server on port ${port}...`);
    
    server.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('Press Ctrl+C to stop the server');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
