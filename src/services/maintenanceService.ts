
import { MaintenanceBlock } from "@/config/equipmentCategories";
import { getMaintenanceStore, setMaintenanceStore, getInventoryStore, setInventoryStore } from "./mockDataService";

// Maintenance block management
export const createMaintenanceBlock = (block: Omit<MaintenanceBlock, 'id' | 'createdAt'>) => {
  const maintenance = getMaintenanceStore();
  const maintenanceBlock: MaintenanceBlock = {
    ...block,
    id: `M${Date.now()}`,
    createdAt: new Date()
  };
  setMaintenanceStore([...maintenance, maintenanceBlock]);

  // Update item status
  const inventory = getInventoryStore();
  const itemIndex = inventory.findIndex(item => item.id === block.itemId);
  if (itemIndex !== -1) {
    const updatedInventory = [...inventory];
    updatedInventory[itemIndex].status = 'maintenance';
    updatedInventory[itemIndex].notes = block.reason;
    setInventoryStore(updatedInventory);
  }

  return maintenanceBlock;
};

export const getMaintenanceBlocks = () => getMaintenanceStore();

export const removeMaintenanceBlock = (id: string) => {
  const maintenance = getMaintenanceStore();
  const index = maintenance.findIndex(block => block.id === id);
  if (index !== -1) {
    const block = maintenance[index];
    const updatedMaintenance = [...maintenance];
    updatedMaintenance.splice(index, 1);
    setMaintenanceStore(updatedMaintenance);

    // Update item status back to available
    const inventory = getInventoryStore();
    const itemIndex = inventory.findIndex(item => item.id === block.itemId);
    if (itemIndex !== -1) {
      const updatedInventory = [...inventory];
      updatedInventory[itemIndex].status = 'available';
      updatedInventory[itemIndex].notes = undefined;
      setInventoryStore(updatedInventory);
    }
    return true;
  }
  return false;
};
