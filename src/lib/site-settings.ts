import { useQuery } from "@tanstack/react-query";
import { listSiteSettings, type SettingRow } from "@/lib/site-settings.functions";

export const DEFAULT_SETTINGS: Record<string, string> = {
  contact_phone: "01785-897167",
  contact_phone_intl: "8801785897167",
  messenger_url: "https://www.facebook.com/share/1HTm4Rz58F/",
  support_message: "Hi CineVault! আমার support দরকার।",
  bkash_number: "01785-897167",
  nagad_number: "01785-897167",
  hero_since_text: "Since 2026",
  hero_badge_text: "FIFA WC · 2026",
  footer_tagline: "Premium digital subscriptions — instant delivery, warranty, বাংলা support.",
  footer_address: "Dhaka, Bangladesh",
};

export function useSiteSettings() {
  const query = useQuery<SettingRow[]>({
    queryKey: ["site-settings"],
    queryFn: () => listSiteSettings(),
    staleTime: 60_000,
  });
  const map: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const r of query.data ?? []) map[r.key] = r.value;
  return {
    get: (key: string, fallback = "") => map[key] ?? fallback,
    all: map,
    isLoading: query.isLoading,
  };
}

export function buildWhatsAppUrl(phoneIntl: string, message: string) {
  return `https://api.whatsapp.com/send/?phone=${encodeURIComponent(phoneIntl)}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
}
