
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Settings, 
  MapPin, 
  User, 
  LogOut, 
  Shield
} from "lucide-react";
import { BRANCHES, type UserRole } from "@/config/equipmentCategories";
import { useAdminAuth } from "@/hooks/useAdminAuth";

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
  const { user, logout } = useAdminAuth();
  const currentBranch = BRANCHES.find(b => b.id === branch);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Rent2Recover Admin</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                {canViewAllBranches ? (
                  <Select value={branch} onValueChange={setBranch}>
                    <SelectTrigger className="w-48 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BRANCHES.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <span>{currentBranch?.name} Branch</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {canCreateBookings && (
              <Button onClick={onCreateBookingClick}>
                <Plus className="h-4 w-4 mr-2" />
                Create Booking
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  {user?.role === 'super-admin' ? (
                    <Shield className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span>{user?.username}</span>
                  <Badge variant={user?.role === 'super-admin' ? 'destructive' : 'default'}>
                    {user?.role}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
