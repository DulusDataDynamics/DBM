'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';

import { Skeleton } from '@/components/ui/skeleton';

// Mock User Type
type MockUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  login: (email?: string, password?: string) => Promise<void>;
  signup: (email?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate checking for a logged-in user
    const checkUser = setTimeout(() => {
      const storedUser = sessionStorage.getItem('dulus-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(checkUser);
  }, []);

  const login = async (email = 'demo@dulus.com', password?: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const mockUser: MockUser = {
      uid: '12345-abcde',
      email: email,
      displayName: 'Demo User',
    };
    setUser(mockUser);
    sessionStorage.setItem('dulus-user', JSON.stringify(mockUser));
    setLoading(false);
    router.push('/dashboard');
  };

  const signup = async (email?: string, password?: string) => {
    await login(email, password); // For demo, signup is the same as login
  };

  const logout = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setUser(null);
    sessionStorage.removeItem('dulus-user');
    setLoading(false);
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
