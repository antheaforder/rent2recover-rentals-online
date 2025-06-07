
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
  
  // Generate unique ID using category prefix and timestamp
  const categoryPrefix = item.category.toUpperCase().slice(0, 3);
  const newItem: InventoryItem = {
    ...item,
    id: item.serialNumber || `${categoryPrefix}${Date.now()}`
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

// Generate next available item name for a category and branch
export const generateNextItemName = (category: string, branch: string) => {
  const inventory = getInventoryByCategory(category);
  const branchItems = inventory.filter(item => item.branch === branch);
  const nextNumber = branchItems.length + 1;
  
  // Convert category ID to proper name format
  const categoryName = category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('');
  
  const branchName = branch === 'hilton' ? 'Hilton' : 'Joburg';
  
  return `${categoryName} ${branchName} ${nextNumber}`;
};

// Generate serial number
export const generateSerialNumber = (category: string) => {
  const prefix = category.toUpperCase().slice(0, 3);
  const year = new Date().getFullYear();
  const inventory = getInventoryByCategory(category);
  const nextNumber = inventory.length + 1;
  
  return `${prefix}-${year}-${String(nextNumber).padStart(3, '0')}`;
};
