
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Accessibility, Bed, Car, Heart, Shield, Clock, Activity, Stethoscope, Zap } from "lucide-react";

const Index = () => {
  const [selectedBranch, setSelectedBranch] = useState<"Hilton" | "Johannesburg" | null>(null);
  const navigate = useNavigate();

  const equipment = [
    { name: "Electric Hospital Beds", icon: Bed, description: "Adjustable electric hospital beds", available: 8 },
    { name: "Electric Wheelchairs", icon: Zap, description: "Powered wheelchairs with joystick control", available: 5 },
    { name: "Wheelchairs", icon: Accessibility, description: "Manual wheelchairs", available: 12 },
    { name: "Mobility Scooters", icon: Car, description: "Indoor and outdoor mobility scooters", available: 6 },
    { name: "Commodes – Mobile Toilets", icon: Activity, description: "Portable toilet solutions", available: 10 },
    { name: "Electric Bath Lifts", icon: Activity, description: "Electric bath lifting aids", available: 4 },
    { name: "Swivel Bath Chairs", icon: Activity, description: "Rotating bath chairs for safety", available: 7 },
    { name: "Knee Scooters", icon: Car, description: "Knee scooters for mobility", available: 9 },
    { name: "Rollators", icon: Heart, description: "Four-wheeled walking aids", available: 11 },
    { name: "Walker (Zimmer) Frames", icon: Heart, description: "Traditional walking frames", available: 15 },
    { name: "Wheelchair Ramps", icon: Activity, description: "Portable wheelchair ramps", available: 6 },
    { name: "Hoists", icon: Activity, description: "Patient lifting hoists", available: 3 },
    { name: "Oxygen Concentrator Machines", icon: Stethoscope, description: "Medical oxygen concentrators", available: 5 }
  ];

  const branches = [
    {
      name: "Hilton",
      location: "Hilton, KwaZulu-Natal",
      phone: "+27 33 343 1234",
      email: "hilton@rent2recover.co.za"
    },
    {
      name: "Johannesburg", 
      location: "Johannesburg, Gauteng",
      phone: "+27 11 987 6543",
      email: "joburg@rent2recover.co.za"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Rent<span className="text-blue-600">2</span>Recover
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              South Africa's trusted medical equipment rental service. 
              Quality mobility aids for your recovery journey.
            </p>
          </div>

          {/* Branch Selection */}
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-2xl font-semibold text-center mb-6">Choose Your Branch</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {branches.map((branch) => (
                <Card 
                  key={branch.name}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedBranch === branch.name ? 'ring-2 ring-blue-500 shadow-lg' : ''
                  }`}
                  onClick={() => setSelectedBranch(branch.name as "Hilton" | "Johannesburg")}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      {branch.name}
                    </CardTitle>
                    <CardDescription>{branch.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        {branch.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        {branch.email}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          {selectedBranch && (
            <div className="text-center space-y-4 animate-in fade-in-50 slide-in-from-bottom-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
                  onClick={() => navigate(`/customer?branch=${selectedBranch}`)}
                >
                  Browse Equipment
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg"
                  onClick={() => navigate(`/admin?branch=${selectedBranch}`)}
                >
                  Admin Access
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Equipment Overview */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Medical Equipment</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {equipment.slice(0, 8).map((item) => (
            <Card key={item.name} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                  <item.icon className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {item.available} Available
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-600">+ 5 more equipment types available</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Rent2Recover?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-gray-600">All equipment is regularly maintained and sanitized for your safety</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Rental</h3>
              <p className="text-gray-600">Weekly or monthly rentals to suit your recovery timeline</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Support</h3>
              <p className="text-gray-600">Dedicated support teams in Hilton and Johannesburg for personal service</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
