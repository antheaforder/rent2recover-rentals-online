
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BRANCHES } from "@/config/equipmentCategories";

interface InventoryManagerHeaderProps {
  branch: string;
  onAddNewCategory: () => void;
}

const InventoryManagerHeader = ({ branch, onAddNewCategory }: InventoryManagerHeaderProps) => {
  const currentBranch = BRANCHES.find(b => b.id === branch);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">Equipment Categories</h2>
        <p className="text-gray-600">Manage equipment categories and inventory for {currentBranch?.name}</p>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline"
          onClick={onAddNewCategory}
          className="bg-green-50 hover:bg-green-100 border-green-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>
    </div>
  );
};

export default InventoryManagerHeader;
