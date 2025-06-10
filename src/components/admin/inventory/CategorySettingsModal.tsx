
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EQUIPMENT_CATEGORIES, type EquipmentCategoryId } from "@/config/equipmentCategories";
import { getEquipmentCategories, updateCategoryPricing } from "@/services/categoryService";
import { useToast } from "@/hooks/use-toast";

interface CategorySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: EquipmentCategoryId | null;
  onUpdate: (categoryId: EquipmentCategoryId, pricing: any) => void;
}

const CategorySettingsModal = ({
  isOpen,
  onClose,
  category,
  onUpdate
}: CategorySettingsModalProps) => {
  const [weeklyRate, setWeeklyRate] = useState(0);
  const [monthlyRate, setMonthlyRate] = useState(0);
  const [dailyRate, setDailyRate] = useState(0);
  const [baseFee, setBaseFee] = useState(50);
  const [crossBranchSurcharge, setCrossBranchSurcharge] = useState(150);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const categoryInfo = EQUIPMENT_CATEGORIES.find(cat => cat.id === category);
  const categories = getEquipmentCategories();
  const currentCategory = categories.find(c => c.id === category);

  useEffect(() => {
    if (currentCategory) {
      setDailyRate(currentCategory.pricing.dailyRate || 0);
      setWeeklyRate(currentCategory.pricing.weeklyRate || 0);
      setMonthlyRate(currentCategory.pricing.monthlyRate || 0);
      setBaseFee(currentCategory.delivery.baseFee || 50);
      setCrossBranchSurcharge(currentCategory.delivery.crossBranchSurcharge || 150);
    }
  }, [currentCategory]);

  const autoSave = async (updates: any) => {
    if (!category) return;
    
    setIsLoading(true);
    try {
      await updateCategoryPricing(category, updates);
      onUpdate(category, updates);
      toast({
        title: "Settings Auto-Saved",
        description: "Category pricing has been updated"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handleDailyRateChange = (value: number) => {
    setDailyRate(value);
    autoSave({
      pricing: { dailyRate: value, weeklyRate, monthlyRate },
      delivery: { baseFee, crossBranchSurcharge }
    });
  };

  const handleWeeklyRateChange = (value: number) => {
    setWeeklyRate(value);
    autoSave({
      pricing: { dailyRate, weeklyRate: value, monthlyRate },
      delivery: { baseFee, crossBranchSurcharge }
    });
  };

  const handleMonthlyRateChange = (value: number) => {
    setMonthlyRate(value);
    autoSave({
      pricing: { dailyRate, weeklyRate, monthlyRate: value },
      delivery: { baseFee, crossBranchSurcharge }
    });
  };

  const handleBaseFeeChange = (value: number) => {
    setBaseFee(value);
    autoSave({
      pricing: { dailyRate, weeklyRate, monthlyRate },
      delivery: { baseFee: value, crossBranchSurcharge }
    });
  };

  const handleCrossBranchSurchargeChange = (value: number) => {
    setCrossBranchSurcharge(value);
    autoSave({
      pricing: { dailyRate, weeklyRate, monthlyRate },
      delivery: { baseFee, crossBranchSurcharge: value }
    });
  };

  if (!category || !categoryInfo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Category Settings</DialogTitle>
          <DialogDescription>
            Configure pricing and delivery settings for {categoryInfo.name}
            {isLoading && <span className="text-blue-600"> • Auto-saving...</span>}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="dailyRate">Daily Rate (R)</Label>
              <Input
                id="dailyRate"
                type="number"
                value={dailyRate}
                onChange={(e) => handleDailyRateChange(Number(e.target.value))}
                onBlur={(e) => handleDailyRateChange(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="weeklyRate">Weekly Rate (R)</Label>
              <Input
                id="weeklyRate"
                type="number"
                value={weeklyRate}
                onChange={(e) => handleWeeklyRateChange(Number(e.target.value))}
                onBlur={(e) => handleWeeklyRateChange(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="monthlyRate">Monthly Rate (R)</Label>
              <Input
                id="monthlyRate"
                type="number"
                value={monthlyRate}
                onChange={(e) => handleMonthlyRateChange(Number(e.target.value))}
                onBlur={(e) => handleMonthlyRateChange(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="baseFee">Base Delivery Fee (R)</Label>
              <Input
                id="baseFee"
                type="number"
                value={baseFee}
                onChange={(e) => handleBaseFeeChange(Number(e.target.value))}
                onBlur={(e) => handleBaseFeeChange(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="crossBranchSurcharge">Cross-Branch Surcharge (R)</Label>
              <Input
                id="crossBranchSurcharge"
                type="number"
                value={crossBranchSurcharge}
                onChange={(e) => handleCrossBranchSurchargeChange(Number(e.target.value))}
                onBlur={(e) => handleCrossBranchSurchargeChange(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="text-xs text-gray-500 mt-4">
            Changes are automatically saved when you finish editing each field.
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategorySettingsModal;
