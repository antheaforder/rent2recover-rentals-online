
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bed, Zap, Accessibility, Car, Activity, Heart, Stethoscope } from "lucide-react";

interface EquipmentTypeSelectionProps {
  selectedType: string;
  onTypeSelect: (type: string, name: string, weeklyRate: number, monthlyRate: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const EquipmentTypeSelection = ({ selectedType, onTypeSelect, onNext, onBack }: EquipmentTypeSelectionProps) => {
  const equipmentTypes = [
    { id: "electric-hospital-beds", name: "Electric Hospital Beds", icon: Bed, weeklyRate: 850, monthlyRate: 2800, available: 8 },
    { id: "electric-wheelchairs", name: "Electric Wheelchairs", icon: Zap, weeklyRate: 1200, monthlyRate: 4000, available: 5 },
    { id: "wheelchairs", name: "Wheelchairs", icon: Accessibility, weeklyRate: 350, monthlyRate: 1200, available: 12 },
    { id: "mobility-scooters", name: "Mobility Scooters", icon: Car, weeklyRate: 750, monthlyRate: 2500, available: 6 },
    { id: "commodes", name: "Commodes – Mobile Toilets", icon: Activity, weeklyRate: 200, monthlyRate: 650, available: 10 },
    { id: "electric-bath-lifts", name: "Electric Bath Lifts", icon: Activity, weeklyRate: 600, monthlyRate: 1900, available: 4 },
    { id: "swivel-bath-chairs", name: "Swivel Bath Chairs", icon: Activity, weeklyRate: 300, monthlyRate: 950, available: 7 },
    { id: "knee-scooters", name: "Knee Scooters", icon: Car, weeklyRate: 400, monthlyRate: 1300, available: 9 },
    { id: "rollators", name: "Rollators", icon: Heart, weeklyRate: 250, monthlyRate: 800, available: 11 },
    { id: "zimmer-frames", name: "Walker (Zimmer) Frames", icon: Heart, weeklyRate: 150, monthlyRate: 500, available: 15 },
    { id: "wheelchair-ramps", name: "Wheelchair Ramps", icon: Activity, weeklyRate: 500, monthlyRate: 1600, available: 6 },
    { id: "hoists", name: "Hoists", icon: Activity, weeklyRate: 800, monthlyRate: 2600, available: 3 },
    { id: "oxygen-concentrators", name: "Oxygen Concentrator Machines", icon: Stethoscope, weeklyRate: 900, monthlyRate: 3000, available: 5 }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Select Equipment Type</h1>
            <p className="text-gray-600">Choose the medical equipment you need to rent</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-medium">✓</div>
            <div className="w-16 h-1 bg-green-600"></div>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">2</div>
            <div className="w-16 h-1 bg-gray-200"></div>
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-medium">3</div>
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {equipmentTypes.map((equipment) => (
            <Card 
              key={equipment.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedType === equipment.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => onTypeSelect(equipment.id, equipment.name, equipment.weeklyRate, equipment.monthlyRate)}
            >
              <CardHeader className="text-center pb-3">
                <div className="mx-auto mb-2 p-3 bg-blue-100 rounded-full w-fit">
                  <equipment.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-sm">{equipment.name}</CardTitle>
                <CardDescription className="text-xs">
                  <Badge variant="secondary" className="text-xs">
                    {equipment.available} Available
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-center space-y-1">
                  <div className="text-sm">
                    <span className="font-semibold">R{equipment.weeklyRate}</span>
                    <span className="text-gray-600">/week</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">R{equipment.monthlyRate}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button 
            onClick={onNext}
            disabled={!selectedType}
            className="px-8 py-2"
          >
            Continue to Date Selection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentTypeSelection;
