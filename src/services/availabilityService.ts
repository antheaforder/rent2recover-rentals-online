
import { AvailabilityCheck, AvailabilityResult, BRANCHES, PRICING_CONFIG } from "@/config/equipmentCategories";
import { getInventoryStore, getBookingStore, getMaintenanceStore } from "./mockDataService";
import { isWithinInterval, differenceInDays } from "date-fns";

// Availability checking logic
export const checkAvailability = (request: AvailabilityCheck): AvailabilityResult => {
  const { category, branch: requestedBranch, startDate, endDate, requestedQuantity } = request;
  const inventory = getInventoryStore();
  const bookings = getBookingStore();
  const maintenance = getMaintenanceStore();
  
  // Get all items in the category for the requested branch
  const branchItems = inventory.filter(item => 
    item.category === category && 
    item.branch === requestedBranch && 
    item.status === 'available'
  );

  // Check for conflicts with existing bookings and maintenance
  const availableItems = branchItems.filter(item => {
    const bookingConflicts = bookings.filter(booking => 
      booking.assignedItemId === item.id &&
      (booking.status === 'confirmed' || booking.status === 'active') &&
      (isWithinInterval(startDate, { start: booking.startDate, end: booking.endDate }) ||
       isWithinInterval(endDate, { start: booking.startDate, end: booking.endDate }) ||
       isWithinInterval(booking.startDate, { start: startDate, end: endDate }))
    );

    const maintenanceConflicts = maintenance.filter(maintenanceBlock =>
      maintenanceBlock.itemId === item.id &&
      (isWithinInterval(startDate, { start: maintenanceBlock.startDate, end: maintenanceBlock.endDate }) ||
       isWithinInterval(endDate, { start: maintenanceBlock.startDate, end: maintenanceBlock.endDate }) ||
       isWithinInterval(maintenanceBlock.startDate, { start: startDate, end: endDate }))
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
  const altBranchItems = inventory.filter(item => 
    item.category === category && 
    item.branch === alternateBranch && 
    item.status === 'available'
  );

  const altAvailableItems = altBranchItems.filter(item => {
    const bookingConflicts = bookings.filter(booking => 
      booking.assignedItemId === item.id &&
      (booking.status === 'confirmed' || booking.status === 'active') &&
      (isWithinInterval(startDate, { start: booking.startDate, end: booking.endDate }) ||
       isWithinInterval(endDate, { start: booking.startDate, end: booking.endDate }) ||
       isWithinInterval(booking.startDate, { start: startDate, end: endDate }))
    );

    const maintenanceConflicts = maintenance.filter(maintenanceBlock =>
      maintenanceBlock.itemId === item.id &&
      (isWithinInterval(startDate, { start: maintenanceBlock.startDate, end: maintenanceBlock.endDate }) ||
       isWithinInterval(endDate, { start: maintenanceBlock.startDate, end: maintenanceBlock.endDate }) ||
       isWithinInterval(maintenanceBlock.startDate, { start: startDate, end: endDate }))
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
