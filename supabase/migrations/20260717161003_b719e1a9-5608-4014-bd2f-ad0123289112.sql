
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  label TEXT NOT NULL,
  description TEXT,
  group_name TEXT NOT NULL DEFAULT 'general',
  sort_order INTEGER NOT NULL DEFAULT 100,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TRIGGER trg_site_settings_updated
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_settings (key, value, label, description, group_name, sort_order) VALUES
  ('contact_phone', '01785-897167', 'Contact Phone (display)', 'Shown on the site (with dash)', 'contact', 10),
  ('contact_phone_intl', '8801785897167', 'WhatsApp Number (intl, digits only)', 'Used in wa.me / WhatsApp links. Format: 8801XXXXXXXXX', 'contact', 20),
  ('messenger_url', 'https://m.me/cinevault', 'Messenger URL', 'Facebook Messenger link (m.me/<username>)', 'contact', 30),
  ('support_message', 'Hi CineVault! আমার support দরকার।', 'Default WhatsApp Support Message', 'Pre-filled message for WhatsApp support links', 'contact', 40),
  ('bkash_number', '01785-897167', 'bKash Number', 'Displayed on checkout', 'payment', 10),
  ('nagad_number', '01785-897167', 'Nagad Number', 'Displayed on checkout', 'payment', 20),
  ('hero_since_text', 'Since 2026', 'Header "Since" Text', 'Small label next to CineVault in the header', 'branding', 10),
  ('hero_badge_text', 'FIFA WC · 2026', 'Header Badge Text', 'Small badge (World Cup theme)', 'branding', 20),
  ('footer_tagline', 'Premium digital subscriptions — instant delivery, warranty, বাংলা support.', 'Footer Tagline', 'Short brand line in the footer', 'footer', 10),
  ('footer_address', 'Dhaka, Bangladesh', 'Footer Address', 'Address shown in footer contact block', 'footer', 20);
