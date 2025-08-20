
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Accessibility, Bed, Car, Heart, Shield, Clock, Activity, Stethoscope, Zap } from "lucide-react";
import { getEquipmentCategories } from "@/services/categoryService";
import { getInventoryByBranch } from "@/services/inventoryService";

const Index = () => {
  const [selectedBranch, setSelectedBranch] = useState<"hilton" | "johannesburg" | null>(null);
  const navigate = useNavigate();

  const branches = [
    {
      id: "hilton" as const,
      name: "Hilton (KZN)",
      location: "Hilton, KwaZulu-Natal",
      phone: "+27 33 343 1234",
      email: "hilton@rent2recover.co.za"
    },
    {
      id: "johannesburg" as const,
      name: "Johannesburg (Gauteng)", 
      location: "Johannesburg, Gauteng",
      phone: "+27 11 987 6543",
      email: "joburg@rent2recover.co.za"
    }
  ];

  const iconMap = {
    'electric-hospital-beds': Bed,
    'electric-wheelchairs': Zap,
    'wheelchairs': Accessibility,
    'mobility-scooters': Car,
    'commodes': Activity,
    'electric-bath-lifts': Activity,
    'swivel-bath-chairs': Activity,
    'knee-scooters': Car,
    'rollators': Heart,
    'walker-frames': Heart,
    'wheelchair-ramps': Activity,
    'hoists': Activity,
    'oxygen-concentrators': Stethoscope
  };

  const categories = getEquipmentCategories();

  const getAvailableCount = (categoryId: string, branchId: string) => {
    if (!branchId) return 0;
    const inventory = getInventoryByBranch(branchId);
    return inventory.filter(item => 
      item.category === categoryId && item.status === 'available'
    ).length;
  };

  const handleCategoryClick = (categoryId: string) => {
    if (selectedBranch) {
      navigate(`/browse/${categoryId}?branch=${selectedBranch}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* Hero Section */}
      <div className="bg-card shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <img 
                src="/lovable-uploads/3e599274-9dd6-490e-b589-c72d88f74133.png" 
                alt="Rent2Recover Logo" 
                className="h-20 md:h-24"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Rent<span className="text-primary">2</span>Recover
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
                  key={branch.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedBranch === branch.id ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                  onClick={() => setSelectedBranch(branch.id)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      {branch.name}
                    </CardTitle>
                    <CardDescription>{branch.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{branch.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{branch.email}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Categories */}
      {selectedBranch && (
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Browse Our Medical Equipment</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = iconMap[category.id as keyof typeof iconMap] || Activity;
              const availableCount = getAvailableCount(category.id, selectedBranch);
              
              return (
                <Card 
                  key={category.id} 
                  className="text-center hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <CardHeader>
                    <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                    <CardDescription>
                      From R{category.pricing.dailyRate}/day
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge 
                      variant="secondary" 
                      className={availableCount > 0 ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"}
                    >
                      {availableCount > 0 ? `${availableCount} Available` : 'Currently Unavailable'}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Rent2Recover?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-muted-foreground">All equipment is regularly maintained and sanitized for your safety</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Rental</h3>
              <p className="text-muted-foreground">Daily, weekly or monthly rentals to suit your recovery timeline</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Support</h3>
              <p className="text-muted-foreground">Dedicated support teams in Hilton and Johannesburg for personal service</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
