
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { USER_ROLES, type UserRole } from "@/config/equipmentCategories";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminTabs from "@/components/admin/AdminTabs";
import CreateBookingModal from "@/components/admin/CreateBookingModal";

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const branch = searchParams.get('branch') || 'hilton';
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreateBookingOpen, setIsCreateBookingOpen] = useState(false);
  
  // Mock user role - in real app this would come from auth
  const [userRole, setUserRole] = useState<UserRole>('super-admin');

  const setBranch = (newBranch: string) => {
    setSearchParams({ branch: newBranch });
  };
  
  // Role-based access control
  const canViewAllBranches = userRole === 'super-admin';
  const canEditEquipment = userRole === 'super-admin';
  const canCreateBookings = userRole === 'super-admin';

  const handleBookingCreated = () => {
    // Refresh data if needed
    console.log('Booking created, refreshing data...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader
        branch={branch}
        setBranch={setBranch}
        userRole={userRole}
        canViewAllBranches={canViewAllBranches}
        canCreateBookings={canCreateBookings}
        canEditEquipment={canEditEquipment}
        onCreateBookingClick={() => setIsCreateBookingOpen(true)}
      />

      <div className="container mx-auto px-4 py-8">
        <AdminTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          canEditEquipment={canEditEquipment}
          branch={branch}
          canViewAllBranches={canViewAllBranches}
        />
      </div>

      <CreateBookingModal
        isOpen={isCreateBookingOpen}
        onClose={() => setIsCreateBookingOpen(false)}
        branch={branch}
        onBookingCreated={handleBookingCreated}
      />
    </div>
  );
};

export default AdminDashboard;
