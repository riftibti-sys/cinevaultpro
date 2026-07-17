import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { requireAdminUnlocked } from "@/lib/admin-guard";

export type SettingRow = {
  key: string;
  value: string;
  label: string;
  description: string | null;
  group_name: string;
  sort_order: number;
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

export const listSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  const supa = publicClient();
  const { data, error } = await supa
    .from("site_settings")
    .select("key,value,label,description,group_name,sort_order")
    .order("group_name", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as SettingRow[];
});

export const adminUpdateSiteSettings = createServerFn({ method: "POST" })
  .inputValidator((data: { updates: Array<{ key: string; value: string }> }) => data)
  .handler(async ({ data }) => {
    await requireAdminUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    for (const u of data.updates) {
      if (typeof u.key !== "string" || typeof u.value !== "string") continue;
      if (u.value.length > 2000) throw new Error(`Value too long for ${u.key}`);
      const { error } = await supabaseAdmin
        .from("site_settings")
        .update({ value: u.value })
        .eq("key", u.key);
      if (error) throw new Error(error.message);
    }
    return { ok: true as const };
  });
