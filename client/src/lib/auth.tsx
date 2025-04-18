import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { auth } from './supabase'; // Not using real auth service for MVP demo

// Mock user data for demonstration
const MOCK_USER = {
  id: 1,
  username: 'mvpranav',
  email: 'admin@precisonrevenue.com',
  fullName: 'Pranav Kumar',
  role: 'admin',
  companyId: 1,
};

type User = {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  role: string;
  companyId?: number;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<User>;
  register: (userData: any) => Promise<User>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo mode - using mock authentication
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(MOCK_USER); // Start with mock user already logged in
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  
  // Mock login function
  const login = async (username: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Always succeed with mock user in demo mode
      setUser(MOCK_USER);
      queryClient.setQueryData(['/api/auth/me'], MOCK_USER);
      return MOCK_USER;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock register function
  const register = async (userData: any): Promise<User> => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Always succeed with mock user in demo mode
      setUser(MOCK_USER);
      queryClient.setQueryData(['/api/auth/me'], MOCK_USER);
      return MOCK_USER;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock logout function
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      setUser(null);
      queryClient.setQueryData(['/api/auth/me'], null);
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
