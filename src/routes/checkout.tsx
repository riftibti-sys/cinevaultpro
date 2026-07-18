import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Copy, ShieldCheck, Zap, ArrowRight, Lock } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useSiteSettings, buildWhatsAppUrl } from "@/lib/site-settings";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — CineVault" },
      { name: "description", content: "Complete your subscription purchase securely." },
    ],
  }),
  component: Checkout,
});

type PayMethod = "bkash" | "nagad" | "binance" | "card";

const METHOD_META: Record<PayMethod, { label: string; hint: string; color: string }> = {
  bkash:   { label: "bKash",   hint: "Send Money",  color: "#E2136E" },
  nagad:   { label: "Nagad",   hint: "Send Money",  color: "#EE1C25" },
  binance: { label: "Binance", hint: "USDT Pay",    color: "#F3BA2F" },
  card:    { label: "Card",    hint: "Secure link", color: "#3B82F6" },
};

function Checkout() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const settings = useSiteSettings();
  const [method, setMethod] = useState<PayMethod>("bkash");
  const [form, setForm] = useState({ name: "", phone: "", email: "", trxId: "", notes: "" });
  const [placed, setPlaced] = useState(false);
  const [copied, setCopied] = useState(false);

  const account = useMemo(() => {
    if (method === "bkash") return settings.get("bkash_number");
    if (method === "nagad") return settings.get("nagad_number");
    if (method === "binance") return "Binance ID: cinevault";
    return "WhatsApp করুন secure card link এর জন্য";
  }, [method, settings]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderLines = items.map((i) => `• ${i.product.name} × ${i.qty} = ৳${i.product.price * i.qty}`).join("\n");
    const msg =
      `*New Order — CineVault*\n\n` +
      `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\n\n` +
      `*Items:*\n${orderLines}\n\n*Total:* ৳${total}\n\n` +
      `Payment: ${METHOD_META[method].label}\nTrxID / TxHash: ${form.trxId || "(pending)"}\n\n` +
      `Notes: ${form.notes || "-"}`;
    window.open(buildWhatsAppUrl(settings.get("contact_phone_intl"), msg), "_blank");
    setPlaced(true);
    clear();
  };

  const copy = () => {
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  if (placed) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-5">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-[0_20px_60px_-20px_rgba(0,0,0,0.2)]">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-9 w-9 text-primary" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Order Received!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            অর্ডার WhatsApp-এ পাঠানো হয়েছে। ১৫ মিনিটের মধ্যে account বুঝিয়ে দেওয়া হবে।
          </p>
          <button
            onClick={() => navigate({ to: "/" })}
            className="mt-6 h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground hover:brightness-110"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-5">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">← Browse subscriptions</Link>
        </div>
      </div>
    );
  }

  const cardTrxRequired = method !== "card";

  return (
    <div className="min-h-screen bg-background pb-32 md:pb-16">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Continue
          </Link>
          <h1 className="text-base font-bold">Checkout</h1>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
            <Lock className="h-3 w-3 text-primary" /> Secure
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-5">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <form onSubmit={submit} className="space-y-4" id="checkout-form">
            {/* Step 1 — Contact */}
            <Section step="1" title="Your details">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Full Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required placeholder="আপনার নাম" />
                <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required placeholder="01XXXXXXXXX" />
                <div className="sm:col-span-2">
                  <Field label="Email (delivery)" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required placeholder="you@example.com" />
                </div>
              </div>
            </Section>

            {/* Step 2 — Payment */}
            <Section step="2" title="Pay with">
              <div className="grid grid-cols-4 gap-2">
                {(Object.keys(METHOD_META) as PayMethod[]).map((m) => {
                  const meta = METHOD_META[m];
                  const active = method === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethod(m)}
                      className={`group relative flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-center transition ${
                        active
                          ? "border-primary bg-primary/5 shadow-[0_6px_20px_-10px_hsl(var(--primary))]"
                          : "border-border bg-secondary/40 hover:border-primary/40"
                      }`}
                    >
                      <span
                        className="h-7 w-7 rounded-full ring-2 ring-white"
                        style={{ background: meta.color }}
                      />
                      <span className="text-xs font-bold">{meta.label}</span>
                      <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{meta.hint}</span>
                      {active && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />}
                    </button>
                  );
                })}
              </div>

              {/* Account box */}
              <div className="mt-4 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Send to</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="truncate font-mono text-sm font-bold">{account}</span>
                  <button type="button" onClick={copy} className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold shadow-sm ring-1 ring-border hover:ring-primary/60">
                    <Copy className="h-3 w-3" /> {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {cardTrxRequired && (
                <div className="mt-3">
                  <Field
                    label="Transaction ID"
                    value={form.trxId}
                    onChange={(v) => setForm({ ...form, trxId: v })}
                    placeholder="e.g. 8N7A2B3C4D"
                    required
                  />
                </div>
              )}

              <div className="mt-3">
                <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">Notes (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  placeholder="Plan, duration, extra info…"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
            </Section>

            {/* Desktop submit */}
            <button
              type="submit"
              className="hidden h-14 w-full items-center justify-between rounded-2xl bg-primary px-5 text-base font-bold text-primary-foreground shadow-[0_10px_30px_-10px_hsl(var(--primary))] transition hover:brightness-110 lg:flex"
            >
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Place Order</span>
              <span className="inline-flex items-center gap-2">৳{total} <ArrowRight className="h-5 w-5" /></span>
            </button>
          </form>

          {/* Summary */}
          <aside className="h-fit rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-20">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Your order</p>
            <ul className="mt-3 space-y-2.5">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex items-center gap-3 text-sm">
                  <div
                    className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-lg ring-1 ring-white/10"
                    style={{ background: `linear-gradient(135deg, ${product.accent}22, ${product.accent}05)` }}
                  >
                    <img src={product.logo} alt="" className={product.logoFill ? "h-full w-full object-cover" : "h-6 w-6 object-contain"} referrerPolicy="no-referrer" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{product.name}</p>
                    <p className="text-[11px] text-muted-foreground">Qty {qty}</p>
                  </div>
                  <span className="font-bold">৳{product.price * qty}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-border pt-3">
              <div className="flex justify-between text-lg font-extrabold">
                <span>Total</span><span>৳{total}</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-[10px] font-semibold text-muted-foreground">
                <span className="rounded-md bg-secondary/60 py-1.5"><ShieldCheck className="mx-auto mb-0.5 h-3 w-3 text-primary" />Secure</span>
                <span className="rounded-md bg-secondary/60 py-1.5"><Zap className="mx-auto mb-0.5 h-3 w-3 text-primary" />Instant</span>
                <span className="rounded-md bg-secondary/60 py-1.5"><Lock className="mx-auto mb-0.5 h-3 w-3 text-primary" />No fees</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky pay bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-10px_30px_rgba(0,0,0,0.15)] backdrop-blur lg:hidden">
        <button
          type="submit"
          form="checkout-form"
          className="flex h-14 w-full items-center justify-between rounded-2xl bg-primary px-5 text-base font-bold text-primary-foreground shadow-[0_10px_25px_-8px_hsl(var(--primary))] transition active:scale-[0.99]"
        >
          <span className="inline-flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Place Order</span>
          <span className="inline-flex items-center gap-2">৳{total} <ArrowRight className="h-5 w-5" /></span>
        </button>
        <p className="mt-1.5 text-center text-[10px] text-muted-foreground">bKash · Nagad · Card · Binance — under 1 min</p>
      </div>
    </div>
  );
}

function Section({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-black text-primary-foreground">{step}</span>
        <h2 className="text-base font-bold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Field({
  label, value, onChange, type = "text", placeholder, required,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean; }) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">{label}{required && " *"}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
    </div>
  );
}
