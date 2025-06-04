
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calculator, Truck, Shield, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { BRANCHES, EQUIPMENT_CATEGORIES } from "@/config/equipmentCategories";

interface BookingData {
  region: string | null;
  equipmentType: string | null;
  equipmentName: string;
  startDate: Date | null;
  endDate: Date | null;
  duration: number;
  availableLocally: boolean;
  requiresCrossBranchDelivery: boolean;
  customerDetails: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
  };
}

interface QuoteConfirmationProps {
  bookingData: BookingData;
  onConfirm: (pricing: any, bookingReference: string) => void;
  onBack: () => void;
}

const QuoteConfirmation = ({ bookingData, onConfirm, onBack }: QuoteConfirmationProps) => {
  // Calculate pricing based on equipment type and duration
  const calculatePricing = () => {
    const baseDailyRates: Record<string, number> = {
      'electric-hospital-beds': 85,
      'electric-wheelchairs': 65,
      'wheelchairs': 35,
      'mobility-scooters': 75,
      'commodes': 25,
      'electric-bath-lifts': 55,
      'swivel-bath-chairs': 45,
      'knee-scooters': 40,
      'rollators': 30,
      'walker-frames': 20,
      'wheelchair-ramps': 50,
      'hoists': 90,
      'oxygen-concentrators': 70
    };

    const dailyRate = baseDailyRates[bookingData.equipmentType || ''] || 50;
    const baseRate = dailyRate * bookingData.duration;
    
    const standardDeliveryFee = 150;
    const crossBranchFee = bookingData.requiresCrossBranchDelivery ? 350 : 0;
    const totalDeliveryFee = standardDeliveryFee + crossBranchFee;
    
    const deposit = Math.round(baseRate * 0.3); // 30% deposit
    const total = baseRate + totalDeliveryFee + deposit;

    return {
      baseRate,
      deliveryFee: standardDeliveryFee,
      crossBranchFee,
      deposit,
      total
    };
  };

  const pricing = calculatePricing();
  const selectedBranch = BRANCHES.find(b => b.id === bookingData.region);
  const selectedEquipment = EQUIPMENT_CATEGORIES.find(e => e.id === bookingData.equipmentType);

  const handleConfirm = () => {
    const bookingReference = `R2R${Date.now().toString().slice(-6)}`;
    onConfirm(pricing, bookingReference);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Review Your Quote</h2>
          <p className="text-gray-600">Please review all details before confirming</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Booking Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Rental Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Equipment</p>
                  <p className="text-gray-600">{selectedEquipment?.name}</p>
                </div>
                <div>
                  <p className="font-medium">Service Branch</p>
                  <p className="text-gray-600">{selectedBranch?.name}</p>
                </div>
                <div>
                  <p className="font-medium">Rental Period</p>
                  <p className="text-gray-600">{bookingData.duration} days</p>
                </div>
                <div>
                  <p className="font-medium">Dates</p>
                  <p className="text-gray-600">
                    {bookingData.startDate && format(bookingData.startDate, "MMM dd")} - {bookingData.endDate && format(bookingData.endDate, "MMM dd")}
                  </p>
                </div>
              </div>

              {bookingData.requiresCrossBranchDelivery && (
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Truck className="h-4 w-4 text-orange-600" />
                    <span className="font-medium text-orange-900">Cross-Branch Delivery</span>
                  </div>
                  <p className="text-sm text-orange-800">
                    Equipment will be delivered from our alternate branch location
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Name</p>
                  <p className="text-gray-600">{bookingData.customerDetails.fullName}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">{bookingData.customerDetails.email}</p>
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600">{bookingData.customerDetails.phone}</p>
                  </div>
                </div>
                <div>
                  <p className="font-medium">Delivery Address</p>
                  <p className="text-gray-600">{bookingData.customerDetails.address}</p>
                </div>
                {bookingData.customerDetails.notes && (
                  <div>
                    <p className="font-medium">Special Instructions</p>
                    <p className="text-gray-600">{bookingData.customerDetails.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Quote Summary</CardTitle>
              <CardDescription>Total costs for your rental</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Equipment Rental ({bookingData.duration} days)</span>
                  <span>R{pricing.baseRate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Delivery</span>
                  <span>R{pricing.deliveryFee}</span>
                </div>
                {pricing.crossBranchFee > 0 && (
                  <div className="flex justify-between">
                    <span>Cross-Branch Fee</span>
                    <span>R{pricing.crossBranchFee}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R{pricing.baseRate + pricing.deliveryFee + pricing.crossBranchFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Security Deposit</span>
                  <span>R{pricing.deposit}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>R{pricing.total}</span>
                </div>
              </div>

              <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Security Deposit</span>
                </div>
                <p className="text-xs text-blue-800">
                  Your deposit will be fully refunded upon safe return of the equipment
                </p>
              </div>

              <Button onClick={handleConfirm} className="w-full mt-6">
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Booking
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuoteConfirmation;
