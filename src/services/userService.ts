
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  delivery_address: string;
  notes: string | null;
  total_bookings: number;
  created_at: string;
  updated_at: string;
}

export const getAllProfiles = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch profiles' };
  }
};

export const getAllCustomers = async () => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching customers:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch customers' };
  }
};

export const createCustomer = async (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .insert([customerData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating customer:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Failed to create customer' };
  }
};

export const updateCustomer = async (id: string, updates: Partial<Customer>) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating customer:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Failed to update customer' };
  }
};

export const deleteCustomer = async (id: string) => {
  try {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting customer:', error);
    return { error: error instanceof Error ? error.message : 'Failed to delete customer' };
  }
};

export const updateProfile = async (id: string, updates: Partial<Profile>) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Failed to update profile' };
  }
};

export const deleteProfile = async (id: string) => {
  try {
    // First delete the auth user, which will cascade to the profile
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting profile:', error);
    return { error: error instanceof Error ? error.message : 'Failed to delete user' };
  }
};
