CREATE TABLE public.questions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id text NOT NULL,
  name text NOT NULL,
  question text NOT NULL,
  answer text,
  answered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.questions TO anon, authenticated;
GRANT ALL ON public.questions TO service_role;

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view questions" ON public.questions
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Anyone can ask a question" ON public.questions
  FOR INSERT TO anon, authenticated WITH CHECK (
    length(trim(name)) > 0 AND length(name) <= 60
    AND length(trim(question)) > 0 AND length(question) <= 500
    AND answer IS NULL AND answered_at IS NULL
  );

CREATE INDEX questions_product_id_created_at_idx
  ON public.questions (product_id, created_at DESC);