
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EQUIPMENT_CATEGORIES, BRANCHES } from "@/config/equipmentCategories";

interface CalendarFiltersProps {
  branchFilter: string;
  setBranchFilter: (value: string) => void;
  equipmentFilter: string;
  setEquipmentFilter: (value: string) => void;
  showCrossBranch: boolean;
  setShowCrossBranch: (value: boolean) => void;
  viewType: 'week' | 'month';
  setViewType: (value: 'week' | 'month') => void;
}

const CalendarFilters = ({
  branchFilter,
  setBranchFilter,
  equipmentFilter,
  setEquipmentFilter,
  showCrossBranch,
  setShowCrossBranch,
  viewType,
  setViewType,
}: CalendarFiltersProps) => {
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
    </div>
  );
};

export default CalendarFilters;
