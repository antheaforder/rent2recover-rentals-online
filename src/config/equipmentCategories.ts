
export const EQUIPMENT_CATEGORIES = [
  { id: 'wheelchairs', name: 'Wheelchairs', color: 'bg-blue-500' },
  { id: 'mobility-scooters', name: 'Mobility Scooters', color: 'bg-green-500' },
  { id: 'hospital-beds', name: 'Hospital Beds', color: 'bg-purple-500' },
  { id: 'walking-aids', name: 'Walking Aids', color: 'bg-yellow-500' },
  { id: 'bathroom-aids', name: 'Bathroom Aids', color: 'bg-pink-500' },
  { id: 'lifting-equipment', name: 'Lifting Equipment', color: 'bg-red-500' },
  { id: 'pressure-care', name: 'Pressure Care', color: 'bg-indigo-500' },
  { id: 'rehabilitation', name: 'Rehabilitation Equipment', color: 'bg-teal-500' },
  { id: 'respiratory', name: 'Respiratory Equipment', color: 'bg-orange-500' },
  { id: 'monitoring', name: 'Monitoring Devices', color: 'bg-cyan-500' },
  { id: 'communication', name: 'Communication Aids', color: 'bg-lime-500' },
  { id: 'daily-living', name: 'Daily Living Aids', color: 'bg-amber-500' },
  { id: 'pediatric', name: 'Pediatric Equipment', color: 'bg-rose-500' }
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
