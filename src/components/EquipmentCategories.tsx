
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  items: number;
}

interface EquipmentCategoriesProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const EquipmentCategories = ({ categories, selectedCategory, onCategorySelect }: EquipmentCategoriesProps) => {
  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
      {categories.slice(0, 10).map((category) => (
        <Card 
          key={category.id}
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedCategory === category.id ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => onCategorySelect(category.id)}
        >
          <CardContent className="text-center p-4">
            <div className="mx-auto mb-2 p-2 bg-blue-100 rounded-full w-fit">
              <category.icon className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
            <Badge variant="secondary" className="text-xs">
              {category.items} Available
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EquipmentCategories;
