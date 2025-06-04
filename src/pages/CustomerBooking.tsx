
import BookingHeader from "@/components/customer/BookingHeader";
import BookingStepContent from "@/components/customer/BookingStepContent";
import { useCustomerBooking } from "@/hooks/useCustomerBooking";

const CustomerBooking = () => {
  const {
    currentStep,
    totalSteps,
    bookingData,
    updateBookingData,
    nextStep,
    prevStep,
    resetBooking,
    getStepTitle
  } = useCustomerBooking();

  return (
    <div className="min-h-screen bg-gray-50">
      <BookingHeader 
        stepTitle={getStepTitle()}
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <div className="container mx-auto px-4 py-8">
        <BookingStepContent
          currentStep={currentStep}
          bookingData={bookingData}
          updateBookingData={updateBookingData}
          nextStep={nextStep}
          prevStep={prevStep}
          resetBooking={resetBooking}
        />
      </div>
    </div>
  );
};

export default CustomerBooking;
