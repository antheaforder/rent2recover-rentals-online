import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Package, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  MapPin,
  Users,
  Wrench
} from "lucide-react";
import { EQUIPMENT_CATEGORIES, BRANCHES } from "@/config/equipmentCategories";
import { getInventoryByBranch, getInventoryByCategory } from "@/services/inventoryService";
import { getEquipmentCategories } from "@/services/categoryService";

interface DashboardOverviewProps {
  branch: string;
}

const DashboardOverview = ({ branch }: DashboardOverviewProps) => {
  const [viewMode, setViewMode] = useState<'total' | 'available'>('available');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  // Listen for inventory and pricing updates
  useEffect(() => {
    const handleInventoryUpdate = () => {
      setRefreshKey(prev => prev + 1);
    };

    const handlePricingUpdate = () => {
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener('inventoryUpdated', handleInventoryUpdate);
    window.addEventListener('categoryPricingUpdated', handlePricingUpdate);

    return () => {
      window.removeEventListener('inventoryUpdated', handleInventoryUpdate);
      window.removeEventListener('categoryPricingUpdated', handlePricingUpdate);
    };
  }, []);

  // Real-time data calculation
  const categoryStats = EQUIPMENT_CATEGORIES.map(category => {
    const allCategoryInventory = getInventoryByCategory(category.id);
    const branchInventory = allCategoryInventory.filter(item => item.branch === branch);
    const categories = getEquipmentCategories();
    const categoryData = categories.find(c => c.id === category.id);
    
    return {
      ...category,
      total: branchInventory.length,
      available: branchInventory.filter(item => item.status === 'available').length,
      booked: branchInventory.filter(item => item.status === 'booked').length,
      maintenance: branchInventory.filter(item => item.status === 'maintenance').length,
      pricing: categoryData?.pricing || { dailyRate: 0, weeklyRate: 0, monthlyRate: 0 }
    };
  });

  const stats = {
    bookingsToday: 12,
    returnsToday: 8,
    overdueReturns: 3,
    totalEquipment: categoryStats.reduce((sum, cat) => sum + cat.total, 0),
    availableEquipment: categoryStats.reduce((sum, cat) => sum + cat.available, 0),
    bookedEquipment: categoryStats.reduce((sum, cat) => sum + cat.booked, 0),
    maintenanceItems: categoryStats.reduce((sum, cat) => sum + cat.maintenance, 0),
    revenue: 15750
  };

  const filteredStats = selectedCategory === 'all' 
    ? categoryStats 
    : categoryStats.filter(cat => cat.id === selectedCategory);

  const recentActivity = [
    { id: 1, type: 'booking', message: 'New booking: Standard Wheelchair (WC001)', time: '10 mins ago', status: 'new' },
    { id: 2, type: 'payment', message: 'Payment received: R450 - John Smith', time: '25 mins ago', status: 'success' },
    { id: 3, type: 'delivery', message: 'Delivery confirmed: Hospital Bed (HB003)', time: '1 hour ago', status: 'success' },
    { id: 4, type: 'overdue', message: 'Overdue return: Mobility Scooter (MS002)', time: '2 hours ago', status: 'warning' },
    { id: 5, type: 'extension', message: 'Extension request: Walking Frame (WF005)', time: '3 hours ago', status: 'pending' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return Calendar;
      case 'payment': return CheckCircle;
      case 'delivery': return Package;
      case 'overdue': return AlertTriangle;
      case 'extension': return Clock;
      default: return Package;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const currentBranch = BRANCHES.find(b => b.id === branch);

  return (
    <div className="space-y-6">
      {/* Branch Info & Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-gray-500" />
          <h2 className="text-xl font-semibold">
            {currentBranch?.name} Overview
          </h2>
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {EQUIPMENT_CATEGORIES.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant={viewMode === 'total' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('total')}
          >
            Total Stock
          </Button>
          <Button 
            variant={viewMode === 'available' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('available')}
          >
            Available Stock
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bookings Today</p>
                <p className="text-3xl font-bold text-blue-600">{stats.bookingsToday}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Returns due: {stats.returnsToday}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Equipment Out</p>
                <p className="text-3xl font-bold text-green-600">{stats.bookedEquipment}</p>
              </div>
              <Package className="h-8 w-8 text-green-400" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Available: {stats.availableEquipment}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Returns</p>
                <p className="text-3xl font-bold text-red-600">{stats.overdueReturns}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                <p className="text-3xl font-bold text-orange-600">{stats.maintenanceItems}</p>
              </div>
              <Wrench className="h-8 w-8 text-orange-400" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Items under repair</p>
          </CardContent>
        </Card>
      </div>

      {/* Equipment Categories Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Equipment Categories</CardTitle>
          <CardDescription>
            Breakdown by category for {currentBranch?.name}
            {selectedCategory !== 'all' && ` - ${EQUIPMENT_CATEGORIES.find(c => c.id === selectedCategory)?.name}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStats.map((category) => (
              <div key={category.id} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  <h3 className="font-semibold text-sm">{category.name}</h3>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Total:</span>
                    <span className="font-medium ml-1">{category.total}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Available:</span>
                    <span className="font-medium ml-1 text-green-600">{category.available}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Booked:</span>
                    <span className="font-medium ml-1 text-blue-600">{category.booked}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Maintenance:</span>
                    <span className="font-medium ml-1 text-orange-600">{category.maintenance}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">
                    Daily: R{category.pricing.dailyRate || 0}
                  </Badge>
                  <Badge variant="outline">
                    Weekly: R{category.pricing.weeklyRate || 0}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your rental operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const IconComponent = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <IconComponent className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <h3 className="font-semibold">Add Equipment</h3>
            <p className="text-sm text-gray-600">Register new rental items</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <h3 className="font-semibold">Process Return</h3>
            <p className="text-sm text-gray-600">Check in returned equipment</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <h3 className="font-semibold">Approve Quote</h3>
            <p className="text-sm text-gray-600">Review pending quotes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
