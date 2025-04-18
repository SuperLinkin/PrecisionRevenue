import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY must be set');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Checks if the Supabase connection is working
 * @returns {Promise<boolean>} True if the connection is working
 */
export async function checkSupabaseConnection(): Promise<{ success: boolean, message?: string }> {
  try {
    // Try to get a small amount of data from a table to verify connection
    const { data, error } = await supabase.from('users').select('id').limit(1);
    
    if (error) {
      return { 
        success: false, 
        message: `Error connecting to Supabase: ${error.message}` 
      };
    }
    
    return { 
      success: true, 
      message: 'Successfully connected to Supabase' 
    };
  } catch (err: any) {
    return { 
      success: false, 
      message: `Connection check failed: ${err.message}` 
    };
  }
}