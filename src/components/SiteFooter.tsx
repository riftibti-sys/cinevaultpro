import { Phone, Mail, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import paymentMethods from "@/assets/payment-methods.png";

export function SiteFooter() {
  const [email, setEmail] = useState("");

  const whatsappSupportUrl = `https://api.whatsapp.com/send/?phone=8801785897167&text=${encodeURIComponent("Hi CineVault! আমার support দরকার।")}&type=phone_number&app_absent=0`;

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
    <footer className="relative mt-20 bg-black text-white">
      <div className="mx-auto max-w-7xl px-5 pt-14 pb-6 sm:px-8">
        {/* Top grid */}
        <div className="grid gap-10 lg:grid-cols-[auto_1fr_1fr_1.4fr]">
          {/* Phone button + Company column */}
          <div>
            <a
              href={whatsappSupportUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 rounded-2xl border-2 border-primary bg-transparent px-5 py-4 text-primary transition hover:bg-primary/10"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
                <Phone className="h-4 w-4" strokeWidth={2.6} />
              </span>
              <span className="text-2xl font-bold tracking-tight">
                01785-897167
              </span>
            </a>

            <h4 className={`${headingCls} mt-10`}>Company</h4>
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
            <p className="mb-4 text-[15px] text-white/85">
              Sign up for get latest news and update
            </p>
            <form onSubmit={onSubscribe} className="flex overflow-hidden rounded-xl">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="min-w-0 flex-1 bg-white px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
              >
                Subscribe
              </button>
            </form>

            {/* Contact row */}
            <div className="mt-6 space-y-3">
              <a href={whatsappSupportUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[15px] text-white/85 hover:text-primary">
                <Phone className="h-4 w-4 text-primary" strokeWidth={2.4} />
                01785-897167
              </a>
              <a href="mailto:support@cinevault.bd" className="flex items-center gap-3 text-[15px] text-white/85 hover:text-primary">
                <Mail className="h-4 w-4 text-primary" strokeWidth={2.4} />
                support@cinevault.bd
              </a>
            </div>

            {/* Socials */}
            <div className="mt-6 flex items-center gap-5 text-white/85">
              <a href="https://www.facebook.com/share/1HTm4Rz58F/" target="_blank" rel="noreferrer" aria-label="Facebook" className="transition hover:text-primary">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" aria-label="Instagram" className="transition hover:text-primary">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" aria-label="YouTube" className="transition hover:text-primary">
                <Youtube className="h-6 w-6" />
              </a>
              <a href="#" aria-label="LinkedIn" className="transition hover:text-primary">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom row: copyright + payments */}
        <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-[15px] font-semibold text-white">
            Copyright @ {new Date().getFullYear()} CineVault Bangladesh. All rights reserved.
          </p>
          <div className="rounded-md bg-white px-2 py-1">
            <img
              src={paymentMethods}
              alt="bKash, Nagad, Rocket, Upay, Visa, Mastercard, Binance, PayPal"
              className="block h-6 w-auto object-contain sm:h-7"
              loading="lazy"
              width={1920}
              height={640}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
