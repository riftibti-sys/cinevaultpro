CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.orders TO anon, authenticated;
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an order request"
  ON public.orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(btrim(product_name)) > 0 AND length(product_name) <= 200
    AND length(btrim(full_name)) > 0 AND length(full_name) <= 100
    AND length(btrim(phone)) >= 5 AND length(phone) <= 20
    AND length(btrim(address)) > 0 AND length(address) <= 300
    AND (email IS NULL OR length(email) <= 255)
    AND (notes IS NULL OR length(notes) <= 500)
    AND status = 'new'
  );

CREATE TRIGGER orders_set_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
