
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Define types for our authentication
export interface User {
  id: string;
  email: string;
  name?: string;
  isSubscribed: boolean;
  scanCount: number;
  subscriptionExpiresAt?: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isPremium: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  remainingScans: number;
  incrementScanCount: () => void;
  subscribe: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Constants
const MAX_FREE_SCANS = 10;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Check for session on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setSupabaseUser(session.user);
          await fetchUserProfile(session.user);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setSupabaseUser(session.user);
          await fetchUserProfile(session.user);
        } else {
          setSupabaseUser(null);
          setUser(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Fetch the user's profile from the database
  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: data.name,
          isSubscribed: data.is_subscribed || false,
          scanCount: data.scan_count || 0,
          subscriptionExpiresAt: data.subscription_expires_at ? new Date(data.subscription_expires_at) : undefined
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load user profile');
    }
  };

  // Check if user is premium
  const isPremium = (): boolean => {
    if (!user) return false;
    if (!user.isSubscribed) return false;
    
    // Check if subscription is still valid
    if (user.subscriptionExpiresAt) {
      return new Date() < new Date(user.subscriptionExpiresAt);
    }
    
    return user.isSubscribed;
  };
  
  // Calculate remaining scans
  const remainingScans = user ? (isPremium() ? Infinity : MAX_FREE_SCANS - user.scanCount) : 0;

  // Login function using Supabase
  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      if (data?.user) {
        toast.success('Login successful');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please check your credentials.');
      throw error;
    }
  };

  // Signup function using Supabase
  const signup = async (email: string, password: string, name?: string) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Account created successfully');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  // Logout function using Supabase
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      toast.info('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  // Increment scan count
  const incrementScanCount = async () => {
    if (!user) return;
    
    try {
      // Update local state
      const newScanCount = user.scanCount + 1;
      setUser({
        ...user,
        scanCount: newScanCount
      });
      
      // Update in database
      const { error } = await supabase
        .from('profiles')
        .update({ scan_count: newScanCount })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error incrementing scan count:', error);
      toast.error('Failed to update scan count');
    }
  };

  // Subscribe to premium
  const subscribe = async () => {
    if (!user) return;
    
    try {
      // Set subscription for 1 year
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      
      // Update local state
      setUser({
        ...user,
        isSubscribed: true,
        subscriptionExpiresAt: expiryDate
      });
      
      // Update in database
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_subscribed: true,
          subscription_expires_at: expiryDate.toISOString()
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast.success('Subscription successful! You now have unlimited scans.');
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.error('Failed to process subscription');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isPremium: isPremium(),
        login,
        signup,
        logout,
        remainingScans,
        incrementScanCount,
        subscribe
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
