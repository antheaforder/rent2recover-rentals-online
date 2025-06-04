
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Package, 
  CreditCard,
  FileText,
  ArrowRight,
  Filter,
  RotateCcw
} from "lucide-react";

interface Notification {
  id: string;
  type: 'quote' | 'payment' | 'delivery' | 'extension' | 'return' | 'overdue' | 'maintenance';
  category: 'bookings' | 'returns' | 'overdue' | 'payments' | 'maintenance';
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  actionRequired?: boolean;
  branch: 'hilton' | 'johannesburg' | 'both';
  equipmentId?: string;
  bookingId?: string;
}

const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'quote',
      category: 'bookings',
      title: 'New Quote Submitted',
      message: 'John Smith submitted a quote for Standard Wheelchair (WC001)',
      time: '5 mins ago',
      read: false,
      priority: 'high',
      actionRequired: true,
      branch: 'hilton',
      equipmentId: 'WC001'
    },
    {
      id: '2',
      type: 'payment',
      category: 'payments',
      title: 'Payment Received',
      message: 'R450 payment confirmed for booking B12345',
      time: '15 mins ago',
      read: false,
      priority: 'medium',
      branch: 'hilton',
      bookingId: 'B12345'
    },
    {
      id: '3',
      type: 'delivery',
      category: 'bookings',
      title: 'Delivery Confirmed',
      message: 'Hospital Bed HB003 delivered to Sarah Johnson',
      time: '1 hour ago',
      read: true,
      priority: 'low',
      branch: 'johannesburg',
      equipmentId: 'HB003'
    },
    {
      id: '4',
      type: 'extension',
      category: 'bookings',
      title: 'Extension Request',
      message: 'Mike Wilson requested 1 week extension for WC005',
      time: '2 hours ago',
      read: false,
      priority: 'medium',
      actionRequired: true,
      branch: 'hilton',
      equipmentId: 'WC005'
    },
    {
      id: '5',
      type: 'overdue',
      category: 'overdue',
      title: 'Overdue Return Alert',
      message: 'Mobility Scooter MS002 is 2 days overdue from Lisa Brown',
      time: '3 hours ago',
      read: false,
      priority: 'high',
      actionRequired: true,
      branch: 'johannesburg',
      equipmentId: 'MS002'
    },
    {
      id: '6',
      type: 'return',
      category: 'returns',
      title: 'Equipment Returned',
      message: 'Walker WA001 returned by David Chen - inspection required',
      time: '4 hours ago',
      read: true,
      priority: 'low',
      branch: 'hilton',
      equipmentId: 'WA001'
    },
    {
      id: '7',
      type: 'maintenance',
      category: 'maintenance',
      title: 'Maintenance Completed',
      message: 'Wheelchair WC010 maintenance completed, ready for use',
      time: '5 hours ago',
      read: false,
      priority: 'medium',
      branch: 'johannesburg',
      equipmentId: 'WC010'
    },
    {
      id: '8',
      type: 'overdue',
      category: 'overdue',
      title: 'Return Reminder Sent',
      message: 'Automatic reminder sent to customer for Hospital Bed HB007',
      time: '6 hours ago',
      read: true,
      priority: 'low',
      branch: 'hilton',
      equipmentId: 'HB007'
    }
  ]);

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');

  const filteredNotifications = notifications.filter(notification => {
    const matchesCategory = categoryFilter === 'all' || notification.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || notification.priority === priorityFilter;
    const matchesBranch = branchFilter === 'all' || notification.branch === branchFilter || notification.branch === 'both';
    return matchesCategory && matchesPriority && matchesBranch;
  });

  const unreadCount = filteredNotifications.filter(n => !n.read).length;
  const actionRequiredCount = filteredNotifications.filter(n => n.actionRequired && !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'quote': return FileText;
      case 'payment': return CreditCard;
      case 'delivery': return Package;
      case 'extension': return Clock;
      case 'return': return CheckCircle;
      case 'overdue': return AlertTriangle;
      case 'maintenance': return RotateCcw;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bookings': return 'bg-blue-100 text-blue-800';
      case 'returns': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'payments': return 'bg-purple-100 text-purple-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
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

  const clearFilters = () => {
    setCategoryFilter('all');
    setPriorityFilter('all');
    setBranchFilter('all');
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
            <div className="flex items-center justify-between">
              <CardDescription>
                {unreadCount > 0 ? (
                  <>
                    {unreadCount} unread
                    {actionRequiredCount > 0 && (
                      <span className="text-red-600 font-medium"> • {actionRequiredCount} need action</span>
                    )}
                  </>
                ) : (
                  'All caught up!'
                )}
              </CardDescription>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="bookings">Bookings</SelectItem>
                  <SelectItem value="returns">Returns</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="payments">Payments</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="hilton">Hilton</SelectItem>
                  <SelectItem value="johannesburg">Johannesburg</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(categoryFilter !== 'all' || priorityFilter !== 'all' || branchFilter !== 'all') && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-6 p-1">
                <Filter className="h-3 w-3 mr-1" />
                Clear filters
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No notifications match your filters</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredNotifications.map((notification) => {
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
                              <div className="flex items-center gap-1">
                                <Badge className={getCategoryColor(notification.category)}>
                                  {notification.category}
                                </Badge>
                                <Badge className={getPriorityColor(notification.priority)}>
                                  {notification.priority}
                                </Badge>
                                {notification.actionRequired && (
                                  <Badge className="bg-orange-100 text-orange-800">
                                    Action
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {(notification.equipmentId || notification.bookingId) && (
                              <div className="mt-1 text-xs text-gray-500">
                                {notification.equipmentId && `Equipment: ${notification.equipmentId}`}
                                {notification.bookingId && `Booking: ${notification.bookingId}`}
                                {notification.branch !== 'both' && ` • ${notification.branch}`}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {filteredNotifications.length > 0 && (
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
