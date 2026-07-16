export type Product = {
  id: string;
  name: string;
  tagline: string;
  price: number; // BDT — placeholder, edit anytime
  duration: string;
  category: "streaming" | "editing" | "music" | "other";
  accent: string; // brand color for card glow
  initials: string;
};

export const products: Product[] = [
  { id: "netflix", name: "Netflix", tagline: "4K Ultra HD • 1 Screen", price: 250, duration: "1 Month", category: "streaming", accent: "#e50914", initials: "N" },
  { id: "prime", name: "Amazon Prime Video", tagline: "HD • Private Profile", price: 180, duration: "1 Month", category: "streaming", accent: "#00a8e1", initials: "P" },
  { id: "yt-premium", name: "YouTube Premium", tagline: "Ad-free + YT Music", price: 220, duration: "1 Month", category: "streaming", accent: "#ff0000", initials: "Y" },
  { id: "hbo", name: "HBO Max", tagline: "Full HD • Shared", price: 200, duration: "1 Month", category: "streaming", accent: "#7b2cbf", initials: "H" },
  { id: "chorki", name: "Chorki", tagline: "All Bangla Originals", price: 150, duration: "1 Month", category: "streaming", accent: "#ff6a00", initials: "C" },
  { id: "bongo", name: "Bongo BOB", tagline: "Movies + Live TV", price: 130, duration: "1 Month", category: "streaming", accent: "#00b894", initials: "B" },
  { id: "iscreen", name: "iScreen", tagline: "Premium Access", price: 140, duration: "1 Month", category: "streaming", accent: "#0984e3", initials: "i" },
  { id: "hoichoi", name: "Hoichoi", tagline: "Bengali Web Series", price: 160, duration: "1 Month", category: "streaming", accent: "#d63031", initials: "H" },
  { id: "capcut", name: "CapCut Pro", tagline: "All Pro Effects Unlocked", price: 300, duration: "1 Month", category: "editing", accent: "#000000", initials: "Cc" },
  { id: "canva", name: "Canva Pro", tagline: "Team + Premium Assets", price: 280, duration: "1 Month", category: "editing", accent: "#00c4cc", initials: "Cv" },
  { id: "spotify", name: "Spotify Premium", tagline: "Ad-free Music", price: 180, duration: "1 Month", category: "music", accent: "#1db954", initials: "S" },
  { id: "chatgpt", name: "ChatGPT Plus", tagline: "GPT-4 + Priority", price: 1200, duration: "1 Month", category: "other", accent: "#10a37f", initials: "GPT" },
];

export const categoryLabels: Record<Product["category"], string> = {
  streaming: "Streaming",
  editing: "Editing",
  music: "Music",
  other: "AI & Others",
};
