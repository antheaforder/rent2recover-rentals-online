
import { supabase } from '@/integrations/supabase/client';

export interface CustomerData {
  full_name: string;
  email: string;
  phone: string;
  delivery_address: string;
  address_latitude?: number;
  address_longitude?: number;
}

export const createOrGetCustomer = async (customerData: CustomerData) => {
  try {
    const { data, error } = await supabase.functions.invoke('customer-management', {
      body: { action: 'create_or_get_customer', ...customerData }
    });

    if (error) throw error;
    if (data.error) throw new Error(data.error);

    return { success: true, customer: data.customer, isNew: data.isNew };
  } catch (error) {
    console.error('Customer service error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create/get customer' 
    };
  }
};

export const createBookingWithCustomer = async (
  customerData: CustomerData,
  bookingData: {
    quote_id: string;
    equipment_category: string;
    equipment_name: string;
    start_date: string;
    end_date: string;
    rental_days: number;
    total_cost: number;
    deposit_amount: number;
    delivery_fee: number;
    delivery_address: string;
    special_instructions?: string;
    branch: string;
  }
) => {
  try {
    // First, create or get the customer
    const customerResult = await createOrGetCustomer(customerData);
    
    if (!customerResult.success) {
      return customerResult;
    }

    // Then create the booking
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        customer_id: customerResult.customer.id,
        ...bookingData
      } as any)
      .select()
      .single();

    if (error) throw error;

    return { 
      success: true, 
      booking: data, 
      customer: customerResult.customer,
      isNewCustomer: customerResult.isNew 
    };
  } catch (error) {
    console.error('Booking creation error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create booking' 
    };
  }
};
