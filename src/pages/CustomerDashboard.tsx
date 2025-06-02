
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Accessibility, Car, Bed, Heart, Activity, Stethoscope, Zap } from "lucide-react";
import SearchFilters from "@/components/SearchFilters";
import EquipmentCategories from "@/components/EquipmentCategories";
import EquipmentGrid from "@/components/EquipmentGrid";

const CustomerDashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const branch = searchParams.get('branch') || 'Hilton';
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const equipmentCategories = [
    { id: "electric-hospital-beds", name: "Electric Hospital Beds", icon: Bed, items: 8 },
    { id: "electric-wheelchairs", name: "Electric Wheelchairs", icon: Zap, items: 5 },
    { id: "wheelchairs", name: "Wheelchairs", icon: Accessibility, items: 12 },
    { id: "mobility-scooters", name: "Mobility Scooters", icon: Car, items: 6 },
    { id: "commodes", name: "Commodes – Mobile Toilets", icon: Activity, items: 10 },
    { id: "electric-bath-lifts", name: "Electric Bath Lifts", icon: Activity, items: 4 },
    { id: "swivel-bath-chairs", name: "Swivel Bath Chairs", icon: Activity, items: 7 },
    { id: "knee-scooters", name: "Knee Scooters", icon: Car, items: 9 },
    { id: "rollators", name: "Rollators", icon: Heart, items: 11 },
    { id: "zimmer-frames", name: "Walker (Zimmer) Frames", icon: Heart, items: 15 },
    { id: "wheelchair-ramps", name: "Wheelchair Ramps", icon: Activity, items: 6 },
    { id: "hoists", name: "Hoists", icon: Activity, items: 3 },
    { id: "oxygen-concentrators", name: "Oxygen Concentrator Machines", icon: Stethoscope, items: 5 }
  ];

  const equipmentItems = [
    {
      id: 1,
      name: "Electric Hospital Bed - Deluxe",
      category: "electric-hospital-beds",
      description: "Fully adjustable electric hospital bed with side rails and remote control",
      weeklyRate: 850,
      monthlyRate: 2800,
      available: 3,
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Electric Wheelchair - Premium",
      category: "electric-wheelchairs", 
      description: "Heavy-duty electric wheelchair with joystick control and long battery life",
      weeklyRate: 1200,
      monthlyRate: 4000,
      available: 2,
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Standard Manual Wheelchair",
      category: "wheelchairs",
      description: "Lightweight manual wheelchair with adjustable footrests and removable armrests",
      weeklyRate: 350,
      monthlyRate: 1200,
      available: 5,
      image: "/placeholder.svg"
    },
    {
      id: 4,
      name: "4-Wheel Mobility Scooter",
      category: "mobility-scooters",
      description: "Outdoor mobility scooter with basket, lights, and 15km range",
      weeklyRate: 750,
      monthlyRate: 2500,
      available: 4,
      image: "/placeholder.svg"
    },
    {
      id: 5,
      name: "Portable Commode Chair",
      category: "commodes",
      description: "Height-adjustable commode with padded seat and splash guard",
      weeklyRate: 200,
      monthlyRate: 650,
      available: 6,
      image: "/placeholder.svg"
    },
    {
      id: 6,
      name: "Electric Bath Lift",
      category: "electric-bath-lifts",
      description: "Battery-powered bath lift with waterproof hand control",
      weeklyRate: 600,
      monthlyRate: 1900,
      available: 2,
      image: "/placeholder.svg"
    }
  ];

  const filteredItems = equipmentItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const otherBranch = branch === "Hilton" ? "Johannesburg" : "Hilton";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Browse Equipment</h1>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {branch} Branch
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Need equipment from {otherBranch}?</p>
              <p className="text-xs text-blue-600">Cross-branch delivery available</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <SearchFilters
          branch={branch}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          equipmentCategories={equipmentCategories}
        />

        <EquipmentCategories
          categories={equipmentCategories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        <EquipmentGrid
          items={filteredItems}
          branch={branch}
          otherBranch={otherBranch}
        />
      </div>
    </div>
  );
};

export default CustomerDashboard;
