import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Sparkles, Zap, ShoppingCart, ShieldCheck, Clock, MessageCircle, Monitor, Download, Radio, PlayCircle } from "lucide-react";
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
import { getServiceSpec } from "@/lib/service-specs";


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

        {/* WHAT'S INCLUDED — premium per-service specs */}
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">প্রতিটা Service-এর বৈশিষ্ট্য</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                কী কী পাচ্ছেন, কোথায় দেখবেন, কয় screen — সব বিস্তারিত
              </p>
            </div>
            <span className="hidden rounded-full border border-border bg-secondary/70 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground sm:inline-block">
              {combo.services.length} Premium Services
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {combo.services.map((s, i) => {
              const spec = getServiceSpec(s.name);
              const accent = s.accent || combo.glow;
              return (
                <article
                  key={`${s.name}-${i}`}
                  className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:shadow-xl"
                >
                  {/* accent edge */}
                  <div
                    className="absolute inset-y-0 left-0 w-1"
                    style={{ background: `linear-gradient(180deg, ${accent}, transparent)` }}
                  />
                  <div
                    className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-20 blur-3xl"
                    style={{ background: accent }}
                  />

                  <div className="relative p-4 sm:p-6">
                    {/* header */}
                    <div className="flex items-center gap-4">
                      <div
                        className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-black/5 ring-1 ring-border sm:h-20 sm:w-20"
                        style={{ boxShadow: `0 15px 40px -18px ${accent}` }}
                      >
                        <img src={s.logo} alt={s.name} className="h-12 w-12 object-contain sm:h-14 sm:w-14" loading="lazy" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-foreground sm:text-xl">{s.name}</h3>
                          <span
                            className="rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white"
                            style={{ background: accent }}
                          >
                            Premium
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Duration · <span className="font-semibold text-foreground">{combo.duration}</span>
                        </div>
                      </div>
                      <Check className="hidden h-6 w-6 text-emerald-500 sm:block" />
                    </div>

                    {/* spec grid */}
                    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                      <SpecTile icon={PlayCircle} label="Quality" value={spec.quality} accent={accent} />
                      <SpecTile icon={Monitor} label="Screens" value={spec.screens} accent={accent} />
                      <SpecTile icon={Download} label="Downloads" value={spec.downloads} accent={accent} />
                      <SpecTile icon={Radio} label="Devices" value={spec.devices} accent={accent} />
                    </div>

                    {/* highlights + how-to */}
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-border bg-secondary/40 p-4">
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          ✦ Highlights
                        </div>
                        <ul className="mt-2 space-y-1.5">
                          {spec.highlights.map((h) => (
                            <li key={h} className="flex items-start gap-2 text-xs text-foreground sm:text-sm">
                              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-border bg-secondary/40 p-4">
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          ▶ কীভাবে ব্যবহার করবেন
                        </div>
                        <ol className="mt-2 space-y-1.5">
                          {spec.howTo.map((step, idx) => (
                            <li key={step} className="flex items-start gap-2 text-xs text-foreground sm:text-sm">
                              <span
                                className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-black text-white"
                                style={{ background: accent }}
                              >
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
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

        {/* STICKY BOTTOM CTA (mobile) — slim glass pill */}
        <div className="pointer-events-none sticky bottom-[calc(72px+env(safe-area-inset-bottom))] z-30 mx-auto max-w-md px-4 pb-2 sm:hidden">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/15 bg-black/70 py-1.5 pl-4 pr-1.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <div className="flex min-w-0 flex-1 items-baseline gap-1.5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/50">Total</span>
              <span className="text-base font-black text-white">৳{combo.price}</span>
              {combo.originalPrice > combo.price && (
                <span className="text-[10px] text-white/40 line-through">৳{combo.originalPrice}</span>
              )}
            </div>
            <button
              onClick={buyNow}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-black uppercase tracking-wide text-primary-foreground shadow-[0_0_16px_rgba(229,9,20,0.55)] active:scale-95"
            >
              <Zap className="h-3.5 w-3.5" /> Buy Now
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

function SpecTile({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-3 backdrop-blur transition hover:border-foreground/20">
      <div className="flex items-center gap-2">
        <div
          className="grid h-7 w-7 place-items-center rounded-lg text-white"
          style={{ background: accent }}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
          {label}
        </div>
      </div>
      <div className="mt-2 text-xs font-bold leading-tight text-foreground sm:text-sm">
        {value}
      </div>
    </div>
  );
}
