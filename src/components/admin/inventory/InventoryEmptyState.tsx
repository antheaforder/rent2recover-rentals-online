
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";

const InventoryEmptyState = () => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No equipment found</h3>
        <p className="text-gray-600">Try adjusting your search criteria or add new equipment</p>
      </CardContent>
    </Card>
  );
};

export default InventoryEmptyState;
