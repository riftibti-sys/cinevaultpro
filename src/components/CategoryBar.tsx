import { Tv, Film, Music2, Scissors, Sparkles, Gamepad2, Bot, Flame, GraduationCap, Cloud } from "lucide-react";

const categories = [
  { label: "Streaming", href: "#products", icon: Tv },
  { label: "OTT Bangla", href: "#products", icon: Film },
  { label: "Music", href: "#products", icon: Music2 },
  { label: "Editing", href: "#products", icon: Scissors },
  { label: "Design", href: "#products", icon: Sparkles },
  { label: "AI Tools", href: "#products", icon: Bot },
  { label: "Gaming", href: "#products", icon: Gamepad2 },
  { label: "Cloud", href: "#products", icon: Cloud },
  { label: "Learning", href: "#products", icon: GraduationCap },
  { label: "Hot Deals", href: "#products", icon: Flame, hot: true },
];

export function CategoryBar() {
  return (
    <div className="sticky top-[68px] z-30 border-b border-white/10 bg-[#0a0a0a] text-white sm:top-[76px]">
      <div className="mx-auto max-w-7xl">
        <nav
          className="scrollbar-none flex items-center gap-1 overflow-x-auto px-3 py-2 sm:justify-center sm:gap-2 sm:px-6 sm:py-2.5"
          aria-label="Categories"
        >
          {categories.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className={`group inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-bold uppercase tracking-wide transition sm:px-4 sm:text-sm ${
                c.hot
                  ? "border-primary/60 bg-primary/15 text-primary hover:bg-primary hover:text-primary-foreground"
                  : "border-white/10 bg-white/5 text-white/80 hover:border-primary/60 hover:text-primary"
              }`}
            >
              <c.icon className={`h-3.5 w-3.5 ${c.hot ? "animate-pulse" : ""}`} strokeWidth={2.5} />
              {c.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
