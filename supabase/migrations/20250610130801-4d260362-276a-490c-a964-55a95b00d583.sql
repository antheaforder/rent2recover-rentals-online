
-- Enable RLS on inventory_items table (if not already enabled)
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to insert inventory items
CREATE POLICY "Allow authenticated users to insert inventory items" 
ON public.inventory_items 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Create policy to allow authenticated users to select inventory items
CREATE POLICY "Allow authenticated users to select inventory items" 
ON public.inventory_items 
FOR SELECT 
TO authenticated 
USING (true);

-- Create policy to allow authenticated users to update inventory items
CREATE POLICY "Allow authenticated users to update inventory items" 
ON public.inventory_items 
FOR UPDATE 
TO authenticated 
USING (true);

-- Create policy to allow authenticated users to delete inventory items
CREATE POLICY "Allow authenticated users to delete inventory items" 
ON public.inventory_items 
FOR DELETE 
TO authenticated 
USING (true);
