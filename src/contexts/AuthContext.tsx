import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

// Define types for the user and context
type User = {
  id: string;
  email: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  user_type: 'buyer' | 'seller' | 'admin';
  bio?: string;
  website?: string;
  is_artist?: boolean;
  is_verified?: boolean;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isSeller: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: Error | null }>;
  signUp: (email: string, password: string, userType: 'buyer' | 'seller' | 'admin') => Promise<{ data: any; error: Error | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to fetch user profile
const fetchUserProfile = async (userId: string) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return profile;
};

// Helper function to update user state with profile data
const updateUserState = async (session: any, setUser: (user: User | null) => void) => {
  if (!session?.user) {
    setUser(null);
    return;
  }

  const profile = await fetchUserProfile(session.user.id);
  
  // Always set a user object even if profile fetch fails
  setUser({
    id: session.user.id,
    email: session.user.email || '',
    username: profile?.username || session.user.email?.split('@')[0] || '',
    full_name: profile?.full_name || '',
    avatar_url: profile?.avatar_url || '',
    user_type: profile?.user_type || session.user.user_metadata?.user_type || 'buyer',
    bio: profile?.bio || '',
    website: profile?.website || '',
    is_artist: profile?.is_artist || session.user.user_metadata?.is_artist || false,
    is_verified: profile?.is_verified || false
  });
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        updateUserState(session, setUser);
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event);
      
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoading(false);
        return;
      }
      
      if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        await updateUserState(session, setUser);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { data: null, error };
      }

      await updateUserState(data.session, setUser);
      return { data, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { data: null, error: error instanceof Error ? error : new Error('An unknown error occurred') };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, userType: 'buyer' | 'seller' | 'admin' = 'buyer') => {
    try {
      setIsLoading(true);
      console.log('Starting signup process with user type:', userType);

      // Step 1: Create auth user with complete metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType,
            is_artist: userType === 'seller',
            username: email.split('@')[0],
            full_name: '',
            avatar_url: ''
          }
        }
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        return { data: null, error: authError };
      }

      if (!authData.user) {
        console.error('No user data returned from auth signup');
        return { data: null, error: new Error('User creation failed') };
      }

      console.log('Auth user created successfully:', {
        id: authData.user.id,
        email: authData.user.email,
        metadata: authData.user.user_metadata
      });

      // Step 2: Wait for the auth user to be fully created
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 3: Create or update the profile using upsert
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email: email,
          username: email.split('@')[0],
          full_name: '',
          avatar_url: '',
          user_type: userType,
          is_artist: userType === 'seller',
          is_verified: false,
          bio: '',
          website: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Even if profile creation fails, we'll try to fetch it using the trigger-created one
      } else {
        console.log('Profile created successfully:', profile);
      }

      // Step 4: Verify profile creation and fetch final profile data
      const finalProfile = await fetchUserProfile(authData.user.id);
      
      if (!finalProfile) {
        console.error('Failed to verify profile creation');
        return { data: null, error: new Error('Failed to create user profile') };
      }

      // Step 5: Update user state with complete profile data
      await updateUserState(authData.session, setUser);

      return { 
        data: { 
          user: authData.user,
          session: authData.session,
          profile: finalProfile
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Unexpected error during signup:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error('An unexpected error occurred') 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isSeller: user?.user_type === 'seller',
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 