import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, Calendar as CalendarIcon, MapPin } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { getEquipmentCategories } from "@/services/categoryService";
import { checkAvailability } from "@/services/availabilityService";
import { calculateOptimalPricing, getPricingRecommendation } from "@/services/pricingService";
import PricingDisplay from "@/components/booking/PricingDisplay";

type BookingStep = 'dates' | 'details' | 'payment' | 'confirmation';

const BookingFlow = () => {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const branchParam = searchParams.get('branch');
  const branch = (branchParam === 'hilton' || branchParam === 'johannesburg') ? branchParam as 'hilton' | 'johannesburg' : null;

  const [currentStep, setCurrentStep] = useState<BookingStep>('dates');
  const [category, setCategory] = useState(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [pricing, setPricing] = useState(null);
  const [availability, setAvailability] = useState(null);
  
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    if (categoryId) {
      const categories = getEquipmentCategories();
      const foundCategory = categories.find(cat => cat.id === categoryId);
      setCategory(foundCategory);
    }
  }, [categoryId]);

  useEffect(() => {
    if (startDate && endDate && category) {
      // Calculate optimal pricing
      const pricingResult = calculateOptimalPricing(startDate, endDate, category.pricing);
      const recommendation = getPricingRecommendation(pricingResult.duration);
      
      setPricing({
        ...pricingResult,
        deliveryFee: category.delivery.baseFee,
        totalWithDelivery: pricingResult.total + category.delivery.baseFee,
        deposit: Math.round((pricingResult.total + category.delivery.baseFee) * 0.3),
        recommendation
      });

      // Check availability
      const availabilityResult = checkAvailability({
        category: category.id,
        branch,
        startDate,
        endDate,
        requestedQuantity: 1
      });
      setAvailability(availabilityResult);
    }
  }, [startDate, endDate, category, branch]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(undefined);
    } else if (startDate && !endDate && date && date >= startDate) {
      setEndDate(date);
    }
  };

  const handleContinueToDetails = () => {
    if (availability?.available) {
      setCurrentStep('details');
    }
  };

  const handleContinueToPayment = () => {
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = () => {
    // This will be implemented with PayFast integration
    alert('PayFast integration will be implemented next');
    setCurrentStep('confirmation');
  };

  if (!category || !branch) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Booking not found</h2>
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
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                if (currentStep === 'dates') {
                  navigate(`/browse/${categoryId}?branch=${branch}`);
                } else if (currentStep === 'details') {
                  setCurrentStep('dates');
                } else if (currentStep === 'payment') {
                  setCurrentStep('details');
                }
              }}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Book {category.name}
              </h1>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                {branchName} Branch
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'dates' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
              }`}>
                {currentStep === 'dates' ? '1' : '✓'}
              </div>
              <div className={`w-16 h-1 ${currentStep !== 'dates' ? 'bg-green-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'details' ? 'bg-blue-600 text-white' : 
                currentStep === 'payment' || currentStep === 'confirmation' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep === 'details' ? '2' : currentStep === 'payment' || currentStep === 'confirmation' ? '✓' : '2'}
              </div>
              <div className={`w-16 h-1 ${currentStep === 'payment' || currentStep === 'confirmation' ? 'bg-green-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'payment' ? 'bg-blue-600 text-white' : 
                currentStep === 'confirmation' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep === 'payment' ? '3' : currentStep === 'confirmation' ? '✓' : '3'}
              </div>
            </div>
          </div>

          {/* Step Content */}
          {currentStep === 'dates' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Select Rental Period
                  </CardTitle>
                  <CardDescription>
                    Choose your start and end dates. We'll automatically calculate the most cost-effective rate.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={handleDateSelect}
                        disabled={(date) => date < new Date()}
                        className="rounded-md border"
                      />
                      {startDate && !endDate && (
                        <p className="text-sm text-blue-600 mt-2 text-center">
                          Now select your end date
                        </p>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="bg-blue-50 p-3 rounded text-center">
                          <div className="font-bold text-blue-600">R{category.pricing.dailyRate}</div>
                          <div className="text-gray-600">per day</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded text-center">
                          <div className="font-bold text-green-600">R{category.pricing.weeklyRate}</div>
                          <div className="text-gray-600">per week</div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded text-center">
                          <div className="font-bold text-purple-600">R{category.pricing.monthlyRate}</div>
                          <div className="text-gray-600">per month</div>
                        </div>
                      </div>
                      
                      {startDate && (
                        <div className="space-y-2">
                          <p className="text-sm"><strong>Start Date:</strong> {format(startDate, 'PPP')}</p>
                          {endDate && (
                            <p className="text-sm"><strong>End Date:</strong> {format(endDate, 'PPP')}</p>
                          )}
                        </div>
                      )}
                      
                      {startDate && endDate && pricing && (
                        <div className="bg-blue-50 p-3 rounded-lg text-sm">
                          <p className="text-blue-800 font-medium">💡 Smart Pricing Applied</p>
                          <p className="text-blue-700">{pricing.recommendation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Booking Summary with New Pricing Logic */}
              {startDate && endDate && pricing && (
                <>
                  <PricingDisplay 
                    pricing={pricing}
                    deliveryFee={pricing.deliveryFee}
                    recommendation={pricing.recommendation}
                  />

                  {availability && (
                    <Card>
                      <CardContent className="pt-6">
                        <div className={`p-3 rounded-lg ${availability.available ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                          {availability.message}
                        </div>
                        <Button 
                          onClick={handleContinueToDetails}
                          disabled={!availability?.available}
                          className="w-full mt-4"
                          size="lg"
                        >
                          Continue to Details
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          )}

          {currentStep === 'details' && (
            <Card>
              <CardHeader>
                <CardTitle>Contact & Delivery Details</CardTitle>
                <CardDescription>
                  Please provide your contact information and delivery address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={customerDetails.name}
                      onChange={(e) => setCustomerDetails(prev => ({...prev, name: e.target.value}))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerDetails.phone}
                      onChange={(e) => setCustomerDetails(prev => ({...prev, phone: e.target.value}))}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerDetails.email}
                    onChange={(e) => setCustomerDetails(prev => ({...prev, email: e.target.value}))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Delivery Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter your full delivery address"
                    value={customerDetails.address}
                    onChange={(e) => setCustomerDetails(prev => ({...prev, address: e.target.value}))}
                    required
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Google Maps address autocomplete will be added with Supabase integration
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="notes">Special Instructions (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special delivery instructions or requirements"
                    value={customerDetails.notes}
                    onChange={(e) => setCustomerDetails(prev => ({...prev, notes: e.target.value}))}
                  />
                </div>

                <Button 
                  onClick={handleContinueToPayment}
                  disabled={!customerDetails.name || !customerDetails.email || !customerDetails.phone || !customerDetails.address}
                  className="w-full"
                  size="lg"
                >
                  Continue to Payment
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === 'payment' && (
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
                <CardDescription>
                  Secure payment processing via PayFast
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Summary */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <h3 className="font-semibold">Order Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>{category.name} ({pricing?.duration} days)</span>
                      <span>R{pricing?.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery & Setup</span>
                      <span>R{pricing?.deliveryFee}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Deposit Due Now (30%)</span>
                      <span>R{pricing?.deposit}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">PayFast Secure Payment</h4>
                  <p className="text-sm text-blue-800">
                    You will be redirected to PayFast's secure payment gateway to complete your deposit payment.
                    The remaining balance will be collected upon delivery.
                  </p>
                </div>

                <Button 
                  onClick={handlePaymentSubmit}
                  className="w-full"
                  size="lg"
                >
                  Pay Deposit - R{pricing?.deposit}
                </Button>

                <p className="text-xs text-gray-600 text-center">
                  PayFast integration requires Supabase Edge Functions for secure payment processing
                </p>
              </CardContent>
            </Card>
          )}

          {currentStep === 'confirmation' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Booking Confirmed!</CardTitle>
                <CardDescription>
                  Your rental has been successfully booked
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">What happens next?</h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• You will receive a confirmation email shortly</li>
                    <li>• Our team will contact you to schedule delivery</li>
                    <li>• Equipment will be delivered and set up for you</li>
                    <li>• Remaining balance due upon delivery</li>
                  </ul>
                </div>

                <div className="text-center space-y-4">
                  <Button onClick={() => navigate('/')} size="lg">
                    Return to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
