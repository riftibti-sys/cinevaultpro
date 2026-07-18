import { useEffect, useMemo, useState } from "react";
import { Play, MessageCircle, ChevronLeft, ChevronRight, Sparkles, Zap, Info } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useProducts, type Product } from "@/lib/products";
import { useCombos, comboToProduct, type Combo } from "@/lib/combos";
import { useCart } from "@/lib/cart";
import { useSiteSettings, buildWhatsAppUrl } from "@/lib/site-settings";


const DEFAULT_FEATURED = ["netflix", "prime", "yt-premium", "hbo", "spotify", "capcut", "chatgpt", "chorki"];

const AUTO_MS = 6000;

type Slide =
  | { kind: "product"; product: Product }
  | { kind: "combo"; combo: Combo };

export function HeroCarousel() {
  const products = useProducts();
  const { combos } = useCombos();
  const settings = useSiteSettings();
  const waUrl = buildWhatsAppUrl(settings.get("contact_phone_intl"), "Hi CineVault! আমি একটা subscription কিনতে চাই।");
  const featuredIds = useMemo(() => {
    const raw = settings.get("hero_featured_ids", "").trim();
    const ids = raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : DEFAULT_FEATURED;
    return ids;
  }, [settings]);

  const slides = useMemo<Slide[]>(() => {
    const productSlides: Slide[] = featuredIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p))
      .map((p) => ({ kind: "product", product: p }));
    const comboSlides: Slide[] = combos.map((c) => ({ kind: "combo", combo: c }));
    // All combos first, then products.
    return [...comboSlides, ...productSlides];
  }, [products, featuredIds, combos]);


  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length === 0) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTO_MS);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  useEffect(() => {
    if (index >= slides.length) setIndex(0);
  }, [slides.length, index]);

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + slides.length) % slides.length);
  if (slides.length === 0) return null;


  return (
    <section className="px-3 pt-3 sm:px-8 sm:pt-4 lg:px-16">
      <div className="mx-auto max-w-[1200px]">

        <div
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] shadow-[0_30px_80px_-30px_rgba(229,9,20,0.55)]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Slides track */}
          <div
            className="flex h-[17rem] transition-transform duration-700 ease-out sm:h-[16rem] lg:h-[19rem]"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((slide, i) =>
              slide.kind === "product" ? (
                <ProductSlide
                  key={`p-${slide.product.id}-${i}`}
                  p={slide.product}
                  waUrl={waUrl}
                  recommended={settings.get("hero_recommended_text", "● Recommended")}
                  startsAt={settings.get("hero_starts_text", "Starts at")}
                  shopText={settings.get("hero_shop_text", "Shop Now")}
                />
              ) : (
                <ComboSlide key={`c-${slide.combo.id}-${i}`} c={slide.combo} />
              ),
            )}

          </div>

          {/* Prev / Next — desktop only; mobile uses swipe + dots */}
          <button
            onClick={() => go(-1)}
            aria-label="Previous"
            className="absolute left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/50 text-white/80 backdrop-blur-md transition hover:border-primary/60 hover:text-primary sm:grid"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next"
            className="absolute right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/50 text-white/80 backdrop-blur-md transition hover:border-primary/60 hover:text-primary sm:grid"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="absolute inset-x-0 bottom-2 z-10 flex items-center justify-center gap-1.5 sm:bottom-5">
            {slides.map((s, i) => (
              <button
                key={`dot-${i}`}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-primary shadow-[0_0_10px_rgba(229,9,20,0.8)]" : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}

function ProductSlide({
  p,
  waUrl,
  recommended,
  startsAt,
  shopText,
}: {
  p: Product;
  waUrl: string;
  recommended: string;
  startsAt: string;
  shopText: string;
}) {
  return (
    <div
      className="relative h-full w-full shrink-0"
      style={{
        background: `radial-gradient(circle at 20% 30%, ${p.accent}55, transparent 60%), radial-gradient(circle at 80% 70%, ${p.accent}33, transparent 55%), #0a0a0a`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative flex h-full items-center justify-between gap-3 px-4 pb-14 pt-5 sm:px-12 sm:py-10">
        <div className="min-w-0 flex-1">
          <span
            className="mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.25em] text-white sm:mb-3 sm:px-3"
            style={{ background: p.accent, boxShadow: `0 0 20px -4px ${p.accent}` }}
          >
            {recommended}
          </span>
          <h1 className="font-display text-[26px] uppercase italic leading-[0.9] tracking-wide text-white sm:text-6xl">
            {p.name}
          </h1>
          <p className="mt-1.5 line-clamp-2 text-[11px] font-medium text-white/70 sm:mt-3 sm:text-sm">
            {p.tagline} · {p.duration}
          </p>
          <div className="mt-2 flex items-baseline gap-2 sm:mt-5">
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/50 sm:text-[10px]">
              {startsAt}
            </span>
            <span className="font-display text-2xl italic text-white sm:text-4xl">৳{p.price}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
            <a
              href="#products"
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-4 text-[11px] font-bold uppercase tracking-wide text-black transition active:scale-95 sm:h-11 sm:px-6 sm:text-xs"
            >
              <Play className="h-3 w-3 fill-black sm:h-3.5 sm:w-3.5" /> {shopText}
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-md transition hover:bg-white/10 sm:h-11 sm:px-6 sm:text-xs"
            >
              <MessageCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> WhatsApp
            </a>
          </div>
        </div>
        <div className="relative shrink-0">
          <div
            className="absolute inset-0 -z-10 rounded-full blur-3xl"
            style={{ background: p.accent, opacity: 0.5 }}
          />
          <div
            className="grid h-28 w-28 place-items-center overflow-hidden rounded-3xl bg-black/40 ring-2 ring-white/10 backdrop-blur-sm sm:h-52 sm:w-52"
            style={{ boxShadow: `0 20px 60px -10px ${p.accent}` }}
          >
            <img
              src={p.logo}
              alt={p.name}
              className={p.logoFill ? "h-full w-full object-cover" : "h-16 w-16 object-contain sm:h-32 sm:w-32"}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ComboSlide({ c }: { c: Combo }) {
  const services = c.services.slice(0, 4);
  const { add } = useCart();
  const navigate = useNavigate();
  const buyNow = () => {
    add(comboToProduct(c));
    navigate({ to: "/checkout" });
  };

  return (
    <div
      className="relative h-full w-full shrink-0 overflow-hidden"
      style={{ background: c.gradient || "linear-gradient(135deg,#0a0a0a,#1a1a1a)" }}
    >
      {/* Animated glow orbs */}
      <div
        className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full blur-3xl animate-pulse"
        style={{ background: c.glow || "#e50914", opacity: 0.35 }}
      />
      <div
        className="pointer-events-none absolute -bottom-20 -right-10 h-60 w-60 rounded-full blur-3xl animate-pulse [animation-delay:1s]"
        style={{ background: c.glow || "#e50914", opacity: 0.28 }}
      />

      <div className="relative flex h-full items-center justify-between gap-3 px-4 pb-14 pt-10 sm:px-12 sm:py-10">
        {/* Left copy */}
        <div className="min-w-0 flex-1">
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.25em] text-white backdrop-blur sm:mb-3 sm:px-3">
            <Sparkles className="h-3 w-3" /> Combo · {c.tag || "Best Value"}
          </span>
          <h1 className="font-display text-[24px] uppercase italic leading-[0.9] tracking-wide text-white sm:text-5xl">
            {c.title}
          </h1>
          <p className="mt-1.5 line-clamp-2 text-[11px] font-medium text-white/80 sm:mt-3 sm:text-sm">
            {c.subtitle} · {c.duration}
          </p>
          <div className="mt-2 flex items-baseline gap-2 sm:mt-5">
            <span className="font-display text-2xl italic text-white sm:text-4xl">৳{c.price}</span>
            {c.originalPrice > c.price ? (
              <span className="text-xs font-semibold text-white/60 line-through sm:text-sm">
                ৳{c.originalPrice}
              </span>
            ) : null}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
            <button
              onClick={buyNow}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-4 text-[11px] font-black uppercase tracking-wide text-black transition active:scale-95 hover:scale-[1.03] sm:h-11 sm:px-6 sm:text-xs"
            >
              <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Buy Now
            </button>
            <Link
              to="/combo/$id"
              params={{ id: c.id }}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur transition hover:bg-white/20 sm:h-11 sm:px-6 sm:text-xs"
            >
              <Info className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Details
            </Link>
          </div>

        </div>

        {/* Right: floating stacked logos */}
        <div className="relative h-32 w-32 shrink-0 sm:h-52 sm:w-52">
          {services.map((s, i) => {
            const positions = [
              { top: "0%", left: "0%", delay: "0s" },
              { top: "0%", left: "55%", delay: "0.4s" },
              { top: "55%", left: "0%", delay: "0.8s" },
              { top: "55%", left: "55%", delay: "1.2s" },
            ];
            const pos = positions[i] ?? positions[0];
            return (
              <div
                key={`${s.name}-${i}`}
                className="absolute grid h-[45%] w-[45%] place-items-center overflow-hidden rounded-2xl bg-black/50 ring-2 ring-white/15 backdrop-blur-md animate-[float_3.6s_ease-in-out_infinite]"
                style={{
                  top: pos.top,
                  left: pos.left,
                  animationDelay: pos.delay,
                  boxShadow: `0 15px 40px -10px ${s.accent || c.glow || "#e50914"}`,
                }}
              >
                <img
                  src={s.logo}
                  alt={s.name}
                  className="h-[70%] w-[70%] object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

