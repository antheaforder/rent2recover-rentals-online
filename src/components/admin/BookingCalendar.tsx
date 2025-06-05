import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Package,
  User,
  Clock,
  Download,
  Link,
  MapPin,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval } from "date-fns";
import { 
  EQUIPMENT_CATEGORIES, 
  BRANCHES, 
  type EquipmentCategoryId, 
  type BranchId, 
  type BookingBlock, 
  type InventoryItem,
  type AvailabilityCheck
} from "@/config/equipmentCategories";
import { 
  getInventory, 
  getBookings, 
  checkAvailability, 
  generateICalForItem 
} from "@/services/bookingService";

interface BookingCalendarProps {
  branch: string;
}

const BookingCalendar = ({ branch }: BookingCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewType, setViewType] = useState<'week' | 'month'>('week');
  const [equipmentFilter, setEquipmentFilter] = useState('all');
  const [showCrossBranch, setShowCrossBranch] = useState(true);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<string | null>(null);
  
  // State for real data
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [bookings, setBookings] = useState<BookingBlock[]>([]);

  // Load data on component mount
  useEffect(() => {
    setInventoryItems(getInventory());
    setBookings(getBookings());
  }, []);

  // Filter bookings based on current selections
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesBranch = showCrossBranch || booking.branch === branch;
      const matchesCategory = equipmentFilter === 'all' || booking.equipmentCategory === equipmentFilter;
      return matchesBranch && matchesCategory;
    });
  }, [bookings, showCrossBranch, branch, equipmentFilter]);

  // Generate iCal feed for a specific inventory item
  const handleGenerateICalFeed = (inventoryItemId: string) => {
    const icalContent = generateICalForItem(inventoryItemId);
    if (icalContent) {
      const blob = new Blob([icalContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${inventoryItemId}-calendar.ics`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const copyICalLink = (inventoryItemId: string) => {
    // In a real app, this would be a public URL to the iCal feed
    const icalUrl = `https://rent2recover.com/api/ical/${inventoryItemId}`;
    navigator.clipboard.writeText(icalUrl);
    // Show toast notification
    console.log('iCal link copied to clipboard:', icalUrl);
  };

  // Get status colors and icons
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 border-green-300 text-green-800';
      case 'pending': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'active': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'overdue': return 'bg-red-100 border-red-300 text-red-800';
      case 'returned': return 'bg-gray-100 border-gray-300 text-gray-800';
      case 'cancelled': return 'bg-gray-100 border-gray-300 text-gray-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getCategoryColor = (categoryId: string) => {
    return EQUIPMENT_CATEGORIES.find(cat => cat.id === categoryId)?.color || 'bg-gray-500';
  };

  const getWeekDays = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  };

  // Enhanced week view with cross-branch visibility
  const renderWeekView = () => {
    const weekDays = getWeekDays(selectedDate);
    const categoriesToShow = equipmentFilter === 'all' 
      ? EQUIPMENT_CATEGORIES 
      : EQUIPMENT_CATEGORIES.filter(cat => cat.id === equipmentFilter);
    
    return (
      <div className="space-y-4">
        {/* Week Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => setSelectedDate(addDays(selectedDate, -7))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold">
              {format(weekDays[0], 'MMM dd')} - {format(weekDays[6], 'MMM dd, yyyy')}
            </h3>
            <Button variant="outline" size="sm" onClick={() => setSelectedDate(addDays(selectedDate, 7))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleGenerateICalFeed('all')}>
              <Download className="h-4 w-4 mr-2" />
              Export All iCal
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
              Today
            </Button>
          </div>
        </div>

        {/* Cross-branch toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            id="cross-branch"
            checked={showCrossBranch}
            onCheckedChange={setShowCrossBranch}
          />
          <Label htmlFor="cross-branch">Show both branches</Label>
          {showCrossBranch && (
            <Badge variant="outline" className="ml-2">
              Viewing: All Branches
            </Badge>
          )}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-8 gap-2">
          {/* Header Row */}
          <div className="font-medium text-sm text-gray-600 p-2">Equipment Category</div>
          {weekDays.map(day => (
            <div key={day.toISOString()} className="font-medium text-sm text-gray-600 p-2 text-center">
              <div>{format(day, 'EEE')}</div>
              <div className="text-lg">{format(day, 'd')}</div>
            </div>
          ))}

          {/* Equipment Category Rows */}
          {categoriesToShow.map(category => (
            <div key={category.id} className="contents">
              <div className="p-3 border-r font-medium text-sm bg-gray-50 flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                <span className="truncate">{category.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => {
                    const request: AvailabilityCheck = {
                      category: category.id,
                      branch: branch as BranchId,
                      startDate: weekDays[0],
                      endDate: weekDays[6],
                      requestedQuantity: 1
                    };
                    const result = checkAvailability(request);
                    console.log('Availability check:', result);
                  }}
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
              </div>
              {weekDays.map(day => {
                const dayBookings = filteredBookings.filter(booking => {
                  const dayStart = new Date(day);
                  const dayEnd = new Date(day);
                  dayEnd.setHours(23, 59, 59);
                  return booking.equipmentCategory === category.id &&
                         booking.startDate <= dayEnd && 
                         booking.endDate >= dayStart;
                });

                return (
                  <div key={`${category.id}-${day.toISOString()}`} className="p-1 border border-gray-200 min-h-16">
                    {dayBookings.map(booking => (
                      <div
                        key={booking.id}
                        className={`text-xs p-1 rounded border cursor-pointer mb-1 ${getStatusColor(booking.status)}`}
                        title={`${booking.customer} - ${booking.equipmentName} (${booking.assignedItemId})`}
                        onClick={() => setSelectedInventoryItem(booking.assignedItemId)}
                      >
                        <div className="font-medium truncate flex items-center gap-1">
                          {booking.assignedItemId}
                          {booking.crossBranchBooking && (
                            <MapPin className="h-3 w-3" />
                          )}
                        </div>
                        <div className="truncate">{booking.customer}</div>
                        {showCrossBranch && (
                          <Badge variant="outline" className="text-xs">
                            {BRANCHES.find(b => b.id === booking.branch)?.name.split(' ')[0]}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Enhanced month view
  const renderMonthView = () => {
    const selectedDateBookings = filteredBookings.filter(booking => {
      if (!selectedDate) return false;
      const dayStart = new Date(selectedDate);
      const dayEnd = new Date(selectedDate);
      dayEnd.setHours(23, 59, 59);
      return booking.startDate <= dayEnd && booking.endDate >= dayStart;
    });

    return (
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </div>
        <div>
          <h3 className="font-semibold mb-4">
            Bookings for {selectedDate ? format(selectedDate, "MMMM dd, yyyy") : "Select a date"}
          </h3>
          <div className="space-y-3">
            {selectedDateBookings.map(booking => {
              const category = EQUIPMENT_CATEGORIES.find(cat => cat.id === booking.equipmentCategory);
              const item = inventoryItems.find(item => item.id === booking.assignedItemId);
              return (
                <div key={booking.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${category?.color || 'bg-gray-500'}`}></div>
                      <span className="font-medium">{booking.assignedItemId}</span>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                      {booking.crossBranchBooking && (
                        <Badge variant="outline">
                          <MapPin className="h-3 w-3 mr-1" />
                          Cross-branch
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateICalFeed(booking.assignedItemId)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyICalLink(booking.assignedItemId)}
                      >
                        <Link className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      <span>{booking.equipmentName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{booking.customer}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{format(booking.startDate, 'MMM dd')} - {format(booking.endDate, 'MMM dd')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{BRANCHES.find(b => b.id === booking.branch)?.name}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Category: {category?.name}
                    </div>
                    {item && (
                      <div className="text-xs text-gray-500">
                        Serial: {item.serialNumber} | Condition: {item.condition}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {selectedDateBookings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No bookings for this date
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const currentBranch = BRANCHES.find(b => b.id === branch);

  return (
    <div className="space-y-6">
      {/* Header with Enhanced Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Equipment Booking Calendar</h2>
          <p className="text-gray-600">
            Manage bookings across {showCrossBranch ? 'all branches' : currentBranch?.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories ({EQUIPMENT_CATEGORIES.length})</SelectItem>
              {EQUIPMENT_CATEGORIES.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={viewType === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('week')}
          >
            Week
          </Button>
          <Button
            variant={viewType === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('month')}
          >
            Month
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {viewType === 'week' ? 'Weekly Calendar View' : 'Monthly Calendar View'}
            {equipmentFilter !== 'all' && (
              <span className="text-base font-normal text-gray-600">
                - {EQUIPMENT_CATEGORIES.find(c => c.id === equipmentFilter)?.name}
              </span>
            )}
          </CardTitle>
          <CardDescription>
            {viewType === 'week' 
              ? 'Equipment availability and bookings by week and category. Supports cross-branch viewing and conflict detection.'
              : 'Select a date to view daily bookings by category with iCal export options.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {viewType === 'week' ? renderWeekView() : renderMonthView()}
        </CardContent>
      </Card>

      {/* Enhanced Status Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Calendar Legend & Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Booking Status Colors</h4>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                  <span className="text-sm">Confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                  <span className="text-sm">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                  <span className="text-sm">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                  <span className="text-sm">Overdue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                  <span className="text-sm">Returned</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                  <span className="text-sm">Cancelled</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Equipment Categories (13 Total)</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {EQUIPMENT_CATEGORIES.map(category => (
                  <div key={category.id} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                    <span className="text-xs">{category.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Features</h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Cross-branch availability checking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>Individual item iCal export</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  <span>Shareable calendar links</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Cross-branch booking indicators</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Conflict detection & prevention</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>Per-item calendar management</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Item Detail Modal */}
      {selectedInventoryItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96 max-h-96 overflow-y-auto">
            <CardHeader>
              <CardTitle>Equipment Details</CardTitle>
              <CardDescription>
                {selectedInventoryItem} - Calendar & iCal Options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(() => {
                  const item = inventoryItems.find(i => i.id === selectedInventoryItem);
                  if (!item) return null;
                  
                  return (
                    <>
                      <div className="space-y-2">
                        <p><strong>Name:</strong> {item.name}</p>
                        <p><strong>Category:</strong> {EQUIPMENT_CATEGORIES.find(c => c.id === item.category)?.name}</p>
                        <p><strong>Branch:</strong> {BRANCHES.find(b => b.id === item.branch)?.name}</p>
                        <p><strong>Status:</strong> <Badge className={getStatusColor(item.status)}>{item.status}</Badge></p>
                        <p><strong>Serial:</strong> {item.serialNumber}</p>
                        <p><strong>Condition:</strong> {item.condition}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleGenerateICalFeed(selectedInventoryItem)}
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download iCal
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => copyICalLink(selectedInventoryItem)}
                          className="flex-1"
                        >
                          <Link className="h-4 w-4 mr-2" />
                          Copy Link
                        </Button>
                      </div>
                    </>
                  );
                })()}
                <Button 
                  onClick={() => setSelectedInventoryItem(null)}
                  variant="outline"
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
