
export const EQUIPMENT_CATEGORIES = [
  { id: 'electric-hospital-beds', name: 'Electric Hospital Beds', color: 'bg-blue-500' },
  { id: 'electric-wheelchairs', name: 'Electric Wheelchairs', color: 'bg-green-500' },
  { id: 'wheelchairs', name: 'Wheelchairs', color: 'bg-purple-500' },
  { id: 'mobility-scooters', name: 'Mobility Scooters', color: 'bg-yellow-500' },
  { id: 'commodes', name: 'Commodes – Mobile Toilets', color: 'bg-pink-500' },
  { id: 'electric-bath-lifts', name: 'Electric Bath Lifts', color: 'bg-red-500' },
  { id: 'swivel-bath-chairs', name: 'Swivel Bath Chairs', color: 'bg-indigo-500' },
  { id: 'knee-scooters', name: 'Knee Scooters', color: 'bg-teal-500' },
  { id: 'rollators', name: 'Rollators', color: 'bg-orange-500' },
  { id: 'walker-frames', name: 'Walker (Zimmer) Frames', color: 'bg-cyan-500' },
  { id: 'wheelchair-ramps', name: 'Wheelchair Ramps', color: 'bg-lime-500' },
  { id: 'hoists', name: 'Hoists', color: 'bg-amber-500' },
  { id: 'oxygen-concentrators', name: 'Oxygen Concentrator Machines', color: 'bg-rose-500' }
] as const;

export type EquipmentCategoryId = typeof EQUIPMENT_CATEGORIES[number]['id'];

export const BRANCHES = [
  { id: 'hilton', name: 'Hilton Branch', location: 'Hilton, KZN' },
  { id: 'johannesburg', name: 'Johannesburg Branch', location: 'Johannesburg, GP' }
] as const;

export type BranchId = typeof BRANCHES[number]['id'];

export const USER_ROLES = [
  { id: 'super-admin', name: 'Super Admin', permissions: ['view-all', 'edit-all', 'manage-users', 'create-bookings', 'manage-inventory'] }
] as const;

export type UserRole = typeof USER_ROLES[number]['id'];

// Enhanced Equipment Category with pricing and management
export interface EquipmentCategory {
  id: EquipmentCategoryId;
  name: string;
  color: string;
  pricing: {
    weeklyRate: number;
    monthlyRate: number;
  };
  delivery: {
    baseFee: number;
    crossBranchSurcharge: number;
  };
  inventory: {
    hilton: number;
    johannesburg: number;
  };
}

// Enhanced inventory and booking types
export interface InventoryItem {
  id: string;
  name: string;
  category: EquipmentCategoryId;
  status: 'available' | 'booked' | 'maintenance' | 'transfer';
  branch: BranchId;
  serialNumber: string;
  lastChecked: string;
  condition: 'excellent' | 'good' | 'fair' | 'needs-repair';
  purchaseDate?: string;
  notes?: string;
  currentBooking?: {
    customer: string;
    endDate: string;
    bookingId: string;
  };
}

export interface BookingBlock {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentCategory: EquipmentCategoryId;
  customer: string;
  customerEmail: string;
  customerPhone: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'confirmed' | 'active' | 'returned' | 'cancelled' | 'overdue';
  branch: BranchId;
  assignedItemId: string;
  deliveryRequired: boolean;
  crossBranchBooking: boolean;
  deliveryFee?: number;
  totalCost: number;
  deposit: number;
  createdBy: 'customer' | 'admin';
  createdAt: Date;
  notes?: string;
}

export interface CreateBookingRequest {
  category: EquipmentCategoryId;
  branch: BranchId;
  startDate: Date;
  endDate: Date;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  notes?: string;
  createdBy: 'customer' | 'admin';
}

export interface AvailabilityCheck {
  category: EquipmentCategoryId;
  branch: BranchId;
  startDate: Date;
  endDate: Date;
  requestedQuantity: number;
}

export interface AvailabilityResult {
  available: boolean;
  availableItems: InventoryItem[];
  alternativeBranch?: {
    branch: BranchId;
    availableItems: InventoryItem[];
    deliveryFee: number;
  };
  message: string;
}

export interface MaintenanceBlock {
  id: string;
  itemId: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  createdBy: string;
  createdAt: Date;
}

// Pricing configuration - now moved to be managed per category
export const PRICING_CONFIG = {
  deliveryFees: {
    standard: 50, // R50 for local delivery
    crossBranch: 150 // R150 for cross-branch delivery
  },
  depositPercentage: 0.3, // 30% deposit
  dailyRates: {
    'electric-hospital-beds': 45,
    'electric-wheelchairs': 40,
    'wheelchairs': 25,
    'mobility-scooters': 35,
    'commodes': 20,
    'electric-bath-lifts': 50,
    'swivel-bath-chairs': 30,
    'knee-scooters': 25,
    'rollators': 20,
    'walker-frames': 15,
    'wheelchair-ramps': 40,
    'hoists': 60,
    'oxygen-concentrators': 55
  } as Record<EquipmentCategoryId, number>
};
