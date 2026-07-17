import iscreenLogo from "@/assets/iscreen-logo.png";
import hbomaxLogo from "@/assets/hbomax-logo.png";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listProducts, type ProductRow } from "@/lib/products.functions";

export type Product = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  duration: string;
  category: "streaming" | "editing" | "music" | "other";
  accent: string;
  logo: string;
  logoFill?: boolean;
  logoLarge?: boolean;
  rating?: number;
  reviews?: number;
  description?: string;
  features?: string[];
  warranty?: string;
};

// Local asset override: DB stores a token like "/src/assets/iscreen-logo.png"
// so the admin panel can distinguish, but the browser needs the built asset URL.
const LOCAL_ASSETS: Record<string, string> = {
  "/src/assets/iscreen-logo.png": iscreenLogo,
  "/src/assets/hbomax-logo.png": hbomaxLogo,
};

export function rowToProduct(r: ProductRow): Product {
  const cat = (["streaming", "editing", "music", "other"].includes(r.category) ? r.category : "other") as Product["category"];
  return {
    id: r.id,
    name: r.name,
    tagline: r.tagline ?? "",
    price: r.price,
    originalPrice: r.original_price ?? undefined,
    duration: r.duration,
    category: cat,
    accent: r.accent,
    logo: LOCAL_ASSETS[r.logo] ?? r.logo,
    logoFill: r.logo_fill || undefined,
    logoLarge: r.logo_large || undefined,
    rating: r.rating ?? undefined,
    reviews: r.reviews ?? undefined,
    description: r.description ?? undefined,
    features: r.features && r.features.length ? r.features : undefined,
    warranty: r.warranty ?? undefined,
  };
}

// Fallback list used as initial data (mirrors current DB seed) so first paint
// is instant and SSR / offline still renders products.
export const fallbackProducts: Product[] = [
  { id: "netflix", name: "Netflix", tagline: "4K Ultra HD • 1 Screen", price: 250, originalPrice: 349, duration: "1 Month", category: "streaming", accent: "#e50914", logo: "https://www.google.com/s2/favicons?domain=netflix.com&sz=256", rating: 5.0, reviews: 428 },
  { id: "prime", name: "Amazon Prime Video", tagline: "4K HDR • Private Profile", price: 180, originalPrice: 249, duration: "1 Month", category: "streaming", accent: "#00a8e1", logo: "https://www.google.com/s2/favicons?domain=primevideo.com&sz=256", rating: 4.9, reviews: 316 },
  { id: "yt-premium", name: "YouTube Premium", tagline: "Ad-free + YouTube Music", price: 220, originalPrice: 299, duration: "1 Month", category: "streaming", accent: "#ff0000", logo: "https://www.google.com/s2/favicons?domain=youtube.com&sz=256", rating: 5.0, reviews: 512 },
  { id: "hbo", name: "HBO Max", tagline: "4K UHD • Shared Profile", price: 200, originalPrice: 279, duration: "1 Month", category: "streaming", accent: "#7c3aed", logo: hbomaxLogo, logoFill: true, rating: 4.8, reviews: 184 },
  { id: "chorki", name: "Chorki", tagline: "All Bangla Originals", price: 150, originalPrice: 199, duration: "1 Month", category: "streaming", accent: "#ff6a00", logo: "https://www.google.com/s2/favicons?domain=chorki.com&sz=256", rating: 4.9, reviews: 267 },
  { id: "bongo", name: "Bongo BOB", tagline: "Movies + Live TV", price: 130, originalPrice: 179, duration: "1 Month", category: "streaming", accent: "#00b894", logo: "https://www.google.com/s2/favicons?domain=bongobd.com&sz=256", rating: 4.7, reviews: 142 },
  { id: "iscreen", name: "iScreen", tagline: "Premium Access", price: 140, originalPrice: 199, duration: "1 Month", category: "streaming", accent: "#e11d48", logo: iscreenLogo, logoLarge: true, rating: 4.8, reviews: 96 },
  { id: "hoichoi", name: "Hoichoi", tagline: "Bengali Web Series", price: 160, originalPrice: 219, duration: "1 Month", category: "streaming", accent: "#d63031", logo: "https://www.google.com/s2/favicons?domain=hoichoi.tv&sz=256", rating: 4.9, reviews: 231 },
  { id: "capcut", name: "CapCut Pro", tagline: "All Pro Effects Unlocked", price: 300, originalPrice: 449, duration: "1 Month", category: "editing", accent: "#111111", logo: "https://www.google.com/s2/favicons?domain=capcut.com&sz=256", rating: 5.0, reviews: 389 },
  { id: "canva", name: "Canva Pro", tagline: "Team + Premium Assets", price: 280, originalPrice: 399, duration: "1 Month", category: "editing", accent: "#00c4cc", logo: "https://www.google.com/s2/favicons?domain=canva.com&sz=256", rating: 4.9, reviews: 254 },
  { id: "spotify", name: "Spotify Premium", tagline: "Ad-free Music", price: 180, originalPrice: 249, duration: "1 Month", category: "music", accent: "#1db954", logo: "https://www.google.com/s2/favicons?domain=spotify.com&sz=256", rating: 5.0, reviews: 471 },
  { id: "chatgpt", name: "ChatGPT Plus", tagline: "GPT-5 + Priority Access", price: 1200, originalPrice: 1499, duration: "1 Month", category: "other", accent: "#10a37f", logo: "https://www.google.com/s2/favicons?domain=openai.com&sz=256", rating: 4.9, reviews: 178 },
];

export const categoryLabels: Record<Product["category"], string> = {
  streaming: "Streaming",
  editing: "Editing",
  music: "Music",
  other: "AI & Others",
};

export function useProducts(): Product[] {
  const fetchProducts = useServerFn(listProducts);
  const { data } = useQuery({
    queryKey: ["products", "public"],
    queryFn: async () => {
      const rows = await fetchProducts();
      return rows.map(rowToProduct);
    },
    initialData: fallbackProducts,
    staleTime: 60_000,
  });
  return data;
}
