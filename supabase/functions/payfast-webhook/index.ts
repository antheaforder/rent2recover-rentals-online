
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateSignature(data: Record<string, any>, passphrase: string): Promise<string> {
  // Create parameter string for PayFast
  const paramString = Object.keys(data)
    .filter(key => key !== 'signature' && data[key] !== '' && data[key] !== null && data[key] !== undefined)
    .sort()
    .map(key => `${key}=${encodeURIComponent(data[key])}`)
    .join('&');

  // Add passphrase if provided
  const stringToHash = passphrase ? `${paramString}&passphrase=${encodeURIComponent(passphrase)}` : paramString;
  
  // Create MD5 hash
  const encoder = new TextEncoder();
  return crypto.subtle.digest('MD5', encoder.encode(stringToHash)).then(buffer => {
    const hashArray = Array.from(new Uint8Array(buffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  });
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('PayFast webhook received');
    
    // Parse form data from PayFast
    const formData = await req.formData();
    const data: Record<string, any> = {};
    
    for (const [key, value] of formData.entries()) {
      data[key] = value.toString();
    }

    console.log('PayFast webhook data:', data);

    // Verify signature
    const passphrase = Deno.env.get('PAYFAST_PASSPHRASE');
    const receivedSignature = data.signature;
    const calculatedSignature = await generateSignature(data, passphrase || '');

    if (receivedSignature !== calculatedSignature) {
      console.error('PayFast signature verification failed');
      return new Response('Invalid signature', { status: 400 });
    }

    // Check payment status
    if (data.payment_status === 'COMPLETE') {
      // Initialize Supabase client with service role key
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        { auth: { persistSession: false } }
      );

      const bookingReference = data.m_payment_id || data.custom_str1;
      
      console.log('Processing successful payment for booking:', bookingReference);

      // Here you would update your booking status in the database
      // For now, we'll just log the successful payment
      console.log('Payment successful:', {
        bookingReference,
        amount: data.amount_gross,
        paymentId: data.pf_payment_id
      });

      // You can add database updates here when you have booking tables set up
      // Example:
      // await supabase.from('bookings').update({ 
      //   payment_status: 'paid',
      //   payment_id: data.pf_payment_id 
      // }).eq('reference', bookingReference);
    }

    return new Response('OK', { 
      headers: corsHeaders,
      status: 200 
    });

  } catch (error) {
    console.error('PayFast webhook error:', error);
    return new Response('Error processing webhook', { 
      headers: corsHeaders,
      status: 500 
    });
  }
});
