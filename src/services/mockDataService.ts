
import { InventoryItem, BookingBlock, MaintenanceBlock, EquipmentCategory } from "@/config/equipmentCategories";

// Mock data stores
let inventoryStore: InventoryItem[] = [];
let bookingStore: BookingBlock[] = [];
let maintenanceStore: MaintenanceBlock[] = [];
let categoriesStore: EquipmentCategory[] = [];

// Initialize with sample data
export const initializeMockData = () => {
  // Initialize categories with default pricing
  categoriesStore = [
    {
      id: 'electric-hospital-beds',
      name: 'Electric Hospital Beds',
      color: 'bg-blue-500',
      pricing: { weeklyRate: 315, monthlyRate: 1200 },
      delivery: { baseFee: 50, crossBranchSurcharge: 150 },
      inventory: { hilton: 2, johannesburg: 1 }
    },
    {
      id: 'wheelchairs',
      name: 'Wheelchairs',
      color: 'bg-purple-500',
      pricing: { weeklyRate: 175, monthlyRate: 650 },
      delivery: { baseFee: 50, crossBranchSurcharge: 150 },
      inventory: { hilton: 1, johannesburg: 1 }
    },
    {
      id: 'mobility-scooters',
      name: 'Mobility Scooters',
      color: 'bg-yellow-500',
      pricing: { weeklyRate: 245, monthlyRate: 900 },
      delivery: { baseFee: 50, crossBranchSurcharge: 150 },
      inventory: { hilton: 1, johannesburg: 1 }
    }
  ];

  inventoryStore = [
    // Electric Hospital Beds
    { id: "EHB001", name: "ElectricHospitalBeds Hilton 1", category: "electric-hospital-beds", status: "available", branch: "hilton", serialNumber: "EHB-2024-001", lastChecked: "2024-01-15", condition: "excellent" },
    { id: "EHB002", name: "ElectricHospitalBeds Hilton 2", category: "electric-hospital-beds", status: "available", branch: "hilton", serialNumber: "EHB-2024-002", lastChecked: "2024-01-10", condition: "good" },
    { id: "EHB003", name: "ElectricHospitalBeds Joburg 1", category: "electric-hospital-beds", status: "available", branch: "johannesburg", serialNumber: "EHB-2024-003", lastChecked: "2024-01-12", condition: "excellent" },
    
    // Wheelchairs
    { id: "WC001", name: "Wheelchairs Hilton 1", category: "wheelchairs", status: "available", branch: "hilton", serialNumber: "WC-2024-001", lastChecked: "2024-01-15", condition: "excellent" },
    { id: "WC002", name: "Wheelchairs Joburg 1", category: "wheelchairs", status: "available", branch: "johannesburg", serialNumber: "WC-2024-002", lastChecked: "2024-01-10", condition: "good" },
    
    // Mobility Scooters
    { id: "MS001", name: "MobilityScooters Hilton 1", category: "mobility-scooters", status: "available", branch: "hilton", serialNumber: "MS-2024-001", lastChecked: "2024-01-13", condition: "excellent" },
    { id: "MS002", name: "MobilityScooters Joburg 1", category: "mobility-scooters", status: "available", branch: "johannesburg", serialNumber: "MS-2024-002", lastChecked: "2024-01-11", condition: "good" }
  ];

  bookingStore = [];
  maintenanceStore = [];
};

// Data store getters and setters
export const getInventoryStore = () => inventoryStore;
export const setInventoryStore = (inventory: InventoryItem[]) => { inventoryStore = inventory; };

export const getBookingStore = () => bookingStore;
export const setBookingStore = (bookings: BookingBlock[]) => { bookingStore = bookings; };

export const getMaintenanceStore = () => maintenanceStore;
export const setMaintenanceStore = (maintenance: MaintenanceBlock[]) => { maintenanceStore = maintenance; };

export const getCategoriesStore = () => categoriesStore;
export const setCategoriesStore = (categories: EquipmentCategory[]) => { categoriesStore = categories; };

// Initialize on module load
initializeMockData();
