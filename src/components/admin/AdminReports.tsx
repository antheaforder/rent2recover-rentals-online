
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Package,
  CalendarIcon,
  CheckCircle,
  MapPin
} from "lucide-react";
import { BRANCHES } from "@/config/equipmentCategories";

interface AdminReportsProps {
  branch: string;
  canViewAllBranches: boolean;
}

const AdminReports = ({ branch, canViewAllBranches }: AdminReportsProps) => {
  const currentBranch = BRANCHES.find(b => b.id === branch);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports & Analytics</CardTitle>
        <CardDescription>Export data and view analytics for {currentBranch?.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" className="w-full justify-start h-auto p-4">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Download className="h-4 w-4" />
                  <span className="font-medium">Booking Reports</span>
                </div>
                <p className="text-sm text-gray-500">Export all bookings for {currentBranch?.name}</p>
              </div>
            </Button>
            <Button variant="outline" className="w-full justify-start h-auto p-4">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="h-4 w-4" />
                  <span className="font-medium">Inventory Report</span>
                </div>
                <p className="text-sm text-gray-500">Current stock levels and utilization</p>
              </div>
            </Button>
            <Button variant="outline" className="w-full justify-start h-auto p-4">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="font-medium">Calendar Export</span>
                </div>
                <p className="text-sm text-gray-500">iCal feeds for all equipment</p>
              </div>
            </Button>
            <Button variant="outline" className="w-full justify-start h-auto p-4">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Financial Summary</span>
                </div>
                <p className="text-sm text-gray-500">Revenue and payment analytics</p>
              </div>
            </Button>
          </div>
          
          {canViewAllBranches && (
            <>
              <hr className="my-6" />
              <h4 className="font-semibold mb-4">Combined Reports (All Branches)</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" className="w-full justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <Download className="h-4 w-4" />
                      <span className="font-medium">Multi-Branch Analytics</span>
                    </div>
                    <p className="text-sm text-gray-500">Combined booking and revenue data</p>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">Cross-Branch Transfers</span>
                    </div>
                    <p className="text-sm text-gray-500">Equipment movement between branches</p>
                  </div>
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminReports;
