
import { 
  BookingBlock, 
  CreateBookingRequest, 
  PRICING_CONFIG
} from "@/config/equipmentCategories";
import { getBookingStore, setBookingStore, getInventoryStore, setInventoryStore } from "./mockDataService";
import { checkAvailability, calculateBookingCost } from "./availabilityService";

// Create booking
export const createBooking = async (request: CreateBookingRequest): Promise<BookingBlock> => {
  // Check availability
  const availability = checkAvailability({
    category: request.category,
    branch: request.branch,
    startDate: request.startDate,
    endDate: request.endDate,
    requestedQuantity: 1
  });

  if (!availability.available) {
    throw new Error(availability.message);
  }

  // Determine which item to assign
  let assignedItem;
  let crossBranchBooking = false;
  let deliveryFee = PRICING_CONFIG.deliveryFees.standard;

  if (availability.availableItems.length > 0) {
    assignedItem = availability.availableItems[0];
  } else if (availability.alternativeBranch) {
    assignedItem = availability.alternativeBranch.availableItems[0];
    crossBranchBooking = true;
    deliveryFee = availability.alternativeBranch.deliveryFee;
  } else {
    throw new Error("No items available for booking");
  }

  // Calculate costs
  const cost = calculateBookingCost(
    request.category,
    request.startDate,
    request.endDate,
    crossBranchBooking
  );

  // Create booking
  const booking: BookingBlock = {
    id: `B${Date.now()}`,
    equipmentId: assignedItem.id,
    equipmentName: assignedItem.name,
    equipmentCategory: request.category,
    customer: request.customer.name,
    customerEmail: request.customer.email,
    customerPhone: request.customer.phone,
    startDate: request.startDate,
    endDate: request.endDate,
    status: 'confirmed',
    branch: request.branch,
    assignedItemId: assignedItem.id,
    deliveryRequired: true,
    crossBranchBooking,
    deliveryFee,
    totalCost: cost.total,
    deposit: cost.deposit,
    createdBy: request.createdBy,
    createdAt: new Date(),
    notes: request.notes
  };

  const bookings = getBookingStore();
  setBookingStore([...bookings, booking]);

  // Update item status to booked
  const inventory = getInventoryStore();
  const itemIndex = inventory.findIndex(item => item.id === assignedItem.id);
  if (itemIndex !== -1) {
    const updatedInventory = [...inventory];
    updatedInventory[itemIndex].status = 'booked';
    updatedInventory[itemIndex].currentBooking = {
      customer: booking.customer,
      endDate: booking.endDate.toISOString().split('T')[0],
      bookingId: booking.id
    };
    setInventoryStore(updatedInventory);
  }

  // Trigger refresh events for other components
  window.dispatchEvent(new CustomEvent('inventoryUpdated'));
  window.dispatchEvent(new CustomEvent('bookingCreated', { 
    detail: { booking, assignedItem } 
  }));

  return booking;
};

// Booking management functions
export const getBookings = () => getBookingStore();

export const getBookingById = (id: string) => 
  getBookingStore().find(booking => booking.id === id);

export const updateBookingStatus = (id: string, status: BookingBlock['status']) => {
  const bookings = getBookingStore();
  const index = bookings.findIndex(booking => booking.id === id);
  if (index !== -1) {
    const updatedBookings = [...bookings];
    updatedBookings[index].status = status;
    setBookingStore(updatedBookings);
    
    // Update item status when booking is returned/cancelled
    if (status === 'returned' || status === 'cancelled') {
      const inventory = getInventoryStore();
      const itemIndex = inventory.findIndex(item => 
        item.id === updatedBookings[index].assignedItemId
      );
      if (itemIndex !== -1) {
        const updatedInventory = [...inventory];
        updatedInventory[itemIndex].status = 'available';
        updatedInventory[itemIndex].currentBooking = undefined;
        setInventoryStore(updatedInventory);
      }
    }
  }
};

// Re-export services for compatibility
export { getEquipmentCategories, updateCategoryPricing } from "./categoryService";
export { 
  getInventory, 
  getInventoryByBranch, 
  getInventoryByCategory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  checkInItem,
  checkOutItem
} from "./inventoryService";
export { createMaintenanceBlock, getMaintenanceBlocks, removeMaintenanceBlock } from "./maintenanceService";
export { checkAvailability, calculateBookingCost } from "./availabilityService";
export { generateICalForItem } from "./calendarService";
export { initializeMockData } from "./mockDataService";
