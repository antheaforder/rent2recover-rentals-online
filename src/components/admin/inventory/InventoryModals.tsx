
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { EQUIPMENT_CATEGORIES, type InventoryItem } from "@/config/equipmentCategories";

interface InventoryModalsProps {
  branch: string;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isMaintenanceModalOpen: boolean;
  setIsMaintenanceModalOpen: (open: boolean) => void;
  selectedItem: InventoryItem | null;
  onAddItem: (formData: FormData) => void;
  onCreateMaintenanceBlock: (itemId: string, reason: string) => void;
}

const InventoryModals = ({
  branch,
  isAddModalOpen,
  setIsAddModalOpen,
  isMaintenanceModalOpen,
  setIsMaintenanceModalOpen,
  selectedItem,
  onAddItem,
  onCreateMaintenanceBlock
}: InventoryModalsProps) => {
  return (
    <>
      {/* Add Equipment Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Equipment</DialogTitle>
            <DialogDescription>Add a new item to the inventory</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            onAddItem(new FormData(e.target as HTMLFormElement));
          }} className="space-y-4">
            <div>
              <Label htmlFor="name">Equipment Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select name="category" required>
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
              <Textarea id="notes" name="notes" />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Item</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Maintenance Modal */}
      <Dialog open={isMaintenanceModalOpen} onOpenChange={setIsMaintenanceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Maintenance Block</DialogTitle>
            <DialogDescription>
              Mark {selectedItem?.name} ({selectedItem?.id}) for maintenance
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const reason = formData.get('reason') as string;
            if (selectedItem) {
              onCreateMaintenanceBlock(selectedItem.id, reason);
            }
          }} className="space-y-4">
            <div>
              <Label htmlFor="reason">Maintenance Reason</Label>
              <Textarea id="reason" name="reason" required placeholder="Describe the maintenance required..." />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setIsMaintenanceModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Maintenance Block</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InventoryModals;
