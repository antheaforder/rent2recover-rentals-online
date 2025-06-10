
import { useState, useEffect } from "react";
import { EQUIPMENT_CATEGORIES } from "@/config/equipmentCategories";
import { getInventoryByCategory } from "@/services/inventoryService";
import { getEquipmentCategories } from "@/services/categoryService";

export const useDashboardData = (branch: string) => {
  const [refreshKey, setRefreshKey] = useState(0);

  // Listen for inventory and pricing updates
  useEffect(() => {
    const handleInventoryUpdate = () => {
      console.log('Dashboard: Inventory updated - refreshing overview');
      setRefreshKey(prev => prev + 1);
    };

    const handlePricingUpdate = () => {
      console.log('Dashboard: Category pricing updated - refreshing overview');
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener('inventoryUpdated', handleInventoryUpdate);
    window.addEventListener('categoryPricingUpdated', handlePricingUpdate);

    return () => {
      window.removeEventListener('inventoryUpdated', handleInventoryUpdate);
      window.removeEventListener('categoryPricingUpdated', handlePricingUpdate);
    };
  }, []);

  // Real-time data calculation
  const categoryStats = EQUIPMENT_CATEGORIES.map(category => {
    const allCategoryInventory = getInventoryByCategory(category.id);
    const branchInventory = allCategoryInventory.filter(item => item.branch === branch);
    const categories = getEquipmentCategories();
    const categoryData = categories.find(c => c.id === category.id);
    
    return {
      ...category,
      total: branchInventory.length,
      available: branchInventory.filter(item => item.status === 'available').length,
      booked: branchInventory.filter(item => item.status === 'booked').length,
      maintenance: branchInventory.filter(item => item.status === 'maintenance').length,
      pricing: categoryData?.pricing || { dailyRate: 0, weeklyRate: 0, monthlyRate: 0 }
    };
  });

  const stats = {
    bookingsToday: 12,
    returnsToday: 8,
    overdueReturns: 3,
    totalEquipment: categoryStats.reduce((sum, cat) => sum + cat.total, 0),
    availableEquipment: categoryStats.reduce((sum, cat) => sum + cat.available, 0),
    bookedEquipment: categoryStats.reduce((sum, cat) => sum + cat.booked, 0),
    maintenanceItems: categoryStats.reduce((sum, cat) => sum + cat.maintenance, 0),
    revenue: 15750
  };

  return {
    refreshKey,
    categoryStats,
    stats
  };
};
