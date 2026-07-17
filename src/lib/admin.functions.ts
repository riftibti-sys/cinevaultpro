import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

type AdminSession = { unlocked?: boolean };

function sessionConfig() {
  const password = process.env.ADMIN_SESSION_SECRET;
  if (!password) throw new Error("ADMIN_SESSION_SECRET is not set");
  return {
    password,
    name: "cv-admin",
    maxAge: 60 * 60 * 8, // 8 hours
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function requireUnlocked() {
  const session = await useSession<AdminSession>(sessionConfig());
  if (!session.data.unlocked) {
    throw new Error("LOCKED");
  }
  return session;
}

export const adminIsUnlocked = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await useSession<AdminSession>(sessionConfig());
    return { unlocked: Boolean(session.data.unlocked) };
  },
);

export const adminUnlock = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) throw new Error("ADMIN_PASSWORD is not set");
    if (!passwordMatches(data.password ?? "", expected)) {
      return { ok: false as const };
    }
    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const adminLock = createServerFn({ method: "POST" }).handler(
  async () => {
    const session = await useSession<AdminSession>(sessionConfig());
    await session.clear();
    return { ok: true as const };
  },
);

export const adminGetData = createServerFn({ method: "GET" }).handler(
  async () => {
    await requireUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [reviewsRes, questionsRes, profilesRes] = await Promise.all([
      supabaseAdmin
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500),
      supabaseAdmin
        .from("questions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500),
      supabaseAdmin
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500),
    ]);

    return {
      reviews: reviewsRes.data ?? [],
      questions: questionsRes.data ?? [],
      profiles: profilesRes.data ?? [],
      errors: {
        reviews: reviewsRes.error?.message ?? null,
        questions: questionsRes.error?.message ?? null,
        profiles: profilesRes.error?.message ?? null,
      },
    };
  },
);

export const adminDeleteReview = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await requireUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("reviews").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminDeleteQuestion = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await requireUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("questions").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminAnswerQuestion = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; answer: string }) => data)
  .handler(async ({ data }) => {
    await requireUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const answer = data.answer.trim();
    const { error } = await supabaseAdmin
      .from("questions")
      .update({
        answer: answer.length ? answer : null,
        answered_at: answer.length ? new Date().toISOString() : null,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminUpdateReview = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; rating: number; comment: string }) => data)
  .handler(async ({ data }) => {
    await requireUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const rating = Math.max(1, Math.min(5, Math.round(data.rating)));
    const comment = data.comment.trim();
    const { error } = await supabaseAdmin
      .from("reviews")
      .update({ rating, comment: comment.length ? comment : null })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminDeleteUser = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await requireUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Delete auth user; profile cascades via FK. Also cleanup content by user_id.
    await supabaseAdmin.from("reviews").delete().eq("user_id", data.id);
    await supabaseAdmin.from("questions").delete().eq("user_id", data.id);
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminUpdateUser = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; full_name: string; phone: string; address: string }) => data)
  .handler(async ({ data }) => {
    await requireUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        full_name: data.full_name.trim() || null,
        phone: data.phone.trim() || null,
        address: data.address.trim() || null,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

