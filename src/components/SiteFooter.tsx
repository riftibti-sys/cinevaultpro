import { Phone, Mail, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import paymentMethods from "@/assets/payment-methods.png";

export function SiteFooter() {
  const [email, setEmail] = useState("");

  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("Subscribed! আপনাকে ধন্যবাদ 🎉");
    setEmail("");
  };


  return (
    <footer className="mt-16 border-t border-white/10 bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Contact + Company */}
          <div>
            <a
              href="tel:+8801785897167"
              className="inline-flex items-center gap-3 rounded-full border-2 border-primary bg-primary/5 px-5 py-3 font-black text-primary shadow-[0_0_20px_-6px_rgba(229,9,20,0.6)] transition hover:bg-primary hover:text-primary-foreground"
            >
              <Phone className="h-5 w-5" />
              <span className="text-base tracking-wide">01785-897167</span>
            </a>

            <h4 className="mt-8 text-lg font-black tracking-wide">Company</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li><a href="#" className="hover:text-primary">Our Brands</a></li>
              <li><a href="#" className="hover:text-primary">Careers</a></li>
              <li><a href="#" className="hover:text-primary">Blogs</a></li>
              <li><a href="#" className="hover:text-primary">About Us</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-lg font-black tracking-wide">Help</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li><a href="#" className="hover:text-primary">FAQ</a></li>
              <li><a href="#" className="hover:text-primary">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-primary">Loyalty Program</a></li>
              <li><a href="#contact" className="hover:text-primary">Support</a></li>
            </ul>
          </div>

          {/* Policy */}
          <div>
            <h4 className="text-lg font-black tracking-wide">Policy</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-primary">Refund Policy</a></li>
              <li><a href="#" className="hover:text-primary">Delivery Info</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-black tracking-wide">Newsletter</h4>
            <p className="mt-2 text-sm text-white/60">
              Sign up for latest offers & updates
            </p>
            <form onSubmit={onSubscribe} className="mt-4 flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white px-3 py-2.5 text-sm text-black placeholder:text-black/40 focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:brightness-110"
              >
                Subscribe
              </button>
            </form>

            <div className="mt-5 space-y-2.5 text-sm text-white/80">
              <a href="tel:+8801785897167" className="flex items-center gap-2.5 hover:text-primary">
                <Phone className="h-4 w-4 text-primary" />
                01785-897167
              </a>
              <a href="mailto:support@cinevault.bd" className="flex items-center gap-2.5 hover:text-primary">
                <Mail className="h-4 w-4 text-primary" />
                support@cinevault.bd
              </a>
            </div>

            <div className="mt-5 flex gap-3">
              {[
                { icon: Facebook, href: "https://www.facebook.com/share/1HTm4Rz58F/" },
                { icon: Instagram, href: "#" },
                { icon: Youtube, href: "#" },
                { icon: Linkedin, href: "#" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/5 text-white/80 transition hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Payments strip */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 border-t border-white/10 pt-6 sm:justify-end">
          {payments.map((p) => (
            <span
              key={p}
              className="grid h-8 min-w-[52px] place-items-center rounded-md border border-white/15 bg-white/5 px-2 text-[10px] font-bold uppercase tracking-wider text-white/80"
            >
              {p}
            </span>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-white/50 sm:text-left">
          Copyright © {new Date().getFullYear()} CineVault. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
