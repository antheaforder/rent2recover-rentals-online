
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BranchSelection from "@/components/booking/BranchSelection";
import EquipmentTypeSelection from "@/components/booking/EquipmentTypeSelection";
import DateSelection from "@/components/booking/DateSelection";
import AvailabilityCheck from "@/components/booking/AvailabilityCheck";
import QuoteDisplay from "@/components/booking/QuoteDisplay";
import CustomerInfo from "@/components/booking/CustomerInfo";
import QuoteSubmitted from "@/components/booking/QuoteSubmitted";
import PaymentPending from "@/components/booking/PaymentPending";
import BookingConfirmed from "@/components/booking/BookingConfirmed";
import DeliveryComplete from "@/components/booking/DeliveryComplete";
import ExtensionOffer from "@/components/booking/ExtensionOffer";
import ReturnReminder from "@/components/booking/ReturnReminder";
import ReturnComplete from "@/components/booking/ReturnComplete";

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

const BookingWorkflow = () => {
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BranchSelection
            selectedBranch={bookingData.branch}
            onBranchSelect={(branch) => updateBookingData({ branch })}
            onNext={nextStep}
            onBack={() => navigate('/')}
          />
        );
      case 2:
        return (
          <EquipmentTypeSelection
            selectedType={bookingData.equipmentType}
            onTypeSelect={(type, name, weeklyRate, monthlyRate) => 
              updateBookingData({ 
                equipmentType: type, 
                equipmentName: name,
                weeklyRate,
                monthlyRate 
              })
            }
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <DateSelection
            startDate={bookingData.startDate}
            endDate={bookingData.endDate}
            onDatesSelect={(startDate, endDate, duration) => 
              updateBookingData({ startDate, endDate, duration })
            }
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <AvailabilityCheck
            bookingData={bookingData}
            onAvailable={nextStep}
            onAlternative={(altBranch, deliveryFee) => {
              updateBookingData({ 
                alternativeBranch: altBranch, 
                requiresDelivery: true,
                deliveryFee 
              });
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <QuoteDisplay
            bookingData={bookingData}
            onQuoteAccept={(totalCost, deposit) => {
              updateBookingData({ totalCost, deposit });
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      case 6:
        return (
          <CustomerInfo
            customerInfo={bookingData.customerInfo}
            onInfoSubmit={(customerInfo) => {
              updateBookingData({ customerInfo });
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      case 7:
        return (
          <QuoteSubmitted
            bookingData={bookingData}
            onQuoteAccepted={() => {
              updateBookingData({ quoteId: `Q${Date.now()}` });
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      case 8:
        return (
          <PaymentPending
            bookingData={bookingData}
            onPaymentComplete={() => {
              updateBookingData({ 
                paymentStatus: 'paid',
                bookingId: `B${Date.now()}`,
                deliveryStatus: 'dispatched'
              });
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      case 9:
        return (
          <BookingConfirmed
            bookingData={bookingData}
            onDeliveryDispatched={() => nextStep()}
            onBack={() => navigate('/customer')}
          />
        );
      case 10:
        return (
          <DeliveryComplete
            bookingData={bookingData}
            onDeliveryConfirmed={() => {
              updateBookingData({ deliveryStatus: 'completed' });
              // Skip to step 12 for extension offer near end date
              goToStep(12);
            }}
            onBack={() => navigate('/customer')}
          />
        );
      case 12:
        return (
          <ExtensionOffer
            bookingData={bookingData}
            onExtend={(newEndDate) => {
              updateBookingData({ 
                endDate: newEndDate,
                returnStatus: 'extended'
              });
              goToStep(10); // Back to delivery complete for extended period
            }}
            onDecline={() => nextStep()}
            onBack={() => navigate('/customer')}
          />
        );
      case 13:
        return (
          <ReturnReminder
            bookingData={bookingData}
            onReturnScheduled={() => nextStep()}
            onExtendRequest={() => goToStep(12)}
            onBack={() => navigate('/customer')}
          />
        );
      case 14:
        return (
          <ReturnComplete
            bookingData={bookingData}
            onReturnConfirmed={() => {
              updateBookingData({ returnStatus: 'returned' });
              navigate('/customer');
            }}
            onBack={() => navigate('/customer')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderStep()}
    </div>
  );
};

export default BookingWorkflow;
