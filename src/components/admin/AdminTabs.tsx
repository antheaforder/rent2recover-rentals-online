
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Calendar, 
  Package, 
  Users, 
  Bell, 
  FileText, 
  Settings 
} from "lucide-react";
import DashboardOverview from "./DashboardOverview";
import BookingCalendar from "./BookingCalendar";
import InventoryManager from "./InventoryManager";
import BookingManager from "./BookingManager";
import NotificationsPanel from "./NotificationsPanel";
import AdminReports from "./AdminReports";
import UserManagement from "./UserManagement";

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
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-7">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="calendar" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Calendar
        </TabsTrigger>
        <TabsTrigger value="inventory" className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Inventory
        </TabsTrigger>
        <TabsTrigger value="bookings" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Bookings
        </TabsTrigger>
        <TabsTrigger value="users" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Users
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </TabsTrigger>
        <TabsTrigger value="reports" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Reports
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <DashboardOverview 
          branch={branch} 
          canViewAllBranches={canViewAllBranches} 
        />
      </TabsContent>

      <TabsContent value="calendar">
        <BookingCalendar 
          branch={branch} 
          canViewAllBranches={canViewAllBranches} 
        />
      </TabsContent>

      <TabsContent value="inventory">
        <InventoryManager 
          branch={branch} 
          canViewAllBranches={canViewAllBranches}
          canEditEquipment={canEditEquipment}
        />
      </TabsContent>

      <TabsContent value="bookings">
        <BookingManager 
          branch={branch} 
          canViewAllBranches={canViewAllBranches} 
        />
      </TabsContent>

      <TabsContent value="users">
        <UserManagement />
      </TabsContent>

      <TabsContent value="notifications">
        <NotificationsPanel />
      </TabsContent>

      <TabsContent value="reports">
        <AdminReports 
          branch={branch} 
          canViewAllBranches={canViewAllBranches} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
