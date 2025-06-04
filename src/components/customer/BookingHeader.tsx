
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BookingHeaderProps {
  stepTitle: string;
  currentStep: number;
  totalSteps: number;
}

const BookingHeader = ({ stepTitle, currentStep, totalSteps }: BookingHeaderProps) => {
  const navigate = useNavigate();
  const progress = (currentStep / totalSteps) * 100;

  return (
    <>
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
              <h1 className="text-2xl font-bold text-gray-900">{stepTitle}</h1>
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
    </>
  );
};

export default BookingHeader;
