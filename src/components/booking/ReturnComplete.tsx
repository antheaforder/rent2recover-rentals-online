
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, RefreshCw, Star, ArrowLeft } from "lucide-react";
import { BookingData } from "@/pages/BookingWorkflow";
import { format } from "date-fns";

interface ReturnCompleteProps {
  bookingData: BookingData;
  onReturnConfirmed: () => void;
  onBack: () => void;
}

const ReturnComplete = ({ bookingData, onReturnConfirmed, onBack }: ReturnCompleteProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Return Complete</h1>
            <p className="text-gray-600">Thank you for using Rent2Recover</p>
          </div>
        </div>

        {/* Success Message */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-green-900">Return Successful!</CardTitle>
            <CardDescription>
              Your {bookingData.equipmentName} has been successfully returned
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <p className="font-semibold">Return Date: {format(new Date(), "EEEE, MMMM do, yyyy")}</p>
              <p className="text-sm text-gray-600">
                Equipment condition: Good - No damage charges applied
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Rental Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Rental Summary</CardTitle>
            <CardDescription>Booking ID: {bookingData.bookingId}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Equipment</p>
                  <p className="text-gray-600">{bookingData.equipmentName}</p>
                </div>
                <div>
                  <p className="font-medium">Total Duration</p>
                  <p className="text-gray-600">{bookingData.duration} days</p>
                </div>
                <div>
                  <p className="font-medium">Rental Period</p>
                  <p className="text-gray-600">
                    {bookingData.startDate && format(bookingData.startDate, "MMM do")} - {bookingData.endDate && format(bookingData.endDate, "MMM do, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Total Cost</p>
                  <p className="text-gray-600">R{bookingData.totalCost}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="font-semibold text-green-900">Deposit Refund</span>
                  <span className="font-bold text-green-600">R{bookingData.deposit}</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Your deposit will be refunded to your original payment method within 3-5 business days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Request */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <CardTitle>How was your experience?</CardTitle>
            </div>
            <CardDescription>Your feedback helps us improve our service</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button key={star} variant="ghost" size="sm" className="p-1">
                    <Star className="h-6 w-6 text-yellow-400 fill-current" />
                  </Button>
                ))}
              </div>
              <div className="text-center">
                <Button variant="outline" size="sm">
                  Leave a Review
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Future Rentals */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-blue-600" />
              <CardTitle>Need Equipment Again?</CardTitle>
            </div>
            <CardDescription>We're here whenever you need medical equipment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Book your next rental with just a few clicks using your saved information.
              </p>
              <Button variant="outline" className="w-full">
                Browse Equipment
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Action */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            For demo purposes, click below to complete the rental process
          </p>
          <Button onClick={onReturnConfirmed} className="px-8">
            Complete Rental & Return to Dashboard
          </Button>
        </div>

        {/* Contact Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Stay Connected</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>📞 Customer Support: 0800 RENT2RECOVER</p>
            <p>📧 Email: help@rent2recover.co.za</p>
            <p>🌐 Website: www.rent2recover.co.za</p>
            <p>📱 Follow us on social media for health tips and equipment updates</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReturnComplete;
