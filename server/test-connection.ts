import { config } from 'dotenv';
import { checkDatabaseConnection } from './db';

// Load environment variables
config();

async function testConnection() {
  try {
    const result = await checkDatabaseConnection();
    console.log('Connection test result:', result);
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

testConnection(); 