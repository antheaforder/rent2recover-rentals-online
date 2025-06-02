
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

interface EquipmentCardProps {
  item: EquipmentItem;
  branch: string;
  otherBranch: string;
}

const EquipmentCard = ({ item, branch, otherBranch }: EquipmentCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gray-200 flex items-center justify-center">
        <div className="text-gray-400">Equipment Image</div>
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          <div className="text-right">
            <Badge variant="outline" className="text-green-600 border-green-600 mb-1">
              {item.available} Available
            </Badge>
            <div className="text-xs text-gray-500">at {branch}</div>
          </div>
        </div>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>Weekly:</span>
            <span className="font-semibold">R{item.weeklyRate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Monthly:</span>
            <span className="font-semibold">R{item.monthlyRate}</span>
          </div>
        </div>
        
        {item.available === 0 && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>Available at {otherBranch} branch</span>
            </div>
            <p className="text-xs text-yellow-700 mt-1">Additional delivery fees apply</p>
          </div>
        )}
        
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate(`/book/${item.category}?item=${item.id}&branch=${branch}`)}
          disabled={item.available === 0}
        >
          {item.available > 0 ? 'Book Now' : 'Check Other Branch'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EquipmentCard;
