
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminUserManagement from './users/AdminUserManagement';
import CustomerUserManagement from './users/CustomerUserManagement';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const UserManagement = () => {
  const { isSuperAdmin } = useAdminAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <p className="text-gray-600">Manage admin users and customer accounts</p>
      </div>

      <Tabs defaultValue="customers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="customers">Customer Users</TabsTrigger>
          {isSuperAdmin && (
            <TabsTrigger value="admins">Admin Users</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="customers">
          <CustomerUserManagement />
        </TabsContent>

        {isSuperAdmin && (
          <TabsContent value="admins">
            <AdminUserManagement />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default UserManagement;
