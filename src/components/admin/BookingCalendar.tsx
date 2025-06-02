
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
  Clock
} from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";

interface BookingCalendarProps {
  branch: string;
}

interface BookingBlock {
  id: string;
  equipmentId: string;
  equipmentName: string;
  customer: string;
  startDate: Date;
  endDate: Date;
  status: 'confirmed' | 'pending' | 'delivered' | 'overdue';
}

const BookingCalendar = ({ branch }: BookingCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewType, setViewType] = useState<'week' | 'month'>('week');
  const [equipmentFilter, setEquipmentFilter] = useState('all');

  // Mock booking data
  const bookings: BookingBlock[] = [
    {
      id: "B001",
      equipmentId: "WC001",
      equipmentName: "Standard Wheelchair",
      customer: "John Smith",
      startDate: new Date(2024, 0, 15),
      endDate: new Date(2024, 0, 22),
      status: 'delivered'
    },
    {
      id: "B002", 
      equipmentId: "MS001",
      equipmentName: "Mobility Scooter",
      customer: "Sarah Johnson",
      startDate: new Date(2024, 0, 18),
      endDate: new Date(2024, 0, 25),
      status: 'confirmed'
    },
    {
      id: "B003",
      equipmentId: "HB001", 
      equipmentName: "Hospital Bed",
      customer: "Mike Wilson",
      startDate: new Date(2024, 0, 20),
      endDate: new Date(2024, 0, 27),
      status: 'pending'
    }
  ];

  const equipmentTypes = [
    'wheelchairs', 'scooters', 'beds', 'walkers', 'crutches'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 border-blue-300';
      case 'pending': return 'bg-yellow-100 border-yellow-300';
      case 'delivered': return 'bg-green-100 border-green-300';
      case 'overdue': return 'bg-red-100 border-red-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getWeekDays = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays(selectedDate);
    
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
          <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
            Today
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-8 gap-2">
          {/* Header Row */}
          <div className="font-medium text-sm text-gray-600 p-2">Equipment</div>
          {weekDays.map(day => (
            <div key={day.toISOString()} className="font-medium text-sm text-gray-600 p-2 text-center">
              <div>{format(day, 'EEE')}</div>
              <div className="text-lg">{format(day, 'd')}</div>
            </div>
          ))}

          {/* Equipment Rows */}
          {equipmentTypes.map(type => (
            <div key={type} className="contents">
              <div className="p-3 border-r font-medium text-sm bg-gray-50">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </div>
              {weekDays.map(day => (
                <div key={`${type}-${day.toISOString()}`} className="p-1 border border-gray-200 min-h-16">
                  {bookings
                    .filter(booking => {
                      const dayStart = new Date(day);
                      const dayEnd = new Date(day);
                      dayEnd.setHours(23, 59, 59);
                      return booking.startDate <= dayEnd && booking.endDate >= dayStart;
                    })
                    .map(booking => (
                      <div
                        key={booking.id}
                        className={`text-xs p-1 rounded border cursor-pointer ${getStatusColor(booking.status)}`}
                        title={`${booking.customer} - ${booking.equipmentName}`}
                      >
                        <div className="font-medium truncate">{booking.equipmentId}</div>
                        <div className="truncate">{booking.customer}</div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
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
            {bookings
              .filter(booking => {
                if (!selectedDate) return false;
                const dayStart = new Date(selectedDate);
                const dayEnd = new Date(selectedDate);
                dayEnd.setHours(23, 59, 59);
                return booking.startDate <= dayEnd && booking.endDate >= dayStart;
              })
              .map(booking => (
                <div key={booking.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{booking.equipmentId}</span>
                    </div>
                    <Badge className={getStatusColor(booking.status).replace('bg-', 'bg-').replace('border-', 'text-')}>
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {booking.customer}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {format(booking.startDate, 'MMM dd')} - {format(booking.endDate, 'MMM dd')}
                    </div>
                  </div>
                </div>
              ))}
            
            {bookings.filter(booking => {
              if (!selectedDate) return false;
              const dayStart = new Date(selectedDate);
              const dayEnd = new Date(selectedDate);
              dayEnd.setHours(23, 59, 59);
              return booking.startDate <= dayEnd && booking.endDate >= dayStart;
            }).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No bookings for this date
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Booking Calendar</h2>
          <p className="text-gray-600">View equipment bookings for {branch === 'hilton' ? 'Hilton' : 'Johannesburg'} branch</p>
        </div>
        <div className="flex gap-2">
          <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Equipment</SelectItem>
              {equipmentTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
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
          </CardTitle>
          <CardDescription>
            {viewType === 'week' 
              ? 'Equipment availability and bookings by week'
              : 'Select a date to view daily bookings'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {viewType === 'week' ? renderWeekView() : renderMonthView()}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Status Legend</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingCalendar;
