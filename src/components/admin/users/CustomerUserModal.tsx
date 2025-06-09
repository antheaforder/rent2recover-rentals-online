
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AddressAutocomplete from '@/components/booking/AddressAutocomplete';

interface CustomerUser {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  delivery_address: string;
  address_latitude?: number;
  address_longitude?: number;
  is_active: boolean;
}

interface CustomerUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customer: CustomerUser | null;
}

const CustomerUserModal = ({ isOpen, onClose, onSuccess, customer }: CustomerUserModalProps) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [addressLatitude, setAddressLatitude] = useState<number | undefined>();
  const [addressLongitude, setAddressLongitude] = useState<number | undefined>();
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (customer) {
      setFullName(customer.full_name);
      setEmail(customer.email);
      setPhone(customer.phone);
      setDeliveryAddress(customer.delivery_address);
      setAddressLatitude(customer.address_latitude);
      setAddressLongitude(customer.address_longitude);
      setIsActive(customer.is_active);
    }
  }, [customer, isOpen]);

  const handleAddressSelect = (address: string, latitude?: number, longitude?: number) => {
    setDeliveryAddress(address);
    setAddressLatitude(latitude);
    setAddressLongitude(longitude);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;
    
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('customer-management', {
        body: {
          action: 'update_customer',
          id: customer.id,
          full_name: fullName,
          email,
          phone,
          delivery_address: deliveryAddress,
          address_latitude: addressLatitude,
          address_longitude: addressLongitude,
          is_active: isActive
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      toast({
        title: "Success",
        description: "Customer updated successfully"
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive"
      });
    }

    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Delivery Address</Label>
            <AddressAutocomplete
              value={deliveryAddress}
              onAddressSelect={handleAddressSelect}
              placeholder="Search for delivery address..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is-active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="is-active">Active</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Update'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerUserModal;
