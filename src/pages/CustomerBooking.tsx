
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle } from "lucide-react";
import RegionSelection from "@/components/customer/RegionSelection";
import EquipmentSelection from "@/components/customer/EquipmentSelection";
import DateRangeSelection from "@/components/customer/DateRangeSelection";
import CustomerDetailsForm from "@/components/customer/CustomerDetailsForm";
import QuoteConfirmation from "@/components/customer/QuoteConfirmation";
import BookingConfirmation from "@/components/customer/BookingConfirmation";
import { EquipmentCategoryId, BranchId } from "@/config/equipmentCategories";

interface BookingData {
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

const CustomerBooking = () => {
  const navigate = useNavigate();
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

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{getStepTitle()}</h1>
              <p className="text-gray-600">Rent2Recover Medical Equipment</p>
            </div>
            {currentStep < totalSteps && (
              <div className="text-sm text-gray-600">
                Step {currentStep} of {totalSteps}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {currentStep < totalSteps && (
        <div className="container mx-auto px-4 py-4">
          <Progress value={progress} className="w-full max-w-2xl mx-auto" />
        </div>
      )}

      {/* Step Content */}
      <div className="container mx-auto px-4 py-8">
        {currentStep === 1 && (
          <RegionSelection
            selectedRegion={bookingData.region}
            onRegionSelect={(region) => updateBookingData({ region })}
            onNext={nextStep}
          />
        )}

        {currentStep === 2 && (
          <EquipmentSelection
            selectedType={bookingData.equipmentType}
            onEquipmentSelect={(equipmentType, equipmentName) => 
              updateBookingData({ equipmentType, equipmentName })
            }
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {currentStep === 3 && (
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
        )}

        {currentStep === 4 && (
          <CustomerDetailsForm
            customerDetails={bookingData.customerDetails}
            onDetailsSubmit={(customerDetails) => updateBookingData({ customerDetails })}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {currentStep === 5 && (
          <QuoteConfirmation
            bookingData={bookingData}
            onConfirm={(pricing, bookingReference) => {
              updateBookingData({ pricing, bookingReference });
              nextStep();
            }}
            onBack={prevStep}
          />
        )}

        {currentStep === 6 && (
          <BookingConfirmation
            bookingData={bookingData}
            onNewBooking={() => {
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
            }}
            onHome={() => navigate('/')}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerBooking;
