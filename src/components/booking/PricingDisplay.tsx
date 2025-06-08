
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingDown } from "lucide-react";
import { PricingBreakdown } from "@/services/pricingService";

interface PricingDisplayProps {
  pricing: PricingBreakdown;
  deliveryFee: number;
  recommendation?: string;
}

const PricingDisplay = ({ pricing, deliveryFee, recommendation }: PricingDisplayProps) => {
  const totalWithDelivery = pricing.total + deliveryFee;
  const deposit = Math.round(totalWithDelivery * 0.3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Rental Cost Breakdown
        </CardTitle>
        <CardDescription>
          Automatically calculated for the most cost-effective rate
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Optimal Rate Display */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-800">Optimal Rate Applied</span>
          </div>
          <p className="text-sm text-green-700">{pricing.breakdown}</p>
          {recommendation && (
            <p className="text-xs text-green-600 mt-1">{recommendation}</p>
          )}
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Rental Period:</span>
            <Badge variant="outline">{pricing.duration} days</Badge>
          </div>
          
          {/* Breakdown by billing unit */}
          {pricing.details.months && (
            <div className="flex justify-between text-sm">
              <span>{pricing.details.months.count} month{pricing.details.months.count > 1 ? 's' : ''} @ R{pricing.details.months.rate}/month</span>
              <span>R{pricing.details.months.total}</span>
            </div>
          )}
          
          {pricing.details.weeks && (
            <div className="flex justify-between text-sm">
              <span>{pricing.details.weeks.count} week{pricing.details.weeks.count > 1 ? 's' : ''} @ R{pricing.details.weeks.rate}/week</span>
              <span>R{pricing.details.weeks.total}</span>
            </div>
          )}
          
          {pricing.details.days && (
            <div className="flex justify-between text-sm">
              <span>{pricing.details.days.count} day{pricing.details.days.count > 1 ? 's' : ''} @ R{pricing.details.days.rate}/day</span>
              <span>R{pricing.details.days.total}</span>
            </div>
          )}
          
          <div className="border-t pt-2 space-y-2">
            <div className="flex justify-between">
              <span>Equipment Rental:</span>
              <span className="font-medium">R{pricing.total}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery & Setup:</span>
              <span>R{deliveryFee}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total Cost:</span>
              <span>R{totalWithDelivery}</span>
            </div>
            <div className="flex justify-between text-blue-600">
              <span>Deposit Required (30%):</span>
              <span className="font-semibold">R{deposit}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingDisplay;
