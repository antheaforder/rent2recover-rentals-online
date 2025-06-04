
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export interface BookingData {
  branch: string;
  equipmentType: string;
  equipmentName: string;
  startDate: Date | null;
  endDate: Date | null;
  alternativeBranch?: string;
  requiresDelivery: boolean;
  weeklyRate: number;
  monthlyRate: number;
  duration: number;
  totalCost: number;
  deliveryFee: number;
  deposit: number;
  customerInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    deliveryAddress: string;
    specialInstructions: string;
  };
  quoteId?: string;
  bookingId?: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  deliveryStatus: 'pending' | 'dispatched' | 'delivered' | 'completed';
  returnStatus: 'pending' | 'extended' | 'returned' | 'overdue';
}

export const useBookingWorkflow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    branch: '',
    equipmentType: '',
    equipmentName: '',
    startDate: null,
    endDate: null,
    requiresDelivery: false,
    weeklyRate: 0,
    monthlyRate: 0,
    duration: 0,
    totalCost: 0,
    deliveryFee: 0,
    deposit: 0,
    customerInfo: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      deliveryAddress: '',
      specialInstructions: ''
    },
    paymentStatus: 'pending',
    deliveryStatus: 'pending',
    returnStatus: 'pending'
  });

  const updateBookingData = (updates: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);
  const goToStep = (step: number) => setCurrentStep(step);

  return {
    currentStep,
    bookingData,
    updateBookingData,
    nextStep,
    prevStep,
    goToStep,
    navigate
  };
};
