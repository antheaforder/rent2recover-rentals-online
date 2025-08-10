
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
    
    const profiles: Profile[] = (data || []).map((p: any) => ({
      id: p.id,
      email: p.email,
      full_name: p.full_name,
      role: p.role,
      created_at: p.created_at,
      updated_at: p.updated_at
    }));
    
    return { data: profiles, error: null };
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
    
    const customers: Customer[] = (data || []).map((c: any) => ({
      id: c.id,
      user_id: null,
      full_name: c.full_name,
      email: c.email,
      phone: c.phone,
      delivery_address: c.delivery_address,
      notes: c.notes ?? null,
      total_bookings: c.total_bookings || 0,
      created_at: c.created_at,
      updated_at: c.updated_at
    }));
    
    return { data: customers, error: null };
  } catch (error) {
    console.error('Error fetching customers:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch customers' };
  }
};

export const createCustomer = async (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .insert([{
        full_name: customerData.full_name,
        email: customerData.email,
        phone: customerData.phone,
        delivery_address: customerData.delivery_address,
        notes: customerData.notes ?? null
      }])
      .select()
      .single();

    if (error) throw error;
    
    const customer: Customer = {
      id: data.id,
      user_id: null,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      delivery_address: data.delivery_address,
      notes: data.notes ?? null,
      total_bookings: 0,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return { data: customer, error: null };
  } catch (error) {
    console.error('Error creating customer:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Failed to create customer' };
  }
};

export const updateCustomer = async (id: string, updates: Partial<Customer>) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .update({
        full_name: updates.full_name,
        email: updates.email,
        phone: updates.phone,
        delivery_address: updates.delivery_address,
        notes: updates.notes ?? null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    const customer: Customer = {
      id: data.id,
      user_id: null,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      delivery_address: data.delivery_address,
      notes: data.notes ?? null,
      total_bookings: 0,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return { data: customer, error: null };
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
      .update({
        email: updates.email,
        full_name: updates.full_name,
        role: updates.role
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    const profile: Profile = {
      id: data.id,
      email: data.email,
      full_name: data.full_name,
      role: data.role,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return { data: profile, error: null };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Failed to update profile' };
  }
};

export const deleteProfile = async (id: string) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting profile:', error);
    return { error: error instanceof Error ? error.message : 'Failed to delete user' };
  }
};
