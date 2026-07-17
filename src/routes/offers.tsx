import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Check, ShoppingCart, Flame, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { CategoryBar } from "@/components/CategoryBar";
import { CartDrawer } from "@/components/CartDrawer";
import { BottomNav } from "@/components/BottomNav";
import { SiteFooter } from "@/components/SiteFooter";
import { FloatingHelp } from "@/components/FloatingHelp";
import { Toaster } from "@/components/ui/sonner";
import { useCombos, comboToProduct, type Combo } from "@/lib/combos";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "Combo Offers — CineVault" },
      { name: "description", content: "Netflix + Prime, Chorki + Hoichoi + Bongo, CapCut + Canva ও আরও অনেক combo offer — সবচেয়ে কম দামে।" },
      { property: "og:title", content: "Combo Offers — CineVault" },
      { property: "og:description", content: "Netflix + Prime, Bangla Bundle, Creator Pack — সব premium combo offer এক জায়গায়।" },
    ],
  }),
  component: OffersPage,
});

function OffersPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const { combos, isLoading } = useCombos();
  return (
    <div className="min-h-screen pb-28">
      <Toaster position="top-center" />
      <div className="sticky top-0 z-40">
        <Header onCartClick={() => setCartOpen(true)} />
        <CategoryBar />
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#1a0507] via-black to-[#0a0a0a] px-4 py-10 sm:px-5 sm:py-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(229,9,20,0.22),transparent_55%)]" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/85 hover:border-primary/60 hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
            <Flame className="h-3 w-3 animate-pulse" /> Hot Combo Offers
          </div>
          <h1 className="font-display text-3xl uppercase italic leading-none tracking-wide text-white sm:text-5xl">
            Combo <span className="text-primary">Offers</span>
          </h1>
          <p className="max-w-2xl text-sm text-white/70 sm:text-base">
            দুই বা তিনটা premium subscription একসাথে নিন — আলাদা কেনার চেয়ে অনেক কমে। ১৫ মিনিটে delivery।
          </p>
        </div>
      </section>

      {/* COMBOS */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-5 sm:py-12">
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
          {combos.map((c) => (
            <ComboBanner key={c.id} combo={c} />
          ))}
        </div>
      </section>

      <SiteFooter />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <BottomNav onCartClick={() => setCartOpen(true)} />
      <FloatingHelp />
    </div>
  );
}

function ComboBanner({ combo }: { combo: Combo }) {
  const { add } = useCart();
  const savings = combo.originalPrice - combo.price;
  const savingsPct = Math.round((savings / combo.originalPrice) * 100);

  const handleAdd = () => {
    add(comboToProduct(combo));
    toast.success(`${combo.title} কার্টে যোগ হয়েছে!`);
  };

  return (
    <article
      className="group relative overflow-hidden rounded-3xl border border-white/10 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.7)] transition-transform duration-300 hover:-translate-y-1"
      style={{ background: combo.gradient, boxShadow: `0 25px 60px -30px ${combo.glow}` }}
    >
      {/* Glow orbs */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full blur-3xl opacity-60 transition-opacity group-hover:opacity-90"
        style={{ background: combo.glow }}
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full blur-3xl opacity-40"
        style={{ background: combo.glow }}
      />
      {/* Diagonal shine */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_40%,rgba(255,255,255,0.08)_50%,transparent_60%)]" />

      <div className="relative flex flex-col gap-5 p-5 sm:p-6">
        {/* Top row: tag + savings badge */}
        <div className="flex items-start justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white ring-1 ring-white/25 backdrop-blur">
            <Sparkles className="h-3 w-3" /> {combo.tag}
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-wide text-black shadow-lg">
            Save {savingsPct}%
          </span>
        </div>

        {/* Logo stack */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-3">
            {combo.services.map((s, i) => (
              <span
                key={s.name}
                className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl bg-white ring-2 ring-white/90 shadow-xl sm:h-16 sm:w-16"
                style={{ zIndex: combo.services.length - i }}
              >
                <img src={s.logo} alt={s.name} className="h-9 w-9 object-contain sm:h-10 sm:w-10" loading="lazy" />
              </span>
            ))}
          </div>
          <div className="ml-2 hidden text-[10px] font-bold uppercase tracking-widest text-white/70 sm:block">
            {combo.services.map((s) => s.name).join(" + ")}
          </div>
        </div>

        {/* Title */}
        <div>
          <h3 className="font-display text-2xl uppercase italic leading-none tracking-wide text-white sm:text-3xl">
            {combo.title}
          </h3>
          <p className="mt-2 text-sm text-white/75">{combo.subtitle}</p>
        </div>

        {/* Perks */}
        <ul className="flex flex-wrap gap-1.5">
          {combo.perks.map((p) => (
            <li
              key={p}
              className="inline-flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-semibold text-white/90 ring-1 ring-white/15 backdrop-blur"
            >
              <Check className="h-3 w-3 text-emerald-400" /> {p}
            </li>
          ))}
        </ul>

        {/* Price + CTA */}
        <div className="mt-1 flex items-end justify-between gap-3 border-t border-white/10 pt-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wide text-white/60">Tk.</span>
              <span className="text-3xl font-black leading-none text-white sm:text-4xl" style={{ textShadow: `0 0 20px ${combo.glow}` }}>
                {combo.price}
              </span>
              <span className="text-sm text-white/45 line-through">Tk. {combo.originalPrice}</span>
            </div>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/60">
              {combo.duration} • Save Tk. {savings}
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="group/btn inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-black uppercase tracking-wide text-black shadow-xl transition hover:scale-[1.03] active:scale-95 sm:h-12 sm:px-5"
          >
            <ShoppingCart className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
