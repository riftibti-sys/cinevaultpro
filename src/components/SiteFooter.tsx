import { Phone, Mail, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import paymentMethods from "@/assets/payment-methods.png";
import { useSiteSettings, buildWhatsAppUrl } from "@/lib/site-settings";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const settings = useSiteSettings();
  const displayPhone = settings.get("contact_phone");
  const whatsappSupportUrl = buildWhatsAppUrl(settings.get("contact_phone_intl"), settings.get("support_message"));

  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("🎬 Subscribed! Welcome to the vault.");
    setEmail("");
  };

  const linkCls =
    "block text-[15px] text-white/85 transition hover:text-primary";
  const headingCls =
    "mb-6 text-lg font-semibold text-white";

  return (
    <footer className="relative mt-20 bg-black text-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 pt-14 pb-14 sm:px-8">
        {/* Top grid */}
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1.4fr]">
          {/* Helpline + Company */}
          <div>
            <div className="mb-10">
              <a
                href={whatsappSupportUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center gap-4 rounded-xl border-2 border-primary bg-transparent p-4 text-primary transition hover:bg-primary/10"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Phone className="h-6 w-6" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider opacity-80">Helpline</p>
                  <p className="text-2xl font-black">{displayPhone}</p>
                </div>
              </a>
            </div>

            <h4 className={headingCls}>Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className={linkCls}>Our Brands</a></li>
              <li><a href="#" className={linkCls}>Careers</a></li>
              <li><a href="#" className={linkCls}>Blogs</a></li>
              <li><a href="#" className={linkCls}>About Us</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className={headingCls}>Help</h4>
            <ul className="space-y-4">
              <li><a href="#" className={linkCls}>FAQ</a></li>
              <li><a href="#" className={linkCls}>Terms &amp; Conditions</a></li>
              <li><a href="#" className={linkCls}>Loyalty Program</a></li>
            </ul>
          </div>

          {/* Policy */}
          <div>
            <h4 className={headingCls}>Policy</h4>
            <ul className="space-y-4">
              <li><a href="#" className={linkCls}>Privacy Policy</a></li>
              <li><a href="#" className={linkCls}>Cookie Policy</a></li>
              <li><a href="#" className={linkCls}>Refund Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className={headingCls}>Newsletter</h4>
            <p className="mb-5 text-[15px] text-white/85 leading-relaxed">
              Sign up for get latest news and update
            </p>
            <form onSubmit={onSubscribe} className="mb-8 flex overflow-hidden rounded-xl bg-white p-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:brightness-110"
              >
                Subscribe
              </button>
            </form>

            <div className="space-y-4">
              <a href={whatsappSupportUrl} target="_blank" rel="noreferrer" className="group flex items-center gap-3 text-[15px] text-white/85 hover:text-primary">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 transition group-hover:bg-primary/20">
                  <Phone className="h-4 w-4 text-primary" strokeWidth={2.4} />
                </div>
                <span className="font-medium">{displayPhone}</span>
              </a>
              <a href="mailto:cinevault136@gmail.com" className="group flex items-center gap-3 text-[15px] text-white/85 hover:text-primary">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 transition group-hover:bg-primary/20">
                  <Mail className="h-4 w-4 text-primary" strokeWidth={2.4} />
                </div>
                <span className="font-medium lowercase">cinevault136@gmail.com</span>
              </a>
            </div>

            <div className="mt-8 flex items-center gap-4">
              {[
                { Icon: Facebook, label: "Facebook", href: "https://www.facebook.com/share/1HTm4Rz58F/" },
                { Icon: Instagram, label: "Instagram", href: "#" },
                { Icon: Youtube, label: "YouTube", href: "#" },
                { Icon: Linkedin, label: "LinkedIn", href: "#" },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70 transition hover:bg-primary hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Payment Bar */}
      <div className="w-full bg-white py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p className="text-sm font-medium text-black/60">
              Copyright @ 2026 <span className="font-bold text-black">RaifaNest</span>. All rights reserved.
            </p>
            <div className="flex items-center justify-center grayscale transition hover:grayscale-0">
              <img
                src={paymentMethods}
                alt="Payment Methods: bKash, Nagad, Rocket, Upay, DBBL, VISA, Mastercard, AMEX"
                className="h-8 w-auto md:h-10"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
