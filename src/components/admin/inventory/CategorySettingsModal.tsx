
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
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
      setHasUnsavedChanges(false);
      setSaveError(null);
    }
  }, [currentCategory]);

  useEffect(() => {
    if (isOpen) {
      initializeCategoriesInDatabase();
    }
  }, [isOpen]);

  const validateValue = (value: number): boolean => {
    return !isNaN(value) && value >= 0 && isFinite(value);
  };

  const handleInputChange = (field: string, value: number) => {
    setHasUnsavedChanges(true);
    setSaveError(null);
    
    switch (field) {
      case 'dailyRate':
        setDailyRate(value);
        break;
      case 'weeklyRate':
        setWeeklyRate(value);
        break;
      case 'monthlyRate':
        setMonthlyRate(value);
        break;
      case 'baseFee':
        setBaseFee(value);
        break;
      case 'crossBranchSurcharge':
        setCrossBranchSurcharge(value);
        break;
    }
  };

  const handleSave = async () => {
    if (!category) return;

    // Validate all values before saving
    if (!validateValue(dailyRate) || 
        !validateValue(weeklyRate) || 
        !validateValue(monthlyRate) ||
        !validateValue(baseFee) ||
        !validateValue(crossBranchSurcharge)) {
      setSaveError("Invalid values. Please enter valid numbers.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    
    try {
      const updates = {
        pricing: { dailyRate, weeklyRate, monthlyRate },
        delivery: { baseFee, crossBranchSurcharge }
      };
      
      console.log('Attempting to save category pricing:', category, updates);
      await updateCategoryPricing(category, updates);
      onUpdate(category, updates);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      
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
            onDailyRateChange={(value) => handleInputChange('dailyRate', value)}
            onWeeklyRateChange={(value) => handleInputChange('weeklyRate', value)}
            onMonthlyRateChange={(value) => handleInputChange('monthlyRate', value)}
            isSaving={isSaving}
          />

          <DeliveryInputs
            baseFee={baseFee}
            crossBranchSurcharge={crossBranchSurcharge}
            onBaseFeeChange={(value) => handleInputChange('baseFee', value)}
            onCrossBranchSurchargeChange={(value) => handleInputChange('crossBranchSurcharge', value)}
            isSaving={isSaving}
          />

          {hasUnsavedChanges && (
            <div className="bg-amber-50 p-3 rounded-lg">
              <p className="text-xs text-amber-700">
                ⚠️ You have unsaved changes. Click "Save Settings" to persist your changes.
              </p>
            </div>
          )}

          {saveError && (
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-xs text-red-700">
                ❌ Save failed: {saveError}. Please check your values and try again.
              </p>
            </div>
          )}

          <div className="flex justify-between gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving || !hasUnsavedChanges}
              className={hasUnsavedChanges ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              {isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save Settings' : 'No Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategorySettingsModal;
