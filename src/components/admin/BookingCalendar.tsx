
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  CheckCircle,
  Eye,
  Edit,
  Filter
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
  generateICalForItem,
  updateBookingStatus
} from "@/services/bookingService";
import BookingDetailModal from "./BookingDetailModal";
import EditBookingModal from "./EditBookingModal";

interface BookingCalendarProps {
  branch: string;
}

const BookingCalendar = ({ branch }: BookingCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewType, setViewType] = useState<'week' | 'month'>('week');
  const [equipmentFilter, setEquipmentFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState(branch);
  const [showCrossBranch, setShowCrossBranch] = useState(true);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingBlock | null>(null);
  const [editingBooking, setEditingBooking] = useState<BookingBlock | null>(null);
  const [dayBookingsModal, setDayBookingsModal] = useState<{
    date: Date;
    bookings: BookingBlock[];
  } | null>(null);
  
  // State for real data
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [bookings, setBookings] = useState<BookingBlock[]>([]);

  // Load data on component mount and when branch changes
  useEffect(() => {
    setInventoryItems(getInventory());
    setBookings(getBookings());
  }, []);

  // Update branch filter when prop changes
  useEffect(() => {
    setBranchFilter(branch);
  }, [branch]);

  // Filter bookings based on current selections
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesBranch = showCrossBranch || branchFilter === 'all' || booking.branch === branchFilter;
      const matchesCategory = equipmentFilter === 'all' || booking.equipmentCategory === equipmentFilter;
      return matchesBranch && matchesCategory;
    });
  }, [bookings, showCrossBranch, branchFilter, equipmentFilter]);

  // Calculate availability counts for calendar display
  const getAvailabilityCounts = (category: EquipmentCategoryId, date: Date, targetBranch?: BranchId) => {
    const categoryInventory = inventoryItems.filter(item => 
      item.category === category && 
      (!targetBranch || item.branch === targetBranch)
    );
    
    const dayStart = new Date(date);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59);
    
    const bookedItems = filteredBookings.filter(booking => 
      booking.equipmentCategory === category &&
      booking.startDate <= dayEnd && 
      booking.endDate >= dayStart &&
      (!targetBranch || booking.branch === targetBranch)
    );

    const totalItems = categoryInventory.length;
    const bookedCount = bookedItems.length;
    const availableCount = Math.max(0, totalItems - bookedCount);

    return { totalItems, bookedCount, availableCount };
  };

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
    const icalUrl = `https://rent2recover.com/api/ical/${inventoryItemId}`;
    navigator.clipboard.writeText(icalUrl);
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

  const handleBookingStatusChange = (bookingId: string, newStatus: BookingBlock['status']) => {
    updateBookingStatus(bookingId, newStatus);
    setBookings(getBookings()); // Refresh data
  };

  const handleDayClick = (date: Date) => {
    const dayStart = new Date(date);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59);
    
    const dayBookings = filteredBookings.filter(booking => 
      booking.startDate <= dayEnd && booking.endDate >= dayStart
    );
    
    setDayBookingsModal({ date, bookings: dayBookings });
  };

  // Enhanced week view with availability counts
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
                const targetBranch = branchFilter === 'all' ? undefined : branchFilter as BranchId;
                const counts = getAvailabilityCounts(category.id, day, targetBranch);
                
                return (
                  <div 
                    key={`${category.id}-${day.toISOString()}`} 
                    className="p-2 border border-gray-200 min-h-16 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleDayClick(day)}
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-blue-600">
                        🟦 {counts.bookedCount} Booked
                      </div>
                      <div className="text-xs font-medium text-green-600">
                        🟩 {counts.availableCount} Available
                      </div>
                    </div>
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
            onSelect={(date) => {
              if (date) {
                setSelectedDate(date);
                handleDayClick(date);
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
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingBooking(booking)}
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

  const currentBranch = BRANCHES.find(b => b.id === branchFilter);

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
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select branch" />
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

      {/* Cross-branch toggle */}
      <div className="flex items-center space-x-2">
        <Switch
          id="cross-branch"
          checked={showCrossBranch}
          onCheckedChange={setShowCrossBranch}
        />
        <Label htmlFor="cross-branch">Show both branches</Label>
        {showCrossBranch && (
          <span className="ml-2 text-sm text-gray-500">Viewing: All Branches</span>
        )}
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
              ? 'Equipment availability and bookings by week and category with availability counts.'
              : 'Select a date to view daily bookings with detailed management options.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {viewType === 'week' ? renderWeekView() : renderMonthView()}
        </CardContent>
      </Card>

      {/* Day Bookings Modal */}
      <Dialog open={!!dayBookingsModal} onOpenChange={() => setDayBookingsModal(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Bookings for {dayBookingsModal?.date && format(dayBookingsModal.date, "MMMM dd, yyyy")}
            </DialogTitle>
          </DialogHeader>
          {dayBookingsModal && (
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
                {dayBookingsModal.bookings.map(booking => {
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
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingBooking(booking)}
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
                
                {dayBookingsModal.bookings.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No bookings for this date
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onStatusChange={handleBookingStatusChange}
        />
      )}

      {/* Edit Booking Modal */}
      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSave={(updatedBooking) => {
            // Handle booking update
            setBookings(getBookings()); // Refresh data
            setEditingBooking(null);
          }}
        />
      )}

      {/* Inventory Item Detail Modal */}
      {selectedInventoryItem && (
        <Dialog open={true} onOpenChange={() => setSelectedInventoryItem(null)}>
          <DialogContent className="w-96">
            <DialogHeader>
              <DialogTitle>Equipment Details</DialogTitle>
            </DialogHeader>
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
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default BookingCalendar;
