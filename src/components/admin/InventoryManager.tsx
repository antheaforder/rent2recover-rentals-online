import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Filter, 
  Plus, 
  Package, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ArrowRightLeft,
  Edit,
  Trash2,
  Wrench,
  Download,
  Link
} from "lucide-react";
import { EQUIPMENT_CATEGORIES, BRANCHES, type InventoryItem } from "@/config/equipmentCategories";
import { 
  getInventoryByBranch, 
  addInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem,
  createMaintenanceBlock,
  generateICalForItem
} from "@/services/bookingService";
import { useToast } from "@/hooks/use-toast";

interface InventoryManagerProps {
  branch: string;
}

const InventoryManager = ({ branch }: InventoryManagerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [inventory, setInventory] = useState<InventoryItem[]>(() => getInventoryByBranch(branch));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const { toast } = useToast();

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesBranch = item.branch === branch;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesBranch;
  });

  const handleAddItem = async (formData: FormData) => {
    try {
      const newItem = addInventoryItem({
        name: formData.get('name') as string,
        category: formData.get('category') as any,
        branch: branch as any,
        serialNumber: formData.get('serialNumber') as string,
        condition: formData.get('condition') as any,
        status: 'available',
        lastChecked: new Date().toISOString().split('T')[0],
        notes: formData.get('notes') as string || undefined
      });
      
      setInventory(getInventoryByBranch(branch));
      setIsAddModalOpen(false);
      toast({
        title: "Item Added",
        description: `${newItem.name} has been added to inventory`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to inventory",
        variant: "destructive"
      });
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      deleteInventoryItem(itemId);
      setInventory(getInventoryByBranch(branch));
      toast({
        title: "Item Deleted",
        description: "Item has been removed from inventory"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete item",
        variant: "destructive"
      });
    }
  };

  const handleCreateMaintenanceBlock = async (itemId: string, reason: string) => {
    try {
      createMaintenanceBlock({
        itemId,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        reason,
        createdBy: 'admin'
      });
      
      setInventory(getInventoryByBranch(branch));
      setIsMaintenanceModalOpen(false);
      toast({
        title: "Maintenance Block Created",
        description: "Item has been marked for maintenance"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create maintenance block",
        variant: "destructive"
      });
    }
  };

  const handleDownloadICal = (itemId: string) => {
    const icalContent = generateICalForItem(itemId);
    if (icalContent) {
      const blob = new Blob([icalContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${itemId}-calendar.ics`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const copyICalLink = (itemId: string) => {
    const icalUrl = `https://rent2recover.com/api/ical/${itemId}`;
    navigator.clipboard.writeText(icalUrl);
    toast({
      title: "iCal Link Copied",
      description: "Calendar link has been copied to clipboard"
    });
  };

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

  const currentBranch = BRANCHES.find(b => b.id === branch);

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Equipment Inventory</h2>
          <p className="text-gray-600">Manage equipment for {currentBranch?.name}</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Equipment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Equipment</DialogTitle>
              <DialogDescription>Add a new item to the inventory</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddItem(new FormData(e.target as HTMLFormElement));
            }} className="space-y-4">
              <div>
                <Label htmlFor="name">Equipment Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EQUIPMENT_CATEGORIES.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input id="serialNumber" name="serialNumber" required />
              </div>
              <div>
                <Label htmlFor="condition">Condition</Label>
                <Select name="condition" defaultValue="excellent">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="needs-repair">Needs Repair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea id="notes" name="notes" />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Item</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by ID, name, or serial..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="transfer">In Transfer</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {EQUIPMENT_CATEGORIES.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Advanced
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Grid */}
      <div className="grid gap-4">
        {filteredInventory.map((item) => (
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
                    onClick={() => handleDownloadICal(item.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyICalLink(item.id)}
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
                        onClick={() => {
                          setSelectedItem(item);
                          setIsMaintenanceModalOpen(true);
                        }}
                      >
                        <Wrench className="h-4 w-4 mr-1" />
                        Maintenance
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteItem(item.id)}
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
        ))}

        {filteredInventory.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No equipment found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or add new equipment</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Maintenance Modal */}
      <Dialog open={isMaintenanceModalOpen} onOpenChange={setIsMaintenanceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Maintenance Block</DialogTitle>
            <DialogDescription>
              Mark {selectedItem?.name} ({selectedItem?.id}) for maintenance
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const reason = formData.get('reason') as string;
            if (selectedItem) {
              handleCreateMaintenanceBlock(selectedItem.id, reason);
            }
          }} className="space-y-4">
            <div>
              <Label htmlFor="reason">Maintenance Reason</Label>
              <Textarea id="reason" name="reason" required placeholder="Describe the maintenance required..." />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setIsMaintenanceModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Maintenance Block</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryManager;
