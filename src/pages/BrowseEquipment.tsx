
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin } from "lucide-react";
import { getEquipmentCategories } from "@/services/categoryService";
import { getInventoryByCategory } from "@/services/inventoryService";

const BrowseEquipment = () => {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const branchParam = searchParams.get('branch');
  const branch = (branchParam === 'hilton' || branchParam === 'johannesburg') ? branchParam : null;

  const [category, setCategory] = useState(null);
  const [availableItems, setAvailableItems] = useState([]);

  useEffect(() => {
    if (categoryId) {
      const categories = getEquipmentCategories();
      const foundCategory = categories.find(cat => cat.id === categoryId);
      setCategory(foundCategory);

      if (foundCategory) {
        const inventory = getInventoryByCategory(categoryId);
        const branchItems = inventory.filter(item => 
          item.branch === branch && item.status === 'available'
        );
        setAvailableItems(branchItems);
      }
    }
  }, [categoryId, branch]);

  const handleBookNow = () => {
    navigate(`/book/${categoryId}?branch=${branch}`);
  };

  if (!category || !branch) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Category not found</h2>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  const branchName = branch === 'hilton' ? 'Hilton' : 'Johannesburg';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Browse {category.name}
                </h1>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {branchName} Branch
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Equipment Summary Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center">{category.name}</CardTitle>
              <CardDescription className="text-center">
                {availableItems.length > 0 ? 
                  `${availableItems.length} Available at ${branchName}` : 
                  `Currently unavailable at ${branchName}`
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pricing Display */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    R{category.pricing.dailyRate}
                  </div>
                  <div className="text-sm text-gray-600">per day</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    R{category.pricing.weeklyRate}
                  </div>
                  <div className="text-sm text-gray-600">per week</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    R{category.pricing.monthlyRate}
                  </div>
                  <div className="text-sm text-gray-600">per month</div>
                </div>
              </div>

              {/* Availability Badge */}
              <div className="text-center">
                <Badge 
                  variant="secondary" 
                  className={availableItems.length > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {availableItems.length > 0 ? 
                    `${availableItems.length} Available` : 
                    'Currently Unavailable'
                  }
                </Badge>
              </div>

              {/* Book Now Button */}
              <div className="text-center pt-4">
                <Button 
                  onClick={handleBookNow}
                  disabled={availableItems.length === 0}
                  size="lg"
                  className="px-8"
                >
                  Book Now
                </Button>
              </div>

              {availableItems.length === 0 && (
                <div className="text-center text-sm text-gray-600 mt-4">
                  <p>This equipment is currently unavailable at {branchName}.</p>
                  <p>Please check back later or contact us for alternative options.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Delivery Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Standard Delivery:</strong> R{category.delivery.baseFee}</p>
                  <p><strong>Setup Included:</strong> Free installation and demonstration</p>
                  <p><strong>Delivery Area:</strong> {branchName} and surrounding areas</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rental Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Minimum Rental:</strong> 1 day</p>
                  <p><strong>Deposit Required:</strong> 30% of total cost</p>
                  <p><strong>Sanitized:</strong> All equipment thoroughly cleaned</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseEquipment;
