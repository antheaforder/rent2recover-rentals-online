
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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
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
      setValidationErrors({});
    }
  }, [currentCategory]);

  useEffect(() => {
    if (isOpen) {
      initializeCategoriesInDatabase();
    }
  }, [isOpen]);

  const validateField = (field: string, value: number): string | null => {
    if (isNaN(value) || !isFinite(value)) {
      return "Must be a valid number";
    }
    if (value < 0) {
      return "Must be greater than or equal to 0";
    }
    return null;
  };

  const validateAllFields = (): boolean => {
    const errors: Record<string, string> = {};
    
    const dailyError = validateField('dailyRate', dailyRate);
    if (dailyError) errors.dailyRate = dailyError;
    
    const weeklyError = validateField('weeklyRate', weeklyRate);
    if (weeklyError) errors.weeklyRate = weeklyError;
    
    const monthlyError = validateField('monthlyRate', monthlyRate);
    if (monthlyError) errors.monthlyRate = monthlyError;
    
    const baseFeeError = validateField('baseFee', baseFee);
    if (baseFeeError) errors.baseFee = baseFeeError;
    
    const surchargeError = validateField('crossBranchSurcharge', crossBranchSurcharge);
    if (surchargeError) errors.crossBranchSurcharge = surchargeError;

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: number) => {
    setHasUnsavedChanges(true);
    setSaveError(null);
    
    // Clear validation error for this field if value is now valid
    const fieldError = validateField(field, value);
    if (!fieldError && validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
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

    // Validate all fields before saving
    if (!validateAllFields()) {
      setSaveError("Please fix validation errors before saving");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    
    try {
      const updates = {
        pricing: { 
          dailyRate: Number(dailyRate), 
          weeklyRate: Number(weeklyRate), 
          monthlyRate: Number(monthlyRate) 
        },
        delivery: { 
          baseFee: Number(baseFee), 
          crossBranchSurcharge: Number(crossBranchSurcharge) 
        }
      };
      
      console.log('Saving category pricing:', category, updates);
      await updateCategoryPricing(category, updates);
      
      // Call the parent update handler
      onUpdate(category, updates);
      
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      
      toast({
        title: "Settings Saved Successfully",
        description: "Category pricing has been updated and will be used in all quotes"
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
            validationErrors={validationErrors}
          />

          <DeliveryInputs
            baseFee={baseFee}
            crossBranchSurcharge={crossBranchSurcharge}
            onBaseFeeChange={(value) => handleInputChange('baseFee', value)}
            onCrossBranchSurchargeChange={(value) => handleInputChange('crossBranchSurcharge', value)}
            isSaving={isSaving}
            validationErrors={validationErrors}
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
                ❌ Save failed: {saveError}
              </p>
            </div>
          )}

          <div className="flex justify-between gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving || !hasUnsavedChanges || Object.keys(validationErrors).length > 0}
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
