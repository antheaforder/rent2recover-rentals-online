
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateSignature(data: Record<string, any>, passphrase: string): string {
  // Create parameter string for PayFast
  const paramString = Object.keys(data)
    .filter(key => data[key] !== '' && data[key] !== null && data[key] !== undefined)
    .sort()
    .map(key => `${key}=${encodeURIComponent(data[key])}`)
    .join('&');

  // Add passphrase if provided
  const stringToHash = passphrase ? `${paramString}&passphrase=${encodeURIComponent(passphrase)}` : paramString;
  
  // Create MD5 hash
  const encoder = new TextEncoder();
  const hashBuffer = crypto.subtle.digest('MD5', encoder.encode(stringToHash));
  
  return hashBuffer.then(buffer => {
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
    const { 
      amount, 
      customerName, 
      customerEmail, 
      customerPhone,
      bookingReference,
      returnUrl,
      cancelUrl 
    } = await req.json();

    // Validate required fields
    if (!amount || !customerName || !customerEmail || !bookingReference) {
      return new Response(
        JSON.stringify({ error: 'Missing required payment information' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Get PayFast credentials
    const merchantId = Deno.env.get('PAYFAST_MERCHANT_ID');
    const merchantKey = Deno.env.get('PAYFAST_MERCHANT_KEY');
    const passphrase = Deno.env.get('PAYFAST_PASSPHRASE');

    if (!merchantId || !merchantKey) {
      throw new Error('PayFast credentials not configured');
    }

    // Prepare PayFast data
    const payfastData = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: returnUrl || `${new URL(req.url).origin}/booking-success`,
      cancel_url: cancelUrl || `${new URL(req.url).origin}/booking-cancelled`,
      notify_url: `${new URL(req.url).origin}/functions/v1/payfast-webhook`,
      name_first: customerName.split(' ')[0] || customerName,
      name_last: customerName.split(' ').slice(1).join(' ') || '',
      email_address: customerEmail,
      cell_number: customerPhone || '',
      m_payment_id: bookingReference,
      amount: parseFloat(amount).toFixed(2),
      item_name: `Rent2Recover Equipment Rental - ${bookingReference}`,
      item_description: 'Medical equipment rental deposit',
      custom_str1: bookingReference,
      email_confirmation: '1',
      confirmation_address: customerEmail
    };

    // Generate signature
    const signature = await generateSignature(payfastData, passphrase || '');
    payfastData.signature = signature;

    // Create PayFast payment URL
    const payfastUrl = 'https://sandbox.payfast.co.za/eng/process'; // Use https://www.payfast.co.za/eng/process for production
    const params = new URLSearchParams(payfastData);
    const paymentUrl = `${payfastUrl}?${params.toString()}`;

    console.log('PayFast payment created:', { bookingReference, amount, customerEmail });

    return new Response(
      JSON.stringify({ 
        paymentUrl,
        paymentId: bookingReference 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('PayFast payment creation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
