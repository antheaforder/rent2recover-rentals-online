
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Package, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  DollarSign,
  Clock,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { 
  BookingBlock, 
  EQUIPMENT_CATEGORIES, 
  BRANCHES 
} from "@/config/equipmentCategories";

interface BookingDetailModalProps {
  booking: BookingBlock;
  onClose: () => void;
  onStatusChange: (bookingId: string, status: BookingBlock['status']) => void;
}

const BookingDetailModal = ({ booking, onClose, onStatusChange }: BookingDetailModalProps) => {
  const category = EQUIPMENT_CATEGORIES.find(cat => cat.id === booking.equipmentCategory);
  const branch = BRANCHES.find(b => b.id === booking.branch);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Booking Details - #{booking.id}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status and Actions */}
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(booking.status)}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
            <div className="flex items-center gap-2">
              <Select 
                value={booking.status} 
                onValueChange={(status) => onStatusChange(booking.id, status as BookingBlock['status'])}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="active">Out for Delivery</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="font-medium">{booking.customer}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {booking.customerEmail}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {booking.customerPhone}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created By</label>
                  <p className="capitalize">{booking.createdBy}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Equipment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Equipment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Category</label>
                  <p className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${category?.color || 'bg-gray-500'}`}></div>
                    {category?.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Equipment Name</label>
                  <p className="font-medium">{booking.equipmentName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Assigned Item ID</label>
                  <p className="font-mono text-sm">{booking.assignedItemId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Branch</label>
                  <p className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {branch?.name}
                  </p>
                </div>
              </div>
              {booking.crossBranchBooking && (
                <div className="p-2 bg-blue-50 rounded border border-blue-200">
                  <p className="text-sm text-blue-800 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Cross-branch booking with delivery surcharge
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Start Date</label>
                  <p className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(booking.startDate, 'MMMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">End Date</label>
                  <p className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(booking.endDate, 'MMMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Duration</label>
                  <p>{Math.ceil((booking.endDate.getTime() - booking.startDate.getTime()) / (1000 * 60 * 60 * 24))} days</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Delivery Required</label>
                  <p>{booking.deliveryRequired ? 'Yes' : 'No'}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <p>{format(booking.createdAt, 'MMMM dd, yyyy HH:mm')}</p>
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Financial Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Cost</label>
                  <p className="text-lg font-semibold text-green-600">R{booking.totalCost}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Deposit</label>
                  <p className="text-lg font-semibold">R{booking.deposit}</p>
                </div>
                {booking.deliveryFee && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Delivery Fee</label>
                    <p>R{booking.deliveryFee}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {booking.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{booking.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailModal;
