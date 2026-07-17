import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Zap, Shield, Play, MessageCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { ProductCard } from "@/components/ProductCard";
import { BottomNav } from "@/components/BottomNav";
import { products, categoryLabels, type Product } from "@/lib/products";
import heroCinema from "@/assets/hero-cinema.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CineVault — Premium Subscriptions at Best Price in BD" },
      { name: "description", content: "Netflix, Prime Video, YouTube Premium, CapCut Pro, Chorki, Hoichoi ও আরও অনেক প্রিমিয়াম সাবস্ক্রিপশন সবচেয়ে কম দামে। bKash, Nagad, Card বা Binance দিয়ে পেমেন্ট।" },
      { property: "og:title", content: "CineVault — Premium Subscriptions at Best Price in BD" },
      { property: "og:description", content: "Netflix, Prime Video, YouTube Premium, CapCut Pro, Chorki, Hoichoi ও আরও অনেক প্রিমিয়াম সাবস্ক্রিপশন সবচেয়ে কম দামে। bKash, Nagad, Card বা Binance দিয়ে পেমেন্ট।" },
    ],
  }),
  component: Home,
});

function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [filter, setFilter] = useState<Product["category"] | "all">("all");

  const filtered = useMemo(
    () => (filter === "all" ? products : products.filter((p) => p.category === filter)),
    [filter],
  );

  const categories: Array<{ key: Product["category"] | "all"; label: string }> = [
    { key: "all", label: "All Plans" },
    { key: "streaming", label: categoryLabels.streaming },
    { key: "editing", label: categoryLabels.editing },
    { key: "music", label: categoryLabels.music },
    { key: "other", label: categoryLabels.other },
  ];

  return (
    <div className="min-h-screen pb-28 sm:pb-0">
      <Header onCartClick={() => setCartOpen(true)} />

      {/* HERO */}
      <section className="px-4 pt-4 sm:px-5 sm:pt-6">
        <div className="mx-auto max-w-6xl">
          <div className="relative h-64 overflow-hidden rounded-3xl border border-border sm:h-96">
            <img
              src={heroCinema}
              alt="CineVault premium subscriptions"
              className="absolute inset-0 h-full w-full object-cover"
              width={1600}
              height={900}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
              <span className="mb-3 inline-block rounded-full bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground shadow-[0_0_15px_rgba(229,9,20,0.5)]">
                Exclusive
              </span>
              <h1 className="font-display text-4xl uppercase italic leading-[0.85] tracking-wide text-white sm:text-7xl">
                Dhamaka BD Offer
              </h1>
              <p className="mt-3 max-w-xs text-xs font-medium text-white/70 sm:max-w-md sm:text-sm">
                Netflix, Prime, CapCut, Chorki — সব প্রিমিয়াম সাবস্ক্রিপশন সবচেয়ে কম দামে, ইনস্ট্যান্ট ডেলিভারি।
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="#products"
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-5 text-xs font-bold text-black transition active:scale-95"
                >
                  <Play className="h-3.5 w-3.5 fill-black" /> Shop Now
                </a>
                <a
                  href="https://wa.me/8801785897167"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/10"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto mt-6 max-w-6xl px-4 sm:px-5">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setFilter(c.key)}
              className={`whitespace-nowrap rounded-full border px-5 py-2 text-xs font-bold transition ${
                filter === c.key
                  ? "border-primary bg-primary text-primary-foreground shadow-[0_0_15px_rgba(229,9,20,0.35)]"
                  : "border-border bg-secondary/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section id="products" className="mx-auto max-w-6xl px-4 pt-6 sm:px-5">
        <div className="mb-5 flex items-end justify-between px-1">
          <div>
            <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-primary">Available Now</p>
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">Trending Services</h2>
          </div>
          <span className="border-b border-border pb-0.5 text-[10px] font-bold uppercase text-muted-foreground">
            View All
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto mt-16 max-w-6xl px-4 sm:px-5">
        <div className="mb-6 px-1">
          <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-primary">Simple Flow</p>
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">How it works</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: Play, title: "1. Choose", text: "যেকোনো সাবস্ক্রিপশন কার্টে যোগ করুন।" },
            { icon: Zap, title: "2. Pay", text: "bKash, Nagad, Card বা Binance দিয়ে পে করুন।" },
            { icon: Shield, title: "3. Enjoy", text: "১৫ মিনিটের মধ্যে অ্যাকাউন্ট বুঝিয়ে দেওয়া হবে।" },
          ].map((s) => (
            <div key={s.title} className="rounded-3xl border border-border bg-card/60 p-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-bold text-foreground">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="mx-auto mt-16 max-w-6xl px-4 pb-16 sm:px-5">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card/60 p-8 text-center">
          <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
          <div className="relative">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Need help choosing?</h2>
            <p className="mt-3 text-sm text-muted-foreground">২৪/৭ সাপোর্ট — যেকোনো প্রশ্নে যোগাযোগ করুন।</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://wa.me/8801785897167"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:brightness-110"
              >
                WhatsApp: 01785-897167
              </a>
              <a
                href="https://www.facebook.com/share/1HTm4Rz58F/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-secondary/60 px-6 text-sm font-bold text-foreground hover:border-primary/60"
              >
                Messenger
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CineVault. All rights reserved.
      </footer>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <BottomNav onCartClick={() => setCartOpen(true)} />
    </div>
  );
}
