
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft } from "lucide-react";

interface BranchSelectionProps {
  selectedBranch: string;
  onBranchSelect: (branch: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const BranchSelection = ({ selectedBranch, onBranchSelect, onNext, onBack }: BranchSelectionProps) => {
  const branches = [
    {
      id: 'hilton',
      name: 'Hilton',
      region: 'KwaZulu-Natal',
      address: 'Hilton, KwaZulu-Natal',
      phone: '+27 33 343 3000',
      coverage: 'Pietermaritzburg, Howick, Durban Metro'
    },
    {
      id: 'johannesburg',
      name: 'Johannesburg',
      region: 'Gauteng',
      address: 'Johannesburg, Gauteng',
      phone: '+27 11 123 4000',
      coverage: 'Johannesburg Metro, Pretoria, East Rand, West Rand'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Choose Your Branch</h1>
            <p className="text-gray-600">Select the Rent2Recover branch nearest to you</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">1</div>
            <div className="w-16 h-1 bg-gray-200"></div>
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-medium">2</div>
            <div className="w-16 h-1 bg-gray-200"></div>
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-medium">3</div>
          </div>
        </div>

        {/* Branch Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {branches.map((branch) => (
            <Card 
              key={branch.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedBranch === branch.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => onBranchSelect(branch.id)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{branch.name}</CardTitle>
                    <CardDescription>{branch.region}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Address</p>
                    <p className="text-sm text-gray-600">{branch.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <p className="text-sm text-gray-600">{branch.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Service Area</p>
                    <p className="text-sm text-gray-600">{branch.coverage}</p>
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
            disabled={!selectedBranch}
            className="px-8 py-2"
          >
            Continue to Equipment Selection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BranchSelection;
