
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

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

// For demo purposes, we'll use localStorage to persist the user
const STORAGE_KEY = 'maldetector_auth';
const MAX_FREE_SCANS = 10;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Load user from localStorage on component mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        // Convert expiry date string back to Date object if it exists
        if (parsedUser.subscriptionExpiresAt) {
          parsedUser.subscriptionExpiresAt = new Date(parsedUser.subscriptionExpiresAt);
        }
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

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

  // Login function - in a real app, this would validate with a backend
  const login = async (email: string, password: string) => {
    // Simple validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // In a real app, this would call an API
    // For demo, we'll check if user exists in localStorage
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser.email === email) {
          // In a real app, you would check password hash
          setUser(parsedUser);
          toast.success('Login successful');
          return;
        }
      }
      
      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  };

  // Signup function - in a real app, this would register with a backend
  const signup = async (email: string, password: string, name?: string) => {
    // Simple validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Check if user already exists
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser.email === email) {
        toast.error('User with this email already exists');
        throw new Error('User already exists');
      }
    }
    
    // Create a new user
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      isSubscribed: false,
      scanCount: 0
    };
    
    setUser(newUser);
    toast.success('Account created successfully');
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    toast.info('Logged out successfully');
  };

  // Increment scan count
  const incrementScanCount = () => {
    if (!user) return;
    
    setUser({
      ...user,
      scanCount: user.scanCount + 1
    });
  };

  // Subscribe to premium
  const subscribe = () => {
    if (!user) return;
    
    // Set subscription for 1 year
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    
    setUser({
      ...user,
      isSubscribed: true,
      subscriptionExpiresAt: expiryDate
    });
    
    toast.success('Subscription successful! You now have unlimited scans.');
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
