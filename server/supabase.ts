import { createClient } from '@supabase/supabase-js';

// Get environment variables with validation
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY must be set');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

interface SupabaseConnectionResult {
  success: boolean;
  message?: string;
  version?: string;
}

/**
 * Checks if the Supabase connection is working
 * @returns {Promise<SupabaseConnectionResult>} Connection status
 */
export async function checkSupabaseConnection(): Promise<SupabaseConnectionResult> {
  try {
    // Just perform a basic auth check to verify the connection
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      return { 
        success: false, 
        message: `Error connecting to Supabase: ${error.message}` 
      };
    }
    
    // If we get here, our connection to Supabase is working
    // We can't check tables directly, but we can get version info
    const versionResponse = await supabase.from('_version').select('*').maybeSingle();
    const version = versionResponse.data ? versionResponse.data.version : 'unknown';

    return { 
      success: true, 
      message: 'Successfully connected to Supabase',
      version
    };
  } catch (error) {
    const err = error as Error;
    console.error("Supabase connection error:", err);
    return { 
      success: false, 
      message: `Connection check failed: ${err.message}` 
    };
  }
}