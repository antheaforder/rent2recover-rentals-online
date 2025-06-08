
import { useState } from "react";
import { toast } from "sonner";
import CalendarFilters from "./calendar/CalendarFilters";
import WeekView from "./calendar/WeekView";
import MonthView from "./calendar/MonthView";
import DayBookingsModal from "./calendar/DayBookingsModal";
import InventoryItemModal from "./calendar/InventoryItemModal";
import { 
  EQUIPMENT_CATEGORIES, 
  INVENTORY_ITEMS, 
  MOCK_BOOKINGS,
  type InventoryItem,
  type BookingBlock
} from "@/config/equipmentCategories";

interface BookingCalendarProps {
  branch: string;
}

const BookingCalendar = ({ branch }: BookingCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [branchFilter, setBranchFilter] = useState(branch);
  const [equipmentFilter, setEquipmentFilter] = useState('all');
  const [showCrossBranch, setShowCrossBranch] = useState(false);
  const [viewType, setViewType] = useState<'week' | 'month'>('week');
  const [selectedDayBookings, setSelectedDayBookings] = useState<{
    date: Date;
    bookings: BookingBlock[];
  } | null>(null);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItem | null>(null);

  // Filter inventory items based on current filters
  const filteredInventoryItems = INVENTORY_ITEMS.filter(item => {
    const branchMatch = branchFilter === 'all' || item.branch === branchFilter || showCrossBranch;
    const categoryMatch = equipmentFilter === 'all' || item.category === equipmentFilter;
    return branchMatch && categoryMatch;
  });

  // Filter bookings based on current filters
  const filteredBookings = MOCK_BOOKINGS.filter(booking => {
    const branchMatch = branchFilter === 'all' || booking.branch === branchFilter || showCrossBranch;
    const categoryMatch = equipmentFilter === 'all' || booking.equipmentCategory === equipmentFilter;
    return branchMatch && categoryMatch;
  });

  const handleDayClick = (date: Date) => {
    const dayStart = new Date(date);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59);
    
    const dayBookings = filteredBookings.filter(booking => 
      booking.startDate <= dayEnd && booking.endDate >= dayStart
    );

    setSelectedDayBookings({ date, bookings: dayBookings });
  };

  const handleInventoryItemClick = (item: InventoryItem) => {
    setSelectedInventoryItem(item);
  };

  const handleGenerateICalFeed = (itemId: string) => {
    if (itemId === 'all') {
      toast.success("Generating iCal feed for all equipment...");
    } else {
      const item = INVENTORY_ITEMS.find(i => i.id === itemId);
      toast.success(`Generating iCal feed for ${item?.name || 'equipment'}...`);
    }
  };

  const handleCopyICalLink = (itemId: string) => {
    const link = `${window.location.origin}/api/ical/${itemId}`;
    navigator.clipboard.writeText(link);
    toast.success("iCal link copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <CalendarFilters
        branchFilter={branchFilter}
        setBranchFilter={setBranchFilter}
        equipmentFilter={equipmentFilter}
        setEquipmentFilter={setEquipmentFilter}
        showCrossBranch={showCrossBranch}
        setShowCrossBranch={setShowCrossBranch}
        viewType={viewType}
        setViewType={setViewType}
      />

      {viewType === 'week' ? (
        <WeekView
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          equipmentFilter={equipmentFilter}
          branchFilter={branchFilter}
          filteredBookings={filteredBookings}
          inventoryItems={filteredInventoryItems}
          onDayClick={handleDayClick}
          onGenerateICalFeed={handleGenerateICalFeed}
        />
      ) : (
        <MonthView
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          equipmentFilter={equipmentFilter}
          branchFilter={branchFilter}
          filteredBookings={filteredBookings}
          inventoryItems={filteredInventoryItems}
          onDayClick={handleDayClick}
          onInventoryItemClick={handleInventoryItemClick}
          onGenerateICalFeed={handleGenerateICalFeed}
        />
      )}

      <DayBookingsModal
        isOpen={!!selectedDayBookings}
        onClose={() => setSelectedDayBookings(null)}
        dayBookings={selectedDayBookings}
        branchFilter={branchFilter}
        setBranchFilter={setBranchFilter}
        equipmentFilter={equipmentFilter}
        setEquipmentFilter={setEquipmentFilter}
      />

      <InventoryItemModal
        isOpen={!!selectedInventoryItem}
        onClose={() => setSelectedInventoryItem(null)}
        item={selectedInventoryItem}
        onGenerateICalFeed={handleGenerateICalFeed}
        onCopyICalLink={handleCopyICalLink}
      />
    </div>
  );
};

export default BookingCalendar;
