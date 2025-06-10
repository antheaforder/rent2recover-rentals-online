
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DeliveryInputsProps {
  baseFee: number;
  crossBranchSurcharge: number;
  onBaseFeeChange: (value: number) => void;
  onCrossBranchSurchargeChange: (value: number) => void;
  isSaving: boolean;
  validationErrors?: Record<string, string>;
}

const DeliveryInputs = ({
  baseFee,
  crossBranchSurcharge,
  onBaseFeeChange,
  onCrossBranchSurchargeChange,
  isSaving,
  validationErrors = {}
}: DeliveryInputsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="baseFee">Base Delivery Fee (R)</Label>
        <Input
          id="baseFee"
          type="number"
          value={baseFee}
          onChange={(e) => onBaseFeeChange(Number(e.target.value))}
          className={`text-center ${validationErrors.baseFee ? 'border-red-500' : ''}`}
          disabled={isSaving}
          min="0"
          step="0.01"
        />
        {validationErrors.baseFee && (
          <p className="text-xs text-red-600 mt-1">{validationErrors.baseFee}</p>
        )}
      </div>
      <div>
        <Label htmlFor="crossBranchSurcharge">Cross-Branch Surcharge (R)</Label>
        <Input
          id="crossBranchSurcharge"
          type="number"
          value={crossBranchSurcharge}
          onChange={(e) => onCrossBranchSurchargeChange(Number(e.target.value))}
          className={`text-center ${validationErrors.crossBranchSurcharge ? 'border-red-500' : ''}`}
          disabled={isSaving}
          min="0"
          step="0.01"
        />
        {validationErrors.crossBranchSurcharge && (
          <p className="text-xs text-red-600 mt-1">{validationErrors.crossBranchSurcharge}</p>
        )}
      </div>
    </div>
  );
};

export default DeliveryInputs;
