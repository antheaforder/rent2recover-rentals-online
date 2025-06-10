
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Shield, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { getAllProfiles, getAllCustomers, deleteProfile, deleteCustomer, type Profile, type Customer } from '@/services/userService';
import UserProfileModal from './UserProfileModal';
import CustomerModal from './CustomerModal';
import ChangePasswordModal from './ChangePasswordModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const NewUserManagement = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [profileSearch, setProfileSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const { profile: currentUser, signOut } = useAuth();
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    
    const [profilesResult, customersResult] = await Promise.all([
      getAllProfiles(),
      getAllCustomers()
    ]);

    if (profilesResult.data) {
      setProfiles(profilesResult.data);
      setFilteredProfiles(profilesResult.data);
    }

    if (customersResult.data) {
      setCustomers(customersResult.data);
      setFilteredCustomers(customersResult.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const filtered = profiles.filter(profile =>
      profile.full_name?.toLowerCase().includes(profileSearch.toLowerCase()) ||
      profile.email.toLowerCase().includes(profileSearch.toLowerCase())
    );
    setFilteredProfiles(filtered);
  }, [profileSearch, profiles]);

  useEffect(() => {
    const filtered = customers.filter(customer =>
      customer.full_name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer.phone.includes(customerSearch)
    );
    setFilteredCustomers(filtered);
  }, [customerSearch, customers]);

  const handleEditProfile = (profile: Profile) => {
    setEditingProfile(profile);
    setIsProfileModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsCustomerModalOpen(true);
  };

  const handleDeleteProfile = async (id: string) => {
    const result = await deleteProfile(id);
    if (!result.error) {
      toast({
        title: "Success",
        description: "User deleted successfully"
      });
      loadData();
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    const result = await deleteCustomer(id);
    if (!result.error) {
      toast({
        title: "Success",
        description: "Customer deleted successfully"
      });
      loadData();
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const handleModalSuccess = () => {
    setIsProfileModalOpen(false);
    setIsCustomerModalOpen(false);
    setIsPasswordModalOpen(false);
    setEditingProfile(null);
    setEditingCustomer(null);
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current User Info */}
      {currentUser && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Logged in as: <span className="font-bold">{currentUser.full_name || currentUser.email}</span>
                  </p>
                  <p className="text-xs text-blue-700">{currentUser.email}</p>
                </div>
                <Badge variant="default" className="ml-auto">
                  {currentUser.role.replace('_', ' ').replace('-', ' ')}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsPasswordModalOpen(true)}>
                  Change Password
                </Button>
                <Button variant="outline" size="sm" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="profiles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profiles">Admin Users</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="profiles">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Admin Users</CardTitle>
              <div className="flex gap-4">
                <div className="relative w-80">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search admin users..."
                    value={profileSearch}
                    onChange={(e) => setProfileSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button onClick={() => { setEditingProfile(null); setIsProfileModalOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Admin User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell className="flex items-center gap-2">
                        {profile.role === 'super_admin' ? (
                          <Shield className="h-4 w-4 text-red-500" />
                        ) : (
                          <UserIcon className="h-4 w-4 text-blue-500" />
                        )}
                        {profile.full_name || 'No name'}
                      </TableCell>
                      <TableCell>{profile.email}</TableCell>
                      <TableCell>
                        <Badge variant={profile.role === 'super_admin' ? 'destructive' : 'default'}>
                          {profile.role.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(profile.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProfile(profile)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {currentUser?.id !== profile.id && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {profile.full_name || profile.email}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteProfile(profile.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Customers</CardTitle>
              <div className="flex gap-4">
                <div className="relative w-80">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search customers..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button onClick={() => { setEditingCustomer(null); setIsCustomerModalOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.full_name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell className="max-w-xs truncate" title={customer.delivery_address}>
                        {customer.delivery_address}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{customer.total_bookings}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCustomer(customer)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {customer.full_name}? This will also delete all their booking history.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteCustomer(customer.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSuccess={handleModalSuccess}
        profile={editingProfile}
      />

      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSuccess={handleModalSuccess}
        customer={editingCustomer}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default NewUserManagement;
