
import { useState } from "react";
import { 
  addInventoryItem,
  updateInventoryItem
} from "@/services/inventoryService";
import { 
  updateCategoryPricing
} from "@/services/categoryService";
import { useToast } from "@/hooks/use-toast";
import { type EquipmentCategoryId, type EquipmentCategory } from "@/config/equipmentCategories";

export const useInventoryModals = (onRefresh: () => void) => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState<EquipmentCategoryId | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const { toast } = useToast();

  const handleCategorySettingsClick = (categoryId: EquipmentCategoryId) => {
    setModalCategory(categoryId);
    setModalMode('edit');
    setIsCategoryModalOpen(true);
  };

  const handleAddNewCategory = () => {
    setModalCategory(null);
    setModalMode('add');
    setIsCategoryModalOpen(true);
  };

  const handleAddItemClick = (categoryId: EquipmentCategoryId) => {
    setModalCategory(categoryId);
    setModalMode('add');
    setIsItemModalOpen(true);
  };

  const handleUpdateCategory = async (categoryId: EquipmentCategoryId, updates: Partial<EquipmentCategory>) => {
    try {
      console.log('Updating category pricing:', categoryId, updates);
      await updateCategoryPricing(categoryId, {
        pricing: updates.pricing,
        delivery: updates.delivery
      });
      setIsCategoryModalOpen(false);
      
      // Force refresh to show updated pricing
      onRefresh();
      
      toast({
        title: "Category Updated Successfully",
        description: "Category settings have been saved and applied across all modules"
      });
    } catch (error) {
      console.error('Failed to update category:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update category settings",
        variant: "destructive"
      });
    }
  };

  const handleSaveItem = async (itemData: any) => {
    try {
      console.log('useInventoryModals: Saving inventory item:', itemData);
      
      if (modalMode === 'add') {
        const newItem = await addInventoryItem({
          name: itemData.name,
          category: itemData.category,
          branch: itemData.branch,
          serialNumber: itemData.serialNumber,
          condition: itemData.condition || 'excellent',
          status: itemData.status || 'available',
          lastChecked: itemData.lastChecked,
          notes: itemData.notes,
          purchaseDate: itemData.purchaseDate
        });
        
        console.log('useInventoryModals: Item saved successfully:', newItem);
        
        toast({
          title: "Item Added Successfully",
          description: `${itemData.name} has been added to inventory and saved to database`
        });
        
        // Force refresh of inventory counts
        onRefresh();
      }
      setIsItemModalOpen(false);
    } catch (error) {
      console.error('useInventoryModals: Failed to save item:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save item to database",
        variant: "destructive"
      });
    }
  };

  return {
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    isItemModalOpen,
    setIsItemModalOpen,
    modalCategory,
    modalMode,
    handleCategorySettingsClick,
    handleAddNewCategory,
    handleAddItemClick,
    handleUpdateCategory,
    handleSaveItem
  };
};
