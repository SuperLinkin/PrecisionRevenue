import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { auth } from './supabase';

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: async () => {
      try {
        return await auth.getUser();
      } catch (error) {
        // Not authenticated, return null instead of throwing
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  const login = async (username: string, password: string) => {
    const user = await auth.signIn({ username, password });
    if (user.message) {
      throw new Error(user.message);
    }
    queryClient.setQueryData(['/api/auth/me'], user);
    return user;
  };

  const register = async (userData: any) => {
    const user = await auth.signUp({
      email: userData.email,
      password: userData.password,
      userData,
    });
    if (user.message) {
      throw new Error(user.message);
    }
    return user;
  };

  const logout = async () => {
    await auth.signOut();
    queryClient.setQueryData(['/api/auth/me'], null);
  };

  const value = {
    user: user as User | null,
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
