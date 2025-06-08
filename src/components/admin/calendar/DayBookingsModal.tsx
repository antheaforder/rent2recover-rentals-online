
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Eye, Edit } from "lucide-react";
import { format } from "date-fns";
import { 
  EQUIPMENT_CATEGORIES, 
  BRANCHES, 
  type BookingBlock 
} from "@/config/equipmentCategories";

interface DayBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  bookings: BookingBlock[];
  branchFilter: string;
  setBranchFilter: (value: string) => void;
  equipmentFilter: string;
  setEquipmentFilter: (value: string) => void;
  onBookingView: (booking: BookingBlock) => void;
  onBookingEdit: (booking: BookingBlock) => void;
}

const DayBookingsModal = ({
  isOpen,
  onClose,
  date,
  bookings,
  branchFilter,
  setBranchFilter,
  equipmentFilter,
  setEquipmentFilter,
  onBookingView,
  onBookingEdit,
}: DayBookingsModalProps) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Bookings for {date && format(date, "MMMM dd, yyyy")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-2 gap-4">
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {BRANCHES.map(branch => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
              <SelectTrigger>
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
          </div>

          {/* Bookings List */}
          <div className="space-y-3">
            {bookings.map(booking => {
              const category = EQUIPMENT_CATEGORIES.find(cat => cat.id === booking.equipmentCategory);
              return (
                <div key={booking.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${category?.color || 'bg-gray-500'}`}></div>
                      <div>
                        <span className="font-medium">Booking #{booking.id}</span>
                        <span className="mx-2">•</span>
                        <span className="text-gray-600">{category?.name}</span>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onBookingView(booking)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onBookingEdit(booking)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>Client:</strong> {booking.customer}
                    </div>
                    <div>
                      <strong>Branch:</strong> {BRANCHES.find(b => b.id === booking.branch)?.name}
                    </div>
                    <div>
                      <strong>Equipment:</strong> {booking.equipmentName}
                    </div>
                    <div>
                      <strong>Duration:</strong> {format(booking.startDate, 'MMM dd')} - {format(booking.endDate, 'MMM dd')}
                    </div>
                  </div>
                  {booking.notes && (
                    <div className="mt-2 text-sm text-gray-600">
                      <strong>Notes:</strong> {booking.notes}
                    </div>
                  )}
                </div>
              );
            })}
            
            {bookings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No bookings for this date
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DayBookingsModal;
