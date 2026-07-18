import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Package, Upload, User, Phone, Mail, MapPin, Send, X, Ticket, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { BottomNav } from "@/components/BottomNav";
import { SiteFooter } from "@/components/SiteFooter";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings, buildWhatsAppUrl } from "@/lib/site-settings";


export const Route = createFileRoute("/request-order")({
  head: () => ({
    meta: [
      { title: "Request Order — CineVault" },
      { name: "description", content: "যে subscription খুঁজে পাচ্ছেন না সেটা request করুন — Netflix, Prime, CapCut, যেকোনো premium service।" },
    ],
  }),
  component: RequestOrderPage,
});

const schema = z.object({
  productName: z.string().trim().min(2, "Product name দিন").max(200),
  fullName: z.string().trim().min(2, "Full name দিন").max(100),
  phone: z.string().trim().min(10, "সঠিক phone দিন").max(20),
  email: z.string().trim().email("Valid email দিন").max(255).or(z.literal("")),
  address: z.string().trim().min(3, "Address দিন").max(300),
  notes: z.string().max(500).optional(),
});

function RequestOrderPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string>("------");
  const settings = useSiteSettings();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTicketId(Date.now().toString().slice(-6));
  }, []);

  const [form, setForm] = useState({
    productName: "",
    fullName: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  const onFile = (f: File | null) => {
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      toast.error("Image 5MB এর কম হতে হবে");
      return;
    }
    const r = new FileReader();
    r.onload = () => setImage(r.result as string);
    r.readAsDataURL(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    setSubmitting(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const { error } = await supabase.from("orders").insert({
        user_id: sessionData.session?.user.id ?? null,
        product_name: result.data.productName,
        full_name: result.data.fullName,
        phone: result.data.phone,
        email: result.data.email || null,
        address: result.data.address,
        notes: result.data.notes || null,
        status: "new",
      });
      if (error) throw error;
    } catch (err) {
      console.error(err);
      toast.error("Order save হয়নি, WhatsApp দিয়ে পাঠাচ্ছি");
    }

    const msg = [
      `🎬 *CineVault — New Order Request*`,
      ``,
      `📦 Product: ${result.data.productName}`,
      `👤 Name: ${result.data.fullName}`,
      `📱 Phone: ${result.data.phone}`,
      result.data.email && `✉️ Email: ${result.data.email}`,
      `📍 Address: ${result.data.address}`,
      result.data.notes && `📝 Notes: ${result.data.notes}`,
      image && `\n(Product image আমি এই chat-এ পাঠাচ্ছি)`,
    ]
      .filter(Boolean)
      .join("\n");

    const url = buildWhatsAppUrl(settings.get("contact_phone_intl"), msg);
    window.open(url, "_blank");
    toast.success("🎬 Request পাঠানো হয়েছে! WhatsApp-এ image attach করুন।");
    setTimeout(() => setSubmitting(false), 800);
  };


  return (
    <div className="mobile-fixed-shell min-h-screen bg-background">
      <div className="mobile-fixed-top sticky top-0 z-40">
        <Header onCartClick={() => setCartOpen(true)} />
      </div>

      <main className="mobile-scroll-area">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#1a0507] via-black to-[#0a0a0a] px-4 py-10 sm:px-5 sm:py-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(229,9,20,0.18),transparent_50%)]" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to store
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-primary">
            <Sparkles className="h-3 w-3" /> Custom Request
          </span>
          <h1 className="mt-4 font-display text-4xl uppercase italic leading-[0.9] tracking-wide text-white sm:text-6xl">
            Request Your <span className="text-primary">Order</span>
          </h1>
          <p className="mt-3 max-w-lg text-sm text-white/60 sm:text-base">
            যে subscription আমাদের listing-এ পাচ্ছেন না? নিচের form পূরণ করুন — 30 মিনিটের মধ্যে আমরা price জানাব।
          </p>
        </div>
      </section>

      {/* TICKET FORM */}
      <section className="px-4 pt-8 sm:px-5">
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-[28px] border border-black/10 bg-white text-neutral-900 shadow-[0_30px_80px_-20px_rgba(229,9,20,0.5)]">
            {/* Ticket header */}
            <div className="relative flex items-center justify-between bg-gradient-to-r from-primary via-[#c40812] to-primary px-5 py-4 text-white sm:px-7">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 ring-1 ring-white/30">
                  <Ticket className="h-5 w-5" />
                </span>
                <div className="leading-tight">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-80">Order Ticket</p>
                  <p className="font-display text-lg uppercase italic tracking-wide">#CV-{ticketId}</p>
                </div>
              </div>
              <span className="hidden rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest ring-1 ring-white/30 sm:block">
                Priority
              </span>
            </div>

            {/* Perforated cut */}
            <div className="relative h-4 bg-white">
              <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-primary/25" />
              <span className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-background" />
              <span className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-background" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-8">
              {/* Product name */}
              <Field label="Product Name" required icon={Package}>
                <input
                  type="text"
                  required
                  maxLength={200}
                  value={form.productName}
                  onChange={(e) => setForm({ ...form, productName: e.target.value })}
                  placeholder="Enter product name / URL"
                  className={inputCls}
                />
              </Field>

              {/* Product image */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-neutral-800">
                  <Upload className="h-4 w-4 text-primary" /> Product Image <span className="text-neutral-400 font-normal">(optional)</span>
                </label>
                {image ? (
                  <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
                    <img src={image} alt="Product preview" className="h-48 w-full object-contain" />
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/70 text-white hover:bg-primary"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center transition hover:border-primary hover:bg-primary/5"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                      <Upload className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-bold text-neutral-800">Click to upload image</span>
                    <span className="text-[11px] text-neutral-500">PNG, JPG • max 5MB</span>
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onFile(e.target.files?.[0] ?? null)}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full Name" required icon={User}>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className={inputCls}
                  />
                </Field>
                <Field label="Phone" required icon={Phone}>
                  <input
                    type="tel"
                    required
                    maxLength={20}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Enter your phone number"
                    className={inputCls}
                  />
                </Field>
              </div>

              <Field label="Email" required icon={Mail}>
                <input
                  type="email"
                  maxLength={255}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Enter your email address"
                  className={inputCls}
                />
              </Field>

              <Field label="Address" required icon={MapPin}>
                <textarea
                  required
                  maxLength={300}
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Enter your address"
                  className={`${inputCls} resize-none`}
                />
              </Field>

              <Field label="Notes (optional)">
                <textarea
                  maxLength={500}
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Specific plan, duration, বা extra info…"
                  className={`${inputCls} resize-none`}
                />
              </Field>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="mx-auto flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-black uppercase tracking-widest text-primary-foreground shadow-[0_10px_30px_-8px_rgba(229,9,20,0.7)] transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? "Sending…" : "Request Order"}
                </button>
              </div>
            </form>

            {/* Bottom stub */}
            <div className="flex flex-wrap items-center justify-center gap-3 border-t border-dashed border-neutral-200 bg-neutral-50 px-4 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">
              <span>⚡ 30 min response</span>
              <span className="h-1 w-1 rounded-full bg-neutral-400" />
              <span>🔒 100% private</span>
              <span className="h-1 w-1 rounded-full bg-neutral-400" />
              <span>💬 WhatsApp confirm</span>
            </div>
          </div>
        </div>
      </section>

        <SiteFooter />
      </main>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <BottomNav onCartClick={() => setCartOpen(true)} />
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 transition focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20";

function Field({
  label,
  required,
  icon: Icon,
  children,
}: {
  label: string;
  required?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-bold text-neutral-800">
        {Icon && <Icon className="h-4 w-4 text-primary" />}
        {label} {required && <span className="text-primary">*</span>}
      </label>
      {children}
    </div>
  );
}
