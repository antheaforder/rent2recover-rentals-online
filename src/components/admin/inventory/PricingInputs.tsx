
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
}

const PricingInputs = ({
  dailyRate,
  weeklyRate,
  monthlyRate,
  onDailyRateChange,
  onWeeklyRateChange,
  onMonthlyRateChange,
  isSaving
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
          className="text-center"
          disabled={isSaving}
        />
      </div>
      <div>
        <Label htmlFor="weeklyRate">Weekly Rate (R)</Label>
        <Input
          id="weeklyRate"
          type="number"
          value={weeklyRate}
          onChange={(e) => onWeeklyRateChange(Number(e.target.value))}
          className="text-center"
          disabled={isSaving}
        />
      </div>
      <div>
        <Label htmlFor="monthlyRate">Monthly Rate (R)</Label>
        <Input
          id="monthlyRate"
          type="number"
          value={monthlyRate}
          onChange={(e) => onMonthlyRateChange(Number(e.target.value))}
          className="text-center"
          disabled={isSaving}
        />
      </div>
    </div>
  );
};

export default PricingInputs;
