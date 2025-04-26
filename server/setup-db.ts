import { config } from 'dotenv';
import { initDB } from './init-db';
import { runMigrations } from './migrations';
import { checkDatabaseConnection } from './db';

// Load environment variables
config();

async function setupDatabase() {
  try {
    console.log('Starting database setup...');
    
    // Check database connection
    console.log('Checking database connection...');
    const connectionResult = await checkDatabaseConnection();
    if (!connectionResult.success) {
      console.error('Database connection failed:', connectionResult.message);
      process.exit(1);
    }
    console.log('Database connection successful:', connectionResult.message);
    
    // Run migrations
    console.log('Running migrations...');
    await runMigrations();
    console.log('Migrations completed successfully');
    
    // Initialize database
    console.log('Initializing database...');
    await initDB();
    console.log('Database initialization completed successfully');
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase(); 