
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, MapPin, ArrowLeft, Accessibility, Car, Bed, Heart, Activity, Stethoscope, Zap, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find Equipment</CardTitle>
            <CardDescription>Search and filter available medical equipment at the {branch} branch</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {equipmentCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "MMM dd") : "Start Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "MMM dd") : "End Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Equipment Categories Overview */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {equipmentCategories.slice(0, 10).map((category) => (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedCategory === category.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardContent className="text-center p-4">
                <div className="mx-auto mb-2 p-2 bg-blue-100 rounded-full w-fit">
                  <category.icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {category.items} Available
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Equipment Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <div className="text-gray-400">Equipment Image</div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <div className="text-right">
                    <Badge variant="outline" className="text-green-600 border-green-600 mb-1">
                      {item.available} Available
                    </Badge>
                    <div className="text-xs text-gray-500">at {branch}</div>
                  </div>
                </div>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Weekly:</span>
                    <span className="font-semibold">R{item.weeklyRate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Monthly:</span>
                    <span className="font-semibold">R{item.monthlyRate}</span>
                  </div>
                </div>
                
                {item.available === 0 && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-800 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>Available at {otherBranch} branch</span>
                    </div>
                    <p className="text-xs text-yellow-700 mt-1">Additional delivery fees apply</p>
                  </div>
                )}
                
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate(`/book/${item.category}?item=${item.id}&branch=${branch}`)}
                  disabled={item.available === 0}
                >
                  {item.available > 0 ? 'Book Now' : 'Check Other Branch'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-400 mb-4">No equipment found</div>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
