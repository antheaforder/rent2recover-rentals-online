
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EQUIPMENT_CATEGORIES, BRANCHES, type EquipmentCategoryId, type BranchId, type InventoryItem } from "@/config/equipmentCategories";
import { generateSerialNumber } from "@/services/inventoryService";

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
    status: 'available',
    lastChecked: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const categoryInfo = EQUIPMENT_CATEGORIES.find(cat => cat.id === category);

  // Generate auto fields for add mode
  const generateAutoFields = () => {
    if (mode === 'edit' || !categoryInfo) return;

    // Generate name: CategoryName Branch Number
    const categoryPrefix = categoryInfo.name.replace(/\s+/g, '');
    const branchName = BRANCHES.find(b => b.id === formData.branch)?.name.split(' ')[0] || '';
    const timestamp = Date.now().toString().slice(-3);
    const generatedName = `${categoryPrefix} ${branchName} ${timestamp}`;

    // Generate serial number using the service
    const generatedSerial = generateSerialNumber(category, formData.branch);

    // Generate ID
    const generatedId = `${category.slice(0, 3)}${timestamp}`;

    setFormData(prev => ({
      ...prev,
      name: generatedName,
      serialNumber: generatedSerial,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSaving) return;
    
    setIsSaving(true);
    
    try {
      console.log('Submitting form data:', formData);
      
      await onSave({
        ...formData,
        category,
        condition: 'excellent', // All items are excellent by default
        purchaseDate: mode === 'add' ? new Date().toISOString().split('T')[0] : editItem?.purchaseDate
      });
      
      console.log('Item saved successfully');
      onClose();
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setIsSaving(false);
    }
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
                required
              />
              {mode === 'add' && (
                <p className="text-xs text-gray-500">Auto-generated: {categoryInfo?.name.replace(/\s+/g, '')} {BRANCHES.find(b => b.id === formData.branch)?.name.split(' ')[0]} #</p>
              )}
            </div>

            <div>
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber}
                disabled={mode === 'add'}
                onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                className={mode === 'add' ? 'bg-gray-50' : ''}
                required
              />
              {mode === 'add' && (
                <p className="text-xs text-gray-500">Auto-generated: [Category]-[Branch]-[Number]</p>
              )}
            </div>
          </div>

          {/* Required fields */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="branch">Branch</Label>
              <Select value={formData.branch} onValueChange={handleBranchChange} disabled={isSaving}>
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
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))} disabled={isSaving}>
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
          </div>

          <div>
            <Label htmlFor="lastChecked">Last Checked</Label>
            <Input
              id="lastChecked"
              type="date"
              value={formData.lastChecked}
              onChange={(e) => setFormData(prev => ({ ...prev, lastChecked: e.target.value }))}
              disabled={isSaving}
            />
          </div>

          <div>
            <Label htmlFor="notes">Admin Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes for admin reference..."
              rows={3}
              disabled={isSaving}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : (mode === 'add' ? 'Add Item' : 'Save Changes')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentItemModal;
