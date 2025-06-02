
import { Card, CardContent } from "@/components/ui/card";
import EquipmentCard from "./EquipmentCard";

interface EquipmentItem {
  id: number;
  name: string;
  category: string;
  description: string;
  weeklyRate: number;
  monthlyRate: number;
  available: number;
  image: string;
}

interface EquipmentGridProps {
  items: EquipmentItem[];
  branch: string;
  otherBranch: string;
}

const EquipmentGrid = ({ items, branch, otherBranch }: EquipmentGridProps) => {
  if (items.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="text-gray-400 mb-4">No equipment found</div>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <EquipmentCard 
          key={item.id} 
          item={item} 
          branch={branch} 
          otherBranch={otherBranch} 
        />
      ))}
    </div>
  );
};

export default EquipmentGrid;
