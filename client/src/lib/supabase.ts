import { createClient } from '@supabase/supabase-js';

// Note: In a real implementation, you would use actual Supabase credentials
// For demonstration purposes, we'll use mock credentials that will be replaced
// with environment variables in a real deployment

const supabaseUrl = 'https://zxwaobyahgwaqyzgleli.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4d2FvYnlhaGd3YXF5emdsZWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5Nzc0NzksImV4cCI6MjA2MDU1MzQ3OX0.fYdZw3XEDVJu1P0jICRAnm85THpYoT1t6_u4IbPmG_k';

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
