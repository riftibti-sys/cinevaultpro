
CREATE TABLE public.products (
  id text PRIMARY KEY,
  name text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  price integer NOT NULL DEFAULT 0,
  original_price integer,
  duration text NOT NULL DEFAULT '1 Month',
  category text NOT NULL DEFAULT 'streaming',
  accent text NOT NULL DEFAULT '#e50914',
  logo text NOT NULL DEFAULT '',
  logo_fill boolean NOT NULL DEFAULT false,
  logo_large boolean NOT NULL DEFAULT false,
  rating numeric(2,1),
  reviews integer,
  description text,
  features text[] NOT NULL DEFAULT '{}',
  warranty text,
  sort_order integer NOT NULL DEFAULT 100,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE TRIGGER products_set_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed 13 products
INSERT INTO public.products (id, name, tagline, price, original_price, duration, category, accent, logo, logo_fill, logo_large, rating, reviews, description, features, warranty, sort_order) VALUES
('netflix','Netflix','4K Ultra HD • 1 Screen',250,349,'1 Month','streaming','#e50914','https://www.google.com/s2/favicons?domain=netflix.com&sz=256',false,false,5.0,428,'Enjoy Netflix in crystal-clear 4K Ultra HD with HDR & Dolby Atmos on a private profile. Access the full global library — Hollywood, K-Drama, anime and exclusive Netflix Originals — on any device.',ARRAY['Quality: 4K Ultra HD + HDR10 / Dolby Vision','Screens: 1 dedicated private screen (PIN protected)','Devices: TV, Mobile, Laptop, Tab, Firestick','Region: Global library (US, UK, IN unlocked)','Downloads: Offline viewing supported','Delivery: Instant (within 5–30 minutes)','Warranty: Full 30-day replacement guarantee'],'30-Day Replacement Warranty',10),
('prime','Amazon Prime Video','4K HDR • Private Profile',180,249,'1 Month','streaming','#00a8e1','https://www.google.com/s2/favicons?domain=primevideo.com&sz=256',false,false,4.9,316,'Stream Prime Video in 4K UHD on your own private profile. Watch Amazon Originals, live sports, Hollywood blockbusters and Bollywood hits with unlimited downloads.',ARRAY['Quality: 4K UHD + HDR','Screens: 1 private profile (yours only)','Devices: Smart TV, Mobile, PC, Firestick, Console','Region: US / IN library unlocked','Downloads: Unlimited offline downloads','Delivery: Instant activation','Warranty: 30-day replacement guarantee'],'30-Day Replacement Warranty',20),
('yt-premium','YouTube Premium','Ad-free + YouTube Music',220,299,'1 Month','streaming','#ff0000','https://www.google.com/s2/favicons?domain=youtube.com&sz=256',false,false,5.0,512,'Watch every YouTube video ad-free in up to 4K, play in background, download offline, and get full YouTube Music Premium — all on your own personal Google account.',ARRAY['Quality: Up to 4K 60fps','Ads: 100% ad-free everywhere','Background Play + Picture-in-Picture','Includes: YouTube Music Premium','Devices: All (Mobile, TV, Web, Tablet)','Activated on YOUR own Gmail account','Delivery: 5–30 minutes • 30-day warranty'],'30-Day Replacement Warranty',30),
('hbo','HBO Max','4K UHD • Shared Profile',200,279,'1 Month','streaming','#7c3aed','/src/assets/hbomax-logo.png',true,false,4.8,184,'Get HBO Max (Max) with access to Warner Bros. movies, HBO Originals, DC Universe and Harry Potter collection in 4K UHD with Dolby Atmos sound.',ARRAY['Quality: 4K UHD + Dolby Atmos','Screens: 1 shared profile','Content: HBO Originals, WB Movies, DC, Studio Ghibli','Devices: TV, Mobile, PC, Firestick','Downloads: Offline supported','Delivery: Instant (within 30 minutes)','Warranty: 30-day full replacement'],'30-Day Replacement Warranty',40),
('chorki','Chorki','All Bangla Originals',150,199,'1 Month','streaming','#ff6a00','https://www.google.com/s2/favicons?domain=chorki.com&sz=256',false,false,4.9,267,'Bangladesh''s premium OTT — watch every Chorki Original, exclusive Bangla films and web series in Full HD on any device.',ARRAY['Quality: Full HD 1080p','Screens: 2 simultaneous streams','Content: All Chorki Originals unlocked','Devices: Mobile, TV, Web, Tab','Downloads: Offline viewing on mobile','Delivery: Instant activation','Warranty: 30-day replacement'],'30-Day Replacement Warranty',50),
('bongo','Bongo BOB','Movies + Live TV',130,179,'1 Month','streaming','#00b894','https://www.google.com/s2/favicons?domain=bongobd.com&sz=256',false,false,4.7,142,'Bongo BOB Premium — Bangla movies, natoks, live TV channels and kids content, all in one subscription.',ARRAY['Quality: Full HD 1080p','Screens: 2 devices at a time','Live TV: 40+ Bangla & international channels','Devices: Mobile, Smart TV, Web','Downloads: Available on mobile','Delivery: Instant • 30-day warranty'],'30-Day Replacement Warranty',60),
('iscreen','iScreen','Premium Access',140,199,'1 Month','streaming','#e11d48','/src/assets/iscreen-logo.png',false,true,4.8,96,'iScreen Premium — Bangladeshi streaming platform with exclusive originals, movies and live sports coverage.',ARRAY['Quality: Full HD 1080p','Screens: 1 private access','Content: iScreen Originals + Live Sports','Devices: Mobile, TV, Web','Delivery: Instant (5–30 min)','Warranty: 30-day replacement guarantee'],'30-Day Replacement Warranty',70),
('hoichoi','Hoichoi','Bengali Web Series',160,219,'1 Month','streaming','#d63031','https://www.google.com/s2/favicons?domain=hoichoi.tv&sz=256',false,false,4.9,231,'Hoichoi Premium — the largest Bengali OTT with 500+ original web series, films and shows from Kolkata & Dhaka.',ARRAY['Quality: Full HD 1080p','Screens: 1 device at a time','Content: 500+ Bengali originals & films','Devices: Mobile, Smart TV, Web, Tab','Downloads: Offline supported','Delivery: Instant activation','Warranty: 30-day replacement'],'30-Day Replacement Warranty',80),
('capcut','CapCut Pro','All Pro Effects Unlocked',300,449,'1 Month','editing','#111111','https://www.google.com/s2/favicons?domain=capcut.com&sz=256',false,false,5.0,389,'CapCut Pro on your own account — unlock every premium effect, filter, transition, AI tool and 4K export with no watermark.',ARRAY['Export: 4K 60fps, no watermark','All Pro Effects, Filters & Transitions','AI Tools: Auto Caption, BG Remover, Enhance','Cloud Storage: 100GB included','Devices: Mobile + Desktop (PC/Mac)','Activated on YOUR own account','Delivery: Instant • 30-day warranty'],'30-Day Replacement Warranty',90),
('canva','Canva Pro','Team + Premium Assets',280,399,'1 Month','editing','#00c4cc','https://www.google.com/s2/favicons?domain=canva.com&sz=256',false,false,4.9,254,'Canva Pro on your personal email — 100M+ premium assets, Magic AI tools, background remover, brand kit and 1TB cloud storage.',ARRAY['Access: 100M+ premium templates & elements','Magic AI: Design, Write, Edit, Eraser','Background Remover (1-click)','Brand Kit + Team collaboration','Storage: 1TB cloud','Activated on YOUR own email','Delivery: Instant • 30-day warranty'],'30-Day Replacement Warranty',100),
('spotify','Spotify Premium','Ad-free Music',180,249,'1 Month','music','#1db954','https://www.google.com/s2/favicons?domain=spotify.com&sz=256',false,false,5.0,471,'Spotify Premium Individual on your own account — ad-free music, high-quality audio, unlimited skips and full offline downloads.',ARRAY['Quality: Very High 320kbps audio','100% Ad-free streaming','Unlimited Skips + Play any song','Offline downloads on all devices','Devices: Mobile, PC, TV, Speakers, Car','Activated on YOUR own account','Delivery: Instant • 30-day warranty'],'30-Day Replacement Warranty',110),
('chatgpt','ChatGPT Plus','GPT-5 + Priority Access',1200,1499,'1 Month','other','#10a37f','https://www.google.com/s2/favicons?domain=openai.com&sz=256',false,false,4.9,178,'ChatGPT Plus on your own OpenAI account — access to the latest GPT-5 model, image generation, advanced voice, file uploads and priority speed even at peak hours.',ARRAY['Model: Latest GPT-5 + GPT-4o','Image Generation (DALL·E 3)','Advanced Voice + Vision mode','File & PDF uploads, Code Interpreter','Priority access during peak times','Activated on YOUR own OpenAI account','Delivery: Instant • 30-day warranty'],'30-Day Replacement Warranty',120);
