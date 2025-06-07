
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { EQUIPMENT_CATEGORIES, type EquipmentCategoryId, type EquipmentCategory } from "@/config/equipmentCategories";
import { getEquipmentCategories } from "@/services/categoryService";

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: EquipmentCategoryId | null;
  onUpdate: (categoryId: EquipmentCategoryId, updates: Partial<EquipmentCategory>) => void;
  mode: 'edit' | 'add';
}

const CategoryManagerModal = ({
  isOpen,
  onClose,
  category,
  onUpdate,
  mode
}: CategoryManagerModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    weeklyRate: 0,
    monthlyRate: 0,
    baseFee: 50,
    crossBranchSurcharge: 150,
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const categoryInfo = EQUIPMENT_CATEGORIES.find(cat => cat.id === category);
  const categories = getEquipmentCategories();
  const currentCategory = categories.find(c => c.id === category);

  useEffect(() => {
    if (mode === 'edit' && currentCategory) {
      setFormData({
        name: currentCategory.name,
        weeklyRate: currentCategory.pricing.weeklyRate,
        monthlyRate: currentCategory.pricing.monthlyRate,
        baseFee: currentCategory.delivery.baseFee,
        crossBranchSurcharge: currentCategory.delivery.crossBranchSurcharge,
        imageUrl: currentCategory.imageUrl || ''
      });
      setImagePreview(currentCategory.imageUrl || '');
    } else if (mode === 'add') {
      setFormData({
        name: '',
        weeklyRate: 0,
        monthlyRate: 0,
        baseFee: 50,
        crossBranchSurcharge: 150,
        imageUrl: ''
      });
      setImagePreview('');
    }
  }, [mode, currentCategory, isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (.jpg, .png, .webp)');
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image file must be smaller than 2MB');
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setFormData(prev => ({ ...prev, imageUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category) {
      onUpdate(category, {
        name: formData.name,
        imageUrl: formData.imageUrl,
        pricing: {
          weeklyRate: Number(formData.weeklyRate),
          monthlyRate: Number(formData.monthlyRate)
        },
        delivery: {
          baseFee: Number(formData.baseFee),
          crossBranchSurcharge: Number(formData.crossBranchSurcharge)
        }
      });
    }
  };

  if (!category && mode === 'edit') return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add New Category' : 'Edit Category'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' 
              ? 'Create a new equipment category with pricing and image'
              : `Configure settings for ${categoryInfo?.name}`
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Name */}
          <div>
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              disabled={mode === 'edit'}
              className={mode === 'edit' ? 'bg-gray-50' : ''}
            />
            {mode === 'edit' && (
              <p className="text-xs text-gray-500 mt-1">Category name cannot be changed</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <Label>Category Image</Label>
            <div className="space-y-2">
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Category preview" 
                    className="w-full h-32 object-cover rounded-md border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                  <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">No image uploaded</p>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </span>
                  </Button>
                </Label>
                <div className="text-xs text-gray-500">
                  <p>Max 2MB • .jpg, .png, .webp</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weeklyRate">Weekly Price (ZAR)</Label>
              <Input
                id="weeklyRate"
                type="number"
                value={formData.weeklyRate}
                onChange={(e) => setFormData(prev => ({ ...prev, weeklyRate: Number(e.target.value) }))}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="monthlyRate">Monthly Price (ZAR)</Label>
              <Input
                id="monthlyRate"
                type="number"
                value={formData.monthlyRate}
                onChange={(e) => setFormData(prev => ({ ...prev, monthlyRate: Number(e.target.value) }))}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Delivery Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="baseFee">Base Delivery Fee (ZAR)</Label>
              <Input
                id="baseFee"
                type="number"
                value={formData.baseFee}
                onChange={(e) => setFormData(prev => ({ ...prev, baseFee: Number(e.target.value) }))}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="crossBranchSurcharge">Cross-Branch Surcharge (ZAR)</Label>
              <Input
                id="crossBranchSurcharge"
                type="number"
                value={formData.crossBranchSurcharge}
                onChange={(e) => setFormData(prev => ({ ...prev, crossBranchSurcharge: Number(e.target.value) }))}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'add' ? 'Create Category' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryManagerModal;
