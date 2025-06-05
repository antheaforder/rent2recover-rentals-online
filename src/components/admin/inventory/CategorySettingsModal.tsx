
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EQUIPMENT_CATEGORIES, type EquipmentCategoryId } from "@/config/equipmentCategories";
import { getEquipmentCategories } from "@/services/bookingService";

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
  const [baseFee, setBaseFee] = useState(50);
  const [crossBranchSurcharge, setCrossBranchSurcharge] = useState(150);

  const categoryInfo = EQUIPMENT_CATEGORIES.find(cat => cat.id === category);
  const categories = getEquipmentCategories();
  const currentCategory = categories.find(c => c.id === category);

  useEffect(() => {
    if (currentCategory) {
      setWeeklyRate(currentCategory.pricing.weeklyRate);
      setMonthlyRate(currentCategory.pricing.monthlyRate);
      setBaseFee(currentCategory.delivery.baseFee);
      setCrossBranchSurcharge(currentCategory.delivery.crossBranchSurcharge);
    }
  }, [currentCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category) {
      onUpdate(category, {
        pricing: {
          weeklyRate: Number(weeklyRate),
          monthlyRate: Number(monthlyRate)
        },
        delivery: {
          baseFee: Number(baseFee),
          crossBranchSurcharge: Number(crossBranchSurcharge)
        }
      });
    }
  };

  if (!category || !categoryInfo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Category Settings</DialogTitle>
          <DialogDescription>
            Configure pricing and delivery settings for {categoryInfo.name}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weeklyRate">Weekly Rate (R)</Label>
              <Input
                id="weeklyRate"
                type="number"
                value={weeklyRate}
                onChange={(e) => setWeeklyRate(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <Label htmlFor="monthlyRate">Monthly Rate (R)</Label>
              <Input
                id="monthlyRate"
                type="number"
                value={monthlyRate}
                onChange={(e) => setMonthlyRate(Number(e.target.value))}
                required
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
                onChange={(e) => setBaseFee(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <Label htmlFor="crossBranchSurcharge">Cross-Branch Surcharge (R)</Label>
              <Input
                id="crossBranchSurcharge"
                type="number"
                value={crossBranchSurcharge}
                onChange={(e) => setCrossBranchSurcharge(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Settings</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategorySettingsModal;
