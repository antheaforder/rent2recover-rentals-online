
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

export const useAdminAuth = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('admin_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'login', username, password }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      const adminUser = data.user;
      setUser(adminUser);
      localStorage.setItem('admin_user', JSON.stringify(adminUser));
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_user');
  };

  const createAdmin = async (adminData: {
    username: string;
    email: string;
    password: string;
    role: string;
  }) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'create_admin', ...adminData }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Create admin error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create admin' };
    }
  };

  const updateAdmin = async (id: string, adminData: {
    username: string;
    email: string;
    password?: string;
    role: string;
    is_active: boolean;
  }) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'update_admin', id, ...adminData }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Update admin error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update admin' };
    }
  };

  const deleteAdmin = async (id: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'delete_admin', id }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      return { success: true };
    } catch (error) {
      console.error('Delete admin error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to delete admin' };
    }
  };

  const getAdmins = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'get_admins' }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      return { success: true, admins: data.admins };
    } catch (error) {
      console.error('Get admins error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get admins' };
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    getAdmins,
    isLoggedIn: !!user,
    isSuperAdmin: user?.role === 'super-admin'
  };
};
