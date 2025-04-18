import express, { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertCompanySchema, 
  insertContractSchema,
  insertRevenueRecordSchema,
  insertTaskSchema
} from "@shared/schema";
import bcrypt from "bcryptjs";
import session from "express-session";
import MemoryStore from "memorystore";

// Emergency fix for contract API
import contractApiRouter from './contract-api';

// Import Revenue Recognition Routes
import { registerRevenueRecognitionRoutes } from './routes/revenue-recognition';

const SessionStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Express middleware configuration is handled in index.ts
  // Set up session middleware
  app.use(
    session({
      cookie: { maxAge: 86400000 }, // 24 hours
      store: new SessionStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      }),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "pra-secret-key"
    })
  );

  // Authentication middleware
  const authenticate = async (req: Request, res: Response, next: Function) => {
    // DEMO MODE - Skip authentication for MVP demo
    // Always provide a mock user for the demo
    req.user = {
      id: 1,
      username: 'mvpranav',
      email: 'admin@precisonrevenue.com',
      fullName: 'Pranav Kumar',
      role: 'admin',
      companyId: 1,
      password: 'mock-password-hash'
    };
    next();
    
    // Real authentication code (disabled for demo)
    /*
    if (!req.session.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
    */
  };

  // Admin middleware
  const requireAdmin = async (req: Request, res: Response, next: Function) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  };

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create user with hashed password
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword
      });
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set user in session
      req.session.userId = user.id;
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", authenticate, (req, res) => {
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });

  // Company routes
  app.get("/api/companies", authenticate, async (req, res) => {
    try {
      const companies = await storage.getCompanies();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch companies" });
    }
  });

  app.get("/api/companies/:id", authenticate, async (req, res) => {
    try {
      const company = await storage.getCompany(parseInt(req.params.id));
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch company" });
    }
  });

  app.post("/api/companies", authenticate, requireAdmin, async (req, res) => {
    try {
      const validatedData = insertCompanySchema.parse(req.body);
      const company = await storage.createCompany(validatedData);
      res.status(201).json(company);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create company" });
    }
  });

  app.put("/api/companies/:id", authenticate, requireAdmin, async (req, res) => {
    try {
      const validatedData = insertCompanySchema.partial().parse(req.body);
      const company = await storage.updateCompany(parseInt(req.params.id), validatedData);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to update company" });
    }
  });

  // Contract routes
  app.get("/api/contracts", authenticate, async (req, res) => {
    try {
      const companyId = req.query.companyId ? parseInt(req.query.companyId as string) : null;
      
      if (companyId) {
        const contracts = await storage.getContractsByCompany(companyId);
        return res.json(contracts);
      }
      
      // If not filtered by company, return all contracts from user's company
      const contracts = await storage.getContractsByCompany(req.user.companyId);
      res.json(contracts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contracts" });
    }
  });

  app.get("/api/contracts/:id", authenticate, async (req, res) => {
    try {
      const contract = await storage.getContract(parseInt(req.params.id));
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      res.json(contract);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contract" });
    }
  });

  app.post("/api/contracts", authenticate, async (req, res) => {
    try {
      // Format dates properly before validation
      const formattedBody = {
        ...req.body,
        companyId: req.user.companyId,
        createdBy: req.user.id,
        // Ensure dates are in ISO format for proper parsing
        startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
        endDate: req.body.endDate ? new Date(req.body.endDate) : undefined
      };

      const validatedData = insertContractSchema.parse(formattedBody);
      
      const contract = await storage.createContract(validatedData);
      res.status(201).json(contract);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors);
        return res.status(400).json({ message: error.errors });
      }
      console.error("Contract creation error:", error);
      res.status(500).json({ message: "Failed to create contract" });
    }
  });

  app.put("/api/contracts/:id", authenticate, async (req, res) => {
    try {
      // Format dates properly before validation
      const formattedBody = {
        ...req.body,
        // Ensure dates are in ISO format for proper parsing
        startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
        endDate: req.body.endDate ? new Date(req.body.endDate) : undefined
      };

      const validatedData = insertContractSchema.transform((data) => data).partial().parse(formattedBody);
      const contract = await storage.updateContract(parseInt(req.params.id), validatedData);
      
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      res.json(contract);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors);
        return res.status(400).json({ message: error.errors });
      }
      console.error("Contract update error:", error);
      res.status(500).json({ message: "Failed to update contract" });
    }
  });

  // Revenue record routes
  app.get("/api/revenue-records", authenticate, async (req, res) => {
    try {
      const contractId = req.query.contractId ? parseInt(req.query.contractId as string) : null;
      
      if (!contractId) {
        return res.status(400).json({ message: "Contract ID required" });
      }
      
      const records = await storage.getRevenueRecordsByContract(contractId);
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch revenue records" });
    }
  });

  app.post("/api/revenue-records", authenticate, async (req, res) => {
    try {
      const validatedData = insertRevenueRecordSchema.parse(req.body);
      const record = await storage.createRevenueRecord(validatedData);
      res.status(201).json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create revenue record" });
    }
  });

  app.put("/api/revenue-records/:id", authenticate, async (req, res) => {
    try {
      const validatedData = insertRevenueRecordSchema.partial().parse(req.body);
      const record = await storage.updateRevenueRecord(parseInt(req.params.id), validatedData);
      if (!record) {
        return res.status(404).json({ message: "Revenue record not found" });
      }
      res.json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to update revenue record" });
    }
  });

  // Task routes
  app.get("/api/tasks", authenticate, async (req, res) => {
    try {
      const assignedTo = req.query.assignedTo ? parseInt(req.query.assignedTo as string) : null;
      
      if (assignedTo) {
        const tasks = await storage.getTasksByAssignee(assignedTo);
        return res.json(tasks);
      }
      
      // If not filtered by assignee, return all tasks for user's company
      const tasks = await storage.getTasksByCompany(req.user.companyId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", authenticate, async (req, res) => {
    try {
      const validatedData = insertTaskSchema.parse({
        ...req.body,
        companyId: req.user.companyId
      });
      
      const task = await storage.createTask(validatedData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.put("/api/tasks/:id", authenticate, async (req, res) => {
    try {
      const validatedData = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(parseInt(req.params.id), validatedData);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  // AI Contract Analysis Routes - Use emergency fix for MVP demo
  app.use('/api/contracts', contractApiRouter);
  
  // Register IFRS 15/ASC 606 Revenue Recognition Routes
  registerRevenueRecognitionRoutes(app);
  
  // Original implementation (disabled for demo)
  /*
  app.post("/api/contracts/extract", authenticate, async (req, res) => {
    try {
      const { text, fileName } = req.body;
      
      // Import dynamically to avoid errors if OpenAI API key is not set
      const { extractContractData } = await import('./utils/openai');
      
      // Create a comprehensive demo contract that will provide consistent responses
      // Extract info from filename to personalize responses if available
      const parts = fileName ? fileName.replace('.pdf', '').split('-') : ['SaaS', 'TechCorp'];
      const contractType = parts[0]?.trim() || 'SaaS';
      const clientName = parts[1]?.trim() || 'TechCorp';
      
      // Store contract details in session for future use
      req.session.contractType = contractType;
      req.session.clientName = clientName;
      req.session.fileName = fileName;

      console.log("Processing contract:", fileName);
      
      // Generate detailed demo contract text
      const demoContractText = `
MASTER ${contractType.toUpperCase()} AGREEMENT

Agreement Number: CT-${Math.floor(Math.random() * 1000)}-${new Date().getFullYear()}
Effective Date: ${new Date().toISOString().split('T')[0]}

This agreement is made between Precision Revenue Automation ("Provider") and ${clientName} ("Client").

1. SERVICES
Provider agrees to provide the ${contractType} services described in Attachment A to Client.

2. TERM
The term of this Agreement shall commence on the Effective Date and continue for a period of 12 months.

3. FEES AND PAYMENT
3.1 Client agrees to pay Provider a total of $50,000.00 for the services described herein.
3.2 The payment schedule will be as follows:
  - Initial payment: $12,500.00 due upon execution of this Agreement
  - Second payment: $12,500.00 due 3 months after the Effective Date
  - Third payment: $12,500.00 due 6 months after the Effective Date
  - Final payment: $12,500.00 due 9 months after the Effective Date
3.3 All payments are due within 30 days of receipt of invoice.

4. INTELLECTUAL PROPERTY
4.1 All intellectual property created by Provider during the performance of this Agreement shall remain the property of Provider.
4.2 Client is granted a non-exclusive, non-transferable license to use the deliverables for its internal business purposes.

5. TERMINATION
5.1 Either party may terminate this Agreement with 60 days written notice.
5.2 Upon termination, Client shall pay Provider for all services rendered up to the date of termination.

6. WARRANTIES AND REPRESENTATIONS
6.1 Provider warrants that the services will be performed in a professional manner.
6.2 Provider warrants a service level of 99.9% uptime for all SaaS services.

7. CONFIDENTIALITY
Both parties agree to maintain the confidentiality of all proprietary information received from the other party.

8. GOVERNING LAW
This Agreement shall be governed by the laws of the State of California.

SIGNATURES:

Client: ${clientName}
Provider: Precision Revenue Automation
Date: ${new Date().toISOString().split('T')[0]}
      `;
      
      // Store the contract text in session for later use
      req.session.contractText = demoContractText;
      
      // Demo data that will be shown in the UI
      const extractedData = {
        name: `${contractType} Agreement`,
        contractNumber: `CT-001-${new Date().getFullYear()}`,
        clientName: clientName,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 7)),
        value: 50000,
        keyTerms: [
          "Net 30 payment terms",
          "Auto-renewal clause",
          "Termination with 60 days notice",
          "Confidentiality agreement",
          "Service level agreement of 99.9% uptime"
        ]
      };
      
      res.json(extractedData);
    } catch (error) {
      console.error("Contract extraction error:", error);
      res.status(500).json({ message: "Failed to extract contract data" });
    }
  });
  
  app.post("/api/contracts/ask", authenticate, async (req, res) => {
    try {
      const { question, fileName } = req.body;
      
      if (!question) {
        return res.status(400).json({ message: "Question is required" });
      }
      
      console.log("Answering REMY question:", question);
      
      // Import dynamically to avoid errors if OpenAI API key is not set
      const { answerContractQuestion } = await import('./utils/openai');
      
      // First try to get the contract from the session (from previous extraction)
      let contractText = req.session.contractText;
      
      // If we don't have a stored contract, create one based on filename
      if (!contractText) {
        console.log("No existing contract in session, creating one");
        const fileNameToUse = fileName || req.session.fileName || 'Contract.pdf';
        const parts = fileNameToUse.replace('.pdf', '').split('-');
        const contractType = parts[0]?.trim() || 'SaaS';
        const clientName = parts[1]?.trim() || 'TechCorp';
        
        // Create a consistent contract with the same format as the extract endpoint
        contractText = `
MASTER ${contractType.toUpperCase()} AGREEMENT

Agreement Number: CT-${Math.floor(Math.random() * 1000)}-${new Date().getFullYear()}
Effective Date: ${new Date().toISOString().split('T')[0]}

This agreement is made between Precision Revenue Automation ("Provider") and ${clientName} ("Client").

1. SERVICES
Provider agrees to provide the ${contractType} services described in Attachment A to Client.

2. TERM
The term of this Agreement shall commence on the Effective Date and continue for a period of 12 months.

3. FEES AND PAYMENT
3.1 Client agrees to pay Provider a total of $50,000.00 for the services described herein.
3.2 The payment schedule will be as follows:
  - Initial payment: $12,500.00 due upon execution of this Agreement
  - Second payment: $12,500.00 due 3 months after the Effective Date
  - Third payment: $12,500.00 due 6 months after the Effective Date
  - Final payment: $12,500.00 due 9 months after the Effective Date
3.3 All payments are due within 30 days of receipt of invoice.

4. INTELLECTUAL PROPERTY
4.1 All intellectual property created by Provider during the performance of this Agreement shall remain the property of Provider.
4.2 Client is granted a non-exclusive, non-transferable license to use the deliverables for its internal business purposes.

5. TERMINATION
5.1 Either party may terminate this Agreement with 60 days written notice.
5.2 Upon termination, Client shall pay Provider for all services rendered up to the date of termination.

6. WARRANTIES AND REPRESENTATIONS
6.1 Provider warrants that the services will be performed in a professional manner.
6.2 Provider warrants a service level of 99.9% uptime for all SaaS services.

7. CONFIDENTIALITY
Both parties agree to maintain the confidentiality of all proprietary information received from the other party.

8. GOVERNING LAW
This Agreement shall be governed by the laws of the State of California.

SIGNATURES:

Client: ${clientName}
Provider: Precision Revenue Automation
Date: ${new Date().toISOString().split('T')[0]}
        `;
        
        // Store the contract for future questions
        req.session.contractText = contractText;
      }
      
      console.log("Using contract text to answer question");
      
      // Process the question with our fixed contract
      const answer = await answerContractQuestion(contractText, question);
      res.json({ answer });
    } catch (error) {
      console.error("Contract Q&A error:", error);
      res.status(500).json({ message: "Failed to answer question" });
    }
  });

  const httpServer = createServer(app);

  */

  // Add this closing tag for the commented out API section
  
  const httpServer = createServer(app);
  return httpServer;
}
