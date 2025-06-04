import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, ArrowLeft } from "lucide-react";
import { BookingData } from "@/hooks/useBookingWorkflow";

interface QuoteSubmittedProps {
  bookingData: BookingData;
  onQuoteAccepted: () => void;
  onBack: () => void;
}

const QuoteSubmitted = ({ bookingData, onQuoteAccepted, onBack }: QuoteSubmittedProps) => {
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
            <h1 className="text-3xl font-bold text-gray-900">Quote Submitted</h1>
            <p className="text-gray-600">Your rental quote has been submitted for review</p>
          </div>
        </div>

        {/* Success Message */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-green-900">Quote Successfully Submitted!</CardTitle>
            <CardDescription>
              We've received your rental request and will review it shortly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">What happens next?</h3>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                  <li>Our team will review your quote within 2 hours</li>
                  <li>We'll contact you to confirm availability and details</li>
                  <li>Once confirmed, you'll receive a payment link</li>
                  <li>After payment, we'll schedule your delivery</li>
                </ol>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Equipment</p>
                  <p className="text-gray-600">{bookingData.equipmentName}</p>
                </div>
                <div>
                  <p className="font-medium">Total Cost</p>
                  <p className="text-gray-600">R{bookingData.totalCost}</p>
                </div>
                <div>
                  <p className="font-medium">Customer</p>
                  <p className="text-gray-600">{bookingData.customerInfo.firstName} {bookingData.customerInfo.lastName}</p>
                </div>
                <div>
                  <p className="font-medium">Contact</p>
                  <p className="text-gray-600">{bookingData.customerInfo.phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Simulate Quote Acceptance */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            For demo purposes, click below to simulate quote acceptance
          </p>
          <Button onClick={onQuoteAccepted} className="px-8">
            Simulate Quote Accepted
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuoteSubmitted;
