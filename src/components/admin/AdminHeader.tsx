
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Plus, 
  MapPin,
  Shield
} from "lucide-react";
import { BRANCHES, USER_ROLES, type UserRole } from "@/config/equipmentCategories";
import NotificationsPanel from "@/components/admin/NotificationsPanel";

interface AdminHeaderProps {
  branch: string;
  setBranch: (branch: string) => void;
  userRole: UserRole;
  canViewAllBranches: boolean;
  canCreateBookings: boolean;
  canEditEquipment: boolean;
  onCreateBookingClick: () => void;
}

const AdminHeader = ({ 
  branch, 
  setBranch, 
  userRole, 
  canViewAllBranches, 
  canCreateBookings, 
  canEditEquipment,
  onCreateBookingClick 
}: AdminHeaderProps) => {
  const navigate = useNavigate();
  const currentBranch = BRANCHES.find(b => b.id === branch);
  const currentUserRole = USER_ROLES.find(r => r.id === userRole);

  return (
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
            
            {canCreateBookings && (
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700"
                onClick={onCreateBookingClick}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Booking
              </Button>
            )}

            {canEditEquipment && (
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Equipment
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
