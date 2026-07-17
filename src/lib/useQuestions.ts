import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Question = {
  id: string;
  product_id: string;
  name: string;
  question: string;
  answer: string | null;
  answered_at: string | null;
  created_at: string;
};

export function useQuestions(productId: string) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data, error } = await (supabase as any)
      .from("questions")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    if (!error && data) setQuestions(data as Question[]);
    setLoading(false);
  }, [productId]);

  useEffect(() => {
    load();
    const channel = supabase
      .channel(`questions-${productId}-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "questions", filter: `product_id=eq.${productId}` },
        (payload) => setQuestions((prev) => [payload.new as Question, ...prev]),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load, productId]);

  const ask = useCallback(
    async (input: { name: string; question: string }) => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      if (!userId) throw new Error("Please log in to ask a question.");
      const { error } = await (supabase as any).from("questions").insert({
        product_id: productId,
        user_id: userId,
        name: input.name.trim().slice(0, 60),
        question: input.question.trim().slice(0, 500),
      });
      if (error) throw error;
    },
    [productId],
  );

  return { questions, loading, ask };
}
