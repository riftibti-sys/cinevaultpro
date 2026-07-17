import { useQuery } from "@tanstack/react-query";
import type { Product } from "./products";
import { listCombos, type ComboRow, type ComboService } from "./combos.functions";

export type Combo = {
  id: string;
  title: string;
  subtitle: string;
  services: ComboService[];
  price: number;
  originalPrice: number;
  duration: string;
  gradient: string;
  glow: string;
  tag: string;
  perks: string[];
};

function rowToCombo(r: ComboRow): Combo {
  return {
    id: r.id,
    title: r.title,
    subtitle: r.subtitle,
    services: r.services ?? [],
    price: r.price,
    originalPrice: r.original_price,
    duration: r.duration,
    gradient: r.gradient,
    glow: r.glow,
    tag: r.tag,
    perks: r.perks ?? [],
  };
}

export function useCombos() {
  const q = useQuery<ComboRow[]>({
    queryKey: ["combos"],
    queryFn: () => listCombos(),
    staleTime: 60_000,
  });
  return {
    combos: (q.data ?? []).map(rowToCombo),
    isLoading: q.isLoading,
  };
}

export function comboToProduct(c: Combo): Product {
  return {
    id: c.id,
    name: c.title,
    tagline: c.subtitle,
    price: c.price,
    originalPrice: c.originalPrice,
    duration: c.duration,
    category: "other",
    accent: c.services[0]?.accent ?? "#e50914",
    logo: c.services[0]?.logo ?? "",
  };
}
