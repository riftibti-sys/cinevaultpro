import { useState, useEffect } from "react";
import { MessageCircle, X, Send, Phone } from "lucide-react";

const MessengerIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.26.34.27.56l.05 1.78a.8.8 0 0 0 1.12.71l1.98-.87c.17-.08.36-.09.54-.04.91.25 1.88.38 2.9.38 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2Zm6 7.46-2.94 4.66a1.5 1.5 0 0 1-2.16.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.18-.69-.63l2.94-4.66a1.5 1.5 0 0 1 2.16-.4l2.34 1.75c.21.16.51.16.72 0l3.16-2.4c.42-.32.97.18.69.63Z"/>
  </svg>
);

export function FloatingHelp() {
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(true);

  const whatsappUrl = (message = "Hi CineVault! আমার support দরকার।") =>
    `https://api.whatsapp.com/send/?phone=8801785897167&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;

  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 8000);
    return () => clearTimeout(t);
  }, []);

  const options = [
    {
      label: "Messenger",
      sub: "Facebook Messenger এ চ্যাট করুন",
      href: "https://m.me/cinevaultbd",
      color: "#0084FF",
      icon: MessengerIcon,
    },
    {
      label: "WhatsApp",
      sub: "সবচেয়ে দ্রুত reply",
      href: whatsappUrl("Hi CineVault! আমি একটা subscription কিনতে চাই।"),
      color: "#25D366",
      icon: MessageCircle,
    },
    {
      label: "Call Us",
      sub: "01785-897167",
      href: "tel:+8801785897167",
      color: "#E50914",
      icon: Phone,
    },
  ];

  return (
    <>
      {/* Backdrop when open */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm animate-fade-in"
        />
      )}

      {/* Chat popup card — same behaviour on mobile & desktop */}
      <div
        className={`fixed right-4 z-[70] w-[calc(100vw-2rem)] max-w-sm origin-bottom-right transition-all duration-300 sm:right-6 ${
          open
            ? "bottom-[calc(6rem+64px+env(safe-area-inset-bottom))] scale-100 opacity-100 sm:bottom-28"
            : "pointer-events-none bottom-[calc(6rem+64px+env(safe-area-inset-bottom))] scale-90 opacity-0 sm:bottom-24"
        }`}
      >
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] shadow-[0_30px_80px_-20px_rgba(229,9,20,0.6)]">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-primary via-[#c40812] to-[#7a050a] px-5 py-5 text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-80">
                  Live Support
                </p>
                <h3 className="mt-1 font-display text-2xl uppercase italic leading-none tracking-wide">
                  How can we help?
                </h3>
                <p className="mt-2 text-xs text-white/80">
                  ২৪/৭ available — instant reply within minutes ⚡
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Online indicator */}
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              We're online now
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2 p-3">
            {options.map((o) => (
              <a
                key={o.label}
                href={o.href}
                target={o.href.startsWith("tel:") ? undefined : "_blank"}
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-white/25 hover:bg-white/[0.06]"
              >
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white transition group-hover:scale-110"
                  style={{ background: o.color, boxShadow: `0 8px 24px -8px ${o.color}` }}
                >
                  <o.icon className="h-5 w-5" strokeWidth={2.5} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white">{o.label}</p>
                  <p className="truncate text-[11px] text-white/60">{o.sub}</p>
                </div>
                <span className="text-white/40 transition group-hover:translate-x-1 group-hover:text-primary">
                  →
                </span>
              </a>
            ))}
          </div>

          <div className="border-t border-white/10 bg-black/40 px-4 py-2.5 text-center text-[9px] font-black uppercase tracking-[0.25em] text-white/40">
            Powered by CineVault Support
          </div>
        </div>
      </div>

      {/* Floating button */}
      <button
        onClick={() => {
          setOpen((v) => !v);
          setPulse(false);
        }}
        aria-label={open ? "Close help" : "Open help"}
        className="fixed bottom-[calc(64px+env(safe-area-inset-bottom)+16px)] right-4 z-[70] grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-primary via-[#e50914] to-[#a10810] text-white shadow-[0_15px_40px_-10px_rgba(229,9,20,0.8)] transition-transform hover:scale-110 active:scale-95 sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
      >
        {/* Ping ring */}
        {pulse && !open && (
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/60" />
        )}
        <span className="relative">
          {open ? (
            <X className="h-6 w-6" strokeWidth={2.5} />
          ) : (
            <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.2} />
          )}
        </span>
        {/* Notification dot */}
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full border-2 border-[#0a0a0a] bg-emerald-500 text-[10px] font-black text-white">
            1
          </span>
        )}
      </button>
    </>
  );
}
