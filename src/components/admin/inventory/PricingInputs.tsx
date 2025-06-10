
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PricingInputsProps {
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  onDailyRateChange: (value: number) => void;
  onWeeklyRateChange: (value: number) => void;
  onMonthlyRateChange: (value: number) => void;
  isSaving: boolean;
  validationErrors?: Record<string, string>;
}

const PricingInputs = ({
  dailyRate,
  weeklyRate,
  monthlyRate,
  onDailyRateChange,
  onWeeklyRateChange,
  onMonthlyRateChange,
  isSaving,
  validationErrors = {}
}: PricingInputsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <Label htmlFor="dailyRate">Daily Rate (R)</Label>
        <Input
          id="dailyRate"
          type="number"
          value={dailyRate}
          onChange={(e) => onDailyRateChange(Number(e.target.value))}
          className={`text-center ${validationErrors.dailyRate ? 'border-red-500' : ''}`}
          disabled={isSaving}
          min="0"
          step="0.01"
        />
        {validationErrors.dailyRate && (
          <p className="text-xs text-red-600 mt-1">{validationErrors.dailyRate}</p>
        )}
      </div>
      <div>
        <Label htmlFor="weeklyRate">Weekly Rate (R)</Label>
        <Input
          id="weeklyRate"
          type="number"
          value={weeklyRate}
          onChange={(e) => onWeeklyRateChange(Number(e.target.value))}
          className={`text-center ${validationErrors.weeklyRate ? 'border-red-500' : ''}`}
          disabled={isSaving}
          min="0"
          step="0.01"
        />
        {validationErrors.weeklyRate && (
          <p className="text-xs text-red-600 mt-1">{validationErrors.weeklyRate}</p>
        )}
      </div>
      <div>
        <Label htmlFor="monthlyRate">Monthly Rate (R)</Label>
        <Input
          id="monthlyRate"
          type="number"
          value={monthlyRate}
          onChange={(e) => onMonthlyRateChange(Number(e.target.value))}
          className={`text-center ${validationErrors.monthlyRate ? 'border-red-500' : ''}`}
          disabled={isSaving}
          min="0"
          step="0.01"
        />
        {validationErrors.monthlyRate && (
          <p className="text-xs text-red-600 mt-1">{validationErrors.monthlyRate}</p>
        )}
      </div>
    </div>
  );
};

export default PricingInputs;
