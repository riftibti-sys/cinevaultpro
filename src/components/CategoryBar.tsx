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
    <div className="relative border-b border-white/10 bg-[#0a0a0a] text-white">
      {/* edge fades so text never looks clipped on mobile scroll */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-[#0a0a0a] to-transparent lg:hidden" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-[#0a0a0a] to-transparent lg:hidden" />

      <nav
        className="scrollbar-none mx-auto flex w-full items-center gap-2 overflow-x-auto px-4 py-2.5 lg:max-w-7xl lg:justify-center lg:gap-1 lg:overflow-visible lg:px-4 xl:gap-1.5 xl:px-6"
        aria-label="Categories"
      >
        {categories.map((c) => (
          <a
            key={c.label}
            href={c.href}
            className={`group inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-wide transition sm:text-[13px] lg:gap-1 lg:px-2.5 lg:py-1 lg:text-[11px] lg:tracking-normal xl:gap-1.5 xl:px-3.5 xl:text-[13px] xl:tracking-wide ${
              c.hot
                ? "border-primary/60 bg-primary/15 text-primary hover:bg-primary hover:text-primary-foreground"
                : "border-white/10 bg-white/5 text-white/85 hover:border-primary/60 hover:text-primary"
            }`}
          >
            <c.icon className={`h-3.5 w-3.5 lg:h-3 lg:w-3 xl:h-3.5 xl:w-3.5 ${c.hot ? "animate-pulse" : ""}`} strokeWidth={2.5} />
            <span className="whitespace-nowrap">{c.label}</span>
          </a>
        ))}
        {/* trailing spacer so last chip isn't hugged by edge fade */}
        <span className="w-2 shrink-0 lg:hidden" aria-hidden />
      </nav>
    </div>

  );
}
