import iscreenLogo from "@/assets/iscreen-logo.png";
import hbomaxLogo from "@/assets/hbomax-logo.png";

export type Product = {
  id: string;
  name: string;
  tagline: string;
  price: number; // BDT — placeholder, edit anytime
  duration: string;
  category: "streaming" | "editing" | "music" | "other";
  accent: string; // brand color for card glow
  logo: string; // logo URL
  logoFill?: boolean; // let logo fill the tile edge-to-edge
};

// Real brand logos via unavatar.io — fetches the actual site logo/icon.
const logo = (domain: string) => `https://unavatar.io/${domain}`;

export const products: Product[] = [
  { id: "netflix", name: "Netflix", tagline: "4K Ultra HD • 1 Screen", price: 250, duration: "1 Month", category: "streaming", accent: "#e50914", logo: logo("netflix.com") },
  { id: "prime", name: "Amazon Prime Video", tagline: "HD • Private Profile", price: 180, duration: "1 Month", category: "streaming", accent: "#00a8e1", logo: logo("primevideo.com") },
  { id: "yt-premium", name: "YouTube Premium", tagline: "Ad-free + YT Music", price: 220, duration: "1 Month", category: "streaming", accent: "#ff0000", logo: logo("youtube.com") },
  { id: "hbo", name: "HBO Max", tagline: "Full HD • Shared", price: 200, duration: "1 Month", category: "streaming", accent: "#000000", logo: logo("hbomax.com") },
  { id: "chorki", name: "Chorki", tagline: "All Bangla Originals", price: 150, duration: "1 Month", category: "streaming", accent: "#ff6a00", logo: logo("chorki.com") },
  { id: "bongo", name: "Bongo BOB", tagline: "Movies + Live TV", price: 130, duration: "1 Month", category: "streaming", accent: "#00b894", logo: logo("bongobd.com") },
  { id: "iscreen", name: "iScreen", tagline: "Premium Access", price: 140, duration: "1 Month", category: "streaming", accent: "#e11d48", logo: iscreenLogo, logoFill: true },
  { id: "hoichoi", name: "Hoichoi", tagline: "Bengali Web Series", price: 160, duration: "1 Month", category: "streaming", accent: "#d63031", logo: logo("hoichoi.tv") },
  { id: "capcut", name: "CapCut Pro", tagline: "All Pro Effects Unlocked", price: 300, duration: "1 Month", category: "editing", accent: "#111111", logo: logo("capcut.com") },
  { id: "canva", name: "Canva Pro", tagline: "Team + Premium Assets", price: 280, duration: "1 Month", category: "editing", accent: "#00c4cc", logo: logo("canva.com") },
  { id: "spotify", name: "Spotify Premium", tagline: "Ad-free Music", price: 180, duration: "1 Month", category: "music", accent: "#1db954", logo: logo("spotify.com") },
  { id: "chatgpt", name: "ChatGPT Plus", tagline: "GPT-4 + Priority", price: 1200, duration: "1 Month", category: "other", accent: "#10a37f", logo: logo("openai.com") },
];

export const categoryLabels: Record<Product["category"], string> = {
  streaming: "Streaming",
  editing: "Editing",
  music: "Music",
  other: "AI & Others",
};
