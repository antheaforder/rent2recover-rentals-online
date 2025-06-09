
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, Phone, Mail } from "lucide-react";

const BookingCancelled = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingRef = searchParams.get('ref');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Cancelled Icon */}
          <XCircle className="h-16 w-16 text-orange-500 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Cancelled
          </h1>
          <p className="text-gray-600 mb-8">
            Your payment was cancelled and no charges were made to your account.
          </p>

          {/* Information Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-orange-600">Booking Status</CardTitle>
              <CardDescription>
                {bookingRef && `Booking Reference: ${bookingRef}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-orange-900 mb-3">What you can do next:</h3>
                <div className="space-y-2 text-sm text-orange-800 text-left">
                  <p>• Your equipment reservation is still available for 24 hours</p>
                  <p>• You can retry the payment process anytime</p>
                  <p>• Contact our support team if you experienced any issues</p>
                  <p>• Start a new booking if you prefer different equipment or dates</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Common reasons for cancelled payments:</h4>
                <div className="space-y-1 text-sm text-blue-800 text-left">
                  <p>• Insufficient funds in the selected account</p>
                  <p>• Payment method declined by your bank</p>
                  <p>• Session timeout during payment process</p>
                  <p>• Cancelled by user choice</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Need Assistance?</CardTitle>
              <CardDescription>Our team is ready to help you complete your booking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span>0800 RENT2RECOVER</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span>help@rent2recover.co.za</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button onClick={() => navigate(-1)} variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Try Payment Again
              </Button>
              <Button onClick={() => navigate('/')} className="px-8">
                Start New Booking
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              <p>Your equipment will remain reserved for 24 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCancelled;
