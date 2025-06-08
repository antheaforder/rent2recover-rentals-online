
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { 
  EQUIPMENT_CATEGORIES, 
  type EquipmentCategoryId, 
  type BranchId, 
  type BookingBlock, 
  type InventoryItem
} from "@/config/equipmentCategories";

interface WeekViewProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  equipmentFilter: string;
  branchFilter: string;
  filteredBookings: BookingBlock[];
  inventoryItems: InventoryItem[];
  onDayClick: (date: Date) => void;
  onGenerateICalFeed: (itemId: string) => void;
}

const WeekView = ({
  selectedDate,
  setSelectedDate,
  equipmentFilter,
  branchFilter,
  filteredBookings,
  inventoryItems,
  onDayClick,
  onGenerateICalFeed,
}: WeekViewProps) => {
  const getWeekDays = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  };

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
          <Button variant="outline" size="sm" onClick={() => onGenerateICalFeed('all')}>
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
                  onClick={() => onDayClick(day)}
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

export default WeekView;
