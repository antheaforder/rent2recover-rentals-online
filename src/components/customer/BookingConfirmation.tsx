
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Phone, Mail, Calendar } from "lucide-react";

interface BookingData {
  region: string | null;
  equipmentName: string;
  duration: number;
  customerDetails: {
    fullName: string;
    email: string;
    phone: string;
  };
  pricing: {
    total: number;
  };
  bookingReference: string;
}

interface BookingConfirmationProps {
  bookingData: BookingData;
  onNewBooking: () => void;
  onHome: () => void;
}

const BookingConfirmation = ({ bookingData, onNewBooking, onHome }: BookingConfirmationProps) => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="mx-auto mb-6 p-4 bg-green-100 rounded-full w-fit">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-green-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600">Your rental request has been successfully submitted</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-green-900">Booking Reference</CardTitle>
          <CardDescription className="text-2xl font-bold text-green-600">
            {bookingData.bookingReference}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">What happens next?</h3>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 text-left">
                <li>Our team will review your booking within 2 hours</li>
                <li>We'll contact you to confirm availability and delivery details</li>
                <li>Once approved, you'll receive a secure payment link</li>
                <li>After payment confirmation, we'll schedule your delivery</li>
              </ol>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm text-left">
              <div>
                <p className="font-medium">Customer</p>
                <p className="text-gray-600">{bookingData.customerDetails.fullName}</p>
              </div>
              <div>
                <p className="font-medium">Equipment</p>
                <p className="text-gray-600">{bookingData.equipmentName}</p>
              </div>
              <div>
                <p className="font-medium">Duration</p>
                <p className="text-gray-600">{bookingData.duration} days</p>
              </div>
              <div>
                <p className="font-medium">Total Cost</p>
                <p className="text-gray-600">R{bookingData.pricing.total}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-center">
            <Phone className="h-5 w-5" />
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Phone className="h-4 w-4 text-gray-600" />
              <span className="text-sm">Call us: +27 33 343 3000 (Hilton) | +27 11 123 4000 (Johannesburg)</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Mail className="h-4 w-4 text-gray-600" />
              <span className="text-sm">Email: bookings@rent2recover.co.za</span>
            </div>
            <p className="text-xs text-gray-500">
              Reference your booking number {bookingData.bookingReference} when contacting us
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={onNewBooking}>
          <Calendar className="h-4 w-4 mr-2" />
          Make Another Booking
        </Button>
        <Button onClick={onHome}>
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
