
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { EQUIPMENT_CATEGORIES, type EquipmentCategoryId } from "@/config/equipmentCategories";

interface EquipmentSelectionProps {
  selectedType: EquipmentCategoryId | null;
  onEquipmentSelect: (type: EquipmentCategoryId, name: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const EquipmentSelection = ({ selectedType, onEquipmentSelect, onNext, onBack }: EquipmentSelectionProps) => {
  // Mock pricing data - in real app this would come from a database
  const getPricing = (categoryId: EquipmentCategoryId) => {
    const pricingMap: Record<EquipmentCategoryId, { daily: number; weekly: number; monthly: number }> = {
      'electric-hospital-beds': { daily: 85, weekly: 450, monthly: 1200 },
      'electric-wheelchairs': { daily: 65, weekly: 350, monthly: 950 },
      'wheelchairs': { daily: 35, weekly: 180, monthly: 480 },
      'mobility-scooters': { daily: 75, weekly: 400, monthly: 1050 },
      'commodes': { daily: 25, weekly: 120, monthly: 320 },
      'electric-bath-lifts': { daily: 55, weekly: 290, monthly: 780 },
      'swivel-bath-chairs': { daily: 45, weekly: 240, monthly: 650 },
      'knee-scooters': { daily: 40, weekly: 200, monthly: 550 },
      'rollators': { daily: 30, weekly: 150, monthly: 400 },
      'walker-frames': { daily: 20, weekly: 100, monthly: 270 },
      'wheelchair-ramps': { daily: 50, weekly: 260, monthly: 700 },
      'hoists': { daily: 90, weekly: 480, monthly: 1300 },
      'oxygen-concentrators': { daily: 70, weekly: 370, monthly: 1000 }
    };
    return pricingMap[categoryId];
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Select Equipment Type</h2>
          <p className="text-gray-600">Choose the medical equipment you need to rent</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {EQUIPMENT_CATEGORIES.map((category) => {
          const pricing = getPricing(category.id);
          return (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedType === category.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => onEquipmentSelect(category.id, category.name)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  <Badge variant="outline" className="text-xs">Available</Badge>
                </div>
                <CardTitle className="text-lg leading-tight">{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span>Daily:</span>
                      <span className="font-medium">R{pricing.daily}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weekly:</span>
                      <span className="font-medium">R{pricing.weekly}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly:</span>
                      <span className="font-medium">R{pricing.monthly}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Button 
          onClick={onNext}
          disabled={!selectedType}
          className="px-8 py-3"
        >
          Continue to Date Selection
        </Button>
      </div>
    </div>
  );
};

export default EquipmentSelection;
