
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  CheckCircle,
  Package,
  AlertTriangle,
  Clock
} from "lucide-react";

const ActivityFeed = () => {
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

  return (
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
  );
};

export default ActivityFeed;
