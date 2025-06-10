
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Settings, 
  Plus, 
  ArrowRight, 
  Edit,
  Users,
  MapPin,
  Image as ImageIcon
} from "lucide-react";
import { 
  getInventoryByBranch,
  addInventoryItem,
  updateInventoryItem
} from "@/services/inventoryService";
import { 
  getEquipmentCategories,
  updateCategoryPricing
} from "@/services/categoryService";
import { useToast } from "@/hooks/use-toast";
import { EQUIPMENT_CATEGORIES, BRANCHES, type EquipmentCategoryId, type EquipmentCategory } from "@/config/equipmentCategories";
import CategoryDetailsView from "@/components/admin/inventory/CategoryDetailsView";
import CategoryManagerModal from "@/components/admin/inventory/CategoryManagerModal";
import EquipmentItemModal from "@/components/admin/inventory/EquipmentItemModal";
import CategorySettingsModal from "@/components/admin/inventory/CategorySettingsModal";

interface InventoryManagerProps {
  branch: string;
}

const InventoryManager = ({ branch }: InventoryManagerProps) => {
  const [selectedCategory, setSelectedCategory] = useState<EquipmentCategoryId | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState<EquipmentCategoryId | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [inventoryRefreshKey, setInventoryRefreshKey] = useState(0);
  const { toast } = useToast();

  const categories = getEquipmentCategories();
  const currentBranch = BRANCHES.find(b => b.id === branch);

  // Listen for inventory updates to refresh counts
  useEffect(() => {
    const handleInventoryUpdate = () => {
      console.log('Inventory updated - refreshing counts');
      setInventoryRefreshKey(prev => prev + 1);
    };

    const handlePricingUpdate = () => {
      console.log('Category pricing updated - refreshing display');
      setInventoryRefreshKey(prev => prev + 1);
    };

    window.addEventListener('inventoryUpdated', handleInventoryUpdate);
    window.addEventListener('categoryPricingUpdated', handlePricingUpdate);
    
    return () => {
      window.removeEventListener('inventoryUpdated', handleInventoryUpdate);
      window.removeEventListener('categoryPricingUpdated', handlePricingUpdate);
    };
  }, []);

  const getCategoryInventoryCount = (categoryId: EquipmentCategoryId, branchId: string) => {
    const inventory = getInventoryByBranch(branchId);
    return inventory.filter(item => item.category === categoryId).length;
  };

  const getAvailableCount = (categoryId: EquipmentCategoryId, branchId: string) => {
    const inventory = getInventoryByBranch(branchId);
    return inventory.filter(item => item.category === categoryId && item.status === 'available').length;
  };

  const handleCategorySettingsClick = (categoryId: EquipmentCategoryId) => {
    setModalCategory(categoryId);
    setModalMode('edit');
    setIsCategoryModalOpen(true);
  };

  const handleAddNewCategory = () => {
    setModalCategory(null);
    setModalMode('add');
    setIsCategoryModalOpen(true);
  };

  const handleAddItemClick = (categoryId: EquipmentCategoryId) => {
    setModalCategory(categoryId);
    setModalMode('add');
    setIsItemModalOpen(true);
  };

  const handleUpdateCategory = async (categoryId: EquipmentCategoryId, updates: Partial<EquipmentCategory>) => {
    try {
      console.log('Updating category pricing:', categoryId, updates);
      await updateCategoryPricing(categoryId, {
        pricing: updates.pricing,
        delivery: updates.delivery
      });
      setIsCategoryModalOpen(false);
      
      // Force refresh to show updated pricing
      setInventoryRefreshKey(prev => prev + 1);
      
      toast({
        title: "Category Updated Successfully",
        description: "Category settings have been saved and applied across all modules"
      });
    } catch (error) {
      console.error('Failed to update category:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update category settings",
        variant: "destructive"
      });
    }
  };

  const handleSaveItem = async (itemData: any) => {
    try {
      console.log('Saving inventory item:', itemData);
      
      if (modalMode === 'add') {
        const newItem = await addInventoryItem({
          name: itemData.name,
          category: itemData.category,
          branch: itemData.branch,
          serialNumber: itemData.serialNumber,
          condition: itemData.condition || 'excellent',
          status: itemData.status || 'available',
          lastChecked: itemData.lastChecked,
          notes: itemData.notes,
          purchaseDate: itemData.purchaseDate
        });
        
        console.log('Item saved successfully:', newItem);
        
        toast({
          title: "Item Added Successfully",
          description: `${itemData.name} has been added to inventory and saved to database`
        });
        
        // Force refresh of inventory counts
        setInventoryRefreshKey(prev => prev + 1);
      }
      setIsItemModalOpen(false);
    } catch (error) {
      console.error('Failed to save item:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save item to database",
        variant: "destructive"
      });
    }
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Equipment Categories</h2>
          <p className="text-gray-600">Manage equipment categories and inventory for {currentBranch?.name}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleAddNewCategory}
            className="bg-green-50 hover:bg-green-100 border-green-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {EQUIPMENT_CATEGORIES.map((category) => {
          const hiltonCount = getCategoryInventoryCount(category.id, 'hilton');
          const johannesburgCount = getCategoryInventoryCount(category.id, 'johannesburg');
          const totalCount = hiltonCount + johannesburgCount;
          const currentBranchCount = getCategoryInventoryCount(category.id, branch);
          const availableCount = getAvailableCount(category.id, branch);
          
          const categoryData = categories.find(c => c.id === category.id);
          
          return (
            <Card key={`${category.id}-${inventoryRefreshKey}`} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Category Image or Icon */}
                    <div className="relative">
                      {categoryData?.imageUrl ? (
                        <div className="w-16 h-16 rounded-lg overflow-hidden">
                          <img 
                            src={categoryData.imageUrl} 
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className={`p-3 ${category.color} rounded-lg`}>
                          <Package className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <div className="flex gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>Hilton: {hiltonCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>Joburg: {johannesburgCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>Total: {totalCount} items</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">
                          Daily: R{categoryData?.pricing.dailyRate || 0}
                        </Badge>
                        <Badge variant="outline">
                          Weekly: R{categoryData?.pricing.weeklyRate || 0}
                        </Badge>
                        <Badge variant="outline">
                          Monthly: R{categoryData?.pricing.monthlyRate || 0}
                        </Badge>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {availableCount} Available
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddItemClick(category.id)}
                      className="text-green-600 hover:bg-green-50"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Item
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCategorySettingsClick(category.id)}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Settings
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      View Items ({currentBranchCount})
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
