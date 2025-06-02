
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  CalendarIcon, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard,
  Shield,
  CheckCircle
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

const BookingFlow = () => {
  const { equipmentType } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const itemId = searchParams.get('item');
  const branch = searchParams.get('branch') || 'KZN';
  
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [rentalPeriod, setRentalPeriod] = useState("daily");
  
  // Sample item data
  const item = {
    id: 1,
    name: "Standard Wheelchair",
    description: "Lightweight manual wheelchair with adjustable footrests",
    dailyRate: 45,
    weeklyRate: 250,
    monthlyRate: 800,
    available: 5,
    deposit: 500
  };

  const calculateCost = () => {
    if (!startDate || !endDate) return 0;
    
    const days = differenceInDays(endDate, startDate) + 1;
    
    if (rentalPeriod === "daily") {
      return days * item.dailyRate;
    } else if (rentalPeriod === "weekly") {
      const weeks = Math.ceil(days / 7);
      return weeks * item.weeklyRate;
    } else {
      const months = Math.ceil(days / 30);
      return months * item.monthlyRate;
    }
  };

  const totalCost = calculateCost();
  const depositAmount = item.deposit;
  const totalAmount = totalCost + depositAmount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Book Equipment</h1>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                {branch} Branch
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= i ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step > i ? <CheckCircle className="h-4 w-4" /> : i}
                  </div>
                  {i < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step > i ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Select Rental Period</CardTitle>
                    <CardDescription>Choose your rental dates and duration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="start-date">Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !startDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate ? format(startDate, "PPP") : "Select start date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label htmlFor="end-date">End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !endDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endDate ? format(endDate, "PPP") : "Select end date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="rental-period">Billing Period</Label>
                      <Select value={rentalPeriod} onValueChange={setRentalPeriod}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily (R{item.dailyRate}/day)</SelectItem>
                          <SelectItem value="weekly">Weekly (R{item.weeklyRate}/week)</SelectItem>
                          <SelectItem value="monthly">Monthly (R{item.monthlyRate}/month)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={() => setStep(2)}
                      disabled={!startDate || !endDate}
                    >
                      Continue to Details
                    </Button>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Contact & Delivery Information</CardTitle>
                    <CardDescription>Please provide your details for the rental</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" placeholder="John" />
                      </div>
                      <div>
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" placeholder="Smith" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john@example.com" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" placeholder="+27 81 234 5678" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Delivery Address</Label>
                      <Textarea 
                        id="address" 
                        placeholder="Enter your full delivery address..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">Special Instructions (Optional)</Label>
                      <Textarea 
                        id="notes" 
                        placeholder="Any special delivery instructions or medical requirements..."
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button className="flex-1" onClick={() => setStep(3)}>
                        Continue to Payment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                    <CardDescription>Complete your booking with payment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-blue-900">Secure Deposit Payment</h3>
                      </div>
                      <p className="text-sm text-blue-800">
                        A deposit of R{depositAmount} is required to confirm your booking. 
                        This will be refunded upon safe return of the equipment.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Payment Method</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <Button variant="outline" className="h-16 flex flex-col gap-1">
                            <CreditCard className="h-6 w-6" />
                            <span className="text-sm">PayFast</span>
                          </Button>
                          <Button variant="outline" className="h-16 flex flex-col gap-1">
                            <CreditCard className="h-6 w-6" />
                            <span className="text-sm">Yoco</span>
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg bg-gray-50">
                        <h4 className="font-semibold mb-2">Terms & Conditions</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Equipment must be returned in original condition</li>
                          <li>• Late returns incur additional daily charges</li>
                          <li>• Damage or loss will be deducted from deposit</li>
                          <li>• Delivery and collection fees may apply</li>
                        </ul>
                      </div>

                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="terms" className="rounded" />
                        <Label htmlFor="terms" className="text-sm">
                          I agree to the terms and conditions
                        </Label>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setStep(2)}>
                        Back
                      </Button>
                      <Button className="flex-1 bg-green-600 hover:bg-green-700">
                        Complete Booking
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Branch:</span>
                      <span>{branch}</span>
                    </div>
                    {startDate && endDate && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>Period:</span>
                          <span>{differenceInDays(endDate, startDate) + 1} days</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Dates:</span>
                          <div className="text-right">
                            <div>{format(startDate, "MMM dd")}</div>
                            <div>{format(endDate, "MMM dd")}</div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Rental Cost:</span>
                      <span>R{totalCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deposit:</span>
                      <span>R{depositAmount}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>R{totalAmount}</span>
                    </div>
                  </div>

                  <Badge variant="secondary" className="w-full justify-center py-2">
                    {item.available} items available
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
