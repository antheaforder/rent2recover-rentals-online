
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus } from "lucide-react";
import { 
  getInventoryByCategory, 
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  checkInItem,
  checkOutItem,
  generateNextItemName
} from "@/services/inventoryService";
import { createMaintenanceBlock, generateICalForItem } from "@/services/bookingService";
import { useToast } from "@/hooks/use-toast";
import { EQUIPMENT_CATEGORIES, BRANCHES, type EquipmentCategoryId, type InventoryItem } from "@/config/equipmentCategories";
import InventoryItemsList from "@/components/admin/inventory/InventoryItemsList";
import AddInventoryItemModal from "@/components/admin/inventory/AddInventoryItemModal";
import EditInventoryItemModal from "@/components/admin/inventory/EditInventoryItemModal";
import CreateBookingModal from "@/components/admin/CreateBookingModal";

interface CategoryDetailsViewProps {
  category: EquipmentCategoryId;
  branch: string;
  onBack: () => void;
}

const CategoryDetailsView = ({ 
  category, 
  branch, 
  onBack
}: CategoryDetailsViewProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [selectedItemForBooking, setSelectedItemForBooking] = useState<InventoryItem | null>(null);
  const [inventory, setInventory] = useState(() => getInventoryByCategory(category));
  const { toast } = useToast();

  const categoryInfo = EQUIPMENT_CATEGORIES.find(cat => cat.id === category);
  const currentBranch = BRANCHES.find(b => b.id === branch);

  const filteredInventory = inventory.filter(item => item.branch === branch);

  const refreshInventory = () => {
    const updatedInventory = getInventoryByCategory(category);
    setInventory(updatedInventory);
    
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('inventoryUpdated', { 
      detail: { category, branch } 
    }));
  };

  // Listen for category pricing updates
  useEffect(() => {
    const handlePricingUpdate = () => {
      refreshInventory();
    };

    window.addEventListener('categoryPricingUpdated', handlePricingUpdate);
    return () => window.removeEventListener('categoryPricingUpdated', handlePricingUpdate);
  }, []);

  const handleAddItem = async (formData: FormData) => {
    try {
      const newItem = await addInventoryItem({
        name: generateNextItemName(category, branch),
        category: category,
        branch: branch as any,
        serialNumber: formData.get('serialNumber') as string,
        condition: 'excellent',
        status: 'available',
        lastChecked: new Date().toISOString().split('T')[0],
        notes: formData.get('notes') as string || undefined
      });
      
      refreshInventory();
      setIsAddModalOpen(false);
      toast({
        title: "Item Added Successfully",
        description: `${newItem.name} has been added to inventory and saved to database`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to inventory",
        variant: "destructive"
      });
    }
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveItemChanges = async (itemId: string, updates: Partial<InventoryItem>) => {
    try {
      await updateInventoryItem(itemId, updates);
      refreshInventory();
      toast({
        title: "Item Updated Successfully",
        description: "Item details have been saved to database"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive"
      });
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteInventoryItem(itemId);
      refreshInventory();
      toast({
        title: "Item Deleted Successfully",
        description: "Item has been removed from inventory and database"
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
      await checkInItem(itemId);
      refreshInventory();
      toast({
        title: "Item Checked In Successfully",
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

  const handleCheckOut = (item: InventoryItem) => {
    // Instead of directly checking out, open booking modal
    setSelectedItemForBooking(item);
    setIsBookingModalOpen(true);
  };

  const handleBookingCreated = () => {
    refreshInventory();
    setIsBookingModalOpen(false);
    setSelectedItemForBooking(null);
    toast({
      title: "Booking Created Successfully",
      description: "Item has been checked out and booking record created"
    });
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
      
      refreshInventory();
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
        onEdit={handleEditItem}
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
        suggestedName={generateNextItemName(category, branch)}
      />

      <EditInventoryItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        item={editingItem}
        onSave={handleSaveItemChanges}
        onDelete={handleDeleteItem}
      />

      <CreateBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedItemForBooking(null);
        }}
        branch={branch}
        onBookingCreated={handleBookingCreated}
        preSelectedCategory={selectedItemForBooking ? category : undefined}
        preSelectedItem={selectedItemForBooking}
      />
    </div>
  );
};

export default CategoryDetailsView;
