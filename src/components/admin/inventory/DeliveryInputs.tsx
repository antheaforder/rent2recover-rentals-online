
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DeliveryInputsProps {
  baseFee: number;
  crossBranchSurcharge: number;
  onBaseFeeChange: (value: number) => void;
  onCrossBranchSurchargeChange: (value: number) => void;
  isSaving: boolean;
}

const DeliveryInputs = ({
  baseFee,
  crossBranchSurcharge,
  onBaseFeeChange,
  onCrossBranchSurchargeChange,
  isSaving
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
          className="text-center"
          disabled={isSaving}
        />
      </div>
      <div>
        <Label htmlFor="crossBranchSurcharge">Cross-Branch Surcharge (R)</Label>
        <Input
          id="crossBranchSurcharge"
          type="number"
          value={crossBranchSurcharge}
          onChange={(e) => onCrossBranchSurchargeChange(Number(e.target.value))}
          className="text-center"
          disabled={isSaving}
        />
      </div>
    </div>
  );
};

export default DeliveryInputs;
