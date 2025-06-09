import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, User, Phone, Mail } from "lucide-react";
import { BookingData } from "@/hooks/useBookingWorkflow";
import AddressAutocomplete from "./AddressAutocomplete";

interface CustomerInfoProps {
  customerInfo: BookingData['customerInfo'];
  onInfoSubmit: (info: BookingData['customerInfo']) => void;
  onBack: () => void;
}

const CustomerInfo = ({ customerInfo, onInfoSubmit, onBack }: CustomerInfoProps) => {
  const [formData, setFormData] = useState(customerInfo);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.deliveryAddress.trim()) newErrors.deliveryAddress = "Delivery address is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation (South African format)
    const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Please enter a valid South African phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onInfoSubmit(formData);
    }
  };

  const updateField = (field: keyof BookingData['customerInfo'], value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Information</h1>
            <p className="text-gray-600">Please provide your contact and delivery details</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Contact & Delivery Details</CardTitle>
                <CardDescription>
                  All fields marked with * are required for processing your rental request
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">Personal Information</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => updateField('firstName', e.target.value)}
                        placeholder="John"
                        className={errors.firstName ? 'border-red-500' : ''}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => updateField('lastName', e.target.value)}
                        placeholder="Smith"
                        className={errors.lastName ? 'border-red-500' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">Contact Information</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="+27 81 234 5678"
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="john@example.com"
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delivery Information with Google Maps Autocomplete */}
                <div>
                  <h3 className="font-semibold mb-4">Delivery Information</h3>
                  <div className="space-y-4">
                    <AddressAutocomplete
                      value={formData.deliveryAddress}
                      onChange={(address) => updateField('deliveryAddress', address)}
                      label="Full Delivery Address"
                      placeholder="Start typing your address..."
                      required
                      className={errors.deliveryAddress ? 'border-red-500' : ''}
                    />
                    {errors.deliveryAddress && (
                      <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>
                    )}
                    
                    <div>
                      <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                      <Textarea
                        id="specialInstructions"
                        value={formData.specialInstructions}
                        onChange={(e) => updateField('specialInstructions', e.target.value)}
                        placeholder="Access instructions, medical requirements, preferred delivery time, etc."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={handleSubmit} className="w-full" size="lg">
                  Submit Quote Request
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Information Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Important Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">What happens next?</h4>
                  <ol className="list-decimal list-inside space-y-1 text-gray-600">
                    <li>We'll review your quote request</li>
                    <li>Contact you within 2 hours to confirm</li>
                    <li>Send payment link for deposit</li>
                    <li>Schedule delivery once paid</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Delivery Information</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Free delivery within 25km</li>
                    <li>• Setup and instruction included</li>
                    <li>• 1-2 day delivery timeframe</li>
                    <li>• Collection arranged at rental end</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Need Help?</h4>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>0800 RENT2RECOVER</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>help@rent2recover.co.za</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;
