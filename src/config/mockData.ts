
import { InventoryItem, BookingBlock } from "./equipmentCategories";

export const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: "bed-001",
    name: "Electric Hospital Bed #001",
    category: "electric-hospital-beds",
    status: "available",
    branch: "hilton",
    serialNumber: "EHB-001",
    lastChecked: "2024-06-01",
    condition: "excellent",
    purchaseDate: "2023-01-15"
  },
  {
    id: "bed-002", 
    name: "Electric Hospital Bed #002",
    category: "electric-hospital-beds",
    status: "booked",
    branch: "hilton",
    serialNumber: "EHB-002",
    lastChecked: "2024-06-01",
    condition: "good",
    purchaseDate: "2023-02-10"
  },
  {
    id: "wheelchair-001",
    name: "Electric Wheelchair #001",
    category: "electric-wheelchairs",
    status: "available",
    branch: "johannesburg",
    serialNumber: "EWC-001",
    lastChecked: "2024-06-01",
    condition: "excellent",
    purchaseDate: "2023-03-20"
  }
];

export const MOCK_BOOKINGS: BookingBlock[] = [
  {
    id: "booking-001",
    equipmentId: "bed-001",
    equipmentName: "Electric Hospital Bed #001",
    equipmentCategory: "electric-hospital-beds",
    customer: "John Smith",
    customerEmail: "john@example.com",
    customerPhone: "+27123456789",
    startDate: new Date(2024, 5, 10),
    endDate: new Date(2024, 5, 17),
    status: "confirmed",
    branch: "hilton",
    assignedItemId: "bed-001",
    deliveryRequired: true,
    crossBranchBooking: false,
    totalCost: 315,
    deposit: 94.5,
    createdBy: "customer",
    createdAt: new Date(2024, 5, 5),
    notes: "Needs delivery to home address"
  },
  {
    id: "booking-002",
    equipmentId: "wheelchair-001",
    equipmentName: "Electric Wheelchair #001", 
    equipmentCategory: "electric-wheelchairs",
    customer: "Mary Johnson",
    customerEmail: "mary@example.com",
    customerPhone: "+27987654321",
    startDate: new Date(2024, 5, 8),
    endDate: new Date(2024, 5, 15),
    status: "active",
    branch: "johannesburg",
    assignedItemId: "wheelchair-001",
    deliveryRequired: false,
    crossBranchBooking: false,
    totalCost: 280,
    deposit: 84,
    createdBy: "admin",
    createdAt: new Date(2024, 5, 3)
  }
];
