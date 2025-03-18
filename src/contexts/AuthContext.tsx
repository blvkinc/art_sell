import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types for the user and context
type User = {
  id: string;
  email: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  user_type: 'buyer' | 'seller' | 'admin';
};

type AuthResponse = {
  data: {
    user: User | null;
  } | null;
  error: Error | null;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  isSeller: boolean;
  isBuyer: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, userType?: 'buyer' | 'seller') => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResponse>;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAdmin: false,
  isSeller: false,
  isBuyer: false,
  signIn: async () => ({ data: null, error: null }),
  signUp: async () => ({ data: null, error: null }),
  signOut: async () => {},
  updateProfile: async () => {},
  resetPassword: async () => ({ data: null, error: null }),
});

// Mock users for demonstration purposes
const mockUsers: Record<string, User> = {
  'user@example.com': {
    id: '1',
    email: 'user@example.com',
    full_name: 'John Doe',
    username: 'johndoe',
    avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg',
    user_type: 'buyer'
  },
  'artist@example.com': {
    id: '2',
    email: 'artist@example.com',
    full_name: 'Jane Artist',
    username: 'janeartist',
    avatar_url: 'https://randomuser.me/api/portraits/women/44.jpg',
    user_type: 'seller'
  },
  'admin@example.com': {
    id: '3',
    email: 'admin@example.com',
    full_name: 'Admin User',
    username: 'adminuser',
    avatar_url: 'https://randomuser.me/api/portraits/women/68.jpg',
    user_type: 'admin'
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state - check if a session exists in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('artify_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('artify_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Role-based checks
  const isAdmin = user?.user_type === 'admin';
  const isSeller = user?.user_type === 'seller';
  const isBuyer = user?.user_type === 'buyer';

  // Sign in function
  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email (case insensitive)
      const matchedUser = mockUsers[email.toLowerCase()];
      
      if (!matchedUser) {
        return { 
          data: null, 
          error: new Error('Invalid email or password') 
        };
      }
      
      // In a real app, you would validate the password here
      // For demo, we'll just assume the password is correct if it's at least 6 chars
      if (password.length < 6) {
        return { 
          data: null, 
          error: new Error('Invalid email or password') 
        };
      }

      // Set the user and store in localStorage
      setUser(matchedUser);
      localStorage.setItem('artify_user', JSON.stringify(matchedUser));
      
      return { 
        data: { user: matchedUser }, 
        error: null 
      };
    } catch (error) {
      console.error('Error signing in:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error('An unknown error occurred') 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, userType: 'buyer' | 'seller' = 'buyer'): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      if (mockUsers[email.toLowerCase()]) {
        return { 
          data: null, 
          error: new Error('Email already in use') 
        };
      }
      
      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: email.toLowerCase(),
        full_name: '',
        username: email.split('@')[0],
        user_type: userType
      };
      
      // Update mock users (in a real app, this would be an API call)
      mockUsers[email.toLowerCase()] = newUser;
      
      // Set the user and store in localStorage
      setUser(newUser);
      localStorage.setItem('artify_user', JSON.stringify(newUser));
      
      return { 
        data: { user: newUser }, 
        error: null 
      };
    } catch (error) {
      console.error('Error signing up:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error('An unknown error occurred') 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear user data
      setUser(null);
      localStorage.removeItem('artify_user');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update user data
      if (user) {
        const updatedUser = {
          ...user,
          ...data,
        };
        
        // Update mockUsers (in a real app, this would be an API call)
        if (updatedUser.email) {
          mockUsers[updatedUser.email.toLowerCase()] = updatedUser;
        }
        
        setUser(updatedUser);
        localStorage.setItem('artify_user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, send reset password email
      // For demo, just check if the email exists in mockUsers
      const exists = Object.keys(mockUsers).some(
        key => key.toLowerCase() === email.toLowerCase()
      );
      
      // Always return success even if email doesn't exist (for security reasons)
      return { 
        data: { user: null }, 
        error: null 
      };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error('An unknown error occurred') 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAdmin,
    isSeller,
    isBuyer,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext); 