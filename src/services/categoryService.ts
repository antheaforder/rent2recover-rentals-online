
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
      pricing: updates.pricing,
      delivery: updates.delivery
    };
    setCategoriesStore(updatedCategories);
  }
};
