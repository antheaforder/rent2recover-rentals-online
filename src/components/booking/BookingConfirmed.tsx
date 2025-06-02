
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Truck, Calendar, ArrowLeft, Phone, Mail } from "lucide-react";
import { BookingData } from "@/pages/BookingWorkflow";
import { format } from "date-fns";

interface BookingConfirmedProps {
  bookingData: BookingData;
  onDeliveryDispatched: () => void;
  onBack: () => void;
}

const BookingConfirmed = ({ bookingData, onDeliveryDispatched, onBack }: BookingConfirmedProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Booking Confirmed</h1>
            <p className="text-gray-600">Your rental has been confirmed and is being prepared</p>
          </div>
        </div>

        {/* Confirmation Message */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-green-900">Payment Successful!</CardTitle>
            <CardDescription>
              Booking ID: {bookingData.bookingId}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Equipment</p>
                  <p className="text-gray-600">{bookingData.equipmentName}</p>
                </div>
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-gray-600">{bookingData.duration} days</p>
                </div>
                <div>
                  <p className="font-medium">Start Date</p>
                  <p className="text-gray-600">
                    {bookingData.startDate && format(bookingData.startDate, "PPP")}
                  </p>
                </div>
                <div>
                  <p className="font-medium">End Date</p>
                  <p className="text-gray-600">
                    {bookingData.endDate && format(bookingData.endDate, "PPP")}
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Deposit Paid</span>
                  <span className="text-green-600">R{bookingData.deposit}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Balance Due on Delivery</span>
                  <span>R{bookingData.totalCost - bookingData.deposit}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                <CardTitle>Delivery Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">Delivery Address</p>
                <p className="text-gray-600 text-sm">{bookingData.customerInfo.deliveryAddress}</p>
              </div>
              
              <div>
                <p className="font-medium">Contact Person</p>
                <p className="text-gray-600">{bookingData.customerInfo.firstName} {bookingData.customerInfo.lastName}</p>
                <p className="text-gray-600 text-sm">{bookingData.customerInfo.phone}</p>
              </div>

              {bookingData.customerInfo.specialInstructions && (
                <div>
                  <p className="font-medium">Special Instructions</p>
                  <p className="text-gray-600 text-sm">{bookingData.customerInfo.specialInstructions}</p>
                </div>
              )}

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <p className="font-semibold text-blue-900">Delivery Schedule</p>
                </div>
                <p className="text-sm text-blue-800">
                  Our team will contact you within 2 hours to schedule delivery.
                  Typical delivery time: 1-2 business days.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Support */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Call Us</p>
                  <p className="text-sm text-gray-600">0800 RENT2RECOVER</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-gray-600">help@rent2recover.co.za</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Action */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 mb-4">
            For demo purposes, click below to simulate delivery dispatch
          </p>
          <Button onClick={onDeliveryDispatched} className="px-8">
            Simulate Delivery Dispatched
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmed;
