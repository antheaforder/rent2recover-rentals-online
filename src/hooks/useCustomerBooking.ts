
import { useState } from "react";
import { EquipmentCategoryId, BranchId } from "@/config/equipmentCategories";

export interface BookingData {
  region: BranchId | null;
  equipmentType: EquipmentCategoryId | null;
  equipmentName: string;
  startDate: Date | null;
  endDate: Date | null;
  duration: number;
  availableLocally: boolean;
  requiresCrossBranchDelivery: boolean;
  customerDetails: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
  };
  pricing: {
    baseRate: number;
    deliveryFee: number;
    crossBranchFee: number;
    deposit: number;
    total: number;
  };
  bookingReference: string;
}

export const useCustomerBooking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  
  const [bookingData, setBookingData] = useState<BookingData>({
    region: null,
    equipmentType: null,
    equipmentName: "",
    startDate: null,
    endDate: null,
    duration: 0,
    availableLocally: true,
    requiresCrossBranchDelivery: false,
    customerDetails: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      notes: ""
    },
    pricing: {
      baseRate: 0,
      deliveryFee: 0,
      crossBranchFee: 0,
      deposit: 0,
      total: 0
    },
    bookingReference: ""
  });

  const updateBookingData = (updates: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetBooking = () => {
    setCurrentStep(1);
    setBookingData({
      region: null,
      equipmentType: null,
      equipmentName: "",
      startDate: null,
      endDate: null,
      duration: 0,
      availableLocally: true,
      requiresCrossBranchDelivery: false,
      customerDetails: {
        fullName: "",
        email: "",
        phone: "",
        address: "",
        notes: ""
      },
      pricing: {
        baseRate: 0,
        deliveryFee: 0,
        crossBranchFee: 0,
        deposit: 0,
        total: 0
      },
      bookingReference: ""
    });
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Choose Your Region";
      case 2: return "Select Equipment";
      case 3: return "Choose Dates";
      case 4: return "Your Details";
      case 5: return "Review & Confirm";
      case 6: return "Booking Confirmed";
      default: return "Book Equipment";
    }
  };

  return {
    currentStep,
    totalSteps,
    bookingData,
    updateBookingData,
    nextStep,
    prevStep,
    resetBooking,
    getStepTitle
  };
};
