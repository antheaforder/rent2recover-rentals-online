
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, MapPin, Phone, Mail } from "lucide-react";

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingRef = searchParams.get('ref');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking payment status
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-8">
            Your booking has been confirmed and your equipment is being prepared for delivery.
          </p>

          {/* Booking Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-green-600">Booking Confirmed</CardTitle>
              <CardDescription>
                {bookingRef && `Booking Reference: ${bookingRef}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-3">What happens next?</h3>
                <div className="space-y-3 text-sm text-green-800">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <p className="font-medium">Confirmation Email Sent</p>
                      <p className="text-green-700">Check your inbox for detailed booking information</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <p className="font-medium">Delivery Scheduling</p>
                      <p className="text-green-700">Our team will contact you within 2 hours to arrange delivery</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <p className="font-medium">Equipment Delivery & Setup</p>
                      <p className="text-green-700">Professional installation and training included</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Delivery Timeframe</span>
                  </div>
                  <p className="text-blue-800">1-2 business days</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-900">Setup Included</span>
                  </div>
                  <p className="text-purple-800">Free installation & training</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>Our support team is here to assist you</CardDescription>
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
            <Button onClick={() => navigate('/')} className="w-full md:w-auto px-8">
              Return to Home
            </Button>
            <div className="text-sm text-gray-600">
              <p>Questions about your booking? Contact us anytime.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
