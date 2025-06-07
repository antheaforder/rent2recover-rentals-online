
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Calendar, DollarSign } from "lucide-react";
import { type EquipmentCategory } from "@/config/equipmentCategories";
import { getInventoryByCategory } from "@/services/inventoryService";

interface EquipmentCategoryCardProps {
  category: EquipmentCategory;
  onViewDetails?: () => void;
  onAddToBooking?: () => void;
  showActions?: boolean;
}

const EquipmentCategoryCard = ({
  category,
  onViewDetails,
  onAddToBooking,
  showActions = true
}: EquipmentCategoryCardProps) => {
  // Calculate available items count
  const inventory = getInventoryByCategory(category.id);
  const availableCount = inventory.filter(item => item.status === 'available').length;

  // Don't show if no inventory available
  if (availableCount === 0) return null;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="relative">
          {/* Category Image */}
          <div className="w-full h-48 rounded-md overflow-hidden bg-gray-100 mb-3">
            {category.imageUrl ? (
              <img 
                src={category.imageUrl} 
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className={`w-full h-full ${category.color} flex items-center justify-center`}>
                <Package className="h-12 w-12 text-white" />
              </div>
            )}
          </div>

          {/* Category Name */}
          <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
            {category.name}
          </h3>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Pricing Display */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1 text-sm">
            <Calendar className="h-4 w-4 text-green-600" />
            <span className="font-medium">Weekly:</span>
            <span className="text-green-600 font-semibold">R{category.pricing.weeklyRate}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <DollarSign className="h-4 w-4 text-blue-600" />
            <span className="font-medium">Monthly:</span>
            <span className="text-blue-600 font-semibold">R{category.pricing.monthlyRate}</span>
          </div>
        </div>

        {/* Available Count */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Package className="h-3 w-3 mr-1" />
            {availableCount} Available
          </Badge>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onViewDetails}
              className="w-full"
            >
              View Details
            </Button>
            <Button 
              size="sm" 
              onClick={onAddToBooking}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Add to Booking
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EquipmentCategoryCard;
