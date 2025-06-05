
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package,
  CalendarIcon,
  Users,
  Settings,
  Download
} from "lucide-react";

interface AdminTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  canEditEquipment: boolean;
}

const AdminTabs = ({ activeTab, onTabChange, canEditEquipment }: AdminTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="inventory" className="flex items-center gap-2" disabled={!canEditEquipment}>
          <Settings className="h-4 w-4" />
          Inventory
        </TabsTrigger>
        <TabsTrigger value="calendar" className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          Calendar
        </TabsTrigger>
        <TabsTrigger value="bookings" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Bookings
        </TabsTrigger>
        <TabsTrigger value="reports" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Reports
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default AdminTabs;
