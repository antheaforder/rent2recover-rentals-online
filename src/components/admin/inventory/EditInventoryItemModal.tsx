
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, AlertTriangle } from "lucide-react";
import { EQUIPMENT_CATEGORIES, BRANCHES, type InventoryItem } from "@/config/equipmentCategories";

interface EditInventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  onSave: (itemId: string, updates: Partial<InventoryItem>) => void;
  onDelete: (itemId: string) => void;
}

const EditInventoryItemModal = ({
  isOpen,
  onClose,
  item,
  onSave,
  onDelete
}: EditInventoryItemModalProps) => {
  const [notes, setNotes] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (item) {
      setNotes(item.notes || '');
    }
  }, [item]);

  const handleSave = () => {
    if (item) {
      onSave(item.id, { notes });
      onClose();
    }
  };

  const handleDelete = () => {
    if (item) {
      onDelete(item.id);
      onClose();
    }
  };

  if (!item) return null;

  const categoryInfo = EQUIPMENT_CATEGORIES.find(cat => cat.id === item.category);
  const branchInfo = BRANCHES.find(b => b.id === item.branch);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'booked': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Inventory Item</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Item Details */}
          <div className="space-y-2">
            <div>
              <Label>Item Name</Label>
              <Input value={item.name} disabled className="bg-gray-50" />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Serial Number</Label>
                <Input value={item.serialNumber} disabled className="bg-gray-50" />
              </div>
              <div>
                <Label>Status</Label>
                <Badge className={getStatusColor(item.status)}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Category</Label>
                <Input value={categoryInfo?.name || item.category} disabled className="bg-gray-50" />
              </div>
              <div>
                <Label>Branch</Label>
                <Input value={branchInfo?.name || item.branch} disabled className="bg-gray-50" />
              </div>
            </div>
          </div>

          {/* Editable Notes */}
          <div>
            <Label htmlFor="notes">Admin Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this item for admin reference..."
              rows={4}
            />
          </div>

          {/* Current Booking Info */}
          {item.currentBooking && (
            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription>
                <strong>Currently Booked</strong><br />
                Customer: {item.currentBooking.customer}<br />
                Return Due: {item.currentBooking.endDate}<br />
                Booking ID: {item.currentBooking.bookingId}
              </AlertDescription>
            </Alert>
          )}

          {/* Delete Section */}
          {!showDeleteConfirm ? (
            <div className="border-t pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full text-red-600 hover:bg-red-50"
                disabled={item.status === 'booked'}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Item
              </Button>
              {item.status === 'booked' && (
                <p className="text-xs text-gray-500 mt-1 text-center">
                  Cannot delete item while booked
                </p>
              )}
            </div>
          ) : (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Are you sure?</strong><br />
                This will permanently delete "{item.name}" from inventory.
                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditInventoryItemModal;
