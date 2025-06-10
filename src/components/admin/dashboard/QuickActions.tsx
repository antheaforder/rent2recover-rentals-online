
import { Card, CardContent } from "@/components/ui/card";
import { 
  Package,
  Users,
  CheckCircle
} from "lucide-react";

const QuickActions = () => {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-6 text-center">
          <Package className="h-8 w-8 mx-auto mb-2 text-blue-500" />
          <h3 className="font-semibold">Add Equipment</h3>
          <p className="text-sm text-gray-600">Register new rental items</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-6 text-center">
          <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
          <h3 className="font-semibold">Process Return</h3>
          <p className="text-sm text-gray-600">Check in returned equipment</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-8 w-8 mx-auto mb-2 text-purple-500" />
          <h3 className="font-semibold">Approve Quote</h3>
          <p className="text-sm text-gray-600">Review pending quotes</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActions;
