
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus } from "lucide-react";
import { 
  getInventoryByCategory, 
  addInventoryItem,
  deleteInventoryItem,
  createMaintenanceBlock,
  generateICalForItem,
  checkInItem,
  checkOutItem
} from "@/services/bookingService";
import { useToast } from "@/hooks/use-toast";
import { EQUIPMENT_CATEGORIES, BRANCHES, type EquipmentCategoryId } from "@/config/equipmentCategories";
import InventoryItemsList from "@/components/admin/inventory/InventoryItemsList";
import AddInventoryItemModal from "@/components/admin/inventory/AddInventoryItemModal";

interface CategoryDetailsViewProps {
  category: EquipmentCategoryId;
  branch: string;
  onBack: () => void;
}

const CategoryDetailsView = ({ category, branch, onBack }: CategoryDetailsViewProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inventory, setInventory] = useState(() => getInventoryByCategory(category));
  const { toast } = useToast();

  const categoryInfo = EQUIPMENT_CATEGORIES.find(cat => cat.id === category);
  const currentBranch = BRANCHES.find(b => b.id === branch);

  const filteredInventory = inventory.filter(item => item.branch === branch);

  const handleAddItem = async (formData: FormData) => {
    try {
      const newItem = addInventoryItem({
        name: generateItemName(category, branch),
        category: category,
        branch: branch as any,
        serialNumber: formData.get('serialNumber') as string,
        condition: formData.get('condition') as any,
        status: 'available',
        lastChecked: new Date().toISOString().split('T')[0],
        notes: formData.get('notes') as string || undefined
      });
      
      setInventory(getInventoryByCategory(category));
      setIsAddModalOpen(false);
      toast({
        title: "Item Added",
        description: `${newItem.name} has been added to inventory`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to inventory",
        variant: "destructive"
      });
    }
  };

  const generateItemName = (categoryId: EquipmentCategoryId, branchId: string): string => {
    const categoryName = categoryInfo?.name.replace(/\s+/g, '').replace(/[^\w]/g, '') || categoryId;
    const branchName = branchId === 'hilton' ? 'Hilton' : 'Joburg';
    const existingItems = inventory.filter(item => 
      item.category === categoryId && item.branch === branchId
    );
    const nextNumber = existingItems.length + 1;
    return `${categoryName} ${branchName} ${nextNumber}`;
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      deleteInventoryItem(itemId);
      setInventory(getInventoryByCategory(category));
      toast({
        title: "Item Deleted",
        description: "Item has been removed from inventory"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete item",
        variant: "destructive"
      });
    }
  };

  const handleCheckIn = async (itemId: string) => {
    try {
      checkInItem(itemId);
      setInventory(getInventoryByCategory(category));
      toast({
        title: "Item Checked In",
        description: "Item status updated to available"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check in item",
        variant: "destructive"
      });
    }
  };

  const handleCheckOut = async (itemId: string) => {
    try {
      checkOutItem(itemId);
      setInventory(getInventoryByCategory(category));
      toast({
        title: "Item Checked Out",
        description: "Item status updated to booked"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check out item",
        variant: "destructive"
      });
    }
  };

  const handleCreateMaintenanceBlock = async (itemId: string, reason: string) => {
    try {
      createMaintenanceBlock({
        itemId,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        reason,
        createdBy: 'admin'
      });
      
      setInventory(getInventoryByCategory(category));
      toast({
        title: "Maintenance Block Created",
        description: "Item has been marked for maintenance"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create maintenance block",
        variant: "destructive"
      });
    }
  };

  const handleDownloadICal = (itemId: string) => {
    const icalContent = generateICalForItem(itemId);
    if (icalContent) {
      const blob = new Blob([icalContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${itemId}-calendar.ics`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const copyICalLink = (itemId: string) => {
    const icalUrl = `https://rent2recover.com/api/ical/${itemId}`;
    navigator.clipboard.writeText(icalUrl);
    toast({
      title: "iCal Link Copied",
      description: "Calendar link has been copied to clipboard"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{categoryInfo?.name}</h2>
            <p className="text-gray-600">
              Inventory items at {currentBranch?.name} • {filteredInventory.length} items
            </p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="flex gap-2">
        <Badge variant="outline">Available: {filteredInventory.filter(i => i.status === 'available').length}</Badge>
        <Badge variant="outline">Booked: {filteredInventory.filter(i => i.status === 'booked').length}</Badge>
        <Badge variant="outline">Maintenance: {filteredInventory.filter(i => i.status === 'maintenance').length}</Badge>
      </div>

      <InventoryItemsList
        items={filteredInventory}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        onMaintenance={handleCreateMaintenanceBlock}
        onDelete={handleDeleteItem}
        onDownloadICal={handleDownloadICal}
        onCopyICalLink={copyICalLink}
      />

      <AddInventoryItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        category={category}
        branch={branch}
        onAddItem={handleAddItem}
        suggestedName={generateItemName(category, branch)}
      />
    </div>
  );
};

export default CategoryDetailsView;
