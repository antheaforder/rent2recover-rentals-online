
import { InventoryItem } from "@/config/equipmentCategories";
import { getInventoryStore, setInventoryStore, getBookingStore } from "./mockDataService";

// Inventory management functions
export const getInventory = () => getInventoryStore();

export const getInventoryByBranch = (branch: string) =>
  getInventoryStore().filter(item => item.branch === branch);

export const getInventoryByCategory = (category: string) =>
  getInventoryStore().filter(item => item.category === category);

export const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
  const inventory = getInventoryStore();
  const newItem: InventoryItem = {
    ...item,
    id: `${item.category.toUpperCase().slice(0, 3)}${Date.now()}`
  };
  setInventoryStore([...inventory, newItem]);
  return newItem;
};

export const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
  const inventory = getInventoryStore();
  const index = inventory.findIndex(item => item.id === id);
  if (index !== -1) {
    const updatedInventory = [...inventory];
    updatedInventory[index] = { ...updatedInventory[index], ...updates };
    setInventoryStore(updatedInventory);
    return updatedInventory[index];
  }
  return null;
};

export const deleteInventoryItem = (id: string) => {
  // Check if item is currently booked
  const bookings = getBookingStore();
  const hasActiveBooking = bookings.some(booking =>
    booking.assignedItemId === id && 
    (booking.status === 'confirmed' || booking.status === 'active')
  );

  if (hasActiveBooking) {
    throw new Error("Cannot delete item with active bookings");
  }

  const inventory = getInventoryStore();
  const index = inventory.findIndex(item => item.id === id);
  if (index !== -1) {
    const updatedInventory = [...inventory];
    updatedInventory.splice(index, 1);
    setInventoryStore(updatedInventory);
    return true;
  }
  return false;
};

// Check-in/Check-out functionality
export const checkInItem = (itemId: string) => {
  const inventory = getInventoryStore();
  const index = inventory.findIndex(item => item.id === itemId);
  if (index !== -1) {
    const updatedInventory = [...inventory];
    updatedInventory[index].status = 'available';
    updatedInventory[index].currentBooking = undefined;
    updatedInventory[index].lastChecked = new Date().toISOString().split('T')[0];
    setInventoryStore(updatedInventory);
  }
};

export const checkOutItem = (itemId: string) => {
  const inventory = getInventoryStore();
  const index = inventory.findIndex(item => item.id === itemId);
  if (index !== -1) {
    const updatedInventory = [...inventory];
    updatedInventory[index].status = 'booked';
    updatedInventory[index].lastChecked = new Date().toISOString().split('T')[0];
    setInventoryStore(updatedInventory);
  }
};
