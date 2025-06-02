
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Truck, Calendar, ArrowLeft, Phone } from "lucide-react";
import { BookingData } from "@/pages/BookingWorkflow";
import { format } from "date-fns";

interface ReturnReminderProps {
  bookingData: BookingData;
  onReturnScheduled: () => void;
  onExtendRequest: () => void;
  onBack: () => void;
}

const ReturnReminder = ({ bookingData, onReturnScheduled, onExtendRequest, onBack }: ReturnReminderProps) => {
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
            <h1 className="text-3xl font-bold text-gray-900">Return Reminder</h1>
            <p className="text-gray-600">Your rental period is ending soon</p>
          </div>
        </div>

        {/* Return Notice */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-fit">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle className="text-orange-900">Rental Return Due</CardTitle>
            <CardDescription>
              Your {bookingData.equipmentName} is due for return
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold">
                Return Date: {bookingData.endDate && format(bookingData.endDate, "EEEE, MMMM do, yyyy")}
              </p>
              <p className="text-sm text-gray-600">
                Our team will contact you to arrange collection
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Return Process */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              <CardTitle>Return Process</CardTitle>
            </div>
            <CardDescription>What to expect when we collect your equipment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold flex items-center justify-center mt-0.5">1</div>
                <div>
                  <h4 className="font-semibold">Collection Scheduling</h4>
                  <p className="text-sm text-gray-600">We'll call you to arrange a convenient collection time</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold flex items-center justify-center mt-0.5">2</div>
                <div>
                  <h4 className="font-semibold">Equipment Inspection</h4>
                  <p className="text-sm text-gray-600">Our technician will inspect the equipment condition</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold flex items-center justify-center mt-0.5">3</div>
                <div>
                  <h4 className="font-semibold">Deposit Refund</h4>
                  <p className="text-sm text-gray-600">Your deposit will be refunded (minus any damage charges)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rental Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Rental Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Equipment</p>
                <p className="text-gray-600">{bookingData.equipmentName}</p>
              </div>
              <div>
                <p className="font-medium">Rental Duration</p>
                <p className="text-gray-600">{bookingData.duration} days</p>
              </div>
              <div>
                <p className="font-medium">Start Date</p>
                <p className="text-gray-600">
                  {bookingData.startDate && format(bookingData.startDate, "MMM do, yyyy")}
                </p>
              </div>
              <div>
                <p className="font-medium">End Date</p>
                <p className="text-gray-600">
                  {bookingData.endDate && format(bookingData.endDate, "MMM do, yyyy")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Button onClick={onReturnScheduled} className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Confirm Return Schedule
            </Button>
            <Button variant="outline" onClick={onExtendRequest} className="w-full">
              <Clock className="h-4 w-4 mr-2" />
              Request Extension
            </Button>
          </div>
          
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-900">Need to Discuss Return?</p>
                  <p className="text-sm text-blue-800">Call us at 0800 RENT2RECOVER</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Notes */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Important Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2 text-gray-600">
            <p>• Late returns incur additional daily charges at standard daily rate</p>
            <p>• Equipment must be returned in the same condition as delivered</p>
            <p>• Normal wear and tear is expected and will not incur charges</p>
            <p>• Any damage will be assessed and deducted from your deposit</p>
            <p>• Collection must be arranged during business hours (8 AM - 5 PM)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReturnReminder;
