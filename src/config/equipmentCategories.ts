
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
  { id: 'super-admin', name: 'Super Admin', permissions: ['view-all', 'edit-all', 'manage-users'] },
  { id: 'branch-manager', name: 'Branch Manager', permissions: ['view-branch', 'edit-branch'] },
  { id: 'read-only', name: 'Read Only', permissions: ['view-branch'] }
] as const;

export type UserRole = typeof USER_ROLES[number]['id'];

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
  startDate: Date;
  endDate: Date;
  status: 'confirmed' | 'pending' | 'delivered' | 'overdue' | 'maintenance';
  branch: BranchId;
  assignedItemId: string;
  deliveryRequired: boolean;
  crossBranchBooking: boolean;
  deliveryFee?: number;
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
