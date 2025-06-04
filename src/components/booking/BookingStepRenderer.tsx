
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
import { BookingData } from "@/hooks/useBookingWorkflow";

interface BookingStepRendererProps {
  currentStep: number;
  bookingData: BookingData;
  updateBookingData: (updates: Partial<BookingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  navigate: (path: string) => void;
}

const BookingStepRenderer = ({
  currentStep,
  bookingData,
  updateBookingData,
  nextStep,
  prevStep,
  goToStep,
  navigate
}: BookingStepRendererProps) => {
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
            goToStep(10);
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

export default BookingStepRenderer;
