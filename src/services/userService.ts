
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
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Transform admin_users to the Profile interface
    const profiles = data.map(admin => ({
      id: admin.id,
      email: admin.email,
      full_name: admin.username,
      role: admin.role,
      created_at: admin.created_at,
      updated_at: admin.updated_at
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
      .from('customer_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Transform customer_users to the Customer interface
    const customers = data.map(customer => ({
      id: customer.id,
      user_id: null, // This field might not exist in customer_users
      full_name: customer.full_name,
      email: customer.email,
      phone: customer.phone,
      delivery_address: customer.delivery_address,
      notes: null, // This field might not exist in customer_users
      total_bookings: customer.total_bookings || 0,
      created_at: customer.created_at,
      updated_at: customer.updated_at
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
      .from('customer_users')
      .insert([{
        full_name: customerData.full_name,
        email: customerData.email,
        phone: customerData.phone,
        delivery_address: customerData.delivery_address
      }])
      .select()
      .single();

    if (error) throw error;
    
    // Transform to Customer interface
    const customer: Customer = {
      id: data.id,
      user_id: null,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      delivery_address: data.delivery_address,
      notes: null,
      total_bookings: data.total_bookings || 0,
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
      .from('customer_users')
      .update({
        full_name: updates.full_name,
        email: updates.email,
        phone: updates.phone,
        delivery_address: updates.delivery_address
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // Transform to Customer interface
    const customer: Customer = {
      id: data.id,
      user_id: null,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      delivery_address: data.delivery_address,
      notes: null,
      total_bookings: data.total_bookings || 0,
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
      .from('customer_users')
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
      .from('admin_users')
      .update({
        email: updates.email,
        username: updates.full_name,
        role: updates.role
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // Transform to Profile interface
    const profile: Profile = {
      id: data.id,
      email: data.email,
      full_name: data.username,
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
    // Delete the admin user
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting profile:', error);
    return { error: error instanceof Error ? error.message : 'Failed to delete user' };
  }
};
