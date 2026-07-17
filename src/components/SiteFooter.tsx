import { Phone, Mail, Facebook, Instagram, Youtube, Send, Film, Ticket, Clapperboard } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import paymentMethods from "@/assets/payment-methods.png";
import logoAsset from "@/assets/cinevault-logo.jpg.asset.json";

export function SiteFooter() {
  const [email, setEmail] = useState("");

  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("🎬 Ticket booked! Welcome to the vault.");
    setEmail("");
  };

  return (
    <footer className="relative mt-20 overflow-hidden bg-[#0a0a0a] text-white">
      {/* Marquee bulb strip */}
      <div className="flex justify-between border-y border-primary/40 bg-black px-3 py-2">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(229,9,20,0.9)]"
            style={{ opacity: i % 2 === 0 ? 1 : 0.35 }}
          />
        ))}
      </div>

      {/* Film-strip perforations */}
      <div className="flex h-6 items-center justify-around bg-[#050505]">
        {Array.from({ length: 32 }).map((_, i) => (
          <span key={i} className="h-3 w-3 rounded-sm bg-[#0a0a0a]" />
        ))}
      </div>

      <div className="mx-auto max-w-6xl px-5 pt-12 pb-8">
        {/* CTA TICKET STUB */}
        <div className="relative mb-14 grid gap-0 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-r from-[#1a0507] via-[#120303] to-[#1a0507] shadow-[0_0_60px_-20px_rgba(229,9,20,0.6)] md:grid-cols-[1fr_auto_1fr]">
          {/* Left stub */}
          <div className="flex items-center gap-4 p-6 sm:p-8">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/40">
              <Ticket className="h-7 w-7" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Admit One</p>
              <h3 className="font-display text-2xl uppercase italic leading-tight tracking-wide text-white sm:text-3xl">
                Join the Vault
              </h3>
              <p className="mt-1 text-xs text-white/60">Early drops, secret offers, VIP prices।</p>
            </div>
          </div>

          {/* Perforated divider */}
          <div className="relative hidden md:flex md:flex-col md:items-center md:justify-center md:px-2">
            <span className="absolute -top-3 h-6 w-6 rounded-full bg-[#0a0a0a]" />
            <span className="absolute -bottom-3 h-6 w-6 rounded-full bg-[#0a0a0a]" />
            <div className="flex h-full flex-col items-center gap-2 py-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full bg-white/25" />
              ))}
            </div>
          </div>

          {/* Right stub form */}
          <form onSubmit={onSubscribe} className="flex items-center gap-2 border-t border-dashed border-white/15 p-6 md:border-l md:border-t-0 sm:p-8">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="min-w-0 flex-1 rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_20px_-4px_rgba(229,9,20,0.8)] transition hover:brightness-110 active:scale-95"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-xl bg-black ring-1 ring-primary/50 shadow-[0_0_18px_-4px_rgba(229,9,20,0.6)]">
                <img src={logoAsset.url} alt="CineVault" className="h-full w-full object-cover" />
              </span>
              <span className="font-display text-2xl uppercase italic tracking-wider text-white">
                Cine<span className="text-primary">Vault</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Bangladesh-এর সবচেয়ে trusted premium subscription store — Netflix থেকে CapCut, ১৫ মিনিটে delivery।
            </p>

            <a
              href="tel:+8801785897167"
              className="mt-6 inline-flex items-center gap-3 rounded-xl border border-primary/50 bg-primary/10 px-4 py-3 text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Phone className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <span className="text-left leading-tight">
                <span className="block text-[9px] font-black uppercase tracking-widest opacity-70">24/7 Hotline</span>
                <span className="block text-base font-black tracking-wide">01785-897167</span>
              </span>
            </a>
          </div>

          {/* Explore */}
          <div>
            <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-primary">
              <Film className="h-3.5 w-3.5" /> Explore
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              {["Our Brands", "Careers", "Blogs", "About Us", "Loyalty Program"].map((l) => (
                <li key={l}>
                  <a href="#" className="group inline-flex items-center gap-2 hover:text-white">
                    <span className="h-px w-3 bg-white/25 transition-all group-hover:w-5 group-hover:bg-primary" />
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-primary">
              <Clapperboard className="h-3.5 w-3.5" /> Support
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              {["FAQ", "Terms & Conditions", "Privacy Policy", "Refund Policy", "Delivery Info"].map((l) => (
                <li key={l}>
                  <a href="#" className="group inline-flex items-center gap-2 hover:text-white">
                    <span className="h-px w-3 bg-white/25 transition-all group-hover:w-5 group-hover:bg-primary" />
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Connect</h4>
            <a
              href="mailto:support@cinevault.bd"
              className="mt-5 flex items-center gap-2.5 text-sm text-white/80 hover:text-primary"
            >
              <Mail className="h-4 w-4 text-primary" />
              support@cinevault.bd
            </a>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                { icon: Facebook, href: "https://www.facebook.com/share/1HTm4Rz58F/", label: "Facebook" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Youtube, href: "#", label: "YouTube" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/5 text-white/80 transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_8px_20px_-6px_rgba(229,9,20,0.7)]"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            <a
              href="https://wa.me/8801785897167"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-black transition hover:brightness-110"
            >
              💬 WhatsApp Chat
            </a>
          </div>
        </div>

        {/* PAYMENTS — premium dark rail */}
        <div className="mt-14">
          <div className="mb-5 flex items-center gap-4">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/15" />
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-white/70 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              Secure Checkout
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/15" />
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white p-5 shadow-[0_10px_40px_-10px_rgba(229,9,20,0.35)] sm:p-6">
            <img
              src={paymentMethods}
              alt="bKash, Nagad, Rocket, Upay, Visa, Mastercard, Binance, PayPal"
              className="mx-auto h-16 w-full object-contain sm:h-20"
              loading="lazy"
              width={1920}
              height={640}
            />
          </div>
          <p className="mt-3 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
            Instant delivery • SSL encrypted • 100% safe
          </p>
        </div>

        {/* Bottom row */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} CineVault Bangladesh. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            All systems operational
          </p>
        </div>
      </div>
    </footer>
  );
}
