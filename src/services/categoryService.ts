
import { EquipmentCategory, EquipmentCategoryId } from "@/config/equipmentCategories";
import { getCategoriesStore, setCategoriesStore } from "./mockDataService";

// Equipment Categories Management
export const getEquipmentCategories = (): EquipmentCategory[] => getCategoriesStore();

export const updateCategoryPricing = (categoryId: EquipmentCategoryId, updates: { pricing: any; delivery: any }) => {
  const categories = getCategoriesStore();
  const index = categories.findIndex(cat => cat.id === categoryId);
  if (index !== -1) {
    const updatedCategories = [...categories];
    updatedCategories[index] = {
      ...updatedCategories[index],
      pricing: {
        ...updatedCategories[index].pricing,
        ...updates.pricing,
        dailyRate: updates.pricing.dailyRate || 0 // Add daily rate support
      },
      delivery: updates.delivery
    };
    setCategoriesStore(updatedCategories);
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
