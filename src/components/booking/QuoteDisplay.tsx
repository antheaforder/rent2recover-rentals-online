
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calculator } from "lucide-react";
import { BookingData } from "@/pages/BookingWorkflow";

interface QuoteDisplayProps {
  bookingData: BookingData;
  onQuoteAccept: (totalCost: number, deposit: number) => void;
  onBack: () => void;
}

const QuoteDisplay = ({ bookingData, onQuoteAccept, onBack }: QuoteDisplayProps) => {
  // Calculate costs
  const calculateCosts = () => {
    const days = bookingData.duration;
    let rentalCost = 0;
    
    if (days <= 7) {
      rentalCost = bookingData.weeklyRate;
    } else if (days <= 30) {
      const weeks = Math.ceil(days / 7);
      rentalCost = weeks * bookingData.weeklyRate;
    } else {
      const months = Math.ceil(days / 30);
      rentalCost = months * bookingData.monthlyRate;
    }

    const deliveryFee = bookingData.requiresDelivery ? bookingData.deliveryFee : 0;
    const subtotal = rentalCost + deliveryFee;
    const deposit = Math.round(subtotal * 0.3); // 30% deposit
    const totalCost = subtotal;

    return { rentalCost, deliveryFee, subtotal, deposit, totalCost };
  };

  const costs = calculateCosts();

  const handleAcceptQuote = () => {
    onQuoteAccept(costs.totalCost, costs.deposit);
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Rental Quote</h1>
            <p className="text-gray-600">Review your rental costs and details</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Rental Details */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  <CardTitle>Rental Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Equipment</p>
                      <p className="text-gray-600">{bookingData.equipmentName}</p>
                    </div>
                    <div>
                      <p className="font-medium">Branch</p>
                      <p className="text-gray-600">
                        {bookingData.alternativeBranch 
                          ? `${bookingData.alternativeBranch === 'hilton' ? 'Hilton' : 'Johannesburg'} (Cross-branch delivery)`
                          : (bookingData.branch === 'hilton' ? 'Hilton' : 'Johannesburg')
                        }
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Rental Period</p>
                      <p className="text-gray-600">{bookingData.duration} days</p>
                    </div>
                    <div>
                      <p className="font-medium">Billing Period</p>
                      <p className="text-gray-600">
                        {bookingData.duration <= 7 ? 'Weekly' : 
                         bookingData.duration <= 30 ? 'Weekly' : 'Monthly'}
                      </p>
                    </div>
                  </div>

                  {bookingData.requiresDelivery && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">Cross-Branch Delivery</h4>
                      <p className="text-sm text-blue-800">
                        Includes delivery, setup, and collection at the end of your rental period.
                        Estimated delivery time: 1-2 business days.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Terms & Conditions */}
            <Card>
              <CardHeader>
                <CardTitle>Terms & Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-gray-600">
                  <li>• Equipment must be returned in original condition</li>
                  <li>• Late returns incur additional daily charges at standard daily rate</li>
                  <li>• Damage assessment will be deducted from deposit</li>
                  <li>• 30% deposit required to confirm booking</li>
                  <li>• Balance due on delivery/collection</li>
                  <li>• 48-hour notice required for cancellations</li>
                  <li>• Delivery and setup included in quoted price</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Cost Breakdown */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
                <CardDescription>Your rental quote summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Rental Cost ({bookingData.duration} days)</span>
                    <span>R{costs.rentalCost}</span>
                  </div>
                  
                  {bookingData.requiresDelivery && (
                    <div className="flex justify-between">
                      <span>Cross-branch Delivery</span>
                      <span>R{costs.deliveryFee}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold">
                    <span>Subtotal</span>
                    <span>R{costs.subtotal}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-sm">
                      <span>Deposit Required (30%)</span>
                      <span className="font-semibold text-blue-600">R{costs.deposit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Balance Due on Delivery</span>
                      <span>R{costs.totalCost - costs.deposit}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Cost</span>
                    <span>R{costs.totalCost}</span>
                  </div>
                  
                  <Button 
                    onClick={handleAcceptQuote}
                    className="w-full mt-6"
                    size="lg"
                  >
                    Accept Quote & Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteDisplay;
