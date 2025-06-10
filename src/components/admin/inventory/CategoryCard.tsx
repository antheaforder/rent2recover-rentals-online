
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Package, 
  Settings, 
  Plus, 
  ArrowRight, 
  Users,
  MapPin
} from "lucide-react";
import { BRANCHES, type EquipmentCategoryId, type EquipmentCategory } from "@/config/equipmentCategories";

interface CategoryCardProps {
  baseCategoryInfo: {
    id: EquipmentCategoryId;
    name: string;
    color: string;
  };
  branch: string;
  hiltonCount: number;
  johannesburgCount: number;
  currentBranchCount: number;
  availableCount: number;
  categoryData: EquipmentCategory | undefined;
  inventoryRefreshKey: number;
  onAddItem: (categoryId: EquipmentCategoryId) => void;
  onSettingsClick: (categoryId: EquipmentCategoryId) => void;
  onViewItems: (categoryId: EquipmentCategoryId) => void;
}

const CategoryCard = ({
  baseCategoryInfo,
  branch,
  hiltonCount,
  johannesburgCount,
  currentBranchCount,
  availableCount,
  categoryData,
  inventoryRefreshKey,
  onAddItem,
  onSettingsClick,
  onViewItems
}: CategoryCardProps) => {
  const totalCount = hiltonCount + johannesburgCount;

  return (
    <Card key={`${baseCategoryInfo.id}-${inventoryRefreshKey}`} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Category Image or Icon */}
            <div className="relative">
              {categoryData?.imageUrl ? (
                <div className="w-16 h-16 rounded-lg overflow-hidden">
                  <img 
                    src={categoryData.imageUrl} 
                    alt={baseCategoryInfo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className={`p-3 ${baseCategoryInfo.color} rounded-lg`}>
                  <Package className="h-6 w-6 text-white" />
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold text-lg">{baseCategoryInfo.name}</h3>
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
                  Daily: R{categoryData?.pricing?.dailyRate || 0}
                </Badge>
                <Badge variant="outline">
                  Weekly: R{categoryData?.pricing?.weeklyRate || 0}
                </Badge>
                <Badge variant="outline">
                  Monthly: R{categoryData?.pricing?.monthlyRate || 0}
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
              onClick={() => onAddItem(baseCategoryInfo.id)}
              className="text-green-600 hover:bg-green-50"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSettingsClick(baseCategoryInfo.id)}
            >
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
            <Button
              size="sm"
              onClick={() => onViewItems(baseCategoryInfo.id)}
            >
              View Items ({currentBranchCount})
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
