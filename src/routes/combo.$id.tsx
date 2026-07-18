import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Sparkles, Zap, ShoppingCart, ShieldCheck, Clock, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { BottomNav } from "@/components/BottomNav";
import { SiteFooter } from "@/components/SiteFooter";
import { FloatingHelp } from "@/components/FloatingHelp";
import { Toaster } from "@/components/ui/sonner";
import { useCombos, comboToProduct, type Combo } from "@/lib/combos";
import { useCart } from "@/lib/cart";
import { useSiteSettings, buildWhatsAppUrl } from "@/lib/site-settings";

export const Route = createFileRoute("/combo/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Combo — ${params.id} · CineVault` },
      { name: "description", content: "Premium subscription combo — সবচেয়ে কম দামে, ১৫ মিনিটে delivery।" },
    ],
  }),
  component: ComboDetail,
});

function ComboDetail() {
  const { id } = Route.useParams();
  const { combos, isLoading } = useCombos();
  const [cartOpen, setCartOpen] = useState(false);
  const { add } = useCart();
  const navigate = useNavigate();
  const settings = useSiteSettings();
  const waUrl = buildWhatsAppUrl(
    settings.get("contact_phone_intl"),
    `Hi CineVault! আমি "${id}" combo সম্পর্কে জানতে চাই।`,
  );

  const combo: Combo | undefined = combos.find((c) => c.id === id);

  if (isLoading && !combo) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-sm text-muted-foreground">
        Loading combo…
      </div>
    );
  }

  if (!combo) {
    return (
      <div className="mobile-fixed-shell min-h-screen bg-background">
        <div className="mobile-fixed-top sticky top-0 z-40">
          <Header onCartClick={() => setCartOpen(true)} />
        </div>
        <main className="mobile-scroll-area">
          <div className="mx-auto max-w-2xl px-4 py-24 text-center">
            <h1 className="text-2xl font-bold text-foreground">Combo not found</h1>
            <p className="mt-2 text-sm text-muted-foreground">এই combo টি পাওয়া যাচ্ছে না।</p>
            <Link
              to="/offers"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground"
            >
              সব Combo দেখুন
            </Link>
          </div>
          <SiteFooter />
        </main>
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        <BottomNav onCartClick={() => setCartOpen(true)} />
      </div>
    );
  }

  const savings = combo.originalPrice - combo.price;
  const savingsPct = Math.round((savings / combo.originalPrice) * 100);

  const addOnly = () => {
    add(comboToProduct(combo));
    toast.success(`${combo.title} কার্টে যোগ হয়েছে!`);
  };
  const buyNow = () => {
    add(comboToProduct(combo));
    navigate({ to: "/checkout" });
  };

  return (
    <div className="mobile-fixed-shell min-h-screen bg-background">
      <Toaster position="top-center" />
      <div className="mobile-fixed-top sticky top-0 z-40">
        <Header onCartClick={() => setCartOpen(true)} />
      </div>

      <main className="mobile-scroll-area">
        {/* HERO */}
        <section
          className="relative overflow-hidden border-b border-white/10"
          style={{ background: combo.gradient }}
        >
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl opacity-60"
            style={{ background: combo.glow }}
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-40"
            style={{ background: combo.glow }}
          />

          <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-14">
            <Link
              to="/offers"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur hover:bg-white/20"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All Combos
            </Link>

            <div className="mt-5 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white ring-1 ring-white/25 backdrop-blur">
                  <Sparkles className="h-3 w-3" /> {combo.tag || "Best Value"}
                </span>
                <h1 className="mt-3 font-display text-3xl uppercase italic leading-none tracking-wide text-white sm:text-5xl">
                  {combo.title}
                </h1>
                <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">{combo.subtitle}</p>

                <div className="mt-5 flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl font-black text-white sm:text-4xl" style={{ textShadow: `0 0 20px ${combo.glow}` }}>
                    ৳{combo.price}
                  </span>
                  {combo.originalPrice > combo.price ? (
                    <>
                      <span className="text-sm text-white/50 line-through sm:text-base">৳{combo.originalPrice}</span>
                      <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-black uppercase text-black">
                        Save {savingsPct}%
                      </span>
                    </>
                  ) : null}
                  <span className="text-[11px] font-bold uppercase tracking-widest text-white/70">
                    · {combo.duration}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 sm:gap-3">
                  <button
                    onClick={buyNow}
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-black uppercase tracking-wide text-black shadow-xl transition hover:scale-[1.03] active:scale-95"
                  >
                    <Zap className="h-4 w-4" /> Buy Now
                  </button>
                  <button
                    onClick={addOnly}
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 text-sm font-bold uppercase tracking-wide text-white backdrop-blur transition hover:bg-white/20"
                  >
                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                  </button>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-black/25 px-5 text-sm font-bold uppercase tracking-wide text-white backdrop-blur transition hover:bg-black/40"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                </div>
              </div>

              {/* Logo tiles */}
              <div className="relative mt-2 grid grid-cols-2 gap-3 sm:mt-0 sm:w-64">
                {combo.services.slice(0, 4).map((s, i) => (
                  <div
                    key={`${s.name}-${i}`}
                    className="grid aspect-square place-items-center overflow-hidden rounded-2xl bg-black/40 ring-2 ring-white/15 backdrop-blur-md animate-[float_3.6s_ease-in-out_infinite]"
                    style={{ animationDelay: `${i * 0.25}s`, boxShadow: `0 15px 40px -10px ${s.accent || combo.glow}` }}
                  >
                    <img src={s.logo} alt={s.name} className="h-14 w-14 object-contain sm:h-16 sm:w-16" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WHAT'S INCLUDED */}
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">What's Included</h2>
          <p className="mt-1 text-sm text-muted-foreground">এই combo-তে যা যা পাচ্ছেন</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {combo.services.map((s, i) => (
              <div
                key={`${s.name}-${i}`}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <div
                  className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl bg-black/5"
                  style={{ boxShadow: `0 8px 25px -12px ${s.accent || combo.glow}` }}
                >
                  <img src={s.logo} alt={s.name} className="h-10 w-10 object-contain" loading="lazy" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-base font-bold text-foreground">{s.name}</div>
                  <div className="text-xs text-muted-foreground">Premium · {combo.duration}</div>
                </div>
                <Check className="h-5 w-5 text-emerald-500" />
              </div>
            ))}
          </div>
        </section>

        {/* PERKS */}
        {combo.perks.length > 0 && (
          <section className="mx-auto max-w-5xl px-4 pb-6 sm:px-6">
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">Perks</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {combo.perks.map((p) => (
                <li
                  key={p}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/70 px-3 py-1.5 text-xs font-semibold text-foreground"
                >
                  <Check className="h-3.5 w-3.5 text-emerald-500" /> {p}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* TRUST */}
        <section className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: Clock, title: "১৫ মিনিটে Delivery", text: "Payment confirm হলে দ্রুত account।" },
              { icon: ShieldCheck, title: "১০০% Genuine", text: "Official account, warranty সহ।" },
              { icon: Sparkles, title: "২৪/৭ Support", text: "WhatsApp/Messenger — যেকোনো সময়।" },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card/70 p-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <div className="mt-3 text-sm font-bold text-foreground">{f.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{f.text}</div>
              </div>
            ))}
          </div>
        </section>

        {/* STICKY BOTTOM CTA (mobile) */}
        <div className="sticky bottom-[calc(68px+env(safe-area-inset-bottom))] z-30 mx-auto max-w-5xl px-3 pb-3 sm:hidden">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0a0a0a] p-3 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">Total</div>
              <div className="text-xl font-black text-white">৳{combo.price}</div>
            </div>
            <button
              onClick={buyNow}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-black uppercase tracking-wide text-primary-foreground shadow-[0_0_20px_rgba(229,9,20,0.5)]"
            >
              <Zap className="h-4 w-4" /> Buy Now
            </button>
          </div>
        </div>

        <SiteFooter />
      </main>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <BottomNav onCartClick={() => setCartOpen(true)} />
      <FloatingHelp />
    </div>
  );
}
