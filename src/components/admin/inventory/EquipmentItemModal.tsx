
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EQUIPMENT_CATEGORIES, BRANCHES, type EquipmentCategoryId, type BranchId, type InventoryItem } from "@/config/equipmentCategories";
import { getInventoryByCategory } from "@/services/inventoryService";

interface EquipmentItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: EquipmentCategoryId;
  branch?: string;
  editItem?: InventoryItem | null;
  onSave: (itemData: any) => void;
  mode: 'add' | 'edit';
}

const EquipmentItemModal = ({
  isOpen,
  onClose,
  category,
  branch,
  editItem,
  onSave,
  mode
}: EquipmentItemModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    id: '',
    branch: branch || 'hilton',
    condition: 'excellent',
    status: 'available',
    lastChecked: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const categoryInfo = EQUIPMENT_CATEGORIES.find(cat => cat.id === category);

  // Generate auto fields for add mode
  const generateAutoFields = () => {
    if (mode === 'edit' || !categoryInfo) return;

    const inventory = getInventoryByCategory(category);
    const branchItems = inventory.filter(item => item.branch === formData.branch);
    const nextNumber = branchItems.length + 1;

    // Generate name: CategoryName Branch Number
    const categoryPrefix = categoryInfo.name.replace(/\s+/g, '');
    const branchName = BRANCHES.find(b => b.id === formData.branch)?.name.split(' ')[0] || '';
    const generatedName = `${categoryPrefix} ${branchName} ${nextNumber}`;

    // Generate serial number: PREFIX-YYYY-###
    const prefix = category.toUpperCase().slice(0, 3);
    const year = new Date().getFullYear();
    const serialNumber = `${prefix}-${year}-${String(nextNumber).padStart(3, '0')}`;

    // Generate ID: PREFIX###
    const generatedId = `${prefix}${String(Date.now()).slice(-3)}`;

    setFormData(prev => ({
      ...prev,
      name: generatedName,
      serialNumber,
      id: generatedId
    }));
  };

  useEffect(() => {
    if (mode === 'edit' && editItem) {
      setFormData({
        name: editItem.name,
        serialNumber: editItem.serialNumber,
        id: editItem.id,
        branch: editItem.branch,
        condition: editItem.condition,
        status: editItem.status,
        lastChecked: editItem.lastChecked,
        notes: editItem.notes || ''
      });
    } else if (mode === 'add') {
      // Reset form for add mode
      setFormData({
        name: '',
        serialNumber: '',
        id: '',
        branch: branch || 'hilton',
        condition: 'excellent',
        status: 'available',
        lastChecked: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
  }, [mode, editItem, branch, isOpen]);

  useEffect(() => {
    if (mode === 'add' && isOpen) {
      generateAutoFields();
    }
  }, [formData.branch, mode, isOpen, category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      category,
      purchaseDate: mode === 'add' ? new Date().toISOString().split('T')[0] : editItem?.purchaseDate
    });
  };

  const handleBranchChange = (newBranch: string) => {
    setFormData(prev => ({ ...prev, branch: newBranch }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add New' : 'Edit'} {categoryInfo?.name}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' 
              ? `Add a new ${categoryInfo?.name} to the inventory`
              : `Edit ${editItem?.name} details`
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Auto-generated fields */}
          <div className="space-y-2">
            <div>
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                value={formData.name}
                disabled={mode === 'add'}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={mode === 'add' ? 'bg-gray-50' : ''}
              />
              {mode === 'add' && (
                <p className="text-xs text-gray-500">Auto-generated: {categoryInfo?.name.replace(/\s+/g, '')} {BRANCHES.find(b => b.id === formData.branch)?.name.split(' ')[0]} #</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                  required
                />
                {mode === 'add' && (
                  <p className="text-xs text-gray-500">Format: PREFIX-YYYY-###</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="id">Internal ID</Label>
                <Input
                  id="id"
                  value={formData.id}
                  disabled={mode === 'add'}
                  onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                  className={mode === 'add' ? 'bg-gray-50' : ''}
                  required
                />
                {mode === 'add' && (
                  <p className="text-xs text-gray-500">Auto-generated unique ID</p>
                )}
              </div>
            </div>
          </div>

          {/* Required fields */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="branch">Branch</Label>
              <Select value={formData.branch} onValueChange={handleBranchChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BRANCHES.map(branch => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name.split(' ')[0]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="condition">Condition</Label>
              <Select value={formData.condition} onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}>
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
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="booked">Out</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="lastChecked">Last Checked</Label>
              <Input
                id="lastChecked"
                type="date"
                value={formData.lastChecked}
                onChange={(e) => setFormData(prev => ({ ...prev, lastChecked: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes for admin reference..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'add' ? 'Add Item' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentItemModal;
