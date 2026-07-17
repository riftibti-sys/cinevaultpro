
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

DROP POLICY IF EXISTS "Anyone can submit a review" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can ask a question" ON public.questions;

CREATE POLICY "Authenticated users can submit their own review"
  ON public.reviews FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own review"
  ON public.reviews FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can submit their own question"
  ON public.questions FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND length(btrim(name)) > 0 AND length(name) <= 60
    AND length(btrim(question)) > 0 AND length(question) <= 500
    AND answer IS NULL AND answered_at IS NULL
  );

CREATE POLICY "Users can delete their own question"
  ON public.questions FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
