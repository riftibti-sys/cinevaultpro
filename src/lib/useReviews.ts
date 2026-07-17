import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Review = {
  id: string;
  product_id: string;
  name: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

export type ProductStats = { avg: number; count: number };

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setReviews(data as Review[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const channel = supabase
      .channel(`reviews-changes-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "reviews" }, (payload) => {
        setReviews((prev) => [payload.new as Review, ...prev]);
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const submit = useCallback(
    async (input: { product_id: string; name: string; rating: number; comment?: string }) => {
      const { error } = await supabase.from("reviews").insert({
        product_id: input.product_id,
        name: input.name.trim().slice(0, 60),
        rating: Math.max(1, Math.min(5, Math.round(input.rating))),
        comment: input.comment?.trim().slice(0, 500) || null,
      });
      if (error) throw error;
    },
    [],
  );

  const statsFor = useCallback(
    (productId: string): ProductStats => {
      const filtered = reviews.filter((r) => r.product_id === productId);
      if (filtered.length === 0) return { avg: 0, count: 0 };
      const avg = filtered.reduce((s, r) => s + r.rating, 0) / filtered.length;
      return { avg, count: filtered.length };
    },
    [reviews],
  );

  return { reviews, loading, submit, statsFor };
}
