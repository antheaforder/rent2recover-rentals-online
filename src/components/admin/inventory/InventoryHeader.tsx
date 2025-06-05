
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BRANCHES } from "@/config/equipmentCategories";

interface InventoryHeaderProps {
  branch: string;
  onAddClick: () => void;
}

const InventoryHeader = ({ branch, onAddClick }: InventoryHeaderProps) => {
  const currentBranch = BRANCHES.find(b => b.id === branch);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold">Equipment Inventory</h2>
        <p className="text-gray-600">Manage equipment for {currentBranch?.name}</p>
      </div>
      <Button className="bg-blue-600 hover:bg-blue-700" onClick={onAddClick}>
        <Plus className="h-4 w-4 mr-2" />
        Add Equipment
      </Button>
    </div>
  );
};

export default InventoryHeader;
