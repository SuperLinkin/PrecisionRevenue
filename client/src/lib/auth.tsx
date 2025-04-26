import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Define proper types
interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  role: string;
  companyId?: number;
  tenantId?: number;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  role?: string;
  companyId?: number;
  tenantId?: number;
}

interface AuthError extends Error {
  code?: string;
  details?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<User>;
  register: (userData: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: async () => { throw new Error('Not implemented'); },
  register: async () => { throw new Error('Not implemented'); },
  logout: async () => { throw new Error('Not implemented'); },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);
  
  const login = async (username: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      if (!username || !password) {
        throw new Error('Username and password are required');
      }
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const userData = await response.json();
      setUser(userData);
      queryClient.setQueryData(['/api/auth/me'], userData);
      return userData;
    } catch (error) {
      const authError: AuthError = new Error(
        error instanceof Error ? error.message : 'Login failed'
      );
      authError.code = 'AUTH_ERROR';
      throw authError;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<User> => {
    setIsLoading(true);
    try {
      if (!userData.username || !userData.email || !userData.password) {
        throw new Error('Username, email, and password are required');
      }
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const newUser = await response.json();
      setUser(newUser);
      queryClient.setQueryData(['/api/auth/me'], newUser);
      return newUser;
    } catch (error) {
      const authError: AuthError = new Error(
        error instanceof Error ? error.message : 'Registration failed'
      );
      authError.code = 'AUTH_ERROR';
      throw authError;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      setUser(null);
      queryClient.setQueryData(['/api/auth/me'], null);
      queryClient.clear();
    } catch (error) {
      const authError: AuthError = new Error(
        error instanceof Error ? error.message : 'Logout failed'
      );
      authError.code = 'AUTH_ERROR';
      throw authError;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
