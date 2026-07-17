import { useEffect, useState } from "react";
import { Play, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { products } from "@/lib/products";

// Featured products to showcase in the hero (in order)
const featuredIds = ["netflix", "prime", "yt-premium", "hbo", "spotify", "capcut", "chatgpt", "chorki"];

const slides = featuredIds
  .map((id) => products.find((p) => p.id === id))
  .filter((p): p is (typeof products)[number] => Boolean(p));

const AUTO_MS = 10000;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTO_MS);
    return () => clearInterval(t);
  }, [paused]);

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + slides.length) % slides.length);

  return (
    <section className="px-4 pt-4 sm:px-5 sm:pt-6">
      <div className="mx-auto max-w-6xl">
        <div
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] shadow-[0_30px_80px_-30px_rgba(229,9,20,0.55)]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Slides track */}
          <div
            className="flex h-64 transition-transform duration-700 ease-out sm:h-96"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((p) => (
              <div
                key={p.id}
                className="relative h-full w-full shrink-0"
                style={{
                  background: `radial-gradient(circle at 20% 30%, ${p.accent}55, transparent 60%), radial-gradient(circle at 80% 70%, ${p.accent}33, transparent 55%), #0a0a0a`,
                }}
              >
                {/* Subtle grid pattern */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />

                <div className="relative flex h-full items-center justify-between gap-4 px-5 py-6 sm:px-12 sm:py-10">
                  {/* Left: copy */}
                  <div className="min-w-0 flex-1">
                    <span
                      className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.25em] text-white"
                      style={{ background: p.accent, boxShadow: `0 0 20px -4px ${p.accent}` }}
                    >
                      ● Recommended
                    </span>
                    <h1 className="font-display text-3xl uppercase italic leading-[0.9] tracking-wide text-white sm:text-6xl">
                      {p.name}
                    </h1>
                    <p className="mt-2 text-xs font-medium text-white/70 sm:mt-3 sm:text-sm">
                      {p.tagline} · {p.duration}
                    </p>
                    <div className="mt-3 flex items-baseline gap-2 sm:mt-5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                        Starts at
                      </span>
                      <span className="font-display text-2xl italic text-white sm:text-4xl">
                        ৳{p.price}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
                      <a
                        href="#products"
                        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-4 text-[11px] font-bold uppercase tracking-wide text-black transition active:scale-95 sm:h-11 sm:px-6 sm:text-xs"
                      >
                        <Play className="h-3 w-3 fill-black sm:h-3.5 sm:w-3.5" /> Shop Now
                      </a>
                      <a
                        href="https://wa.me/8801785897167"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-md transition hover:bg-white/10 sm:h-11 sm:px-6 sm:text-xs"
                      >
                        <MessageCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> WhatsApp
                      </a>
                    </div>
                  </div>

                  {/* Right: giant logo */}
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
            ))}
          </div>

          {/* Prev / Next */}
          <button
            onClick={() => go(-1)}
            aria-label="Previous"
            className="absolute left-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/50 text-white/80 backdrop-blur-md transition hover:border-primary/60 hover:text-primary sm:left-4 sm:h-11 sm:w-11"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next"
            className="absolute right-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/50 text-white/80 backdrop-blur-md transition hover:border-primary/60 hover:text-primary sm:right-4 sm:h-11 sm:w-11"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Dots */}
          <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-1.5 sm:bottom-5">
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
