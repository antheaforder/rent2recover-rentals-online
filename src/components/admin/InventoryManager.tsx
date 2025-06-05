
import { useState } from "react";
import { 
  getInventoryByBranch, 
  addInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem,
  createMaintenanceBlock,
  generateICalForItem
} from "@/services/bookingService";
import { useToast } from "@/hooks/use-toast";
import { type InventoryItem } from "@/config/equipmentCategories";
import InventoryHeader from "@/components/admin/inventory/InventoryHeader";
import InventoryFilters from "@/components/admin/inventory/InventoryFilters";
import InventoryItem from "@/components/admin/inventory/InventoryItem";
import InventoryModals from "@/components/admin/inventory/InventoryModals";
import InventoryEmptyState from "@/components/admin/inventory/InventoryEmptyState";

interface InventoryManagerProps {
  branch: string;
}

const InventoryManager = ({ branch }: InventoryManagerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [inventory, setInventory] = useState<InventoryItem[]>(() => getInventoryByBranch(branch));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const { toast } = useToast();

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesBranch = item.branch === branch;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesBranch;
  });

  const handleAddItem = async (formData: FormData) => {
    try {
      const newItem = addInventoryItem({
        name: formData.get('name') as string,
        category: formData.get('category') as any,
        branch: branch as any,
        serialNumber: formData.get('serialNumber') as string,
        condition: formData.get('condition') as any,
        status: 'available',
        lastChecked: new Date().toISOString().split('T')[0],
        notes: formData.get('notes') as string || undefined
      });
      
      setInventory(getInventoryByBranch(branch));
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

  const handleDeleteItem = async (itemId: string) => {
    try {
      deleteInventoryItem(itemId);
      setInventory(getInventoryByBranch(branch));
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

  const handleCreateMaintenanceBlock = async (itemId: string, reason: string) => {
    try {
      createMaintenanceBlock({
        itemId,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        reason,
        createdBy: 'admin'
      });
      
      setInventory(getInventoryByBranch(branch));
      setIsMaintenanceModalOpen(false);
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

  const handleMaintenanceClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsMaintenanceModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <InventoryHeader 
        branch={branch} 
        onAddClick={() => setIsAddModalOpen(true)} 
      />

      <InventoryFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

      <div className="grid gap-4">
        {filteredInventory.map((item) => (
          <InventoryItem
            key={item.id}
            item={item}
            onDownloadICal={handleDownloadICal}
            onCopyICalLink={copyICalLink}
            onMaintenance={handleMaintenanceClick}
            onDelete={handleDeleteItem}
          />
        ))}

        {filteredInventory.length === 0 && <InventoryEmptyState />}
      </div>

      <InventoryModals
        branch={branch}
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        isMaintenanceModalOpen={isMaintenanceModalOpen}
        setIsMaintenanceModalOpen={setIsMaintenanceModalOpen}
        selectedItem={selectedItem}
        onAddItem={handleAddItem}
        onCreateMaintenanceBlock={handleCreateMaintenanceBlock}
      />
    </div>
  );
};

export default InventoryManager;
