
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, User, Mail, Phone, MapPin } from "lucide-react";

interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

interface CustomerDetailsFormProps {
  customerDetails: CustomerDetails;
  onDetailsSubmit: (details: CustomerDetails) => void;
  onNext: () => void;
  onBack: () => void;
}

const CustomerDetailsForm = ({ customerDetails, onDetailsSubmit, onNext, onBack }: CustomerDetailsFormProps) => {
  const [formData, setFormData] = useState<CustomerDetails>(customerDetails);
  const [errors, setErrors] = useState<Partial<CustomerDetails>>({});

  const validateForm = () => {
    const newErrors: Partial<CustomerDetails> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Delivery address is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onDetailsSubmit(formData);
      onNext();
    }
  };

  const updateField = (field: keyof CustomerDetails, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Your Details</h2>
          <p className="text-gray-600">We need some information to process your rental</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Contact & Delivery Information
          </CardTitle>
          <CardDescription>
            Please provide accurate details for delivery and communication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              placeholder="John Smith"
              className={errors.fullName ? 'border-red-500' : ''}
            />
            {errors.fullName && (
              <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="john@example.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+27 81 234 5678"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Delivery Address *
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="Please provide your full delivery address including street address, suburb, city, and postal code"
              className={`min-h-[100px] ${errors.address ? 'border-red-500' : ''}`}
            />
            {errors.address && (
              <p className="text-sm text-red-600 mt-1">{errors.address}</p>
            )}
          </div>

          <div>
            <Label htmlFor="notes">Special Instructions (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Any special delivery instructions, medical requirements, or other notes..."
              className="min-h-[80px]"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Privacy Notice</h4>
            <p className="text-sm text-blue-800">
              Your information will only be used to process your rental and provide customer support. 
              We do not share your details with third parties.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Button onClick={handleSubmit} className="px-8 py-3">
          Continue to Quote Review
        </Button>
      </div>
    </div>
  );
};

export default CustomerDetailsForm;
