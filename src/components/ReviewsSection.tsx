import { useMemo, useState } from "react";
import { Star, Send } from "lucide-react";
import { toast } from "sonner";
import { useReviews } from "@/lib/useReviews";
import { products } from "@/lib/products";

export function ReviewsSection() {
  const { reviews, submit } = useReviews();
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  const productName = useMemo(
    () => products.find((p) => p.id === productId)?.name ?? "",
    [productId],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("নাম দিন");
    if (rating < 1) return toast.error("রেটিং সিলেক্ট করুন");
    if (!comment.trim()) return toast.error("রিভিউ লিখুন");
    try {
      setBusy(true);
      await submit({ product_id: productId, name, rating, comment });
      toast.success("আপনার রিভিউ জমা হয়েছে — ধন্যবাদ!");
      setName("");
      setComment("");
      setRating(0);
    } catch {
      toast.error("জমা দিতে সমস্যা হয়েছে");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="reviews" className="mx-auto mt-16 max-w-6xl px-4 sm:px-5">
      <div className="mb-6 px-1">
        <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-primary">Community</p>
        <h2 className="text-xl font-bold text-foreground sm:text-2xl">Customer Reviews</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          আপনার অভিজ্ঞতা শেয়ার করুন — কাস্টমার হিসেবে আপনার মতামত আমাদের কাছে গুরুত্বপূর্ণ।
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-border bg-card/70 p-5"
        >
          <h3 className="text-sm font-bold text-foreground">রিভিউ লিখুন</h3>

          <label className="mt-4 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Product
          </label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <label className="mt-3 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            আপনার নাম
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            placeholder="Your name"
            className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
          />

          <label className="mt-3 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            রেটিং
          </label>
          <div className="mt-1 flex items-center gap-1" onMouseLeave={() => setHover(0)}>
            {Array.from({ length: 5 }).map((_, i) => {
              const v = i + 1;
              const active = hover ? v <= hover : v <= rating;
              return (
                <button
                  key={i}
                  type="button"
                  onMouseEnter={() => setHover(v)}
                  onClick={() => setRating(v)}
                  className="p-1 transition-transform hover:scale-110"
                  aria-label={`Rate ${v}`}
                >
                  <Star
                    className={`h-6 w-6 ${active ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
                  />
                </button>
              );
            })}
            {rating > 0 && (
              <span className="ml-2 text-xs font-bold text-foreground">{rating}.0</span>
            )}
          </div>

          <label className="mt-3 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            রিভিউ
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
            rows={4}
            placeholder={`${productName} সম্পর্কে আপনার মতামত লিখুন...`}
            className="mt-1 w-full resize-none rounded-lg border border-border bg-background p-3 text-sm text-foreground outline-none focus:border-primary"
          />
          <div className="mt-1 text-right text-[10px] text-muted-foreground">{comment.length}/500</div>

          <button
            type="submit"
            disabled={busy}
            className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-black uppercase tracking-wider text-primary-foreground shadow-[0_0_20px_rgba(229,9,20,0.35)] transition hover:brightness-110 disabled:opacity-60"
          >
            <Send className="h-4 w-4" /> {busy ? "Submitting..." : "Submit Review"}
          </button>
        </form>

        {/* LIST */}
        <div className="rounded-3xl border border-border bg-card/60 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Latest Reviews</h3>
            <span className="text-[10px] font-bold text-muted-foreground">
              {reviews.length} total
            </span>
          </div>

          {reviews.length === 0 ? (
            <p className="py-10 text-center text-xs text-muted-foreground">
              এখনো কোনো রিভিউ নেই — প্রথম রিভিউটা আপনিই দিন!
            </p>
          ) : (
            <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
              {reviews.map((r) => {
                const p = products.find((x) => x.id === r.product_id);
                return (
                  <div key={r.id} className="rounded-2xl border border-border bg-background/60 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/15 text-xs font-black text-primary">
                          {r.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">{r.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {p?.name ?? r.product_id} • {new Date(r.created_at).toLocaleDateString("en-GB")}
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < r.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
                          />
                        ))}
                      </div>
                    </div>
                    {r.comment && (
                      <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                        {r.comment}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
