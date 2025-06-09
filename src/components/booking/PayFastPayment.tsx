
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Shield, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PayFastPaymentProps {
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  bookingReference: string;
  onPaymentInitiated?: () => void;
  onError?: (error: string) => void;
}

const PayFastPayment = ({
  amount,
  customerName,
  customerEmail,
  customerPhone,
  bookingReference,
  onPaymentInitiated,
  onError
}: PayFastPaymentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayFastPayment = async () => {
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-payfast-payment', {
        body: {
          amount: amount.toFixed(2),
          customerName,
          customerEmail,
          customerPhone,
          bookingReference,
          returnUrl: `${window.location.origin}/booking-success?ref=${bookingReference}`,
          cancelUrl: `${window.location.origin}/booking-cancelled?ref=${bookingReference}`
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to create payment');
      }

      console.log('PayFast payment URL created:', data.paymentUrl);

      // Notify parent component
      if (onPaymentInitiated) {
        onPaymentInitiated();
      }

      // Redirect to PayFast
      window.location.href = data.paymentUrl;

    } catch (error) {
      console.error('PayFast payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment initialization failed';
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Secure Payment
        </CardTitle>
        <CardDescription>
          Complete your booking with PayFast's secure payment gateway
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Summary */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Deposit Amount:</span>
            <span className="text-lg font-bold text-blue-600">R{amount.toFixed(2)}</span>
          </div>
          <div className="text-sm text-gray-600">
            Booking Reference: {bookingReference}
          </div>
        </div>

        {/* Security Information */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-800">Secure Payment</span>
          </div>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• PayFast is South Africa's leading payment gateway</li>
            <li>• PCI DSS compliant and bank-grade security</li>
            <li>• Supports all major South African banks</li>
            <li>• Instant EFT and credit/debit cards accepted</li>
          </ul>
        </div>

        {/* Payment Instructions */}
        <div className="space-y-3">
          <h4 className="font-medium">What happens next?</h4>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li>Click "Pay with PayFast" below</li>
            <li>You'll be redirected to PayFast's secure payment page</li>
            <li>Choose your preferred payment method</li>
            <li>Complete the payment process</li>
            <li>Return to Rent2Recover for confirmation</li>
          </ol>
        </div>

        {/* Payment Button */}
        <Button 
          onClick={handlePayFastPayment}
          disabled={isProcessing}
          className="w-full py-6 text-lg"
          size="lg"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              Redirecting to PayFast...
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5 mr-2" />
              Pay with PayFast
              <ExternalLink className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>

        {/* Important Notes */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Your payment is secured by PayFast's 256-bit SSL encryption</p>
          <p>• Balance payment due upon equipment delivery</p>
          <p>• Refund policy applies as per terms and conditions</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayFastPayment;
