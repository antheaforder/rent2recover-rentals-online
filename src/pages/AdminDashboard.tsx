
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Download, 
  Calendar as CalendarIcon,
  Package,
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const AdminDashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const branch = searchParams.get('branch') || 'KZN';
  
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");

  // Sample inventory data
  const inventory = [
    {
      id: "WC001",
      name: "Standard Wheelchair",
      category: "wheelchairs",
      status: "available",
      lastChecked: "2024-01-15",
      currentBooking: null
    },
    {
      id: "WC002", 
      name: "Standard Wheelchair",
      category: "wheelchairs",
      status: "rented",
      lastChecked: "2024-01-10",
      currentBooking: {
        customer: "John Smith",
        startDate: "2024-01-12",
        endDate: "2024-01-20"
      }
    },
    {
      id: "MS001",
      name: "4-Wheel Mobility Scooter",
      category: "scooters", 
      status: "maintenance",
      lastChecked: "2024-01-08",
      currentBooking: null
    },
    {
      id: "HB001",
      name: "Electric Hospital Bed",
      category: "beds",
      status: "available",
      lastChecked: "2024-01-14",
      currentBooking: null
    }
  ];

  const stats = {
    total: inventory.length,
    available: inventory.filter(item => item.status === 'available').length,
    rented: inventory.filter(item => item.status === 'rented').length,
    maintenance: inventory.filter(item => item.status === 'maintenance').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'rented': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return CheckCircle;
      case 'rented': return Clock;
      case 'maintenance': return AlertTriangle;
      default: return Package;
    }
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {branch} Branch
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <Package className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-3xl font-bold text-green-600">{stats.available}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rented Out</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.rented}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Maintenance</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.maintenance}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="inventory" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inventory">Inventory Management</TabsTrigger>
            <TabsTrigger value="bookings">Active Bookings</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory Search</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by ID or name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Inventory List */}
            <div className="grid gap-4">
              {inventory.map((item) => {
                const StatusIcon = getStatusIcon(item.status);
                return (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <StatusIcon className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-gray-600">ID: {item.id}</p>
                            <p className="text-xs text-gray-500">Last checked: {item.lastChecked}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <Badge className={getStatusColor(item.status)}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Badge>
                          
                          {item.status === 'available' && (
                            <Button size="sm" variant="outline">
                              Check Out
                            </Button>
                          )}
                          
                          {item.status === 'rented' && (
                            <div className="text-right">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Check In
                              </Button>
                              <p className="text-xs text-gray-500 mt-1">
                                Due: {item.currentBooking?.endDate}
                              </p>
                            </div>
                          )}
                          
                          {item.status === 'maintenance' && (
                            <Button size="sm" variant="outline">
                              Mark Fixed
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {item.currentBooking && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm"><strong>Customer:</strong> {item.currentBooking.customer}</p>
                          <p className="text-sm"><strong>Period:</strong> {item.currentBooking.startDate} to {item.currentBooking.endDate}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Bookings</CardTitle>
                <CardDescription>Manage current and upcoming rentals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Active bookings management interface will be displayed here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendar View</CardTitle>
                <CardDescription>View equipment availability and bookings by date</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className={cn("rounded-md border pointer-events-auto")}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">
                      {selectedDate ? `Schedule for ${format(selectedDate, "MMMM dd, yyyy")}` : "Select a date"}
                    </h3>
                    <div className="space-y-2">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium">WC002 - Due Return</p>
                        <p className="text-xs text-gray-600">John Smith</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium">HB001 - New Rental</p>
                        <p className="text-xs text-gray-600">Sarah Johnson</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
