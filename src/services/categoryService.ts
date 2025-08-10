import { EquipmentCategory, EquipmentCategoryId } from "@/config/equipmentCategories";
import { getCategoriesStore, setCategoriesStore } from "./mockDataService";
import { supabase } from "@/integrations/supabase/client";

// Equipment Categories Management
export const getEquipmentCategories = (): EquipmentCategory[] => getCategoriesStore();

export const updateCategoryPricing = async (categoryId: EquipmentCategoryId, updates: { pricing: any; delivery: any }) => {
  console.log('Starting updateCategoryPricing for:', categoryId, updates);
  
  // First update local store immediately for UI responsiveness
  const categories = getCategoriesStore();
  const index = categories.findIndex(cat => cat.id === categoryId);
  if (index === -1) {
    throw new Error(`Category ${categoryId} not found in local store`);
  }

  const updatedCategories = [...categories];
  updatedCategories[index] = {
    ...updatedCategories[index],
    pricing: {
      ...updatedCategories[index].pricing,
      ...updates.pricing,
      dailyRate: Number(updates.pricing.dailyRate) || 0,
      weeklyRate: Number(updates.pricing.weeklyRate) || 0,
      monthlyRate: Number(updates.pricing.monthlyRate) || 0
    },
    delivery: {
      ...updatedCategories[index].delivery,
      ...updates.delivery,
      baseFee: Number(updates.delivery.baseFee) || 50,
      crossBranchSurcharge: Number(updates.delivery.crossBranchSurcharge) || 150
    }
  };
  
  // Update local store first
  setCategoriesStore(updatedCategories);
  
  // Now save to Supabase with proper error handling
  try {
    console.log('Attempting to save to Supabase...');
    
    // Try to update existing record first (match by slug)
    const { data: updateData, error: updateError } = await supabase
      .from('equipment_categories')
      .update({
        name: updatedCategories[index].name,
        daily_rate: updatedCategories[index].pricing.dailyRate || 0,
        weekly_rate: updatedCategories[index].pricing.weeklyRate || 0,
        monthly_rate: updatedCategories[index].pricing.monthlyRate || 0,
        base_delivery_fee: updatedCategories[index].delivery.baseFee || 0,
        cross_branch_surcharge: updatedCategories[index].delivery.crossBranchSurcharge || 0,
        updated_at: new Date().toISOString()
      })
      .eq('slug', categoryId)
      .select();

    if (updateError) {
      console.log('Update failed, trying insert:', updateError);
      
      // If update fails (record doesn't exist), try insert
      const { data: insertData, error: insertError } = await supabase
        .from('equipment_categories')
        .insert({
          slug: categoryId,
          name: updatedCategories[index].name,
          daily_rate: updatedCategories[index].pricing.dailyRate || 0,
          weekly_rate: updatedCategories[index].pricing.weeklyRate || 0,
          monthly_rate: updatedCategories[index].pricing.monthlyRate || 0,
          base_delivery_fee: updatedCategories[index].delivery.baseFee || 0,
          cross_branch_surcharge: updatedCategories[index].delivery.crossBranchSurcharge || 0
        })
        .select();

      if (insertError) {
        console.error('Both update and insert failed:', insertError);
        // Don't throw here - keep local changes even if DB save fails
        console.warn('Category saved locally but not persisted to database:', insertError.message);
      } else {
        console.log('Category inserted successfully:', insertData);
      }
    } else {
      console.log('Category updated successfully:', updateData);
    }
    
    // Trigger refresh events for other components
    window.dispatchEvent(new CustomEvent('categoryPricingUpdated', { 
      detail: { categoryId, updates } 
    }));
    
    return updatedCategories[index];
    
  } catch (error) {
    console.error('Unexpected error during Supabase operation:', error);
    // Don't throw - keep local changes
    console.warn('Category saved locally but database sync failed');
    return updatedCategories[index];
  }
};

// Initialize categories in Supabase if they don't exist
export const initializeCategoriesInDatabase = async () => {
  try {
    const categories = getCategoriesStore();
    
    for (const category of categories) {
      const { data: existingCategory } = await supabase
        .from('equipment_categories')
        .select('slug')
        .eq('slug', category.id)
        .maybeSingle();
      
      if (!existingCategory) {
        await supabase
          .from('equipment_categories')
          .insert({
            slug: category.id,
            name: category.name,
            daily_rate: category.pricing.dailyRate || 0,
            weekly_rate: category.pricing.weeklyRate || 0,
            monthly_rate: category.pricing.monthlyRate || 0,
            base_delivery_fee: category.delivery.baseFee || 0,
            cross_branch_surcharge: category.delivery.crossBranchSurcharge || 0
          });
        
        console.log(`Initialized category ${category.id} in database`);
      }
    }
  } catch (error) {
    console.error('Error initializing categories in database:', error);
  }
};

// Calculate best pricing for date range
export const calculateBestPricing = (categoryId: EquipmentCategoryId, days: number) => {
  const categories = getCategoriesStore();
  const category = categories.find(cat => cat.id === categoryId);
  
  if (!category) return { total: 0, breakdown: '', rateType: 'daily' };
  
  const { dailyRate = 0, weeklyRate = 0, monthlyRate = 0 } = category.pricing;
  
  if (days <= 6) {
    // Use daily rate for 1-6 days
    return {
      total: dailyRate * days,
      breakdown: `${days} days @ R${dailyRate}/day = R${dailyRate * days}`,
      rateType: 'daily'
    };
  } else if (days <= 29) {
    // Use weekly rate for 7-29 days (calculate best option)
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    
    const weeklyOption = (weeks * weeklyRate) + (remainingDays * dailyRate);
    const dailyOption = days * dailyRate;
    
    if (weeklyOption < dailyOption && weeklyRate > 0) {
      const breakdown = weeks > 0 
        ? `${weeks} week${weeks > 1 ? 's' : ''} @ R${weeklyRate}${remainingDays > 0 ? ` + ${remainingDays} days @ R${dailyRate}` : ''} = R${weeklyOption}`
        : `${days} days @ R${dailyRate}/day = R${dailyOption}`;
      
      return {
        total: weeklyOption,
        breakdown,
        rateType: 'weekly'
      };
    } else {
      return {
        total: dailyOption,
        breakdown: `${days} days @ R${dailyRate}/day = R${dailyOption}`,
        rateType: 'daily'
      };
    }
  } else {
    // Use monthly rate for 30+ days
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    
    const monthlyOption = (months * monthlyRate) + (remainingDays * dailyRate);
    const dailyOption = days * dailyRate;
    
    if (monthlyOption < dailyOption && monthlyRate > 0) {
      const breakdown = months > 0 
        ? `${months} month${months > 1 ? 's' : ''} @ R${monthlyRate}${remainingDays > 0 ? ` + ${remainingDays} days @ R${dailyRate}` : ''} = R${monthlyOption}`
        : `${days} days @ R${dailyRate}/day = R${dailyOption}`;
      
      return {
        total: monthlyOption,
        breakdown,
        rateType: 'monthly'
      };
    } else {
      return {
        total: dailyOption,
        breakdown: `${days} days @ R${dailyRate}/day = R${dailyOption}`,
        rateType: 'daily'
      };
    }
  }
};
