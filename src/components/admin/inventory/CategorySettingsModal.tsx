
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EQUIPMENT_CATEGORIES, type EquipmentCategoryId } from "@/config/equipmentCategories";
import { getEquipmentCategories, updateCategoryPricing, initializeCategoriesInDatabase } from "@/services/categoryService";
import { useToast } from "@/hooks/use-toast";
import PricingInputs from "./PricingInputs";
import DeliveryInputs from "./DeliveryInputs";
import SaveStatusIndicator from "./SaveStatusIndicator";

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
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
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

  useEffect(() => {
    if (isOpen) {
      initializeCategoriesInDatabase();
    }
  }, [isOpen]);

  const autoSave = async (updates: any) => {
    if (!category) return;
    
    setIsSaving(true);
    setSaveError(null);
    
    try {
      console.log('Attempting to save category pricing:', category, updates);
      await updateCategoryPricing(category, updates);
      onUpdate(category, updates);
      setLastSaved(new Date());
      
      toast({
        title: "Settings Saved Successfully",
        description: "Category pricing has been updated and saved to database"
      });
      
      console.log('Category pricing saved successfully');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save category settings";
      setSaveError(errorMessage);
      
      toast({
        title: "Save Failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      console.error('Failed to save category pricing:', error);
    }
    
    setIsSaving(false);
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
          <DialogTitle>Category Settings - {categoryInfo.name}</DialogTitle>
          <DialogDescription>
            Configure pricing and delivery settings
            <SaveStatusIndicator 
              isSaving={isSaving}
              lastSaved={lastSaved}
              saveError={saveError}
            />
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <PricingInputs
            dailyRate={dailyRate}
            weeklyRate={weeklyRate}
            monthlyRate={monthlyRate}
            onDailyRateChange={handleDailyRateChange}
            onWeeklyRateChange={handleWeeklyRateChange}
            onMonthlyRateChange={handleMonthlyRateChange}
            isSaving={isSaving}
          />

          <DeliveryInputs
            baseFee={baseFee}
            crossBranchSurcharge={crossBranchSurcharge}
            onBaseFeeChange={handleBaseFeeChange}
            onCrossBranchSurchargeChange={handleCrossBranchSurchargeChange}
            isSaving={isSaving}
          />

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-700">
              💡 Changes are automatically saved when you finish editing each field. 
              Updates will immediately reflect in Overview, Calendar, and Bookings tabs.
            </p>
          </div>

          {saveError && (
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-xs text-red-700">
                ❌ Save failed: {saveError}. Please try again.
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={onClose} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Done'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategorySettingsModal;
