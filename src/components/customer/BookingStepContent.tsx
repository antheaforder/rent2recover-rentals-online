
import RegionSelection from "@/components/customer/RegionSelection";
import EquipmentSelection from "@/components/customer/EquipmentSelection";
import DateRangeSelection from "@/components/customer/DateRangeSelection";
import CustomerDetailsForm from "@/components/customer/CustomerDetailsForm";
import QuoteConfirmation from "@/components/customer/QuoteConfirmation";
import BookingConfirmation from "@/components/customer/BookingConfirmation";
import { BookingData } from "@/hooks/useCustomerBooking";
import { useNavigate } from "react-router-dom";

interface BookingStepContentProps {
  currentStep: number;
  bookingData: BookingData;
  updateBookingData: (updates: Partial<BookingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetBooking: () => void;
}

const BookingStepContent = ({
  currentStep,
  bookingData,
  updateBookingData,
  nextStep,
  prevStep,
  resetBooking
}: BookingStepContentProps) => {
  const navigate = useNavigate();

  switch (currentStep) {
    case 1:
      return (
        <RegionSelection
          selectedRegion={bookingData.region}
          onRegionSelect={(region) => updateBookingData({ region })}
          onNext={nextStep}
        />
      );

    case 2:
      return (
        <EquipmentSelection
          selectedType={bookingData.equipmentType}
          onEquipmentSelect={(equipmentType, equipmentName) => 
            updateBookingData({ equipmentType, equipmentName })
          }
          onNext={nextStep}
          onBack={prevStep}
        />
      );

    case 3:
      return (
        <DateRangeSelection
          startDate={bookingData.startDate}
          endDate={bookingData.endDate}
          region={bookingData.region}
          equipmentType={bookingData.equipmentType}
          onDatesSelect={(startDate, endDate, duration, availableLocally, requiresCrossBranchDelivery) =>
            updateBookingData({ 
              startDate, 
              endDate, 
              duration, 
              availableLocally, 
              requiresCrossBranchDelivery 
            })
          }
          onNext={nextStep}
          onBack={prevStep}
        />
      );

    case 4:
      return (
        <CustomerDetailsForm
          customerDetails={bookingData.customerDetails}
          onDetailsSubmit={(customerDetails) => updateBookingData({ customerDetails })}
          onNext={nextStep}
          onBack={prevStep}
        />
      );

    case 5:
      return (
        <QuoteConfirmation
          bookingData={bookingData}
          onConfirm={(pricing, bookingReference) => {
            updateBookingData({ pricing, bookingReference });
            nextStep();
          }}
          onBack={prevStep}
        />
      );

    case 6:
      return (
        <BookingConfirmation
          bookingData={bookingData}
          onNewBooking={resetBooking}
          onHome={() => navigate('/')}
        />
      );

    default:
      return null;
  }
};

export default BookingStepContent;
