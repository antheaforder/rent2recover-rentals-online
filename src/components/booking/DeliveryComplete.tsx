
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Calendar, ArrowLeft } from "lucide-react";
import { BookingData } from "@/hooks/useBookingWorkflow";
import { format } from "date-fns";

interface DeliveryCompleteProps {
  bookingData: BookingData;
  onDeliveryConfirmed: () => void;
  onBack: () => void;
}

const DeliveryComplete = ({ bookingData, onDeliveryConfirmed, onBack }: DeliveryCompleteProps) => {
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
            <h1 className="text-3xl font-bold text-gray-900">Equipment Delivered</h1>
            <p className="text-gray-600">Your rental equipment has been delivered and set up</p>
          </div>
        </div>

        {/* Delivery Confirmation */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-green-900">Delivery Complete!</CardTitle>
            <CardDescription>
              Your {bookingData.equipmentName} has been successfully delivered
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Delivery Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                  <div>
                    <span className="font-medium">Delivered to:</span>
                    <p>{bookingData.customerInfo.firstName} {bookingData.customerInfo.lastName}</p>
                  </div>
                  <div>
                    <span className="font-medium">Delivery Date:</span>
                    <p>{format(new Date(), "PPP")}</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Rental Period</p>
                  <p className="text-gray-600">
                    {bookingData.startDate && format(bookingData.startDate, "MMM d")} - {bookingData.endDate && format(bookingData.endDate, "MMM d, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Return Date</p>
                  <p className="text-gray-600">
                    {bookingData.endDate && format(bookingData.endDate, "EEEE, MMMM do")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium">Return Reminder</p>
                <p className="text-gray-600">We'll contact you 2 days before your return date to arrange collection.</p>
              </div>
            </div>
            
            <div className="space-y-2 text-gray-600">
              <p>• Keep equipment in good condition - normal wear and tear is expected</p>
              <p>• Contact us immediately if you experience any issues</p>
              <p>• Extension options available if you need the equipment longer</p>
              <p>• Late returns incur additional daily charges</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Need Support?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              If you have any questions or issues with your equipment:
            </p>
            <div className="space-y-2 text-sm">
              <p>📞 Emergency Support: 0800 RENT2RECOVER</p>
              <p>📧 Email: help@rent2recover.co.za</p>
              <p>💬 WhatsApp: Available 8 AM - 6 PM</p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Action */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            For demo purposes, click below to confirm delivery and continue rental period
          </p>
          <Button onClick={onDeliveryConfirmed} className="px-8">
            Confirm Delivery Complete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryComplete;
