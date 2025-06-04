
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CalendarIcon, AlertTriangle, CheckCircle, Truck } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { BranchId, EquipmentCategoryId, BRANCHES, EQUIPMENT_CATEGORIES } from "@/config/equipmentCategories";

interface DateRangeSelectionProps {
  startDate: Date | null;
  endDate: Date | null;
  region: BranchId | null;
  equipmentType: EquipmentCategoryId | null;
  onDatesSelect: (startDate: Date, endDate: Date, duration: number, availableLocally: boolean, requiresCrossBranchDelivery: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

const DateRangeSelection = ({ 
  startDate, 
  endDate, 
  region, 
  equipmentType, 
  onDatesSelect, 
  onNext, 
  onBack 
}: DateRangeSelectionProps) => {
  const [localStartDate, setLocalStartDate] = useState<Date | undefined>(startDate || undefined);
  const [localEndDate, setLocalEndDate] = useState<Date | undefined>(endDate || undefined);
  const [checking, setChecking] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<{
    availableLocally: boolean;
    availableAlternate: boolean;
    alternateRegion: BranchId | null;
  } | null>(null);

  const checkAvailability = async () => {
    if (!localStartDate || !localEndDate || !region || !equipmentType) return;
    
    setChecking(true);
    
    // Simulate availability check
    setTimeout(() => {
      const isLocallyAvailable = Math.random() > 0.3; // 70% chance locally available
      const isAlternateAvailable = !isLocallyAvailable ? Math.random() > 0.2 : false; // 80% chance if not local
      const alternateRegion = region === 'hilton' ? 'johannesburg' : 'hilton';
      
      setAvailabilityResult({
        availableLocally: isLocallyAvailable,
        availableAlternate: isAlternateAvailable,
        alternateRegion: isAlternateAvailable ? alternateRegion : null
      });
      setChecking(false);
    }, 1500);
  };

  const handleContinue = () => {
    if (localStartDate && localEndDate && availabilityResult) {
      const duration = differenceInDays(localEndDate, localStartDate) + 1;
      onDatesSelect(
        localStartDate, 
        localEndDate, 
        duration, 
        availabilityResult.availableLocally,
        !availabilityResult.availableLocally && availabilityResult.availableAlternate
      );
      onNext();
    }
  };

  const isValidDateRange = localStartDate && localEndDate && localStartDate <= localEndDate;
  const duration = localStartDate && localEndDate ? differenceInDays(localEndDate, localStartDate) + 1 : 0;

  const selectedBranch = BRANCHES.find(b => b.id === region);
  const selectedEquipment = EQUIPMENT_CATEGORIES.find(e => e.id === equipmentType);
  const alternateBranch = availabilityResult?.alternateRegion ? 
    BRANCHES.find(b => b.id === availabilityResult.alternateRegion) : null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Select Rental Dates</h2>
          <p className="text-gray-600">Choose your rental start and end dates</p>
        </div>
      </div>

      {/* Current Selection Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Current Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Region:</span>
              <p className="text-gray-600">{selectedBranch?.name} ({selectedBranch?.location})</p>
            </div>
            <div>
              <span className="font-medium">Equipment:</span>
              <p className="text-gray-600">{selectedEquipment?.name}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date Selection */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Start Date</CardTitle>
            <CardDescription>When do you need the equipment?</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={localStartDate}
              onSelect={setLocalStartDate}
              disabled={(date) => date < new Date()}
              className={cn("p-3 pointer-events-auto")}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">End Date</CardTitle>
            <CardDescription>When will you return it?</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={localEndDate}
              onSelect={setLocalEndDate}
              disabled={(date) => !localStartDate || date < localStartDate}
              className={cn("p-3 pointer-events-auto")}
            />
          </CardContent>
        </Card>
      </div>

      {/* Duration Summary */}
      {isValidDateRange && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Rental Duration: {duration} days</p>
                <p className="text-sm text-gray-600">
                  {format(localStartDate!, "EEEE, MMMM do")} - {format(localEndDate!, "EEEE, MMMM do")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Availability Check */}
      {isValidDateRange && !availabilityResult && !checking && (
        <div className="text-center mb-6">
          <Button onClick={checkAvailability} className="px-8">
            Check Availability
          </Button>
        </div>
      )}

      {checking && (
        <Card className="mb-6">
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Checking availability...</p>
          </CardContent>
        </Card>
      )}

      {/* Availability Results */}
      {availabilityResult && (
        <div className="mb-6">
          {availabilityResult.availableLocally ? (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Great news!</strong> {selectedEquipment?.name} is available at {selectedBranch?.name} for your selected dates.
              </AlertDescription>
            </Alert>
          ) : availabilityResult.availableAlternate ? (
            <Alert className="border-orange-200 bg-orange-50">
              <Truck className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Available from {alternateBranch?.name}</strong><br />
                Not available at {selectedBranch?.name}, but we can deliver from our {alternateBranch?.name} branch. 
                Additional delivery fee will apply (approximately R350-450).
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Not Available</strong><br />
                {selectedEquipment?.name} is not available at either branch for your selected dates. 
                Please try different dates.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Continue Button */}
      {availabilityResult && (availabilityResult.availableLocally || availabilityResult.availableAlternate) && (
        <div className="text-center">
          <Button onClick={handleContinue} className="px-8 py-3">
            Continue to Customer Details
          </Button>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelection;
