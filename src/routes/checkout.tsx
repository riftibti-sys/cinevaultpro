import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Copy } from "lucide-react";
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

function Checkout() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const settings = useSiteSettings();
  const [method, setMethod] = useState<PayMethod>("bkash");
  const [form, setForm] = useState({ name: "", phone: "", email: "", trxId: "", notes: "" });
  const [placed, setPlaced] = useState(false);
  const [copied, setCopied] = useState(false);

  const payInstructions: Record<PayMethod, { label: string; account: string; note: string }> = {
    bkash: { label: "bKash (Send Money)", account: settings.get("bkash_number"), note: "Send Money → নাম্বারে টাকা পাঠান → নিচে TrxID লিখুন।" },
    nagad: { label: "Nagad (Send Money)", account: settings.get("nagad_number"), note: "Send Money → নাম্বারে টাকা পাঠান → নিচে TrxID লিখুন।" },
    binance: { label: "Binance Pay (USDT)", account: "Binance ID: cinevault", note: "USDT (BEP20/TRC20) পাঠিয়ে TxHash নিচে দিন।" },
    card: { label: "Card Payment", account: "WhatsApp করুন সিকিউর কার্ড লিংকের জন্য", note: "কার্ড পেমেন্টের জন্য আমরা WhatsApp-এ সিকিউর লিংক পাঠাব।" },
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderLines = items.map((i) => `• ${i.product.name} × ${i.qty} = ৳${i.product.price * i.qty}`).join("\n");
    const msg =
      `*New Order — CineVault*\n\n` +
      `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\n\n` +
      `*Items:*\n${orderLines}\n\n*Total:* ৳${total}\n\n` +
      `Payment: ${payInstructions[method].label}\nTrxID / TxHash: ${form.trxId || "(pending)"}\n\n` +
      `Notes: ${form.notes || "-"}`;
    window.open(buildWhatsAppUrl(settings.get("contact_phone_intl"), msg), "_blank");
    setPlaced(true);
    clear();
  };

  const copy = () => {
    navigator.clipboard.writeText(payInstructions[method].account);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (placed) {
    return (
      <div className="grid min-h-screen place-items-center px-5">
        <div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
          <h1 className="mt-4 text-2xl font-bold">Order Received!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            আপনার অর্ডারের বিস্তারিত WhatsApp-এ পাঠানো হয়েছে। ১৫ মিনিটের মধ্যে অ্যাকাউন্ট বুঝিয়ে দেওয়া হবে।
          </p>
          <button
            onClick={() => navigate({ to: "/" })}
            className="mt-6 h-11 w-full rounded-lg bg-primary font-semibold text-primary-foreground hover:brightness-110"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="grid min-h-screen place-items-center px-5">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">← Browse subscriptions</Link>
        </div>
      </div>
    );
  }

  return (
    <main
      className="h-[100dvh] overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] [touch-action:pan-y]"
    >
      <div className="mx-auto max-w-5xl px-5 py-8 pb-32">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Continue shopping
        </Link>
        <h1 className="mt-4 text-3xl font-bold">Checkout</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <form onSubmit={submit} className="space-y-6">
            {/* Contact */}
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold">Contact Info</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Full Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
                <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required placeholder="01XXXXXXXXX" />
                <div className="sm:col-span-2">
                  <Field label="Email (account delivery)" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold">Payment Method</h2>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(Object.keys(payInstructions) as PayMethod[]).map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`rounded-lg border px-3 py-3 text-sm font-medium transition ${
                      method === m ? "border-primary bg-primary/10 text-foreground" : "border-border bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m === "bkash" && "bKash"}
                    {m === "nagad" && "Nagad"}
                    {m === "binance" && "Binance"}
                    {m === "card" && "Card"}
                  </button>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-border bg-background p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{payInstructions[method].label}</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="font-mono text-base font-semibold">{payInstructions[method].account}</span>
                  <button type="button" onClick={copy} className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary/60">
                    <Copy className="h-3 w-3" /> {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{payInstructions[method].note}</p>
              </div>

              <div className="mt-4">
                <Field
                  label="Transaction ID / TxHash"
                  value={form.trxId}
                  onChange={(v) => setForm({ ...form, trxId: v })}
                  placeholder={method === "card" ? "Not required for card" : "e.g. 8N7A2B3C4D"}
                  required={method !== "card"}
                />
              </div>

              <div className="mt-4">
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Notes (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
            </section>

            <button
              type="submit"
              className="h-12 w-full rounded-lg bg-primary text-base font-semibold text-primary-foreground transition hover:brightness-110"
            >
              Place Order via WhatsApp
            </button>
          </form>

          {/* Summary */}
          <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <ul className="mt-4 space-y-3">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex items-center gap-3 text-sm">
                  <div
                    className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg ring-1 ring-white/10"
                    style={{ background: `linear-gradient(135deg, ${product.accent}22, ${product.accent}05)` }}
                  >
                    <img src={product.logo} alt="" className={product.logoFill ? "h-full w-full object-cover" : "h-7 w-7 object-contain"} referrerPolicy="no-referrer" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty {qty}</p>
                  </div>
                  <span className="font-semibold">৳{product.price * qty}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 border-t border-border pt-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span><span>৳{total}</span>
              </div>
              <div className="mt-3 flex justify-between text-lg font-bold">
                <span>Total</span><span>৳{total}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Field({
  label, value, onChange, type = "text", placeholder, required,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean; }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}{required && " *"}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary"
      />
    </div>
  );
}
