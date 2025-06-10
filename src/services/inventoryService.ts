import { InventoryItem } from "@/config/equipmentCategories";
import { getInventoryStore, setInventoryStore, getBookingStore } from "./mockDataService";
import { supabase } from "@/integrations/supabase/client";

// Inventory management functions
export const getInventory = () => getInventoryStore();

export const getInventoryByBranch = (branch: string) =>
  getInventoryStore().filter(item => item.branch === branch);

export const getInventoryByCategory = (category: string) =>
  getInventoryStore().filter(item => item.category === category);

// Generate category abbreviation for serial numbers
const getCategoryAbbreviation = (category: string): string => {
  const abbreviations: Record<string, string> = {
    'electric-hospital-beds': 'EHB',
    'electric-wheelchairs': 'EWC',
    'manual-wheelchairs': 'MWC',
    'mobility-scooters': 'MS',
    'walking-frames': 'WF',
    'crutches': 'CR',
    'commodes': 'CM',
    'shower-chairs': 'SC',
    'toilet-seats': 'TS',
    'grab-rails': 'GR'
  };
  return abbreviations[category] || category.toUpperCase().slice(0, 3);
};

// Generate branch code for serial numbers
const getBranchCode = (branch: string): string => {
  const codes: Record<string, string> = {
    'hilton': 'HLT',
    'johannesburg': 'JHB'
  };
  return codes[branch] || branch.toUpperCase().slice(0, 3);
};

// Generate auto serial number
export const generateSerialNumber = (category: string, branch: string): string => {
  const categoryAbbr = getCategoryAbbreviation(category);
  const branchCode = getBranchCode(branch);
  
  // Get existing items for this category and branch to determine next number
  const existingItems = getInventoryStore().filter(item => 
    item.category === category && item.branch === branch
  );
  
  const nextNumber = existingItems.length + 1;
  return `${categoryAbbr}-${branchCode}-${String(nextNumber).padStart(3, '0')}`;
};

export const addInventoryItem = async (item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> => {
  console.log('Adding inventory item:', item);
  
  // Generate unique ID and serial number if not provided
  const newItem: InventoryItem = {
    ...item,
    id: item.serialNumber || `${Date.now()}`,
    serialNumber: item.serialNumber || generateSerialNumber(item.category, item.branch),
    condition: item.condition || 'excellent',
    status: item.status || 'available'
  };
  
  try {
    // Save to Supabase first
    const { data, error } = await supabase
      .from('inventory_items')
      .insert({
        id: newItem.id,
        name: newItem.name,
        category: newItem.category,
        branch: newItem.branch,
        serial_number: newItem.serialNumber,
        condition: newItem.condition,
        status: newItem.status,
        last_checked: newItem.lastChecked,
        notes: newItem.notes,
        purchase_date: newItem.purchaseDate
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error saving to Supabase:', error);
      throw new Error(`Failed to save item to database: ${error.message}`);
    }
    
    console.log('Successfully saved to Supabase:', data);
    
    // Update local store after successful save
    const inventory = getInventoryStore();
    setInventoryStore([...inventory, newItem]);
    
    // Trigger refresh events for other components
    window.dispatchEvent(new CustomEvent('inventoryUpdated', { 
      detail: { category: newItem.category, branch: newItem.branch } 
    }));
    
    return newItem;
    
  } catch (error) {
    console.error('Failed to add inventory item:', error);
    throw error;
  }
};

export const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>): Promise<InventoryItem | null> => {
  const inventory = getInventoryStore();
  const index = inventory.findIndex(item => item.id === id);
  if (index !== -1) {
    const updatedInventory = [...inventory];
    updatedInventory[index] = { ...updatedInventory[index], ...updates };
    
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('inventory_items')
        .update({
          name: updates.name,
          condition: updates.condition,
          status: updates.status,
          last_checked: updates.lastChecked,
          notes: updates.notes
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating in Supabase:', error);
        throw new Error(`Failed to update item: ${error.message}`);
      }
      
      // Update local store after successful save
      setInventoryStore(updatedInventory);
      
      // Trigger refresh events
      window.dispatchEvent(new CustomEvent('inventoryUpdated', { 
        detail: { category: updatedInventory[index].category, branch: updatedInventory[index].branch } 
      }));
      
      return updatedInventory[index];
      
    } catch (error) {
      console.error('Failed to update inventory item:', error);
      throw error;
    }
  }
  return null;
};

export const deleteInventoryItem = async (id: string): Promise<boolean> => {
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
    const itemToDelete = inventory[index];
    
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting from Supabase:', error);
        throw new Error(`Failed to delete item: ${error.message}`);
      }
      
      // Update local store after successful delete
      const updatedInventory = [...inventory];
      updatedInventory.splice(index, 1);
      setInventoryStore(updatedInventory);
      
      // Trigger refresh events
      window.dispatchEvent(new CustomEvent('inventoryUpdated', { 
        detail: { category: itemToDelete.category, branch: itemToDelete.branch } 
      }));
      
      return true;
      
    } catch (error) {
      console.error('Failed to delete inventory item:', error);
      throw error;
    }
  }
  return false;
};

// Check-in/Check-out functionality
export const checkInItem = async (itemId: string) => {
  const inventory = getInventoryStore();
  const index = inventory.findIndex(item => item.id === itemId);
  if (index !== -1) {
    const updatedInventory = [...inventory];
    updatedInventory[index].status = 'available';
    updatedInventory[index].currentBooking = undefined;
    updatedInventory[index].lastChecked = new Date().toISOString().split('T')[0];
    setInventoryStore(updatedInventory);
    
    // Update status in Supabase
    await updateInventoryItem(itemId, {
      status: 'available',
      lastChecked: new Date().toISOString().split('T')[0]
    });
  }
};

export const checkOutItem = async (itemId: string) => {
  const inventory = getInventoryStore();
  const index = inventory.findIndex(item => item.id === itemId);
  if (index !== -1) {
    const updatedInventory = [...inventory];
    updatedInventory[index].status = 'booked';
    updatedInventory[index].lastChecked = new Date().toISOString().split('T')[0];
    setInventoryStore(updatedInventory);
    
    // Update status in Supabase
    await updateInventoryItem(itemId, {
      status: 'booked',
      lastChecked: new Date().toISOString().split('T')[0]
    });
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
