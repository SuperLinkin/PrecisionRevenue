import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { Session } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
    companyId: number;
    tenantId: number;
  };
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // DEMO MODE - Skip authentication check and use mock user
  req.user = {
    id: 1,
    username: 'mvpranav',
    role: 'admin',
    companyId: 1,
    tenantId: 1
  };
  return next();

  // Real authentication code (disabled for demo)
  /*
  if (!req.session?.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.session.userId));

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      companyId: user.companyId,
      tenantId: user.tenantId
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
  */
}; 