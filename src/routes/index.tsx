import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Play, Shield, Zap, MessageCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { ProductCard } from "@/components/ProductCard";
import { products, categoryLabels, type Product } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CineVault — Premium Subscriptions at Best Price in BD" },
      { name: "description", content: "Netflix, Prime Video, YouTube Premium, CapCut Pro, Chorki, Hoichoi ও আরও অনেক প্রিমিয়াম সাবস্ক্রিপশন সবচেয়ে কম দামে। bKash, Nagad, Card বা Binance দিয়ে পেমেন্ট।" },
      { property: "og:title", content: "CineVault — Premium Subscriptions" },
      { property: "og:description", content: "Trusted premium subscription store in Bangladesh." },
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
    { key: "all", label: "All" },
    { key: "streaming", label: categoryLabels.streaming },
    { key: "editing", label: categoryLabels.editing },
    { key: "music", label: categoryLabels.music },
    { key: "other", label: categoryLabels.other },
  ];

  return (
    <div className="min-h-screen">
      <Header onCartClick={() => setCartOpen(true)} />

      {/* Hero */}
      <section
        className="relative overflow-hidden border-b border-border"
        style={{ backgroundImage: "var(--gradient-hero)" }}
      >
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> Trusted by 2000+ customers
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Premium Subscriptions.
            <br />
            <span className="text-primary">Unbeatable Prices.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
            Netflix, Prime Video, YouTube Premium, CapCut Pro ও আরও অনেক কিছু —
            সহজ পেমেন্টে, দ্রুত ডেলিভারিতে।
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#products"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
            >
              <Play className="h-4 w-4" /> Browse Subscriptions
            </a>
            <a
              href="https://wa.me/8801785897167"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-secondary px-6 text-sm font-semibold transition hover:border-primary/60"
            >
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Choose your subscription</h2>
            <p className="mt-2 text-sm text-muted-foreground">All accounts are 100% genuine and warranty covered.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setFilter(c.key)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                  filter === c.key
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">How it works</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { icon: Play, title: "1. Choose", text: "যেকোনো সাবস্ক্রিপশন কার্টে যোগ করুন।" },
              { icon: Zap, title: "2. Pay", text: "bKash, Nagad, Card বা Binance দিয়ে সহজে পে করুন।" },
              { icon: Shield, title: "3. Enjoy", text: "১৫ মিনিটের মধ্যে অ্যাকাউন্ট বুঝিয়ে দেওয়া হবে।" },
            ].map((s) => (
              <div key={s.title} className="rounded-2xl border border-border bg-card p-6">
                <s.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-border">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Need help choosing?</h2>
          <p className="mt-3 text-muted-foreground">২৪/৭ সাপোর্ট — যেকোনো প্রশ্নে যোগাযোগ করুন।</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://wa.me/8801785897167"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground hover:brightness-110"
            >
              WhatsApp: 01785-897167
            </a>
            <a
              href="https://www.facebook.com/share/1HTm4Rz58F/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-secondary px-6 text-sm font-semibold hover:border-primary/60"
            >
              Messenger
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CineVault. All rights reserved.
      </footer>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
