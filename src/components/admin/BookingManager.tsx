
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit,
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Package,
  CreditCard,
  Calendar,
  User
} from "lucide-react";
import { format } from "date-fns";
import { BookingBlock, EQUIPMENT_CATEGORIES, BRANCHES } from "@/config/equipmentCategories";
import { getBookings, updateBookingStatus } from "@/services/bookingService";
import BookingDetailModal from "./BookingDetailModal";
import EditBookingModal from "./EditBookingModal";

interface BookingManagerProps {
  branch: string;
}

const BookingManager = ({ branch }: BookingManagerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [equipmentFilter, setEquipmentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<BookingBlock | null>(null);
  const [editingBooking, setEditingBooking] = useState<BookingBlock | null>(null);
  const [bookings, setBookings] = useState<BookingBlock[]>([]);

  // Load bookings on component mount
  useEffect(() => {
    setBookings(getBookings());
  }, []);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.equipmentName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    const matchesEquipment = equipmentFilter === "all" || booking.equipmentCategory === equipmentFilter;
    const matchesBranch = booking.branch === branch;
    
    return matchesSearch && matchesStatus && matchesEquipment && matchesBranch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'returned': return 'bg-gray-100 text-gray-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'confirmed': return CreditCard;
      case 'active': return CheckCircle;
      case 'returned': return Package;
      case 'overdue': return AlertTriangle;
      case 'cancelled': return AlertTriangle;
      default: return Clock;
    }
  };

  const handleStatusChange = (bookingId: string, newStatus: BookingBlock['status']) => {
    updateBookingStatus(bookingId, newStatus);
    setBookings(getBookings()); // Refresh data
  };

  const handleBookingUpdate = (updatedBooking: BookingBlock) => {
    // In a real app, this would make an API call
    setBookings(getBookings()); // Refresh data
    setEditingBooking(null);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Booking ID', 'Customer', 'Equipment', 'Start Date', 'End Date', 'Status', 'Total Cost'].join(','),
      ...filteredBookings.map(booking => [
        booking.id,
        booking.customer,
        booking.equipmentName,
        format(booking.startDate, 'yyyy-MM-dd'),
        format(booking.endDate, 'yyyy-MM-dd'),
        booking.status,
        `R${booking.totalCost}`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `bookings-${branch}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getActionButton = (booking: BookingBlock) => {
    switch (booking.status) {
      case 'pending':
        return (
          <Button 
            size="sm" 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => handleStatusChange(booking.id, 'confirmed')}
          >
            Approve
          </Button>
        );
      case 'confirmed':
        return (
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => handleStatusChange(booking.id, 'active')}
          >
            Dispatch
          </Button>
        );
      case 'active':
        return (
          <Button 
            size="sm" 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => handleStatusChange(booking.id, 'returned')}
          >
            Complete
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Booking Management</h2>
          <p className="text-gray-600">Manage all bookings for {branch === 'hilton' ? 'Hilton' : 'Johannesburg'} branch</p>
        </div>
        <Button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by equipment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Equipment</SelectItem>
                {EQUIPMENT_CATEGORIES.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bookings ({filteredBookings.length})</CardTitle>
          <CardDescription>
            Showing {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} 
            {statusFilter !== 'all' && ` with status: ${statusFilter}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => {
                  const StatusIcon = getStatusIcon(booking.status);
                  const category = EQUIPMENT_CATEGORIES.find(cat => cat.id === booking.equipmentCategory);
                  return (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{booking.id}</div>
                          <div className="text-xs text-gray-500">
                            Created: {format(booking.createdAt, 'MMM dd')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.customer}</div>
                          <div className="text-sm text-gray-500">{booking.customerPhone}</div>
                          <div className="text-xs text-gray-500">{booking.customerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.equipmentName}</div>
                          <div className="text-sm text-gray-500">ID: {booking.assignedItemId}</div>
                          <div className="text-xs text-gray-500">{category?.name}</div>
                          {booking.deliveryRequired && (
                            <Badge variant="outline" className="text-xs mt-1">Delivery</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{format(booking.startDate, 'MMM dd, yyyy')}</div>
                          <div>to {format(booking.endDate, 'MMM dd, yyyy')}</div>
                          <div className="text-xs text-gray-500">
                            ({Math.ceil((booking.endDate.getTime() - booking.startDate.getTime()) / (1000 * 60 * 60 * 24))} days)
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(booking.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">R{booking.totalCost}</div>
                          <div className="text-sm text-gray-500">Deposit: R{booking.deposit}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setEditingBooking(booking)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {getActionButton(booking)}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Edit Booking Modal */}
      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSave={handleBookingUpdate}
        />
      )}
    </div>
  );
};

export default BookingManager;
