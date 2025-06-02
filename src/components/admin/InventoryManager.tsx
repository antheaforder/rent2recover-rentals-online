
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Plus, 
  Package, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ArrowRightLeft,
  Edit,
  Trash2
} from "lucide-react";

interface InventoryManagerProps {
  branch: string;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  status: 'available' | 'rented' | 'maintenance' | 'transfer';
  branch: string;
  lastChecked: string;
  condition: 'excellent' | 'good' | 'fair' | 'needs-repair';
  currentBooking?: {
    customer: string;
    endDate: string;
  };
}

const InventoryManager = ({ branch }: InventoryManagerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Mock inventory data
  const inventory: InventoryItem[] = [
    {
      id: "WC001",
      name: "Standard Wheelchair",
      category: "wheelchairs",
      status: "available",
      branch: "hilton",
      lastChecked: "2024-01-15",
      condition: "excellent"
    },
    {
      id: "WC002",
      name: "Standard Wheelchair",
      category: "wheelchairs", 
      status: "rented",
      branch: "hilton",
      lastChecked: "2024-01-10",
      condition: "good",
      currentBooking: {
        customer: "John Smith",
        endDate: "2024-01-20"
      }
    },
    {
      id: "MS001",
      name: "4-Wheel Mobility Scooter",
      category: "scooters",
      status: "maintenance",
      branch: "johannesburg",
      lastChecked: "2024-01-08",
      condition: "needs-repair"
    },
    {
      id: "HB001",
      name: "Electric Hospital Bed",
      category: "beds",
      status: "available",
      branch: "hilton",
      lastChecked: "2024-01-14",
      condition: "excellent"
    }
  ];

  const categories = [
    "wheelchairs", "scooters", "beds", "walkers", "crutches", 
    "bathroom-aids", "lifts", "ramps", "cushions", "accessories"
  ];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesBranch = item.branch === branch;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesBranch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'rented': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'transfer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'needs-repair': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return CheckCircle;
      case 'rented': return Clock;
      case 'maintenance': return AlertTriangle;
      case 'transfer': return ArrowRightLeft;
      default: return Package;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Inventory Management</h2>
          <p className="text-gray-600">Manage equipment for {branch === 'hilton' ? 'Hilton' : 'Johannesburg'} branch</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by ID or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="transfer">In Transfer</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Advanced
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Grid */}
      <div className="grid gap-4">
        {filteredInventory.map((item) => {
          const StatusIcon = getStatusIcon(item.status);
          return (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <StatusIcon className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-sm text-gray-600">ID: {item.id}</p>
                      <p className="text-xs text-gray-500">Last checked: {item.lastChecked}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Badge>
                        <Badge className={getConditionColor(item.condition)}>
                          {item.condition.charAt(0).toUpperCase() + item.condition.slice(1).replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {item.status === 'available' && (
                      <>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <ArrowRightLeft className="h-4 w-4 mr-1" />
                          Transfer
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Check Out
                        </Button>
                      </>
                    )}
                    
                    {item.status === 'rented' && (
                      <div className="text-right">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Check In
                        </Button>
                        <p className="text-xs text-gray-500 mt-1">
                          Due: {item.currentBooking?.endDate}
                        </p>
                      </div>
                    )}
                    
                    {item.status === 'maintenance' && (
                      <>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Update
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Mark Fixed
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                {item.currentBooking && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm"><strong>Customer:</strong> {item.currentBooking.customer}</p>
                    <p className="text-sm"><strong>Return Due:</strong> {item.currentBooking.endDate}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {filteredInventory.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No equipment found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or add new equipment</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InventoryManager;
