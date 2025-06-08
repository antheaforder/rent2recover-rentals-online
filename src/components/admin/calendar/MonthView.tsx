
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  User, 
  Clock, 
  MapPin, 
  Eye, 
  Edit 
} from "lucide-react";
import { format } from "date-fns";
import { 
  EQUIPMENT_CATEGORIES, 
  BRANCHES, 
  type BookingBlock, 
  type InventoryItem
} from "@/config/equipmentCategories";

interface MonthViewProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  filteredBookings: BookingBlock[];
  inventoryItems: InventoryItem[];
  onBookingView: (booking: BookingBlock) => void;
  onBookingEdit: (booking: BookingBlock) => void;
  onDayClick: (date: Date) => void;
}

const MonthView = ({
  selectedDate,
  setSelectedDate,
  filteredBookings,
  inventoryItems,
  onBookingView,
  onBookingEdit,
  onDayClick,
}: MonthViewProps) => {
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
          onSelect={(date) => {
            if (date) {
              setSelectedDate(date);
              onDayClick(date);
            }
          }}
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
                      onClick={() => onBookingView(booking)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onBookingEdit(booking)}
                    >
                      <Edit className="h-3 w-3" />
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

export default MonthView;
