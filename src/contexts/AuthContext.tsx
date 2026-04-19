import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { authService } from '../lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((newUser) => {
      setUser(newUser);
      setLoading(false);
    });

    return () => unsubscribe?.();
  }, []);

  const signUp = async (email: string, password: string, username: string, displayName: string) => {
    const { error } = await authService.signUp(email, password, username, displayName);
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await authService.signIn(email, password);
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await authService.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
