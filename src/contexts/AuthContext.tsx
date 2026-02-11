import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'admin' | 'user';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: string;
  created_at: string;
  updated_at: string;
  onboarding_completed: boolean;
  company_name: string | null;
  job_role: string | null;
  acquisition_channel: string | null;
  team_size: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  isProfileLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  
  // Guard to prevent duplicate fetches
  const fetchingForUserRef = useRef<string | null>(null);

  const fetchUserData = async (userId: string) => {
    // Skip if already fetching for this user
    if (fetchingForUserRef.current === userId) return;
    fetchingForUserRef.current = userId;
    
    setIsProfileLoading(true);
    
    const [profileResult, roleResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.rpc('has_role', { _user_id: userId, _role: 'admin' }),
    ]);
    
    if (!profileResult.error && profileResult.data) {
      setProfile(profileResult.data as Profile);
    }
    if (!roleResult.error) {
      setIsAdmin(roleResult.data === true);
    }
    
    setIsProfileLoading(false);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => fetchUserData(session.user.id), 0);
        } else {
          setProfile(null);
          setIsAdmin(false);
          fetchingForUserRef.current = null;
        }
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { full_name: fullName },
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsAdmin(false);
    fetchingForUserRef.current = null;
  };

  return (
    <AuthContext.Provider value={{
      user, session, profile, isAdmin, isLoading, isProfileLoading,
      signIn, signUp, signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
