import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Check, MessageCircleQuestion, Send, ShieldCheck, Sparkles, Star, Zap } from "lucide-react";
import { toast } from "sonner";
import { products } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useReviews } from "@/lib/useReviews";
import { useQuestions } from "@/lib/useQuestions";
import { Header } from "@/components/Header";
import { CategoryBar } from "@/components/CategoryBar";
import { BottomNav } from "@/components/BottomNav";
import { SiteFooter } from "@/components/SiteFooter";
import { CartDrawer } from "@/components/CartDrawer";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const p = products.find((x) => x.id === params.id);
    const title = p ? `${p.name} — CineVault` : "Product — CineVault";
    const desc = p ? `${p.name} ${p.duration} — Tk. ${p.price}. ${p.tagline}. Instant delivery.` : "Premium subscription details.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:image", content: p?.logo ?? "" },
      ],
    };
  },
  loader: ({ params }) => {
    const p = products.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return { product: p };
  },
  component: ProductDetail,
  errorComponent: ({ error }) => (
    <div className="grid min-h-screen place-items-center bg-background p-6 text-center text-foreground">
      <div>
        <h1 className="text-xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <Link to="/" className="mt-4 inline-block text-primary underline">Go home</Link>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center bg-background p-6 text-center text-foreground">
      <div>
        <h1 className="text-2xl font-black">Product not found</h1>
        <Link to="/" className="mt-4 inline-block text-primary underline">Browse all products</Link>
      </div>
    </div>
  ),
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const { items, add } = useCart();
  const inCart = items.some((i) => i.product.id === product.id);
  const { reviews, submit, statsFor } = useReviews();
  const { questions, ask } = useQuestions(product.id);
  const [cartOpen, setCartOpen] = useState(false);

  const productReviews = useMemo(
    () => reviews.filter((r) => r.product_id === product.id),
    [reviews, product.id],
  );
  const stats = statsFor(product.id);
  const avg = stats.count > 0 ? stats.avg : product.rating ?? 0;
  const count = stats.count > 0 ? stats.count : product.reviews ?? 0;
  const discount = product.originalPrice
    ? Math.max(0, Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100))
    : 0;

  const description =
    product.description ??
    `${product.name} — সম্পূর্ণ অরিজিনাল ${product.duration} সাবস্ক্রিপশন। অর্ডারের সাথে সাথেই delivery, পুরো subscription জুড়ে warranty, এবং ২৪/৭ কাস্টমার সাপোর্ট। ${product.tagline}.`;
  const features = product.features ?? [
    "১০০% অরিজিনাল অ্যাকাউন্ট",
    "৫ মিনিটের মধ্যে ইনস্ট্যান্ট ডেলিভারি",
    "সম্পূর্ণ ওয়ারেন্টি কভারেজ",
    "২৪/৭ ফাস্ট রেসপন্স সাপোর্ট",
    "bKash / Nagad / Card — সব পেমেন্ট গ্রহণযোগ্য",
  ];

  // Review form
  const [rName, setRName] = useState("");
  const [rating, setRating] = useState(0);
  const [rHover, setRHover] = useState(0);
  const [rComment, setRComment] = useState("");
  const [rBusy, setRBusy] = useState(false);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rName.trim()) return toast.error("নাম দিন");
    if (rating < 1) return toast.error("রেটিং সিলেক্ট করুন");
    if (!rComment.trim()) return toast.error("রিভিউ লিখুন");
    try {
      setRBusy(true);
      await submit({ product_id: product.id, name: rName, rating, comment: rComment });
      toast.success("রিভিউ জমা হয়েছে — ধন্যবাদ!");
      setRName("");
      setRComment("");
      setRating(0);
    } catch {
      toast.error("জমা দিতে সমস্যা হয়েছে");
    } finally {
      setRBusy(false);
    }
  };

  // Question form
  const [qName, setQName] = useState("");
  const [qText, setQText] = useState("");
  const [qBusy, setQBusy] = useState(false);
  const submitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qName.trim() || !qText.trim()) return toast.error("নাম ও প্রশ্ন লিখুন");
    try {
      setQBusy(true);
      await ask({ name: qName, question: qText });
      toast.success("প্রশ্ন পোস্ট হয়েছে — দ্রুত উত্তর দেওয়া হবে!");
      setQName("");
      setQText("");
    } catch {
      toast.error("জমা দিতে সমস্যা হয়েছে");
    }
    finally {
      setQBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 text-foreground md:pb-8">
      <div className="sticky top-0 z-40">
        <Header />
        <CategoryBar />
      </div>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-5">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to products
        </Link>
      </div>

      {/* HERO */}
      <section className="mx-auto mt-4 grid max-w-6xl gap-6 px-4 sm:px-5 lg:grid-cols-[1.05fr_1fr]">
        {/* Image */}
        <div
          className="relative grid aspect-square w-full place-items-center overflow-hidden rounded-3xl border border-border"
          style={{ background: `linear-gradient(135deg, ${product.accent}33, ${product.accent}0a)` }}
        >
          <img
            src={product.logo}
            alt={product.name}
            className={product.logoFill ? "h-full w-full object-cover" : "h-40 w-40 object-contain sm:h-56 sm:w-56"}
            referrerPolicy="no-referrer"
          />
          <div className="absolute left-4 top-4 rounded-full border border-emerald-500/30 bg-black/70 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-400 backdrop-blur">
            <Zap className="mr-1 inline h-3 w-3" /> Instant Delivery
          </div>
          {discount > 0 && (
            <div className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary-foreground">
              Save {discount}%
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">
            {product.category}
          </p>
          <h1 className="mt-1 text-2xl font-black leading-tight sm:text-3xl">{product.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{product.tagline} • {product.duration}</p>

          {/* Rating summary */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(avg) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
                />
              ))}
            </div>
            <span className="text-sm font-bold">{avg > 0 ? avg.toFixed(1) : "New"}</span>
            <span className="text-xs text-muted-foreground">· {count} reviews</span>
          </div>

          {/* Price block */}
          <div className="mt-4 rounded-2xl border border-border bg-card/70 p-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-primary">Tk. {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-sm font-medium text-muted-foreground line-through">
                  Tk. {product.originalPrice.toLocaleString()}
                </span>
              )}
              {discount > 0 && (
                <span className="rounded-md bg-primary/15 px-2 py-0.5 text-[10px] font-black uppercase text-primary">
                  {discount}% OFF
                </span>
              )}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">Price incl. all fees • Warranty for full duration</p>

            <button
              onClick={() => {
                add(product);
                toast.success(`${product.name} — Cart-এ যোগ হয়েছে`);
              }}
              disabled={inCart}
              className={`mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-black uppercase tracking-widest transition ${
                inCart
                  ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                  : "bg-primary text-primary-foreground shadow-[0_0_25px_rgba(229,9,20,0.4)] hover:brightness-110"
              }`}
            >
              {inCart ? (<><Check className="h-4 w-4" strokeWidth={3} /> Added to Cart</>) : "Buy Now"}
            </button>
          </div>

          {/* Features */}
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2 rounded-xl border border-border bg-card/50 p-2.5 text-xs">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="mx-auto mt-10 max-w-6xl px-4 sm:px-5">
        <div className="rounded-3xl border border-border bg-card/60 p-5">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-bold">Product Details</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="mx-auto mt-10 max-w-6xl px-4 sm:px-5">
        <div className="mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Feedback</p>
          <h2 className="text-lg font-bold sm:text-xl">Customer Reviews ({productReviews.length})</h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
          <form onSubmit={submitReview} className="rounded-3xl border border-border bg-card/70 p-5">
            <h3 className="text-sm font-bold">রিভিউ লিখুন</h3>
            <input
              value={rName}
              onChange={(e) => setRName(e.target.value)}
              placeholder="আপনার নাম"
              maxLength={60}
              className="mt-3 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
            <div className="mt-3 flex items-center gap-1" onMouseLeave={() => setRHover(0)}>
              {Array.from({ length: 5 }).map((_, i) => {
                const v = i + 1;
                const active = rHover ? v <= rHover : v <= rating;
                return (
                  <button
                    key={i}
                    type="button"
                    onMouseEnter={() => setRHover(v)}
                    onClick={() => setRating(v)}
                    className="p-1 transition-transform hover:scale-110"
                    aria-label={`Rate ${v}`}
                  >
                    <Star className={`h-6 w-6 ${active ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`} />
                  </button>
                );
              })}
              {rating > 0 && <span className="ml-2 text-xs font-bold">{rating}.0</span>}
            </div>
            <textarea
              value={rComment}
              onChange={(e) => setRComment(e.target.value)}
              rows={4}
              maxLength={500}
              placeholder={`${product.name} সম্পর্কে আপনার অভিজ্ঞতা লিখুন...`}
              className="mt-3 w-full resize-none rounded-lg border border-border bg-background p-3 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={rBusy}
              className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-black uppercase tracking-widest text-primary-foreground disabled:opacity-60"
            >
              <Send className="h-4 w-4" /> {rBusy ? "Submitting..." : "Submit Review"}
            </button>
          </form>

          <div className="rounded-3xl border border-border bg-card/60 p-5">
            {productReviews.length === 0 ? (
              <p className="py-10 text-center text-xs text-muted-foreground">
                এখনো কোনো রিভিউ নেই — প্রথম রিভিউটা আপনিই দিন!
              </p>
            ) : (
              <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
                {productReviews.map((r) => (
                  <div key={r.id} className="rounded-2xl border border-border bg-background/60 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/15 text-xs font-black text-primary">
                          {r.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold">{r.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(r.created_at).toLocaleDateString("en-GB")}
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
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Q&A */}
      <section className="mx-auto mt-10 max-w-6xl px-4 sm:px-5">
        <div className="mb-4 flex items-center gap-2">
          <MessageCircleQuestion className="h-5 w-5 text-primary" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Ask & Answer</p>
            <h2 className="text-lg font-bold sm:text-xl">Questions ({questions.length})</h2>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
          <form onSubmit={submitQuestion} className="rounded-3xl border border-border bg-card/70 p-5">
            <h3 className="text-sm font-bold">প্রশ্ন করুন</h3>
            <input
              value={qName}
              onChange={(e) => setQName(e.target.value)}
              placeholder="আপনার নাম"
              maxLength={60}
              className="mt-3 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
            <textarea
              value={qText}
              onChange={(e) => setQText(e.target.value)}
              rows={4}
              maxLength={500}
              placeholder={`${product.name} সম্পর্কে যেকোনো প্রশ্ন লিখুন...`}
              className="mt-3 w-full resize-none rounded-lg border border-border bg-background p-3 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={qBusy}
              className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/10 text-sm font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-60"
            >
              <Send className="h-4 w-4" /> {qBusy ? "Posting..." : "Post Question"}
            </button>
          </form>

          <div className="rounded-3xl border border-border bg-card/60 p-5">
            {questions.length === 0 ? (
              <p className="py-10 text-center text-xs text-muted-foreground">
                এখনো কোনো প্রশ্ন নেই — কিছু জানার থাকলে প্রথম প্রশ্নটা আপনিই করুন!
              </p>
            ) : (
              <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
                {questions.map((q) => (
                  <div key={q.id} className="rounded-2xl border border-border bg-background/60 p-3">
                    <div className="flex items-start gap-2">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-black text-primary">
                        Q
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold">{q.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(q.created_at).toLocaleDateString("en-GB")}
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-xs text-foreground">{q.question}</p>
                      </div>
                    </div>
                    {q.answer ? (
                      <div className="mt-2 ml-10 rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-2.5">
                        <p className="mb-0.5 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                          CineVault Team
                        </p>
                        <p className="whitespace-pre-wrap text-xs text-foreground">{q.answer}</p>
                      </div>
                    ) : (
                      <p className="mt-2 ml-10 text-[10px] italic text-muted-foreground">
                        উত্তর দেওয়া হবে শীঘ্রই...
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
      <BottomNav />
    </div>
  );
}
