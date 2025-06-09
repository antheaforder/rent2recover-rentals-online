
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CustomerUser {
  id: string;
  full_name: string;
  email: string;
}

interface Booking {
  id: string;
  quote_id: string;
  equipment_category: string;
  equipment_name: string;
  start_date: string;
  end_date: string;
  total_cost: number;
  status: string;
  payment_status: string;
  created_at: string;
}

interface CustomerBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerUser | null;
}

const CustomerBookingsModal = ({ isOpen, onClose, customer }: CustomerBookingsModalProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();

  const loadBookings = async () => {
    if (!customer) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-management', {
        body: { action: 'get_customer_bookings', customerId: customer.id }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setBookings(data.bookings);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load customer bookings",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen && customer) {
      loadBookings();
    }
  }, [isOpen, customer]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'confirmed': return 'default';
      case 'delivered': return 'default';
      case 'returned': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'paid': return 'default';
      case 'failed': return 'destructive';
      case 'refunded': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Booking History - {customer?.full_name}
          </DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No bookings found for this customer.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quote ID</TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-mono text-sm">
                        {booking.quote_id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.equipment_name}</div>
                          <div className="text-sm text-gray-500">{booking.equipment_category}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(booking.start_date).toLocaleDateString()}</div>
                          <div className="text-gray-500">to {new Date(booking.end_date).toLocaleDateString()}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        R{booking.total_cost.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPaymentStatusColor(booking.payment_status)}>
                          {booking.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(booking.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomerBookingsModal;
