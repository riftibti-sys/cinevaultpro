import { useEffect, useMemo, useState } from "react";
import { Play, MessageCircle, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useProducts, type Product } from "@/lib/products";
import { useCombos, type Combo } from "@/lib/combos";
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
    // Interleave: combo, product, product, combo, product, product...
    const out: Slide[] = [];
    let ci = 0, pi = 0;
    while (ci < comboSlides.length || pi < productSlides.length) {
      if (ci < comboSlides.length) out.push(comboSlides[ci++]);
      if (pi < productSlides.length) out.push(productSlides[pi++]);
      if (pi < productSlides.length) out.push(productSlides[pi++]);
    }
    return out;
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
            className="flex h-[13rem] transition-transform duration-700 ease-out sm:h-[16rem] lg:h-[19rem]"
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
                key={s.id}
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
