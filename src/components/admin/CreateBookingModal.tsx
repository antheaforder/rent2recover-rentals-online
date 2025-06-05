
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { EQUIPMENT_CATEGORIES, BRANCHES, type CreateBookingRequest } from "@/config/equipmentCategories";
import { checkAvailability, createBooking, calculateBookingCost } from "@/services/bookingService";
import { useToast } from "@/hooks/use-toast";

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch: string;
  onBookingCreated: () => void;
}

const CreateBookingModal = ({ isOpen, onClose, branch, onBookingCreated }: CreateBookingModalProps) => {
  const [formData, setFormData] = useState<Partial<CreateBookingRequest>>({
    branch: branch as any,
    createdBy: 'admin'
  });
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [availability, setAvailability] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckAvailability = async () => {
    if (!formData.category || !startDate || !endDate) {
      toast({
        title: "Missing Information",
        description: "Please select category and dates",
        variant: "destructive"
      });
      return;
    }

    const result = checkAvailability({
      category: formData.category,
      branch: formData.branch!,
      startDate,
      endDate,
      requestedQuantity: 1
    });

    setAvailability(result);
  };

  const handleCreateBooking = async () => {
    if (!formData.category || !startDate || !endDate || !formData.customer?.name) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await createBooking({
        category: formData.category,
        branch: formData.branch!,
        startDate,
        endDate,
        customer: formData.customer,
        notes: formData.notes,
        createdBy: 'admin'
      });

      toast({
        title: "Booking Created",
        description: "New booking has been successfully created"
      });

      onBookingCreated();
      onClose();
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create booking",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ branch: branch as any, createdBy: 'admin' });
    setStartDate(undefined);
    setEndDate(undefined);
    setAvailability(null);
  };

  const costCalculation = startDate && endDate && formData.category ? 
    calculateBookingCost(
      formData.category, 
      startDate, 
      endDate, 
      availability?.alternativeBranch ? true : false
    ) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Booking</DialogTitle>
          <DialogDescription>
            Create a manual booking for {BRANCHES.find(b => b.id === branch)?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Equipment Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Equipment Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, category: value as any }));
                  setAvailability(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {EQUIPMENT_CATEGORIES.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Branch</Label>
              <Select value={formData.branch} onValueChange={(value) => setFormData(prev => ({ ...prev, branch: value as any }))}>
                <SelectTrigger>
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
            </div>
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date);
                      setAvailability(null);
                    }}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date);
                      setAvailability(null);
                    }}
                    disabled={(date) => date < (startDate || new Date())}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Check Availability Button */}
          <Button 
            onClick={handleCheckAvailability}
            variant="outline"
            className="w-full"
            disabled={!formData.category || !startDate || !endDate}
          >
            Check Availability
          </Button>

          {/* Availability Results */}
          {availability && (
            <div className="p-4 border rounded-lg">
              {availability.available ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">Available</Badge>
                    <span className="text-sm">{availability.message}</span>
                  </div>
                  {availability.alternativeBranch && (
                    <div className="text-sm text-orange-600 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Cross-branch delivery required - additional R{availability.alternativeBranch.deliveryFee} fee
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-800">Unavailable</Badge>
                  <span className="text-sm">{availability.message}</span>
                </div>
              )}
            </div>
          )}

          {/* Cost Calculation */}
          {costCalculation && availability?.available && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <h4 className="font-semibold">Cost Breakdown</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Base Rate ({costCalculation.days} days):</span>
                  <span>R{costCalculation.baseRate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>R{costCalculation.deliveryFee}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-1">
                  <span>Total:</span>
                  <span>R{costCalculation.total}</span>
                </div>
                <div className="flex justify-between text-blue-600">
                  <span>Deposit Required:</span>
                  <span>R{costCalculation.deposit}</span>
                </div>
              </div>
            </div>
          )}

          {/* Customer Details */}
          {availability?.available && (
            <div className="space-y-4">
              <h4 className="font-semibold">Customer Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Full Name</Label>
                  <Input 
                    id="customerName"
                    value={formData.customer?.name || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customer: { ...prev.customer, name: e.target.value } as any
                    }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input 
                    id="customerEmail"
                    type="email"
                    value={formData.customer?.email || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customer: { ...prev.customer, email: e.target.value } as any
                    }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Phone</Label>
                  <Input 
                    id="customerPhone"
                    value={formData.customer?.phone || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customer: { ...prev.customer, phone: e.target.value } as any
                    }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customerAddress">Address</Label>
                  <Input 
                    id="customerAddress"
                    value={formData.customer?.address || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customer: { ...prev.customer, address: e.target.value } as any
                    }))}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea 
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional booking notes..."
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            {availability?.available && (
              <Button 
                onClick={handleCreateBooking}
                disabled={isLoading || !formData.customer?.name}
                className="flex-1"
              >
                {isLoading ? "Creating..." : "Create Booking"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBookingModal;
