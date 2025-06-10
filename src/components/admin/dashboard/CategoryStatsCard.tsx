
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EQUIPMENT_CATEGORIES, BRANCHES } from "@/config/equipmentCategories";

interface CategoryStatsCardProps {
  filteredStats: Array<{
    id: string;
    name: string;
    color: string;
    total: number;
    available: number;
    booked: number;
    maintenance: number;
    pricing: {
      dailyRate: number;
      weeklyRate: number;
      monthlyRate: number;
    };
  }>;
  selectedCategory: string;
  branch: string;
}

const CategoryStatsCard = ({ filteredStats, selectedCategory, branch }: CategoryStatsCardProps) => {
  const currentBranch = BRANCHES.find(b => b.id === branch);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment Categories</CardTitle>
        <CardDescription>
          Breakdown by category for {currentBranch?.name}
          {selectedCategory !== 'all' && ` - ${EQUIPMENT_CATEGORIES.find(c => c.id === selectedCategory)?.name}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStats.map((category) => (
            <div key={category.id} className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                <h3 className="font-semibold text-sm">{category.name}</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Total:</span>
                  <span className="font-medium ml-1">{category.total}</span>
                </div>
                <div>
                  <span className="text-gray-500">Available:</span>
                  <span className="font-medium ml-1 text-green-600">{category.available}</span>
                </div>
                <div>
                  <span className="text-gray-500">Booked:</span>
                  <span className="font-medium ml-1 text-blue-600">{category.booked}</span>
                </div>
                <div>
                  <span className="text-gray-500">Maintenance:</span>
                  <span className="font-medium ml-1 text-orange-600">{category.maintenance}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">
                  Daily: R{category.pricing.dailyRate || 0}
                </Badge>
                <Badge variant="outline">
                  Weekly: R{category.pricing.weeklyRate || 0}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryStatsCard;
