
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Package,
  CalendarIcon,
  Users,
  Settings,
  Download,
  Shield
} from "lucide-react";
import DashboardOverview from "@/components/admin/DashboardOverview";
import InventoryManager from "@/components/admin/InventoryManager";
import BookingCalendar from "@/components/admin/BookingCalendar";
import BookingManager from "@/components/admin/BookingManager";
import AdminReports from "@/components/admin/AdminReports";

interface AdminTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  canEditEquipment: boolean;
  branch: string;
  canViewAllBranches: boolean;
}

const AdminTabs = ({ 
  activeTab, 
  onTabChange, 
  canEditEquipment, 
  branch, 
  canViewAllBranches 
}: AdminTabsProps) => {
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

      <TabsContent value="overview" className="mt-6">
        <DashboardOverview branch={branch} />
      </TabsContent>

      <TabsContent value="inventory" className="mt-6">
        {canEditEquipment ? (
          <InventoryManager branch={branch} />
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Restricted</h3>
              <p className="text-gray-600">You don't have permission to manage inventory</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="calendar" className="mt-6">
        <BookingCalendar branch={branch} />
      </TabsContent>

      <TabsContent value="bookings" className="mt-6">
        <BookingManager branch={branch} />
      </TabsContent>

      <TabsContent value="reports" className="mt-6">
        <AdminReports branch={branch} canViewAllBranches={canViewAllBranches} />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
