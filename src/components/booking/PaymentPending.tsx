
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BookingData } from "@/hooks/useBookingWorkflow";
import PayFastPayment from "./PayFastPayment";

interface PaymentPendingProps {
  bookingData: BookingData;
  onPaymentComplete: () => void;
  onBack: () => void;
}

const PaymentPending = ({ bookingData, onPaymentComplete, onBack }: PaymentPendingProps) => {
  const customerName = `${bookingData.customerInfo.firstName} ${bookingData.customerInfo.lastName}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Required</h1>
            <p className="text-gray-600">Complete your payment to confirm booking</p>
          </div>
        </div>

        {/* Payment Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>Quote ID: {bookingData.quoteId}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Deposit Required (30%)</span>
                <span className="text-blue-600">R{bookingData.deposit}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Balance due on delivery</span>
                <span>R{bookingData.totalCost - bookingData.deposit}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total Rental Cost</span>
                <span>R{bookingData.totalCost}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PayFast Payment Component */}
        <PayFastPayment
          amount={bookingData.deposit}
          customerName={customerName}
          customerEmail={bookingData.customerInfo.email}
          customerPhone={bookingData.customerInfo.phone}
          bookingReference={bookingData.quoteId}
          onPaymentInitiated={onPaymentComplete}
          onError={(error) => console.error('Payment error:', error)}
        />

        {/* Important Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• Payment must be completed within 24 hours to secure your booking</p>
            <p>• Your equipment will be reserved once payment is confirmed</p>
            <p>• Delivery will be scheduled within 1-2 business days after payment</p>
            <p>• Balance payment is due on delivery before equipment handover</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPending;
