
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Package, 
  CreditCard,
  FileText,
  ArrowRight
} from "lucide-react";

interface Notification {
  id: string;
  type: 'quote' | 'payment' | 'delivery' | 'extension' | 'return' | 'overdue';
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  actionRequired?: boolean;
}

const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'quote',
      title: 'New Quote Submitted',
      message: 'John Smith submitted a quote for Standard Wheelchair (WC001)',
      time: '5 mins ago',
      read: false,
      priority: 'high',
      actionRequired: true
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Received',
      message: 'R450 payment confirmed for booking B12345',
      time: '15 mins ago',
      read: false,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'delivery',
      title: 'Delivery Confirmed',
      message: 'Hospital Bed HB003 delivered to Sarah Johnson',
      time: '1 hour ago',
      read: true,
      priority: 'low'
    },
    {
      id: '4',
      type: 'extension',
      title: 'Extension Request',
      message: 'Mike Wilson requested 1 week extension for WC005',
      time: '2 hours ago',
      read: false,
      priority: 'medium',
      actionRequired: true
    },
    {
      id: '5',
      type: 'overdue',
      title: 'Overdue Return Alert',
      message: 'Mobility Scooter MS002 is 2 days overdue from Lisa Brown',
      time: '3 hours ago',
      read: false,
      priority: 'high',
      actionRequired: true
    },
    {
      id: '6',
      type: 'return',
      title: 'Equipment Returned',
      message: 'Walker WA001 returned by David Chen',
      time: '4 hours ago',
      read: true,
      priority: 'low'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'quote': return FileText;
      case 'payment': return CreditCard;
      case 'delivery': return Package;
      case 'extension': return Clock;
      case 'return': return CheckCircle;
      case 'overdue': return AlertTriangle;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500 text-white">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
            </div>
            {unreadCount > 0 && (
              <CardDescription>
                You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => {
                    const IconComponent = getNotificationIcon(notification.type);
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                            <IconComponent className="h-4 w-4 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm truncate">
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {notification.time}
                              </span>
                              <div className="flex items-center gap-2">
                                <Badge className={getPriorityColor(notification.priority)}>
                                  {notification.priority}
                                </Badge>
                                {notification.actionRequired && (
                                  <Badge className="bg-orange-100 text-orange-800">
                                    Action Required
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {notifications.length > 0 && (
              <div className="p-4 border-t">
                <Button variant="ghost" size="sm" className="w-full">
                  View all notifications
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPanel;
