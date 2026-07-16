export type Product = {
  id: string;
  name: string;
  tagline: string;
  price: number; // BDT — placeholder, edit anytime
  duration: string;
  category: "streaming" | "editing" | "music" | "other";
  accent: string; // brand color for card glow
  logo: string; // logo URL
};

// Brand logos: simpleicons CDN for global brands, Google favicons for BD services.
const si = (slug: string, color = "ffffff") => `https://cdn.simpleicons.org/${slug}/${color}`;
const fav = (domain: string) => `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;

export const products: Product[] = [
  { id: "netflix", name: "Netflix", tagline: "4K Ultra HD • 1 Screen", price: 250, duration: "1 Month", category: "streaming", accent: "#e50914", logo: si("netflix", "e50914") },
  { id: "prime", name: "Amazon Prime Video", tagline: "HD • Private Profile", price: 180, duration: "1 Month", category: "streaming", accent: "#00a8e1", logo: si("primevideo", "00a8e1") },
  { id: "yt-premium", name: "YouTube Premium", tagline: "Ad-free + YT Music", price: 220, duration: "1 Month", category: "streaming", accent: "#ff0000", logo: si("youtube", "ff0000") },
  { id: "hbo", name: "HBO Max", tagline: "Full HD • Shared", price: 200, duration: "1 Month", category: "streaming", accent: "#7b2cbf", logo: si("max", "ffffff") },
  { id: "chorki", name: "Chorki", tagline: "All Bangla Originals", price: 150, duration: "1 Month", category: "streaming", accent: "#ff6a00", logo: fav("chorki.com") },
  { id: "bongo", name: "Bongo BOB", tagline: "Movies + Live TV", price: 130, duration: "1 Month", category: "streaming", accent: "#00b894", logo: fav("bongobd.com") },
  { id: "iscreen", name: "iScreen", tagline: "Premium Access", price: 140, duration: "1 Month", category: "streaming", accent: "#0984e3", logo: fav("iscreen.com") },
  { id: "hoichoi", name: "Hoichoi", tagline: "Bengali Web Series", price: 160, duration: "1 Month", category: "streaming", accent: "#d63031", logo: fav("hoichoi.tv") },
  { id: "capcut", name: "CapCut Pro", tagline: "All Pro Effects Unlocked", price: 300, duration: "1 Month", category: "editing", accent: "#000000", logo: si("capcut", "ffffff") },
  { id: "canva", name: "Canva Pro", tagline: "Team + Premium Assets", price: 280, duration: "1 Month", category: "editing", accent: "#00c4cc", logo: si("canva", "00c4cc") },
  { id: "spotify", name: "Spotify Premium", tagline: "Ad-free Music", price: 180, duration: "1 Month", category: "music", accent: "#1db954", logo: si("spotify", "1db954") },
  { id: "chatgpt", name: "ChatGPT Plus", tagline: "GPT-4 + Priority", price: 1200, duration: "1 Month", category: "other", accent: "#10a37f", logo: si("openai", "10a37f") },
];

export const categoryLabels: Record<Product["category"], string> = {
  streaming: "Streaming",
  editing: "Editing",
  music: "Music",
  other: "AI & Others",
};
