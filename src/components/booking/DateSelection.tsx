
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

interface DateSelectionProps {
  startDate: Date | null;
  endDate: Date | null;
  onDatesSelect: (startDate: Date, endDate: Date, duration: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const DateSelection = ({ startDate, endDate, onDatesSelect, onNext, onBack }: DateSelectionProps) => {
  const [localStartDate, setLocalStartDate] = useState<Date | undefined>(startDate || undefined);
  const [localEndDate, setLocalEndDate] = useState<Date | undefined>(endDate || undefined);

  const handleContinue = () => {
    if (localStartDate && localEndDate) {
      const duration = differenceInDays(localEndDate, localStartDate) + 1;
      onDatesSelect(localStartDate, localEndDate, duration);
      onNext();
    }
  };

  const isValidDateRange = localStartDate && localEndDate && localStartDate <= localEndDate;
  const duration = localStartDate && localEndDate ? differenceInDays(localEndDate, localStartDate) + 1 : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Select Rental Dates</h1>
            <p className="text-gray-600">Choose your rental start and end dates</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-medium">✓</div>
            <div className="w-16 h-1 bg-green-600"></div>
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-medium">✓</div>
            <div className="w-16 h-1 bg-green-600"></div>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">3</div>
          </div>
        </div>

        {/* Date Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Rental Period</CardTitle>
            <CardDescription>Select your start and end dates for the rental</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !localStartDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localStartDate ? format(localStartDate, "PPP") : "Select start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={localStartDate}
                      onSelect={setLocalStartDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !localEndDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localEndDate ? format(localEndDate, "PPP") : "Select end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={localEndDate}
                      onSelect={setLocalEndDate}
                      disabled={(date) => !localStartDate || date < localStartDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {isValidDateRange && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Rental Summary</h3>
                <div className="space-y-1 text-sm text-blue-800">
                  <p>Duration: {duration} days</p>
                  <p>Start: {format(localStartDate!, "EEEE, MMMM do, yyyy")}</p>
                  <p>End: {format(localEndDate!, "EEEE, MMMM do, yyyy")}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button 
            onClick={handleContinue}
            disabled={!isValidDateRange}
            className="px-8 py-2"
          >
            Check Availability
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DateSelection;
