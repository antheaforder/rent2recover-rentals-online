
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Link } from "lucide-react";
import { 
  EQUIPMENT_CATEGORIES, 
  BRANCHES, 
  type InventoryItem 
} from "@/config/equipmentCategories";

interface InventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  onGenerateICalFeed: (itemId: string) => void;
  onCopyICalLink: (itemId: string) => void;
}

const InventoryItemModal = ({
  isOpen,
  onClose,
  item,
  onGenerateICalFeed,
  onCopyICalLink,
}: InventoryItemModalProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'out': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-96">
        <DialogHeader>
          <DialogTitle>Equipment Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <p><strong>Name:</strong> {item.name}</p>
            <p><strong>Category:</strong> {EQUIPMENT_CATEGORIES.find(c => c.id === item.category)?.name}</p>
            <p><strong>Branch:</strong> {BRANCHES.find(b => b.id === item.branch)?.name}</p>
            <p><strong>Status:</strong> <Badge className={getStatusColor(item.status)}>{item.status}</Badge></p>
            <p><strong>Serial:</strong> {item.serialNumber}</p>
            <p><strong>Condition:</strong> {item.condition}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => onGenerateICalFeed(item.id)}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download iCal
            </Button>
            <Button
              variant="outline"
              onClick={() => onCopyICalLink(item.id)}
              className="flex-1"
            >
              <Link className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>
          <Button 
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryItemModal;
