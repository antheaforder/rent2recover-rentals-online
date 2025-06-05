
import { useState } from "react";
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
  MapPin
} from "lucide-react";
import { 
  getInventoryByBranch, 
  getEquipmentCategories,
  updateCategoryPricing
} from "@/services/bookingService";
import { useToast } from "@/hooks/use-toast";
import { EQUIPMENT_CATEGORIES, BRANCHES, type EquipmentCategoryId } from "@/config/equipmentCategories";
import CategoryDetailsView from "@/components/admin/inventory/CategoryDetailsView";
import CategorySettingsModal from "@/components/admin/inventory/CategorySettingsModal";

interface InventoryManagerProps {
  branch: string;
}

const InventoryManager = ({ branch }: InventoryManagerProps) => {
  const [selectedCategory, setSelectedCategory] = useState<EquipmentCategoryId | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsCategory, setSettingsCategory] = useState<EquipmentCategoryId | null>(null);
  const { toast } = useToast();

  const categories = getEquipmentCategories();
  const currentBranch = BRANCHES.find(b => b.id === branch);

  const getCategoryInventoryCount = (categoryId: EquipmentCategoryId, branchId: string) => {
    const inventory = getInventoryByBranch(branchId);
    return inventory.filter(item => item.category === categoryId).length;
  };

  const handleCategorySettingsClick = (categoryId: EquipmentCategoryId) => {
    setSettingsCategory(categoryId);
    setIsSettingsModalOpen(true);
  };

  const handleUpdateCategoryPricing = async (categoryId: EquipmentCategoryId, pricing: any) => {
    try {
      updateCategoryPricing(categoryId, pricing);
      setIsSettingsModalOpen(false);
      toast({
        title: "Category Updated",
        description: "Pricing and delivery settings have been saved"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category settings",
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
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="grid gap-4">
        {EQUIPMENT_CATEGORIES.map((category) => {
          const hiltonCount = getCategoryInventoryCount(category.id, 'hilton');
          const johannesburgCount = getCategoryInventoryCount(category.id, 'johannesburg');
          const totalCount = hiltonCount + johannesburgCount;
          const currentBranchCount = getCategoryInventoryCount(category.id, branch);
          
          return (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 ${category.color} rounded-lg`}>
                      <Package className="h-6 w-6 text-white" />
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
                          Weekly: R{categories.find(c => c.id === category.id)?.pricing.weeklyRate || 0}
                        </Badge>
                        <Badge variant="outline">
                          Monthly: R{categories.find(c => c.id === category.id)?.pricing.monthlyRate || 0}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
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

      <CategorySettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        category={settingsCategory}
        onUpdate={handleUpdateCategoryPricing}
      />
    </div>
  );
};

export default InventoryManager;
