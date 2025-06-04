
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Plus, 
  Download, 
  Package,
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
  Bell,
  Calendar as CalendarIcon,
  Users,
  Settings,
  Shield
} from "lucide-react";
import DashboardOverview from "@/components/admin/DashboardOverview";
import InventoryManager from "@/components/admin/InventoryManager";
import BookingCalendar from "@/components/admin/BookingCalendar";
import NotificationsPanel from "@/components/admin/NotificationsPanel";
import BookingManager from "@/components/admin/BookingManager";
import { BRANCHES, USER_ROLES, type UserRole } from "@/config/equipmentCategories";

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const branch = searchParams.get('branch') || 'hilton';
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock user role - in real app this would come from auth
  const [userRole, setUserRole] = useState<UserRole>('super-admin');

  const setBranch = (newBranch: string) => {
    setSearchParams({ branch: newBranch });
  };

  const currentBranch = BRANCHES.find(b => b.id === branch);
  const currentUserRole = USER_ROLES.find(r => r.id === userRole);
  
  // Role-based access control
  const canViewAllBranches = userRole === 'super-admin';
  const canEditEquipment = userRole !== 'read-only';
  const canManageUsers = userRole === 'super-admin';

  // Filter branches based on user role
  const availableBranches = canViewAllBranches 
    ? BRANCHES 
    : BRANCHES.filter(b => b.id === branch);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">Rent2Recover Admin</h1>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    {currentUserRole?.name}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {currentBranch?.name} • Medical Equipment Rental Management
                  {!canViewAllBranches && (
                    <span className="text-xs text-gray-500 ml-2">(Restricted Access)</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {canViewAllBranches && (
                <Select value={branch} onValueChange={setBranch}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANCHES.map(branch => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              <NotificationsPanel />
              
              {canEditEquipment && (
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Equipment
                </Button>
              )}

              {canManageUsers && (
                <Select value={userRole} onValueChange={(value: UserRole) => setUserRole(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_ROLES.map(role => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
