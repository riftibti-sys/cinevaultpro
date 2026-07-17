DROP POLICY IF EXISTS "Anyone can submit an order request" ON public.orders;

CREATE POLICY "Authenticated users can submit orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND length(btrim(product_name)) > 0 AND length(product_name) <= 200
  AND length(btrim(full_name)) > 0 AND length(full_name) <= 100
  AND length(btrim(phone)) >= 5 AND length(phone) <= 20
  AND length(btrim(address)) > 0 AND length(address) <= 300
  AND (email IS NULL OR length(email) <= 255)
  AND (notes IS NULL OR length(notes) <= 500)
  AND status = 'new'
);

REVOKE INSERT ON public.orders FROM anon;