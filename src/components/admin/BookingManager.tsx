
import { useState } from "react";
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
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Package,
  CreditCard,
  Calendar,
  User
} from "lucide-react";

interface BookingManagerProps {
  branch: string;
}

interface Booking {
  id: string;
  quoteId: string;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  equipment: {
    id: string;
    name: string;
    category: string;
  };
  dates: {
    start: string;
    end: string;
    duration: number;
  };
  status: 'pending' | 'paid' | 'active' | 'returned' | 'overdue' | 'cancelled';
  branch: string;
  totalCost: number;
  deposit: number;
  createdAt: string;
  requiresDelivery: boolean;
}

const BookingManager = ({ branch }: BookingManagerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [equipmentFilter, setEquipmentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Mock booking data
  const bookings: Booking[] = [
    {
      id: "B001",
      quoteId: "Q001",
      customer: {
        name: "John Smith",
        phone: "+27 81 234 5678",
        email: "john@example.com"
      },
      equipment: {
        id: "WC001",
        name: "Standard Wheelchair",
        category: "wheelchairs"
      },
      dates: {
        start: "2024-01-15",
        end: "2024-01-22",
        duration: 7
      },
      status: "active",
      branch: "hilton",
      totalCost: 450,
      deposit: 135,
      createdAt: "2024-01-10",
      requiresDelivery: true
    },
    {
      id: "B002",
      quoteId: "Q002", 
      customer: {
        name: "Sarah Johnson",
        phone: "+27 82 345 6789",
        email: "sarah@example.com"
      },
      equipment: {
        id: "MS001",
        name: "4-Wheel Mobility Scooter",
        category: "scooters"
      },
      dates: {
        start: "2024-01-18",
        end: "2024-01-25",
        duration: 7
      },
      status: "paid",
      branch: "hilton",
      totalCost: 850,
      deposit: 255,
      createdAt: "2024-01-12",
      requiresDelivery: false
    },
    {
      id: "B003",
      quoteId: "Q003",
      customer: {
        name: "Mike Wilson", 
        phone: "+27 83 456 7890",
        email: "mike@example.com"
      },
      equipment: {
        id: "HB001",
        name: "Electric Hospital Bed",
        category: "beds"
      },
      dates: {
        start: "2024-01-20",
        end: "2024-01-27", 
        duration: 7
      },
      status: "pending",
      branch: "hilton",
      totalCost: 1200,
      deposit: 360,
      createdAt: "2024-01-15",
      requiresDelivery: true
    }
  ];

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.equipment.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    const matchesEquipment = equipmentFilter === "all" || booking.equipment.category === equipmentFilter;
    const matchesBranch = booking.branch === branch;
    
    return matchesSearch && matchesStatus && matchesEquipment && matchesBranch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
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
      case 'paid': return CreditCard;
      case 'active': return CheckCircle;
      case 'returned': return Package;
      case 'overdue': return AlertTriangle;
      case 'cancelled': return AlertTriangle;
      default: return Clock;
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Booking ID', 'Customer', 'Equipment', 'Start Date', 'End Date', 'Status', 'Total Cost'].join(','),
      ...filteredBookings.map(booking => [
        booking.id,
        booking.customer.name,
        booking.equipment.name,
        booking.dates.start,
        booking.dates.end,
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
                <SelectItem value="paid">Paid</SelectItem>
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
                <SelectItem value="wheelchairs">Wheelchairs</SelectItem>
                <SelectItem value="scooters">Scooters</SelectItem>
                <SelectItem value="beds">Beds</SelectItem>
                <SelectItem value="walkers">Walkers</SelectItem>
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
                  return (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{booking.id}</div>
                          <div className="text-xs text-gray-500">Quote: {booking.quoteId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.customer.name}</div>
                          <div className="text-sm text-gray-500">{booking.customer.phone}</div>
                          <div className="text-xs text-gray-500">{booking.customer.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.equipment.name}</div>
                          <div className="text-sm text-gray-500">ID: {booking.equipment.id}</div>
                          {booking.requiresDelivery && (
                            <Badge variant="outline" className="text-xs mt-1">Delivery</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{booking.dates.start}</div>
                          <div>to {booking.dates.end}</div>
                          <div className="text-xs text-gray-500">({booking.dates.duration} days)</div>
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
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {booking.status === 'pending' && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Approve
                            </Button>
                          )}
                          {booking.status === 'paid' && (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              Dispatch
                            </Button>
                          )}
                          {booking.status === 'active' && (
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                              Complete
                            </Button>
                          )}
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
    </div>
  );
};

export default BookingManager;
