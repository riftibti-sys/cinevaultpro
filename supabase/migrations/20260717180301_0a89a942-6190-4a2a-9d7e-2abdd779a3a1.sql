
CREATE TABLE public.combos (
  id text PRIMARY KEY,
  title text NOT NULL,
  subtitle text NOT NULL DEFAULT '',
  tag text NOT NULL DEFAULT '',
  duration text NOT NULL DEFAULT '1 Month',
  price integer NOT NULL DEFAULT 0,
  original_price integer NOT NULL DEFAULT 0,
  gradient text NOT NULL DEFAULT 'linear-gradient(135deg, #1a0000 0%, #6b0f14 100%)',
  glow text NOT NULL DEFAULT 'rgba(229,9,20,0.35)',
  perks text[] NOT NULL DEFAULT '{}',
  services jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order integer NOT NULL DEFAULT 100,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.combos TO anon, authenticated;
GRANT ALL ON public.combos TO service_role;

ALTER TABLE public.combos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active combos" ON public.combos
  FOR SELECT USING (is_active = true);

CREATE TRIGGER combos_set_updated_at BEFORE UPDATE ON public.combos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed existing combos
INSERT INTO public.combos (id, title, subtitle, tag, duration, price, original_price, gradient, glow, perks, services, sort_order) VALUES
('combo-netflix-prime','Netflix + Amazon Prime','Hollywood-এর সব — এক প্যাকেজে','MOST POPULAR','1 Month',370,430,
  'linear-gradient(135deg, #1a0000 0%, #6b0f14 45%, #003a55 100%)','rgba(229, 9, 20, 0.35)',
  ARRAY['4K Ultra HD','Private Profile','Instant Delivery'],
  '[{"name":"Netflix","logo":"https://www.google.com/s2/favicons?domain=netflix.com&sz=256","accent":"#e50914"},{"name":"Prime Video","logo":"https://www.google.com/s2/favicons?domain=primevideo.com&sz=256","accent":"#00a8e1"}]'::jsonb,10),
('combo-netflix-spotify','Netflix + Spotify Premium','সিনেমা দেখো, গান শোনো — একসাথে','ENTERTAINMENT','1 Month',380,430,
  'linear-gradient(135deg, #0a2a12 0%, #0d5c2b 45%, #6b0f14 100%)','rgba(29, 185, 84, 0.35)',
  ARRAY['Ad-free Music','4K Video','Offline Downloads'],
  '[{"name":"Netflix","logo":"https://www.google.com/s2/favicons?domain=netflix.com&sz=256","accent":"#e50914"},{"name":"Spotify","logo":"https://www.google.com/s2/favicons?domain=spotify.com&sz=256","accent":"#1db954"}]'::jsonb,20),
('combo-yt-spotify','YouTube Premium + Spotify','সব music platform — একদম ad-free','MUSIC LOVERS','1 Month',340,400,
  'linear-gradient(135deg, #2a0000 0%, #b30000 45%, #0d5c2b 100%)','rgba(255, 0, 0, 0.30)',
  ARRAY['No Ads','Background Play','YT Music Included'],
  '[{"name":"YouTube","logo":"https://www.google.com/s2/favicons?domain=youtube.com&sz=256","accent":"#ff0000"},{"name":"Spotify","logo":"https://www.google.com/s2/favicons?domain=spotify.com&sz=256","accent":"#1db954"}]'::jsonb,30),
('combo-bangla-triple','Chorki + Hoichoi + Bongo','বাংলা কন্টেন্ট — সবকিছু এক জায়গায়','BANGLA BUNDLE','1 Month',380,540,
  'linear-gradient(135deg, #2a1200 0%, #b34700 40%, #620000 100%)','rgba(255, 106, 0, 0.35)',
  ARRAY['Web Series','Live TV','Bangla Originals'],
  '[{"name":"Chorki","logo":"https://www.google.com/s2/favicons?domain=chorki.com&sz=256","accent":"#ff6a00"},{"name":"Hoichoi","logo":"https://www.google.com/s2/favicons?domain=hoichoi.tv&sz=256","accent":"#d63031"},{"name":"Bongo","logo":"https://www.google.com/s2/favicons?domain=bongobd.com&sz=256","accent":"#00b894"}]'::jsonb,40),
('combo-creator','CapCut Pro + Canva Pro','Content creator-দের জন্য perfect combo','CREATOR PACK','1 Month',500,700,
  'linear-gradient(135deg, #001f24 0%, #006970 45%, #101010 100%)','rgba(0, 196, 204, 0.35)',
  ARRAY['All Pro Effects','Premium Templates','Team Access'],
  '[{"name":"CapCut","logo":"https://www.google.com/s2/favicons?domain=capcut.com&sz=256","accent":"#111111"},{"name":"Canva","logo":"https://www.google.com/s2/favicons?domain=canva.com&sz=256","accent":"#00c4cc"}]'::jsonb,50),
('combo-ultimate','Netflix + Prime + Spotify','Ultimate entertainment — সব একসাথে','BEST VALUE','1 Month',550,700,
  'linear-gradient(135deg, #1a0000 0%, #6b0f14 30%, #003a55 65%, #0d5c2b 100%)','rgba(229, 9, 20, 0.4)',
  ARRAY['4K UHD','Ad-free','Instant Delivery','24/7 Support'],
  '[{"name":"Netflix","logo":"https://www.google.com/s2/favicons?domain=netflix.com&sz=256","accent":"#e50914"},{"name":"Prime Video","logo":"https://www.google.com/s2/favicons?domain=primevideo.com&sz=256","accent":"#00a8e1"},{"name":"Spotify","logo":"https://www.google.com/s2/favicons?domain=spotify.com&sz=256","accent":"#1db954"}]'::jsonb,60);

-- Hero panel editable settings
INSERT INTO public.site_settings (key, value, label, description, group_name, sort_order) VALUES
('hero_featured_ids','netflix,prime,yt-premium,hbo,spotify,capcut,chatgpt,chorki','Hero featured product IDs','Comma-separated product IDs to show in hero carousel (in order).','hero',10),
('hero_recommended_text','● Recommended','Hero badge text',null,'hero',20),
('hero_starts_text','Starts at','Hero "Starts at" label',null,'hero',30),
('hero_shop_text','Shop Now','Hero shop button text',null,'hero',40)
ON CONFLICT (key) DO NOTHING;
