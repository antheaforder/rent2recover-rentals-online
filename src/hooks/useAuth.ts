import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserProfile = async (user: User) => {
    try {
      console.log('Fetching profile for user:', user.email);
      
      // First try to fetch from customer_users
      const { data: customerData, error: customerError } = await supabase
        .from('customer_users')
        .select('*')
        .eq('email', user.email!)
        .single();
      
      if (customerData && !customerError) {
        console.log('Found customer profile:', customerData);
        setProfile({
          id: customerData.id,
          email: customerData.email,
          full_name: customerData.full_name,
          role: 'customer',
          created_at: customerData.created_at,
          updated_at: customerData.updated_at,
        });
        return;
      }

      // Then try admin_users
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', user.email!)
        .single();
      
      if (adminData && !adminError) {
        console.log('Found admin profile:', adminData);
        setProfile({
          id: adminData.id,
          email: adminData.email,
          full_name: adminData.username,
          role: adminData.role === 'super-admin' ? 'super_admin' : adminData.role,
          created_at: adminData.created_at,
          updated_at: adminData.updated_at,
        });
        return;
      }

      console.log('No profile found for user');
      setProfile(null);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        if (!mounted) return;

        try {
          setSession(session);
          setUser(session?.user ?? null);

          if (session?.user) {
            // Defer profile fetching to avoid potential deadlocks
            setTimeout(() => {
              if (mounted) {
                fetchUserProfile(session.user);
              }
            }, 100);
          } else {
            setProfile(null);
          }
          
          setLoading(false);
        } catch (error) {
          console.error('Error in auth state change:', error);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          console.log('Initial session check:', session?.user?.email);
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await fetchUserProfile(session.user);
          }
        }
      } catch (error) {
        console.error('Error in initAuth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: string = 'customer') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });

      if (error) throw error;

      // Create profile record based on role
      if (role === 'super_admin') {
        await supabase
          .from('admin_users')
          .insert([{
            email,
            username: fullName,
            role: 'super-admin',
            password_hash: 'managed_by_auth'
          }]);
      } else {
        await supabase
          .from('customer_users')
          .insert([{
            email,
            full_name: fullName,
            phone: '',
            delivery_address: ''
          }]);
      }

      toast({
        title: "Account Created",
        description: "Please check your email for verification"
      });

      return { data, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      return { data: null, error: errorMessage };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      console.log('Sign in successful:', data.user?.email);

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in"
      });

      return { data, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
      console.error('Sign in error:', errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      return { data: null, error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);
      setProfile(null);

      toast({
        title: "Signed out",
        description: "You have been successfully signed out"
      });

      // Redirect to login
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      let result;
      
      if (profile?.role === 'super_admin') {
        result = await supabase
          .from('admin_users')
          .update({
            username: updates.full_name || undefined,
            email: updates.email || undefined,
            role: updates.role || undefined
          })
          .eq('id', profile.id)
          .select();
      } else {
        result = await supabase
          .from('customer_users')
          .update({
            full_name: updates.full_name || undefined,
            email: updates.email || undefined
          })
          .eq('id', profile.id)
          .select();
      }

      if (result.error) throw result.error;

      // Update local state
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated"
      });

      return { data: true, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      return { data: null, error: errorMessage };
    }
  };

  const changePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Password Changed",
        description: "Your password has been successfully updated"
      });

      return { error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to change password';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      return { error: errorMessage };
    }
  };

  const isAuthenticated = !!user;
  const isSuperAdmin = profile?.role === 'super_admin' || profile?.role === 'super-admin';

  console.log('Auth state:', { 
    user: user?.email, 
    profile: profile?.role, 
    isAuthenticated, 
    isSuperAdmin, 
    loading 
  });

  return {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    changePassword,
    isAuthenticated,
    isSuperAdmin
  };
};
