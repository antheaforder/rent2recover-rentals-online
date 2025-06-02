
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, MapPin, ArrowLeft, Wheelchair, Car, Bed, Heart } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const CustomerDashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const branch = searchParams.get('branch') || 'KZN';
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const equipmentCategories = [
    { id: "wheelchairs", name: "Wheelchairs", icon: Wheelchair, items: 12 },
    { id: "scooters", name: "Mobility Scooters", icon: Car, items: 8 },
    { id: "beds", name: "Hospital Beds", icon: Bed, items: 6 },
    { id: "walking-aids", name: "Walking Aids", icon: Heart, items: 15 }
  ];

  const equipmentItems = [
    {
      id: 1,
      name: "Standard Wheelchair",
      category: "wheelchairs",
      description: "Lightweight manual wheelchair with adjustable footrests",
      dailyRate: 45,
      weeklyRate: 250,
      monthlyRate: 800,
      available: 5,
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Electric Wheelchair",
      category: "wheelchairs", 
      description: "Powered wheelchair with joystick control",
      dailyRate: 120,
      weeklyRate: 700,
      monthlyRate: 2400,
      available: 3,
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Mobility Scooter - 4 Wheel",
      category: "scooters",
      description: "Outdoor mobility scooter with basket and lights",
      dailyRate: 95,
      weeklyRate: 550,
      monthlyRate: 1800,
      available: 4,
      image: "/placeholder.svg"
    },
    {
      id: 4,
      name: "Hospital Bed - Electric",
      category: "beds",
      description: "Adjustable hospital bed with side rails",
      dailyRate: 150,
      weeklyRate: 900,
      monthlyRate: 3000,
      available: 2,
      image: "/placeholder.svg"
    }
  ];

  const filteredItems = equipmentItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find Equipment</CardTitle>
            <CardDescription>Search and filter available medical equipment</CardDescription>
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
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {equipmentCategories.map((category) => (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedCategory === category.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardContent className="text-center p-6">
                <div className="mx-auto mb-3 p-3 bg-blue-100 rounded-full w-fit">
                  <category.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold">{category.name}</h3>
                <Badge variant="secondary" className="mt-2">
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
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {item.available} Available
                  </Badge>
                </div>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Daily:</span>
                    <span className="font-semibold">R{item.dailyRate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Weekly:</span>
                    <span className="font-semibold">R{item.weeklyRate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Monthly:</span>
                    <span className="font-semibold">R{item.monthlyRate}</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate(`/book/${item.category}?item=${item.id}&branch=${branch}`)}
                >
                  Book Now
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
