import { Router } from 'express';
import { supabase } from './supabase';

const router = Router();

// Health check endpoint
router.get('/api/health', async (req, res) => {
  try {
    // Test Supabase connection
    const { data, error } = await supabase.from('users').select('count').single();
    
    if (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Database connection failed',
        error: error.message
      });
    }

    return res.status(200).json({
      status: 'healthy',
      message: 'Server is running and database is connected'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Auth check endpoint
router.get('/api/auth/check', async (req, res) => {
  const user = await supabase.auth.getUser();
  
  if (user.error) {
    return res.status(401).json({
      status: 'error',
      message: 'Not authenticated'
    });
  }

  return res.status(200).json({
    status: 'success',
    message: 'Authenticated',
    user: user.data.user
  });
});

export default router; 