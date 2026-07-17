import iscreenLogo from "@/assets/iscreen-logo.png";
import hbomaxLogo from "@/assets/hbomax-logo.png";

export type Product = {
  id: string;
  name: string;
  tagline: string;
  price: number; // BDT — current selling price
  originalPrice?: number; // BDT — before-discount price (shown struck-through)
  duration: string;
  category: "streaming" | "editing" | "music" | "other";
  accent: string; // brand color for card glow
  logo: string; // logo URL
  logoFill?: boolean; // let logo fill the tile edge-to-edge
  rating?: number; // 0..5, one-decimal
  reviews?: number; // review count
};

// Real brand logos via unavatar.io — fetches the actual site logo/icon.
const logo = (domain: string) => `https://unavatar.io/${domain}`;

export const products: Product[] = [
  { id: "netflix", name: "Netflix", tagline: "4K Ultra HD • 1 Screen", price: 250, originalPrice: 349, duration: "1 Month", category: "streaming", accent: "#e50914", logo: logo("netflix.com"), rating: 5.0, reviews: 428 },
  { id: "prime", name: "Amazon Prime Video", tagline: "HD • Private Profile", price: 180, originalPrice: 249, duration: "1 Month", category: "streaming", accent: "#00a8e1", logo: logo("primevideo.com"), rating: 4.9, reviews: 316 },
  { id: "yt-premium", name: "YouTube Premium", tagline: "Ad-free + YT Music", price: 220, originalPrice: 299, duration: "1 Month", category: "streaming", accent: "#ff0000", logo: logo("youtube.com"), rating: 5.0, reviews: 512 },
  { id: "hbo", name: "HBO Max", tagline: "Full HD • Shared", price: 200, originalPrice: 279, duration: "1 Month", category: "streaming", accent: "#7c3aed", logo: hbomaxLogo, logoFill: true, rating: 4.8, reviews: 184 },
  { id: "chorki", name: "Chorki", tagline: "All Bangla Originals", price: 150, originalPrice: 199, duration: "1 Month", category: "streaming", accent: "#ff6a00", logo: logo("chorki.com"), rating: 4.9, reviews: 267 },
  { id: "bongo", name: "Bongo BOB", tagline: "Movies + Live TV", price: 130, originalPrice: 179, duration: "1 Month", category: "streaming", accent: "#00b894", logo: logo("bongobd.com"), rating: 4.7, reviews: 142 },
  { id: "iscreen", name: "iScreen", tagline: "Premium Access", price: 140, originalPrice: 199, duration: "1 Month", category: "streaming", accent: "#e11d48", logo: iscreenLogo, logoFill: true, rating: 4.8, reviews: 96 },
  { id: "hoichoi", name: "Hoichoi", tagline: "Bengali Web Series", price: 160, originalPrice: 219, duration: "1 Month", category: "streaming", accent: "#d63031", logo: logo("hoichoi.tv"), rating: 4.9, reviews: 231 },
  { id: "capcut", name: "CapCut Pro", tagline: "All Pro Effects Unlocked", price: 300, originalPrice: 449, duration: "1 Month", category: "editing", accent: "#111111", logo: logo("capcut.com"), rating: 5.0, reviews: 389 },
  { id: "canva", name: "Canva Pro", tagline: "Team + Premium Assets", price: 280, originalPrice: 399, duration: "1 Month", category: "editing", accent: "#00c4cc", logo: logo("canva.com"), rating: 4.9, reviews: 254 },
  { id: "spotify", name: "Spotify Premium", tagline: "Ad-free Music", price: 180, originalPrice: 249, duration: "1 Month", category: "music", accent: "#1db954", logo: logo("spotify.com"), rating: 5.0, reviews: 471 },
  { id: "chatgpt", name: "ChatGPT Plus", tagline: "GPT-4 + Priority", price: 1200, originalPrice: 1499, duration: "1 Month", category: "other", accent: "#10a37f", logo: logo("openai.com"), rating: 4.9, reviews: 178 },
];

export const categoryLabels: Record<Product["category"], string> = {
  streaming: "Streaming",
  editing: "Editing",
  music: "Music",
  other: "AI & Others",
};
