
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Package,
  User,
  Clock,
  Download
} from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { EQUIPMENT_CATEGORIES, BRANCHES } from "@/config/equipmentCategories";

interface BookingCalendarProps {
  branch: string;
}

interface BookingBlock {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentCategory: string;
  customer: string;
  startDate: Date;
  endDate: Date;
  status: 'confirmed' | 'pending' | 'delivered' | 'overdue';
  branch: string;
}

const BookingCalendar = ({ branch }: BookingCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewType, setViewType] = useState<'week' | 'month'>('week');
  const [equipmentFilter, setEquipmentFilter] = useState('all');

  // Enhanced mock booking data for all categories
  const bookings: BookingBlock[] = [
    {
      id: "B001",
      equipmentId: "WC001",
      equipmentName: "Standard Manual Wheelchair",
      equipmentCategory: "wheelchairs",
      customer: "John Smith",
      startDate: new Date(2024, 0, 15),
      endDate: new Date(2024, 0, 22),
      status: 'delivered',
      branch: 'hilton'
    },
    {
      id: "B002", 
      equipmentId: "MS001",
      equipmentName: "4-Wheel Mobility Scooter",
      equipmentCategory: "mobility-scooters",
      customer: "Sarah Johnson",
      startDate: new Date(2024, 0, 18),
      endDate: new Date(2024, 0, 25),
      status: 'confirmed',
      branch: 'hilton'
    },
    {
      id: "B003",
      equipmentId: "HB001", 
      equipmentName: "Electric Hospital Bed",
      equipmentCategory: "hospital-beds",
      customer: "Mike Wilson",
      startDate: new Date(2024, 0, 20),
      endDate: new Date(2024, 0, 27),
      status: 'pending',
      branch: 'hilton'
    },
    {
      id: "B004",
      equipmentId: "WA001", 
      equipmentName: "Walking Frame with Wheels",
      equipmentCategory: "walking-aids",
      customer: "Mary Brown",
      startDate: new Date(2024, 0, 16),
      endDate: new Date(2024, 0, 23),
      status: 'delivered',
      branch: 'johannesburg'
    },
    {
      id: "B005",
      equipmentId: "BA001", 
      equipmentName: "Shower Chair",
      equipmentCategory: "bathroom-aids",
      customer: "David Chen",
      startDate: new Date(2024, 0, 19),
      endDate: new Date(2024, 0, 26),
      status: 'confirmed',
      branch: 'johannesburg'
    }
  ];

  const filteredBookings = bookings.filter(booking => {
    const matchesBranch = booking.branch === branch;
    const matchesCategory = equipmentFilter === 'all' || booking.equipmentCategory === equipmentFilter;
    return matchesBranch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'pending': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'delivered': return 'bg-green-100 border-green-300 text-green-800';
      case 'overdue': return 'bg-red-100 border-red-300 text-red-800';
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

  const generateICalFeed = () => {
    // This would generate an iCal feed for the filtered bookings
    console.log('Generating iCal feed for:', equipmentFilter);
  };

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
            <Button variant="outline" size="sm" onClick={generateICalFeed}>
              <Download className="h-4 w-4 mr-2" />
              Export iCal
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
              Today
            </Button>
          </div>
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
                        title={`${booking.customer} - ${booking.equipmentName} (${booking.equipmentId})`}
                      >
                        <div className="font-medium truncate">{booking.equipmentId}</div>
                        <div className="truncate">{booking.customer}</div>
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
              return (
                <div key={booking.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${category?.color || 'bg-gray-500'}`}></div>
                      <span className="font-medium">{booking.equipmentId}</span>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
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
                    <div className="text-xs text-gray-500">
                      Category: {category?.name}
                    </div>
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
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Booking Calendar</h2>
          <p className="text-gray-600">View equipment bookings for {currentBranch?.name}</p>
        </div>
        <div className="flex gap-2">
          <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
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
            {viewType === 'week' ? 'Weekly View' : 'Monthly View'}
            {equipmentFilter !== 'all' && (
              <span className="text-base font-normal text-gray-600">
                - {EQUIPMENT_CATEGORIES.find(c => c.id === equipmentFilter)?.name}
              </span>
            )}
          </CardTitle>
          <CardDescription>
            {viewType === 'week' 
              ? 'Equipment availability and bookings by week and category'
              : 'Select a date to view daily bookings by category'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {viewType === 'week' ? renderWeekView() : renderMonthView()}
        </CardContent>
      </Card>

      {/* Status Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Booking Status</h4>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                  <span className="text-sm">Confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                  <span className="text-sm">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                  <span className="text-sm">Delivered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                  <span className="text-sm">Overdue</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Equipment Categories</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {EQUIPMENT_CATEGORIES.map(category => (
                  <div key={category.id} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                    <span className="text-xs">{category.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingCalendar;
