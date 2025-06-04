
import { useState, useMemo } from "react";
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
  type AvailabilityCheck,
  type AvailabilityResult
} from "@/config/equipmentCategories";

interface BookingCalendarProps {
  branch: string;
}

const BookingCalendar = ({ branch }: BookingCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewType, setViewType] = useState<'week' | 'month'>('week');
  const [equipmentFilter, setEquipmentFilter] = useState('all');
  const [showCrossBranch, setShowCrossBranch] = useState(true);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<string | null>(null);

  // Enhanced mock data for all 13 categories across both branches
  const inventoryItems: InventoryItem[] = [
    // Electric Hospital Beds
    { id: "EHB001", name: "Electric Hospital Bed Model A", category: "electric-hospital-beds", status: "available", branch: "hilton", serialNumber: "EHB-2024-001", lastChecked: "2024-01-15", condition: "excellent" },
    { id: "EHB002", name: "Electric Hospital Bed Model B", category: "electric-hospital-beds", status: "booked", branch: "hilton", serialNumber: "EHB-2024-002", lastChecked: "2024-01-10", condition: "good" },
    { id: "EHB003", name: "Electric Hospital Bed Model A", category: "electric-hospital-beds", status: "available", branch: "johannesburg", serialNumber: "EHB-2024-003", lastChecked: "2024-01-12", condition: "excellent" },
    
    // Electric Wheelchairs
    { id: "EWC001", name: "Power Wheelchair Standard", category: "electric-wheelchairs", status: "available", branch: "hilton", serialNumber: "EWC-2024-001", lastChecked: "2024-01-14", condition: "good" },
    { id: "EWC002", name: "Power Wheelchair Heavy Duty", category: "electric-wheelchairs", status: "maintenance", branch: "johannesburg", serialNumber: "EWC-2024-002", lastChecked: "2024-01-08", condition: "needs-repair" },
    
    // Manual Wheelchairs
    { id: "WC001", name: "Standard Manual Wheelchair", category: "wheelchairs", status: "available", branch: "hilton", serialNumber: "WC-2024-001", lastChecked: "2024-01-15", condition: "excellent" },
    { id: "WC002", name: "Lightweight Wheelchair", category: "wheelchairs", status: "booked", branch: "johannesburg", serialNumber: "WC-2024-002", lastChecked: "2024-01-10", condition: "good" },
    
    // Mobility Scooters
    { id: "MS001", name: "4-Wheel Mobility Scooter", category: "mobility-scooters", status: "available", branch: "hilton", serialNumber: "MS-2024-001", lastChecked: "2024-01-13", condition: "excellent" },
    { id: "MS002", name: "3-Wheel Mobility Scooter", category: "mobility-scooters", status: "booked", branch: "johannesburg", serialNumber: "MS-2024-002", lastChecked: "2024-01-11", condition: "good" },
    
    // Add more items for other categories...
    { id: "COM001", name: "Standard Commode", category: "commodes", status: "available", branch: "hilton", serialNumber: "COM-2024-001", lastChecked: "2024-01-14", condition: "good" },
    { id: "EBL001", name: "Electric Bath Lift Deluxe", category: "electric-bath-lifts", status: "available", branch: "johannesburg", serialNumber: "EBL-2024-001", lastChecked: "2024-01-12", condition: "excellent" },
    { id: "SBC001", name: "Swivel Bath Chair", category: "swivel-bath-chairs", status: "booked", branch: "hilton", serialNumber: "SBC-2024-001", lastChecked: "2024-01-09", condition: "good" },
    { id: "KS001", name: "Knee Scooter Standard", category: "knee-scooters", status: "available", branch: "johannesburg", serialNumber: "KS-2024-001", lastChecked: "2024-01-15", condition: "excellent" },
    { id: "ROL001", name: "4-Wheel Rollator", category: "rollators", status: "available", branch: "hilton", serialNumber: "ROL-2024-001", lastChecked: "2024-01-13", condition: "good" },
    { id: "WF001", name: "Walker Frame Standard", category: "walker-frames", status: "booked", branch: "johannesburg", serialNumber: "WF-2024-001", lastChecked: "2024-01-10", condition: "excellent" },
    { id: "WR001", name: "Portable Wheelchair Ramp", category: "wheelchair-ramps", status: "available", branch: "hilton", serialNumber: "WR-2024-001", lastChecked: "2024-01-14", condition: "good" },
    { id: "HOI001", name: "Patient Hoist Electric", category: "hoists", status: "maintenance", branch: "johannesburg", serialNumber: "HOI-2024-001", lastChecked: "2024-01-07", condition: "needs-repair" },
    { id: "OXY001", name: "Oxygen Concentrator 5L", category: "oxygen-concentrators", status: "available", branch: "hilton", serialNumber: "OXY-2024-001", lastChecked: "2024-01-15", condition: "excellent" }
  ];

  const bookings: BookingBlock[] = [
    {
      id: "B001",
      equipmentId: "EHB002",
      equipmentName: "Electric Hospital Bed Model B",
      equipmentCategory: "electric-hospital-beds",
      customer: "John Smith",
      startDate: new Date(2024, 0, 15),
      endDate: new Date(2024, 0, 22),
      status: 'delivered',
      branch: 'hilton',
      assignedItemId: "EHB002",
      deliveryRequired: true,
      crossBranchBooking: false
    },
    {
      id: "B002", 
      equipmentId: "MS002",
      equipmentName: "3-Wheel Mobility Scooter",
      equipmentCategory: "mobility-scooters",
      customer: "Sarah Johnson",
      startDate: new Date(2024, 0, 18),
      endDate: new Date(2024, 0, 25),
      status: 'confirmed',
      branch: 'johannesburg',
      assignedItemId: "MS002",
      deliveryRequired: false,
      crossBranchBooking: false
    },
    {
      id: "B003",
      equipmentId: "WC002",
      equipmentName: "Lightweight Wheelchair",
      equipmentCategory: "wheelchairs",
      customer: "Mike Wilson",
      startDate: new Date(2024, 0, 20),
      endDate: new Date(2024, 0, 27),
      status: 'pending',
      branch: 'johannesburg',
      assignedItemId: "WC002",
      deliveryRequired: true,
      crossBranchBooking: false
    },
    {
      id: "B004",
      equipmentId: "SBC001",
      equipmentName: "Swivel Bath Chair",
      equipmentCategory: "swivel-bath-chairs",
      customer: "Mary Brown",
      startDate: new Date(2024, 0, 16),
      endDate: new Date(2024, 0, 23),
      status: 'delivered',
      branch: 'hilton',
      assignedItemId: "SBC001",
      deliveryRequired: false,
      crossBranchBooking: false
    },
    {
      id: "B005",
      equipmentId: "WF001",
      equipmentName: "Walker Frame Standard",
      equipmentCategory: "walker-frames",
      customer: "David Chen",
      startDate: new Date(2024, 0, 19),
      endDate: new Date(2024, 0, 26),
      status: 'confirmed',
      branch: 'johannesburg',
      assignedItemId: "WF001",
      deliveryRequired: true,
      crossBranchBooking: false
    }
  ];

  // Cross-branch availability checking logic
  const checkAvailability = (request: AvailabilityCheck): AvailabilityResult => {
    const { category, branch: requestedBranch, startDate, endDate, requestedQuantity } = request;
    
    // Get all items in the category for the requested branch
    const branchItems = inventoryItems.filter(item => 
      item.category === category && 
      item.branch === requestedBranch && 
      item.status === 'available'
    );

    // Check for conflicts with existing bookings
    const availableItems = branchItems.filter(item => {
      const conflicts = bookings.filter(booking => 
        booking.assignedItemId === item.id &&
        (booking.status === 'confirmed' || booking.status === 'delivered') &&
        isWithinInterval(startDate, { start: booking.startDate, end: booking.endDate }) ||
        isWithinInterval(endDate, { start: booking.startDate, end: booking.endDate }) ||
        isWithinInterval(booking.startDate, { start: startDate, end: endDate })
      );
      return conflicts.length === 0;
    });

    if (availableItems.length >= requestedQuantity) {
      return {
        available: true,
        availableItems: availableItems.slice(0, requestedQuantity),
        message: `${availableItems.length} items available at ${BRANCHES.find(b => b.id === requestedBranch)?.name}`
      };
    }

    // Check alternative branch
    const alternateBranch = requestedBranch === 'hilton' ? 'johannesburg' : 'hilton';
    const altBranchItems = inventoryItems.filter(item => 
      item.category === category && 
      item.branch === alternateBranch && 
      item.status === 'available'
    );

    const altAvailableItems = altBranchItems.filter(item => {
      const conflicts = bookings.filter(booking => 
        booking.assignedItemId === item.id &&
        (booking.status === 'confirmed' || booking.status === 'delivered') &&
        isWithinInterval(startDate, { start: booking.startDate, end: booking.endDate }) ||
        isWithinInterval(endDate, { start: booking.startDate, end: booking.endDate }) ||
        isWithinInterval(booking.startDate, { start: startDate, end: endDate })
      );
      return conflicts.length === 0;
    });

    if (altAvailableItems.length >= requestedQuantity) {
      return {
        available: true,
        availableItems: [],
        alternativeBranch: {
          branch: alternateBranch,
          availableItems: altAvailableItems.slice(0, requestedQuantity),
          deliveryFee: 150 // R150 delivery fee
        },
        message: `Available from ${BRANCHES.find(b => b.id === alternateBranch)?.name} - delivery fee will apply`
      };
    }

    return {
      available: false,
      availableItems: [],
      message: "Currently Unavailable at both branches"
    };
  };

  // Filter bookings based on current selections
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesBranch = showCrossBranch || booking.branch === branch;
      const matchesCategory = equipmentFilter === 'all' || booking.equipmentCategory === equipmentFilter;
      return matchesBranch && matchesCategory;
    });
  }, [bookings, showCrossBranch, branch, equipmentFilter]);

  // Generate iCal feed for a specific inventory item
  const generateICalFeed = (inventoryItemId: string) => {
    const itemBookings = bookings.filter(booking => booking.assignedItemId === inventoryItemId);
    const item = inventoryItems.find(item => item.id === inventoryItemId);
    
    if (!item) return;

    let icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Rent2Recover//Equipment Calendar//EN',
      `X-WR-CALNAME:${item.name} (${item.id}) - ${BRANCHES.find(b => b.id === item.branch)?.name}`,
      'X-WR-CALDESC:Booking calendar for medical equipment rental'
    ];

    itemBookings.forEach(booking => {
      const startDate = format(booking.startDate, 'yyyyMMdd');
      const endDate = format(addDays(booking.endDate, 1), 'yyyyMMdd'); // Add 1 day for end date
      
      icalContent.push(
        'BEGIN:VEVENT',
        `UID:${booking.id}@rent2recover.com`,
        `DTSTART:${startDate}`,
        `DTEND:${endDate}`,
        `SUMMARY:Rental - ${booking.customer}`,
        `DESCRIPTION:Equipment: ${booking.equipmentName}\\nCustomer: ${booking.customer}\\nBranch: ${BRANCHES.find(b => b.id === booking.branch)?.name}\\nStatus: ${booking.status}`,
        `LOCATION:${BRANCHES.find(b => b.id === booking.branch)?.location}`,
        'END:VEVENT'
      );
    });

    icalContent.push('END:VCALENDAR');
    
    const blob = new Blob([icalContent.join('\r\n')], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.id}-calendar.ics`;
    link.click();
    URL.revokeObjectURL(url);
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
      case 'delivered': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'overdue': return 'bg-red-100 border-red-300 text-red-800';
      case 'maintenance': return 'bg-gray-100 border-gray-300 text-gray-800';
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
            <Button variant="outline" size="sm" onClick={() => generateICalFeed('all')}>
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
                        onClick={() => generateICalFeed(booking.assignedItemId)}
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
                  <span className="text-sm">Delivered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                  <span className="text-sm">Overdue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                  <span className="text-sm">Maintenance</span>
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
                          onClick={() => generateICalFeed(selectedInventoryItem)}
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
