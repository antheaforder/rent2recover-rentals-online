
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Edit, 
  Trash2, 
  Wrench, 
  Download, 
  Link,
  LogIn,
  LogOut,
  Calendar
} from "lucide-react";
import { type InventoryItem } from "@/config/equipmentCategories";

interface InventoryItemsListProps {
  items: InventoryItem[];
  onCheckIn: (itemId: string) => void;
  onCheckOut: (itemId: string) => void;
  onMaintenance: (itemId: string, reason: string) => void;
  onDelete: (itemId: string) => void;
  onDownloadICal: (itemId: string) => void;
  onCopyICalLink: (itemId: string) => void;
}

const InventoryItemsList = ({ 
  items, 
  onCheckIn,
  onCheckOut,
  onMaintenance, 
  onDelete,
  onDownloadICal,
  onCopyICalLink
}: InventoryItemsListProps) => {
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

  const handleMaintenanceClick = (item: InventoryItem) => {
    const reason = prompt("Enter maintenance reason:");
    if (reason) {
      onMaintenance(item.id, reason);
    }
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Items Found</h3>
          <p className="text-gray-600">No inventory items found for this category and branch.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
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
                    <span>•</span>
                    <span>Last checked: {item.lastChecked}</span>
                  </div>
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
                {/* Calendar Actions */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDownloadICal(item.id)}
                  title="Download iCal"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCopyICalLink(item.id)}
                  title="Copy iCal Link"
                >
                  <Link className="h-4 w-4" />
                </Button>

                {/* Status Management */}
                {item.status === 'available' && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onCheckOut(item.id)}
                      title="Check Out"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Check Out
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleMaintenanceClick(item)}
                      title="Mark for Maintenance"
                    >
                      <Wrench className="h-4 w-4 mr-1" />
                      Maintenance
                    </Button>
                  </>
                )}

                {(item.status === 'booked' || item.status === 'maintenance') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onCheckIn(item.id)}
                    title="Check In"
                  >
                    <LogIn className="h-4 w-4 mr-1" />
                    Check In
                  </Button>
                )}

                {/* Edit and Delete */}
                <Button size="sm" variant="outline" title="Edit Item">
                  <Edit className="h-4 w-4" />
                </Button>
                
                {item.status === 'available' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onDelete(item.id)}
                    title="Delete Item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
      ))}
    </div>
  );
};

export default InventoryItemsList;
