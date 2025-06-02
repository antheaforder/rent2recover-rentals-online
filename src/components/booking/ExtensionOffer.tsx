
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Clock, CalendarIcon, ArrowLeft } from "lucide-react";
import { BookingData } from "@/pages/BookingWorkflow";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";

interface ExtensionOfferProps {
  bookingData: BookingData;
  onExtend: (newEndDate: Date) => void;
  onDecline: () => void;
  onBack: () => void;
}

const ExtensionOffer = ({ bookingData, onExtend, onDecline, onBack }: ExtensionOfferProps) => {
  const [selectedExtensionDate, setSelectedExtensionDate] = useState<Date | undefined>();

  const calculateExtensionCost = (newEndDate: Date) => {
    if (!bookingData.endDate) return 0;
    const additionalDays = Math.ceil((newEndDate.getTime() - bookingData.endDate.getTime()) / (1000 * 60 * 60 * 24));
    const dailyRate = bookingData.weeklyRate / 7;
    return Math.round(additionalDays * dailyRate);
  };

  const handleExtend = () => {
    if (selectedExtensionDate) {
      onExtend(selectedExtensionDate);
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Extend Your Rental</h1>
            <p className="text-gray-600">Your rental period is ending soon</p>
          </div>
        </div>

        {/* Current Rental Info */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <CardTitle>Current Rental</CardTitle>
            </div>
            <CardDescription>
              Your {bookingData.equipmentName} rental is scheduled to end soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Equipment</p>
                <p className="text-gray-600">{bookingData.equipmentName}</p>
              </div>
              <div>
                <p className="font-medium">Current End Date</p>
                <p className="text-gray-600">
                  {bookingData.endDate && format(bookingData.endDate, "EEEE, MMMM do, yyyy")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Extension Options */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Extend Your Rental</CardTitle>
            <CardDescription>Choose how long you'd like to keep the equipment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Extension Options */}
            <div>
              <h4 className="font-semibold mb-3">Quick Options</h4>
              <div className="grid grid-cols-3 gap-3">
                {[7, 14, 30].map((days) => {
                  const newDate = addDays(bookingData.endDate!, days);
                  const cost = calculateExtensionCost(newDate);
                  return (
                    <Button
                      key={days}
                      variant="outline"
                      className="flex flex-col h-auto p-4"
                      onClick={() => setSelectedExtensionDate(newDate)}
                    >
                      <span className="font-semibold">+{days} days</span>
                      <span className="text-sm text-gray-600">R{cost}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Custom Date Picker */}
            <div>
              <h4 className="font-semibold mb-3">Custom End Date</h4>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedExtensionDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedExtensionDate ? format(selectedExtensionDate, "PPP") : "Select new end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedExtensionDate}
                    onSelect={setSelectedExtensionDate}
                    disabled={(date) => !bookingData.endDate || date <= bookingData.endDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Cost Calculation */}
            {selectedExtensionDate && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Extension Cost</h4>
                <div className="space-y-1 text-sm text-blue-800">
                  <div className="flex justify-between">
                    <span>Additional Cost:</span>
                    <span className="font-semibold">R{calculateExtensionCost(selectedExtensionDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>New End Date:</span>
                    <span>{format(selectedExtensionDate, "MMM do, yyyy")}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={handleExtend}
            disabled={!selectedExtensionDate}
            className="flex-1"
          >
            Extend Rental
          </Button>
          <Button variant="outline" onClick={onDecline} className="flex-1">
            No, Return as Scheduled
          </Button>
        </div>

        {/* Important Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Extension Terms</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2 text-gray-600">
            <p>• Extension payment is due within 24 hours of confirmation</p>
            <p>• Same terms and conditions apply to the extended period</p>
            <p>• Equipment will be collected on the new end date</p>
            <p>• Further extensions may be possible subject to availability</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExtensionOffer;
