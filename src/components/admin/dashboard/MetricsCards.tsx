
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar,
  Package,
  AlertTriangle,
  Wrench
} from "lucide-react";

interface MetricsCardsProps {
  stats: {
    bookingsToday: number;
    returnsToday: number;
    overdueReturns: number;
    bookedEquipment: number;
    availableEquipment: number;
    maintenanceItems: number;
  };
}

const MetricsCards = ({ stats }: MetricsCardsProps) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bookings Today</p>
              <p className="text-3xl font-bold text-blue-600">{stats.bookingsToday}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-400" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Returns due: {stats.returnsToday}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Equipment Out</p>
              <p className="text-3xl font-bold text-green-600">{stats.bookedEquipment}</p>
            </div>
            <Package className="h-8 w-8 text-green-400" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Available: {stats.availableEquipment}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue Returns</p>
              <p className="text-3xl font-bold text-red-600">{stats.overdueReturns}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Requires immediate attention</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maintenance</p>
              <p className="text-3xl font-bold text-orange-600">{stats.maintenanceItems}</p>
            </div>
            <Wrench className="h-8 w-8 text-orange-400" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Items under repair</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsCards;
