
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EQUIPMENT_CATEGORIES, type EquipmentCategoryId } from "@/config/equipmentCategories";

interface AddInventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: EquipmentCategoryId;
  branch: string;
  onAddItem: (formData: FormData) => void;
  suggestedName: string;
}

const AddInventoryItemModal = ({
  isOpen,
  onClose,
  category,
  branch,
  onAddItem,
  suggestedName
}: AddInventoryItemModalProps) => {
  const categoryInfo = EQUIPMENT_CATEGORIES.find(cat => cat.id === category);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Inventory Item</DialogTitle>
          <DialogDescription>
            Add a new {categoryInfo?.name} to the {branch} branch inventory
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          onAddItem(new FormData(e.target as HTMLFormElement));
        }} className="space-y-4">
          <div>
            <Label htmlFor="suggestedName">Generated Name</Label>
            <Input
              id="suggestedName"
              value={suggestedName}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Names are automatically generated following: [Category] [Branch] [Number]
            </p>
          </div>
          
          <div>
            <Label htmlFor="serialNumber">Serial Number</Label>
            <Input id="serialNumber" name="serialNumber" required />
          </div>
          
          <div>
            <Label htmlFor="condition">Condition</Label>
            <Select name="condition" defaultValue="excellent">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="needs-repair">Needs Repair</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea id="notes" name="notes" placeholder="Additional notes about this item..." />
          </div>
          
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Item</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInventoryItemModal;
