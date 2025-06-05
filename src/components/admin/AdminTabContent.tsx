
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";
import DashboardOverview from "@/components/admin/DashboardOverview";
import InventoryManager from "@/components/admin/InventoryManager";
import BookingCalendar from "@/components/admin/BookingCalendar";
import BookingManager from "@/components/admin/BookingManager";
import AdminReports from "@/components/admin/AdminReports";

interface AdminTabContentProps {
  branch: string;
  canEditEquipment: boolean;
  canViewAllBranches: boolean;
}

const AdminTabContent = ({ branch, canEditEquipment, canViewAllBranches }: AdminTabContentProps) => {
  return (
    <>
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
    </>
  );
};

export default AdminTabContent;
