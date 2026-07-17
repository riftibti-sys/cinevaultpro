import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { requireAdminUnlocked } from "@/lib/admin-guard";

export type ProductRow = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  original_price: number | null;
  duration: string;
  category: string;
  accent: string;
  logo: string;
  logo_fill: boolean;
  logo_large: boolean;
  rating: number | null;
  reviews: number | null;
  description: string | null;
  features: string[];
  warranty: string | null;
  sort_order: number;
  is_active: boolean;
};

function publicClient() {
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(process.env.SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const supa = publicClient();
  const { data, error } = await supa
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as ProductRow[];
});

export const adminListProducts = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminUnlocked();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as ProductRow[];
});

export type ProductInput = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  original_price: number | null;
  duration: string;
  category: string;
  accent: string;
  logo: string;
  logo_fill: boolean;
  logo_large: boolean;
  rating: number | null;
  reviews: number | null;
  description: string | null;
  features: string[];
  warranty: string | null;
  sort_order: number;
  is_active: boolean;
};

export const adminSaveProduct = createServerFn({ method: "POST" })
  .inputValidator((data: { product: ProductInput; isNew: boolean; originalId?: string }) => data)
  .handler(async ({ data }) => {
    await requireAdminUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const p = data.product;
    const id = (p.id || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    if (!id) throw new Error("id required");
    if (!p.name.trim()) throw new Error("name required");
    const payload = {
      id,
      name: p.name.trim().slice(0, 120),
      tagline: (p.tagline ?? "").trim().slice(0, 200),
      price: Math.max(0, Math.floor(Number(p.price) || 0)),
      original_price: p.original_price == null || p.original_price === 0 ? null : Math.max(0, Math.floor(Number(p.original_price))),
      duration: (p.duration ?? "1 Month").trim().slice(0, 60),
      category: ["streaming", "editing", "music", "other"].includes(p.category) ? p.category : "other",
      accent: (p.accent ?? "#e50914").trim().slice(0, 20),
      logo: (p.logo ?? "").trim().slice(0, 1000),
      logo_fill: Boolean(p.logo_fill),
      logo_large: Boolean(p.logo_large),
      rating: p.rating == null ? null : Math.max(0, Math.min(5, Number(p.rating))),
      reviews: p.reviews == null ? null : Math.max(0, Math.floor(Number(p.reviews))),
      description: p.description ? p.description.slice(0, 2000) : null,
      features: Array.isArray(p.features) ? p.features.filter((f) => typeof f === "string" && f.trim()).slice(0, 30).map((f) => f.slice(0, 300)) : [],
      warranty: p.warranty ? p.warranty.slice(0, 200) : null,
      sort_order: Math.max(0, Math.floor(Number(p.sort_order) || 100)),
      is_active: p.is_active !== false,
    };
    if (data.isNew) {
      const { error } = await supabaseAdmin.from("products").insert(payload);
      if (error) throw new Error(error.message);
    } else {
      const target = data.originalId ?? id;
      const { error } = await supabaseAdmin.from("products").update(payload).eq("id", target);
      if (error) throw new Error(error.message);
    }
    return { ok: true as const, id };
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await requireAdminUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
