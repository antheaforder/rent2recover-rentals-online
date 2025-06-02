
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  MapPin,
  Users
} from "lucide-react";

interface DashboardOverviewProps {
  branch: string;
}

const DashboardOverview = ({ branch }: DashboardOverviewProps) => {
  const [viewMode, setViewMode] = useState<'total' | 'available'>('available');

  // Mock data - replace with real API calls
  const stats = {
    bookingsToday: 12,
    checkedOut: 45,
    overdueReturns: 3,
    totalEquipment: 150,
    availableEquipment: 78,
    maintenanceItems: 8,
    revenue: 15750
  };

  const recentActivity = [
    { id: 1, type: 'booking', message: 'New booking: Wheelchair WC001', time: '10 mins ago', status: 'new' },
    { id: 2, type: 'payment', message: 'Payment received: R450 - John Smith', time: '25 mins ago', status: 'success' },
    { id: 3, type: 'delivery', message: 'Delivery confirmed: Hospital Bed HB003', time: '1 hour ago', status: 'success' },
    { id: 4, type: 'overdue', message: 'Overdue return: Mobility Scooter MS002', time: '2 hours ago', status: 'warning' },
    { id: 5, type: 'extension', message: 'Extension request: WC005 - Sarah Johnson', time: '3 hours ago', status: 'pending' }
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

  return (
    <div className="space-y-6">
      {/* Branch Info & View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-gray-500" />
          <h2 className="text-xl font-semibold">
            {branch === 'hilton' ? 'Hilton' : 'Johannesburg'} Branch Overview
          </h2>
        </div>
        <div className="flex gap-2">
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
            <p className="text-xs text-gray-500 mt-2">+15% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Equipment Out</p>
                <p className="text-3xl font-bold text-green-600">{stats.checkedOut}</p>
              </div>
              <Package className="h-8 w-8 text-green-400" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {viewMode === 'total' ? `${stats.totalEquipment} total items` : `${stats.availableEquipment} available`}
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
                <p className="text-sm font-medium text-gray-600">Revenue Today</p>
                <p className="text-3xl font-bold text-purple-600">R{stats.revenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
            <p className="text-xs text-gray-500 mt-2">+8% from last week</p>
          </CardContent>
        </Card>
      </div>

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
