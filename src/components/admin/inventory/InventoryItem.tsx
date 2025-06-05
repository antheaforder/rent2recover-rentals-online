
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Edit, 
  Trash2, 
  Wrench, 
  Download, 
  Link 
} from "lucide-react";
import { EQUIPMENT_CATEGORIES, BRANCHES, type InventoryItem } from "@/config/equipmentCategories";

interface InventoryItemProps {
  item: InventoryItem;
  onDownloadICal: (itemId: string) => void;
  onCopyICalLink: (itemId: string) => void;
  onMaintenance: (item: InventoryItem) => void;
  onDelete: (itemId: string) => void;
}

const InventoryItem = ({ 
  item, 
  onDownloadICal, 
  onCopyICalLink, 
  onMaintenance, 
  onDelete 
}: InventoryItemProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'booked': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'transfer': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'needs-repair': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Package className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <div className="flex gap-2 text-sm text-gray-600">
                <span>ID: {item.id}</span>
                <span>•</span>
                <span>Serial: {item.serialNumber}</span>
              </div>
              <p className="text-xs text-gray-500">
                Category: {EQUIPMENT_CATEGORIES.find(cat => cat.id === item.category)?.name} • Last checked: {item.lastChecked}
              </p>
              {item.notes && (
                <p className="text-xs text-gray-600 mt-1 italic">"{item.notes}"</p>
              )}
              <div className="flex gap-2 mt-2">
                <Badge className={getStatusColor(item.status)}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Badge>
                <Badge className={getConditionColor(item.condition)}>
                  {item.condition.charAt(0).toUpperCase() + item.condition.slice(1).replace('-', ' ')}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDownloadICal(item.id)}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCopyICalLink(item.id)}
            >
              <Link className="h-4 w-4" />
            </Button>
            
            {item.status === 'available' && (
              <>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onMaintenance(item)}
                >
                  <Wrench className="h-4 w-4 mr-1" />
                  Maintenance
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
        
        {item.currentBooking && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm"><strong>Customer:</strong> {item.currentBooking.customer}</p>
            <p className="text-sm"><strong>Return Due:</strong> {item.currentBooking.endDate}</p>
            <p className="text-sm"><strong>Booking ID:</strong> {item.currentBooking.bookingId}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryItem;
