
import { useBookingWorkflow } from "@/hooks/useBookingWorkflow";
import BookingStepRenderer from "@/components/booking/BookingStepRenderer";

const BookingWorkflow = () => {
  const {
    currentStep,
    bookingData,
    updateBookingData,
    nextStep,
    prevStep,
    goToStep,
    navigate
  } = useBookingWorkflow();

  return (
    <div className="min-h-screen bg-gray-50">
      <BookingStepRenderer
        currentStep={currentStep}
        bookingData={bookingData}
        updateBookingData={updateBookingData}
        nextStep={nextStep}
        prevStep={prevStep}
        goToStep={goToStep}
        navigate={navigate}
      />
    </div>
  );
};

export default BookingWorkflow;
