
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle, AlertTriangle, Truck } from "lucide-react";
import { BookingData } from "@/pages/BookingWorkflow";

interface AvailabilityCheckProps {
  bookingData: BookingData;
  onAvailable: () => void;
  onAlternative: (altBranch: string, deliveryFee: number) => void;
  onBack: () => void;
}

const AvailabilityCheck = ({ bookingData, onAvailable, onAlternative, onBack }: AvailabilityCheckProps) => {
  const [checking, setChecking] = useState(true);
  const [available, setAvailable] = useState(false);
  const [alternativeAvailable, setAlternativeAvailable] = useState(false);

  const otherBranch = bookingData.branch === 'hilton' ? 'johannesburg' : 'hilton';
  const otherBranchName = otherBranch === 'hilton' ? 'Hilton' : 'Johannesburg';
  const deliveryFee = bookingData.branch === 'hilton' ? 350 : 450; // Different delivery fees

  useEffect(() => {
    // Simulate availability check
    const timer = setTimeout(() => {
      // Mock availability logic - 70% chance available at selected branch
      const isAvailable = Math.random() > 0.3;
      setAvailable(isAvailable);
      setAlternativeAvailable(!isAvailable ? Math.random() > 0.2 : false);
      setChecking(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (checking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <h2 className="text-2xl font-bold mt-4">Checking Availability</h2>
            <p className="text-gray-600">Please wait while we check stock availability...</p>
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Availability Check</h1>
            <p className="text-gray-600">Stock availability for your selected dates</p>
          </div>
        </div>

        {/* Booking Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium">Equipment</p>
                <p className="text-gray-600">{bookingData.equipmentName}</p>
              </div>
              <div>
                <p className="font-medium">Branch</p>
                <p className="text-gray-600">{bookingData.branch === 'hilton' ? 'Hilton' : 'Johannesburg'}</p>
              </div>
              <div>
                <p className="font-medium">Duration</p>
                <p className="text-gray-600">{bookingData.duration} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Availability Results */}
        {available ? (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Great news!</strong> {bookingData.equipmentName} is available at the {bookingData.branch === 'hilton' ? 'Hilton' : 'Johannesburg'} branch for your selected dates.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Not available</strong> at {bookingData.branch === 'hilton' ? 'Hilton' : 'Johannesburg'} branch for your selected dates.
            </AlertDescription>
          </Alert>
        )}

        {/* Alternative Branch Option */}
        {!available && alternativeAvailable && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-blue-900">Available at {otherBranchName} Branch</CardTitle>
              </div>
              <CardDescription className="text-blue-700">
                We can deliver from our {otherBranchName} branch with additional delivery charges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Cross-branch delivery fee:</span>
                  <span className="font-semibold">R{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Estimated delivery time:</span>
                  <span>1-2 business days</span>
                </div>
                <p className="text-xs text-blue-700">
                  Delivery includes setup and collection at end of rental period
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          {available ? (
            <Button onClick={onAvailable} className="px-8">
              Continue with {bookingData.branch === 'hilton' ? 'Hilton' : 'Johannesburg'} Branch
            </Button>
          ) : alternativeAvailable ? (
            <Button onClick={() => onAlternative(otherBranch, deliveryFee)} className="px-8">
              Continue with {otherBranchName} Branch (+R{deliveryFee})
            </Button>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-4">Unfortunately, this equipment is not available at either branch for your selected dates.</p>
              <Button variant="outline" onClick={onBack}>
                Try Different Dates
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCheck;
