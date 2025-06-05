
import { 
  InventoryItem, 
  BookingBlock, 
  CreateBookingRequest, 
  AvailabilityCheck, 
  AvailabilityResult,
  MaintenanceBlock,
  PRICING_CONFIG,
  BRANCHES
} from "@/config/equipmentCategories";
import { isWithinInterval, differenceInDays } from "date-fns";

// Mock data stores - in real app these would be API calls
let inventoryStore: InventoryItem[] = [];
let bookingStore: BookingBlock[] = [];
let maintenanceStore: MaintenanceBlock[] = [];

// Initialize with sample data
export const initializeMockData = () => {
  inventoryStore = [
    // Electric Hospital Beds
    { id: "EHB001", name: "Electric Hospital Bed Model A", category: "electric-hospital-beds", status: "available", branch: "hilton", serialNumber: "EHB-2024-001", lastChecked: "2024-01-15", condition: "excellent" },
    { id: "EHB002", name: "Electric Hospital Bed Model B", category: "electric-hospital-beds", status: "available", branch: "hilton", serialNumber: "EHB-2024-002", lastChecked: "2024-01-10", condition: "good" },
    { id: "EHB003", name: "Electric Hospital Bed Model A", category: "electric-hospital-beds", status: "available", branch: "johannesburg", serialNumber: "EHB-2024-003", lastChecked: "2024-01-12", condition: "excellent" },
    
    // Wheelchairs
    { id: "WC001", name: "Standard Manual Wheelchair", category: "wheelchairs", status: "available", branch: "hilton", serialNumber: "WC-2024-001", lastChecked: "2024-01-15", condition: "excellent" },
    { id: "WC002", name: "Lightweight Wheelchair", category: "wheelchairs", status: "available", branch: "johannesburg", serialNumber: "WC-2024-002", lastChecked: "2024-01-10", condition: "good" },
    
    // Mobility Scooters
    { id: "MS001", name: "4-Wheel Mobility Scooter", category: "mobility-scooters", status: "available", branch: "hilton", serialNumber: "MS-2024-001", lastChecked: "2024-01-13", condition: "excellent" },
    { id: "MS002", name: "3-Wheel Mobility Scooter", category: "mobility-scooters", status: "available", branch: "johannesburg", serialNumber: "MS-2024-002", lastChecked: "2024-01-11", condition: "good" }
  ];

  bookingStore = [];
  maintenanceStore = [];
};

// Availability checking logic
export const checkAvailability = (request: AvailabilityCheck): AvailabilityResult => {
  const { category, branch: requestedBranch, startDate, endDate, requestedQuantity } = request;
  
  // Get all items in the category for the requested branch
  const branchItems = inventoryStore.filter(item => 
    item.category === category && 
    item.branch === requestedBranch && 
    item.status === 'available'
  );

  // Check for conflicts with existing bookings and maintenance
  const availableItems = branchItems.filter(item => {
    const bookingConflicts = bookingStore.filter(booking => 
      booking.assignedItemId === item.id &&
      (booking.status === 'confirmed' || booking.status === 'active') &&
      (isWithinInterval(startDate, { start: booking.startDate, end: booking.endDate }) ||
       isWithinInterval(endDate, { start: booking.startDate, end: booking.endDate }) ||
       isWithinInterval(booking.startDate, { start: startDate, end: endDate }))
    );

    const maintenanceConflicts = maintenanceStore.filter(maintenance =>
      maintenance.itemId === item.id &&
      (isWithinInterval(startDate, { start: maintenance.startDate, end: maintenance.endDate }) ||
       isWithinInterval(endDate, { start: maintenance.startDate, end: maintenance.endDate }) ||
       isWithinInterval(maintenance.startDate, { start: startDate, end: endDate }))
    );

    return bookingConflicts.length === 0 && maintenanceConflicts.length === 0;
  });

  if (availableItems.length >= requestedQuantity) {
    return {
      available: true,
      availableItems: availableItems.slice(0, requestedQuantity),
      message: `${availableItems.length} items available at ${BRANCHES.find(b => b.id === requestedBranch)?.name}`
    };
  }

  // Check alternative branch
  const alternateBranch = requestedBranch === 'hilton' ? 'johannesburg' : 'hilton';
  const altBranchItems = inventoryStore.filter(item => 
    item.category === category && 
    item.branch === alternateBranch && 
    item.status === 'available'
  );

  const altAvailableItems = altBranchItems.filter(item => {
    const bookingConflicts = bookingStore.filter(booking => 
      booking.assignedItemId === item.id &&
      (booking.status === 'confirmed' || booking.status === 'active') &&
      (isWithinInterval(startDate, { start: booking.startDate, end: booking.endDate }) ||
       isWithinInterval(endDate, { start: booking.startDate, end: booking.endDate }) ||
       isWithinInterval(booking.startDate, { start: startDate, end: endDate }))
    );

    const maintenanceConflicts = maintenanceStore.filter(maintenance =>
      maintenance.itemId === item.id &&
      (isWithinInterval(startDate, { start: maintenance.startDate, end: maintenance.endDate }) ||
       isWithinInterval(endDate, { start: maintenance.startDate, end: maintenance.endDate }) ||
       isWithinInterval(maintenance.startDate, { start: startDate, end: endDate }))
    );

    return bookingConflicts.length === 0 && maintenanceConflicts.length === 0;
  });

  if (altAvailableItems.length >= requestedQuantity) {
    return {
      available: true,
      availableItems: [],
      alternativeBranch: {
        branch: alternateBranch,
        availableItems: altAvailableItems.slice(0, requestedQuantity),
        deliveryFee: PRICING_CONFIG.deliveryFees.crossBranch
      },
      message: `Available from ${BRANCHES.find(b => b.id === alternateBranch)?.name} - delivery fee will apply`
    };
  }

  return {
    available: false,
    availableItems: [],
    message: "Currently Unavailable at both branches"
  };
};

// Calculate booking cost
export const calculateBookingCost = (
  category: string,
  startDate: Date,
  endDate: Date,
  crossBranchDelivery: boolean = false
) => {
  const days = differenceInDays(endDate, startDate) + 1;
  const dailyRate = PRICING_CONFIG.dailyRates[category as keyof typeof PRICING_CONFIG.dailyRates] || 30;
  const baseRate = dailyRate * days;
  
  const deliveryFee = crossBranchDelivery ? 
    PRICING_CONFIG.deliveryFees.crossBranch : 
    PRICING_CONFIG.deliveryFees.standard;
  
  const total = baseRate + deliveryFee;
  const deposit = Math.round(total * PRICING_CONFIG.depositPercentage);
  
  return {
    baseRate,
    deliveryFee,
    deposit,
    total,
    days
  };
};

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
  let assignedItem: InventoryItem;
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
    status: 'pending',
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

  bookingStore.push(booking);

  // Update item status
  const itemIndex = inventoryStore.findIndex(item => item.id === assignedItem.id);
  if (itemIndex !== -1) {
    inventoryStore[itemIndex].status = 'booked';
    inventoryStore[itemIndex].currentBooking = {
      customer: booking.customer,
      endDate: booking.endDate.toISOString().split('T')[0],
      bookingId: booking.id
    };
  }

  return booking;
};

// Booking management functions
export const getBookings = () => bookingStore;

export const getBookingById = (id: string) => 
  bookingStore.find(booking => booking.id === id);

export const updateBookingStatus = (id: string, status: BookingBlock['status']) => {
  const index = bookingStore.findIndex(booking => booking.id === id);
  if (index !== -1) {
    bookingStore[index].status = status;
    
    // Update item status when booking is returned/cancelled
    if (status === 'returned' || status === 'cancelled') {
      const itemIndex = inventoryStore.findIndex(item => 
        item.id === bookingStore[index].assignedItemId
      );
      if (itemIndex !== -1) {
        inventoryStore[itemIndex].status = 'available';
        inventoryStore[itemIndex].currentBooking = undefined;
      }
    }
  }
};

// Inventory management functions
export const getInventory = () => inventoryStore;

export const getInventoryByBranch = (branch: string) =>
  inventoryStore.filter(item => item.branch === branch);

export const getInventoryByCategory = (category: string) =>
  inventoryStore.filter(item => item.category === category);

export const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
  const newItem: InventoryItem = {
    ...item,
    id: `${item.category.toUpperCase().slice(0, 3)}${Date.now()}`
  };
  inventoryStore.push(newItem);
  return newItem;
};

export const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
  const index = inventoryStore.findIndex(item => item.id === id);
  if (index !== -1) {
    inventoryStore[index] = { ...inventoryStore[index], ...updates };
    return inventoryStore[index];
  }
  return null;
};

export const deleteInventoryItem = (id: string) => {
  // Check if item is currently booked
  const hasActiveBooking = bookingStore.some(booking =>
    booking.assignedItemId === id && 
    (booking.status === 'confirmed' || booking.status === 'active')
  );

  if (hasActiveBooking) {
    throw new Error("Cannot delete item with active bookings");
  }

  const index = inventoryStore.findIndex(item => item.id === id);
  if (index !== -1) {
    inventoryStore.splice(index, 1);
    return true;
  }
  return false;
};

// Maintenance block management
export const createMaintenanceBlock = (block: Omit<MaintenanceBlock, 'id' | 'createdAt'>) => {
  const maintenanceBlock: MaintenanceBlock = {
    ...block,
    id: `M${Date.now()}`,
    createdAt: new Date()
  };
  maintenanceStore.push(maintenanceBlock);

  // Update item status
  const itemIndex = inventoryStore.findIndex(item => item.id === block.itemId);
  if (itemIndex !== -1) {
    inventoryStore[itemIndex].status = 'maintenance';
    inventoryStore[itemIndex].notes = block.reason;
  }

  return maintenanceBlock;
};

export const getMaintenanceBlocks = () => maintenanceStore;

export const removeMaintenanceBlock = (id: string) => {
  const index = maintenanceStore.findIndex(block => block.id === id);
  if (index !== -1) {
    const block = maintenanceStore[index];
    maintenanceStore.splice(index, 1);

    // Update item status back to available
    const itemIndex = inventoryStore.findIndex(item => item.id === block.itemId);
    if (itemIndex !== -1) {
      inventoryStore[itemIndex].status = 'available';
      inventoryStore[itemIndex].notes = undefined;
    }
    return true;
  }
  return false;
};

// iCal generation
export const generateICalForItem = (itemId: string) => {
  const itemBookings = bookingStore.filter(booking => booking.assignedItemId === itemId);
  const item = inventoryStore.find(item => item.id === itemId);
  
  if (!item) return null;

  let icalContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Rent2Recover//Equipment Calendar//EN',
    `X-WR-CALNAME:${item.name} (${item.id}) - ${BRANCHES.find(b => b.id === item.branch)?.name}`,
    'X-WR-CALDESC:Booking calendar for medical equipment rental'
  ];

  itemBookings.forEach(booking => {
    const startDate = booking.startDate.toISOString().split('T')[0].replace(/-/g, '');
    const endDate = new Date(booking.endDate);
    endDate.setDate(endDate.getDate() + 1);
    const endDateStr = endDate.toISOString().split('T')[0].replace(/-/g, '');
    
    icalContent.push(
      'BEGIN:VEVENT',
      `UID:${booking.id}@rent2recover.com`,
      `DTSTART:${startDate}`,
      `DTEND:${endDateStr}`,
      `SUMMARY:Rental - ${booking.customer}`,
      `DESCRIPTION:Equipment: ${booking.equipmentName}\\nCustomer: ${booking.customer}\\nBranch: ${BRANCHES.find(b => b.id === booking.branch)?.name}\\nStatus: ${booking.status}`,
      `LOCATION:${BRANCHES.find(b => b.id === booking.branch)?.location}`,
      'END:VEVENT'
    );
  });

  icalContent.push('END:VCALENDAR');
  return icalContent.join('\r\n');
};

// Initialize mock data
initializeMockData();
