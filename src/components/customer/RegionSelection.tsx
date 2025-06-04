
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { BRANCHES, type BranchId } from "@/config/equipmentCategories";

interface RegionSelectionProps {
  selectedRegion: BranchId | null;
  onRegionSelect: (region: BranchId) => void;
  onNext: () => void;
}

const RegionSelection = ({ selectedRegion, onRegionSelect, onNext }: RegionSelectionProps) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Choose Your Service Area</h2>
        <p className="text-gray-600">Select the branch closest to your location for delivery</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {BRANCHES.map((branch) => (
          <Card 
            key={branch.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedRegion === branch.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => onRegionSelect(branch.id)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">{branch.name}</CardTitle>
                  <CardDescription>{branch.location}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Service Areas:</span>
                  <p className="text-gray-600 mt-1">
                    {branch.id === 'hilton' 
                      ? 'Pietermaritzburg, Howick, Durban Metro, surrounding areas'
                      : 'Johannesburg Metro, Pretoria, East Rand, West Rand'
                    }
                  </p>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Delivery Time:</span>
                  <p className="text-gray-600">Same day or next business day</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button 
          onClick={onNext}
          disabled={!selectedRegion}
          className="px-8 py-3"
        >
          Continue to Equipment Selection
        </Button>
      </div>
    </div>
  );
};

export default RegionSelection;
