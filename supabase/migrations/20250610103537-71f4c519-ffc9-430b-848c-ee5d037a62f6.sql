
-- Create equipment_categories table
CREATE TABLE public.equipment_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  pricing JSONB NOT NULL DEFAULT '{"dailyRate": 0, "weeklyRate": 0, "monthlyRate": 0}'::jsonb,
  delivery JSONB NOT NULL DEFAULT '{"baseFee": 50, "crossBranchSurcharge": 150}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inventory_items table
CREATE TABLE public.inventory_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  branch TEXT NOT NULL,
  serial_number TEXT NOT NULL UNIQUE,
  condition TEXT NOT NULL DEFAULT 'excellent',
  status TEXT NOT NULL DEFAULT 'available',
  last_checked DATE,
  notes TEXT,
  purchase_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for equipment_categories
ALTER TABLE public.equipment_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view equipment categories" 
  ON public.equipment_categories 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage equipment categories" 
  ON public.equipment_categories 
  FOR ALL 
  TO authenticated
  USING (true);

-- Add RLS policies for inventory_items
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view inventory items" 
  ON public.inventory_items 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage inventory items" 
  ON public.inventory_items 
  FOR ALL 
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_inventory_items_category ON public.inventory_items(category);
CREATE INDEX idx_inventory_items_branch ON public.inventory_items(branch);
CREATE INDEX idx_inventory_items_status ON public.inventory_items(status);
CREATE INDEX idx_inventory_items_serial_number ON public.inventory_items(serial_number);

-- Add trigger to update updated_at column
CREATE TRIGGER update_equipment_categories_updated_at
  BEFORE UPDATE ON public.equipment_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_items_updated_at
  BEFORE UPDATE ON public.inventory_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
