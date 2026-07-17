import type { Product } from "./products";

export type Combo = {
  id: string;
  title: string;
  subtitle: string;
  services: Array<{ name: string; logo: string; accent: string }>;
  price: number;
  originalPrice: number;
  duration: string;
  gradient: string;         // CSS gradient for banner background
  glow: string;             // rgba for outer glow
  tag: string;              // e.g. "MOST POPULAR"
  perks: string[];
};

const favicon = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;

export const combos: Combo[] = [
  {
    id: "combo-netflix-prime",
    title: "Netflix + Amazon Prime",
    subtitle: "Hollywood-এর সব — এক প্যাকেজে",
    services: [
      { name: "Netflix", logo: favicon("netflix.com"), accent: "#e50914" },
      { name: "Prime Video", logo: favicon("primevideo.com"), accent: "#00a8e1" },
    ],
    price: 370,
    originalPrice: 430,
    duration: "1 Month",
    gradient: "linear-gradient(135deg, #1a0000 0%, #6b0f14 45%, #003a55 100%)",
    glow: "rgba(229, 9, 20, 0.35)",
    tag: "MOST POPULAR",
    perks: ["4K Ultra HD", "Private Profile", "Instant Delivery"],
  },
  {
    id: "combo-netflix-spotify",
    title: "Netflix + Spotify Premium",
    subtitle: "সিনেমা দেখো, গান শোনো — একসাথে",
    services: [
      { name: "Netflix", logo: favicon("netflix.com"), accent: "#e50914" },
      { name: "Spotify", logo: favicon("spotify.com"), accent: "#1db954" },
    ],
    price: 380,
    originalPrice: 430,
    duration: "1 Month",
    gradient: "linear-gradient(135deg, #0a2a12 0%, #0d5c2b 45%, #6b0f14 100%)",
    glow: "rgba(29, 185, 84, 0.35)",
    tag: "ENTERTAINMENT",
    perks: ["Ad-free Music", "4K Video", "Offline Downloads"],
  },
  {
    id: "combo-yt-spotify",
    title: "YouTube Premium + Spotify",
    subtitle: "সব music platform — একদম ad-free",
    services: [
      { name: "YouTube", logo: favicon("youtube.com"), accent: "#ff0000" },
      { name: "Spotify", logo: favicon("spotify.com"), accent: "#1db954" },
    ],
    price: 340,
    originalPrice: 400,
    duration: "1 Month",
    gradient: "linear-gradient(135deg, #2a0000 0%, #b30000 45%, #0d5c2b 100%)",
    glow: "rgba(255, 0, 0, 0.30)",
    tag: "MUSIC LOVERS",
    perks: ["No Ads", "Background Play", "YT Music Included"],
  },
  {
    id: "combo-bangla-triple",
    title: "Chorki + Hoichoi + Bongo",
    subtitle: "বাংলা কন্টেন্ট — সবকিছু এক জায়গায়",
    services: [
      { name: "Chorki", logo: favicon("chorki.com"), accent: "#ff6a00" },
      { name: "Hoichoi", logo: favicon("hoichoi.tv"), accent: "#d63031" },
      { name: "Bongo", logo: favicon("bongobd.com"), accent: "#00b894" },
    ],
    price: 380,
    originalPrice: 540,
    duration: "1 Month",
    gradient: "linear-gradient(135deg, #2a1200 0%, #b34700 40%, #620000 100%)",
    glow: "rgba(255, 106, 0, 0.35)",
    tag: "BANGLA BUNDLE",
    perks: ["Web Series", "Live TV", "Bangla Originals"],
  },
  {
    id: "combo-creator",
    title: "CapCut Pro + Canva Pro",
    subtitle: "Content creator-দের জন্য perfect combo",
    services: [
      { name: "CapCut", logo: favicon("capcut.com"), accent: "#111111" },
      { name: "Canva", logo: favicon("canva.com"), accent: "#00c4cc" },
    ],
    price: 500,
    originalPrice: 700,
    duration: "1 Month",
    gradient: "linear-gradient(135deg, #001f24 0%, #006970 45%, #101010 100%)",
    glow: "rgba(0, 196, 204, 0.35)",
    tag: "CREATOR PACK",
    perks: ["All Pro Effects", "Premium Templates", "Team Access"],
  },
  {
    id: "combo-ultimate",
    title: "Netflix + Prime + Spotify",
    subtitle: "Ultimate entertainment — সব একসাথে",
    services: [
      { name: "Netflix", logo: favicon("netflix.com"), accent: "#e50914" },
      { name: "Prime Video", logo: favicon("primevideo.com"), accent: "#00a8e1" },
      { name: "Spotify", logo: favicon("spotify.com"), accent: "#1db954" },
    ],
    price: 550,
    originalPrice: 700,
    duration: "1 Month",
    gradient: "linear-gradient(135deg, #1a0000 0%, #6b0f14 30%, #003a55 65%, #0d5c2b 100%)",
    glow: "rgba(229, 9, 20, 0.4)",
    tag: "BEST VALUE",
    perks: ["4K UHD", "Ad-free", "Instant Delivery", "24/7 Support"],
  },
];

export function comboToProduct(c: Combo): Product {
  return {
    id: c.id,
    name: c.title,
    tagline: c.subtitle,
    price: c.price,
    originalPrice: c.originalPrice,
    duration: c.duration,
    category: "other",
    accent: c.services[0].accent,
    logo: c.services[0].logo,
  };
}
