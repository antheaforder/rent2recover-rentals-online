
import { useState, useEffect } from "react";
import { 
  getInventoryByBranch,
  getEquipmentCategories
} from "@/services/inventoryService";
import { 
  updateCategoryPricing
} from "@/services/categoryService";
import { type EquipmentCategoryId } from "@/config/equipmentCategories";

export const useInventoryData = (branch: string) => {
  const [inventoryRefreshKey, setInventoryRefreshKey] = useState(0);

  // Listen for inventory updates to refresh counts
  useEffect(() => {
    const handleInventoryUpdate = () => {
      console.log('Inventory updated - refreshing counts');
      setInventoryRefreshKey(prev => prev + 1);
    };

    const handlePricingUpdate = () => {
      console.log('Category pricing updated - refreshing display');
      setInventoryRefreshKey(prev => prev + 1);
    };

    window.addEventListener('inventoryUpdated', handleInventoryUpdate);
    window.addEventListener('categoryPricingUpdated', handlePricingUpdate);
    
    return () => {
      window.removeEventListener('inventoryUpdated', handleInventoryUpdate);
      window.removeEventListener('categoryPricingUpdated', handlePricingUpdate);
    };
  }, []);

  const categories = getEquipmentCategories();

  const getCategoryInventoryCount = (categoryId: EquipmentCategoryId, branchId: string) => {
    const inventory = getInventoryByBranch(branchId);
    return inventory.filter(item => item.category === categoryId).length;
  };

  const getAvailableCount = (categoryId: EquipmentCategoryId, branchId: string) => {
    const inventory = getInventoryByBranch(branchId);
    return inventory.filter(item => item.category === categoryId && item.status === 'available').length;
  };

  const forceRefresh = () => {
    setInventoryRefreshKey(prev => prev + 1);
  };

  return {
    categories,
    inventoryRefreshKey,
    getCategoryInventoryCount,
    getAvailableCount,
    forceRefresh
  };
};
