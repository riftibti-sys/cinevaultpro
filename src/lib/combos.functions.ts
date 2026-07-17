import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { requireAdminUnlocked } from "@/lib/admin-guard";

export type ComboService = { name: string; logo: string; accent: string };

export type ComboRow = {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  duration: string;
  price: number;
  original_price: number;
  gradient: string;
  glow: string;
  perks: string[];
  services: ComboService[];
  sort_order: number;
  is_active: boolean;
};

export type ComboInput = ComboRow;

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

export const listCombos = createServerFn({ method: "GET" }).handler(async () => {
  const supa = publicClient();
  const { data, error } = await supa
    .from("combos" as never)
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as ComboRow[];
});

export const adminListCombos = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminUnlocked();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("combos" as never)
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as ComboRow[];
});

function sanitize(p: ComboInput): ComboInput {
  const id = (p.id || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
  if (!id) throw new Error("id required");
  if (!p.title.trim()) throw new Error("title required");
  const services = Array.isArray(p.services)
    ? p.services
        .filter((s) => s && typeof s.name === "string")
        .slice(0, 6)
        .map((s) => ({
          name: String(s.name).slice(0, 60),
          logo: String(s.logo ?? "").slice(0, 1000),
          accent: String(s.accent ?? "#e50914").slice(0, 20),
        }))
    : [];
  return {
    id,
    title: p.title.trim().slice(0, 120),
    subtitle: (p.subtitle ?? "").slice(0, 200),
    tag: (p.tag ?? "").slice(0, 40),
    duration: (p.duration ?? "1 Month").slice(0, 60),
    price: Math.max(0, Math.floor(Number(p.price) || 0)),
    original_price: Math.max(0, Math.floor(Number(p.original_price) || 0)),
    gradient: (p.gradient ?? "").slice(0, 500),
    glow: (p.glow ?? "").slice(0, 100),
    perks: Array.isArray(p.perks)
      ? p.perks.filter((f) => typeof f === "string" && f.trim()).slice(0, 12).map((f) => f.slice(0, 100))
      : [],
    services,
    sort_order: Math.max(0, Math.floor(Number(p.sort_order) || 100)),
    is_active: p.is_active !== false,
  };
}

export const adminSaveCombo = createServerFn({ method: "POST" })
  .inputValidator((data: { combo: ComboInput; isNew: boolean; originalId?: string }) => data)
  .handler(async ({ data }) => {
    await requireAdminUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = sanitize(data.combo);
    if (data.isNew) {
      const { error } = await supabaseAdmin.from("combos" as never).insert(payload as never);
      if (error) throw new Error(error.message);
    } else {
      const target = data.originalId ?? payload.id;
      const { error } = await supabaseAdmin.from("combos" as never).update(payload as never).eq("id", target);
      if (error) throw new Error(error.message);
    }
    return { ok: true as const, id: payload.id };
  });

export const adminDeleteCombo = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await requireAdminUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("combos" as never).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
