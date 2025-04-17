import { createClient } from '@supabase/supabase-js';

// Note: In a real implementation, you would use actual Supabase credentials
// For demonstration purposes, we'll use mock credentials that will be replaced
// with environment variables in a real deployment

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Note: In this project, we're using our Express backend for authentication
// but in the future, we could switch to Supabase Auth for authentication
// These helpers will make that transition easier

export const auth = {
  signUp: async ({ email, password, userData }: { email: string; password: string; userData: any }) => {
    return await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...userData, email, password }),
    }).then(res => res.json());
  },
  
  signIn: async ({ username, password }: { username: string; password: string }) => {
    return await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    }).then(res => res.json());
  },
  
  signOut: async () => {
    return await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).then(res => res.json());
  },
  
  getUser: async () => {
    return await fetch('/api/auth/me', {
      credentials: 'include',
    }).then(res => {
      if (res.ok) return res.json();
      throw new Error("Not authenticated");
    });
  }
};

// Storage - for file uploads
export const storage = {
  upload: async (bucket: string, path: string, file: File) => {
    // In the future, will use Supabase Storage
    // For now, we're not implementing file uploads in this demo
    throw new Error("File uploads not implemented in this demo");
  }
};
