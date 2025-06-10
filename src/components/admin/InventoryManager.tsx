
import { useState } from "react";
import { EQUIPMENT_CATEGORIES, type EquipmentCategoryId } from "@/config/equipmentCategories";
import CategoryDetailsView from "@/components/admin/inventory/CategoryDetailsView";
import CategorySettingsModal from "@/components/admin/inventory/CategorySettingsModal";
import EquipmentItemModal from "@/components/admin/inventory/EquipmentItemModal";
import InventoryManagerHeader from "@/components/admin/inventory/InventoryManagerHeader";
import CategoryCard from "@/components/admin/inventory/CategoryCard";
import { useInventoryData } from "@/hooks/useInventoryData";
import { useInventoryModals } from "@/hooks/useInventoryModals";

interface InventoryManagerProps {
  branch: string;
}

const InventoryManager = ({ branch }: InventoryManagerProps) => {
  const [selectedCategory, setSelectedCategory] = useState<EquipmentCategoryId | null>(null);
  
  const {
    categories,
    inventoryRefreshKey,
    getCategoryInventoryCount,
    getAvailableCount,
    forceRefresh
  } = useInventoryData(branch);

  const {
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    isItemModalOpen,
    setIsItemModalOpen,
    modalCategory,
    modalMode,
    handleCategorySettingsClick,
    handleAddNewCategory,
    handleAddItemClick,
    handleUpdateCategory,
    handleSaveItem
  } = useInventoryModals(forceRefresh);

  if (selectedCategory) {
    return (
      <CategoryDetailsView
        category={selectedCategory}
        branch={branch}
        onBack={() => setSelectedCategory(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <InventoryManagerHeader 
        branch={branch}
        onAddNewCategory={handleAddNewCategory}
      />

      <div className="grid gap-4">
        {EQUIPMENT_CATEGORIES.map((category) => {
          const hiltonCount = getCategoryInventoryCount(category.id, 'hilton');
          const johannesburgCount = getCategoryInventoryCount(category.id, 'johannesburg');
          const currentBranchCount = getCategoryInventoryCount(category.id, branch);
          const availableCount = getAvailableCount(category.id, branch);
          const categoryData = categories.find(c => c.id === category.id);
          
          return (
            <CategoryCard
              key={category.id}
              category={category}
              branch={branch}
              hiltonCount={hiltonCount}
              johannesburgCount={johannesburgCount}
              currentBranchCount={currentBranchCount}
              availableCount={availableCount}
              categoryData={categoryData}
              inventoryRefreshKey={inventoryRefreshKey}
              onAddItem={handleAddItemClick}
              onSettingsClick={handleCategorySettingsClick}
              onViewItems={setSelectedCategory}
            />
          );
        })}
      </div>

      {/* Category Settings Modal */}
      <CategorySettingsModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        category={modalCategory}
        onUpdate={handleUpdateCategory}
      />

      {/* Equipment Item Modal */}
      <EquipmentItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        category={modalCategory!}
        branch={branch}
        onSave={handleSaveItem}
        mode={modalMode}
      />
    </div>
  );
};

export default InventoryManager;
