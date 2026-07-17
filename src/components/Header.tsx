import { Link, useNavigate } from "@tanstack/react-router";
import { Search, ShoppingBag, Menu, X, Home, Store, HelpCircle, MessageCircle, Plus, Check, MapPin, ClipboardList, User, LogOut, Flame } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { products } from "@/lib/products";
import logoAsset from "@/assets/cinevault-logo.jpg.asset.json";
import footballImg from "@/assets/football.png";

export function Header({ onCartClick }: { onCartClick: () => void }) {
  const { count, items, add } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUser = () => {
    if (user) {
      if (confirm("আপনি কি sign out করতে চান?")) {
        supabase.auth.signOut().then(() => toast.success("Sign out হয়েছে"));
      }
    } else {
      navigate({ to: "/auth" });
    }
  };


  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.slice(0, 6);
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q),
    );
  }, [query]);

  const menuItems = [
    { label: "Home", href: "#", icon: Home },
    { label: "Products", href: "#products", icon: Store },
    { label: "How it works", href: "#how", icon: HelpCircle },
    { label: "Contact", href: "#contact", icon: MessageCircle },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0a] text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 sm:py-4">
          {/* Left: menu + logo */}
          <div className="flex shrink-0 items-center gap-2.5">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-primary/60 hover:text-primary"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/" className="flex items-center gap-2 leading-none">
              <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-black ring-1 ring-primary/50 shadow-[0_0_18px_-4px_rgba(229,9,20,0.6)] sm:h-10 sm:w-10">
                <img src={logoAsset.url} alt="CineVault" className="h-full w-full object-cover" />
              </span>
              <span className="hidden flex-col leading-none sm:flex">
                <span className="relative font-display text-2xl uppercase italic tracking-wider text-white sm:text-[28px]">
                  Cine<span className="text-primary">Vault</span>
                  {/* Football that kicks & bounces across the wordmark */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-5 left-0 animate-cv-ball-kick"
                  >
                    <img
                      src={footballImg}
                      alt=""
                      width={20}
                      height={20}
                      className="h-5 w-5 animate-cv-ball-spin drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
                    />
                  </span>
                </span>
                <span className="mt-1 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-white/50">
                  <span>Since 2026</span>
                  <span className="inline-flex items-center gap-1.5 rounded-sm border-l border-r border-white/15 px-2 py-[1px] tracking-[0.22em] text-[8px] text-amber-200/80">
                    <span className="block h-1.5 w-1.5 rounded-full bg-amber-200/80" />
                    FIFA World Cup · 2026
                  </span>
                </span>
              </span>
            </Link>
          </div>

          {/* Center: long pill search bar (desktop only) */}
          <button
            onClick={() => setSearchOpen(true)}
            className="group hidden min-w-0 flex-1 items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] pl-5 pr-1.5 py-1.5 text-left text-white/50 transition hover:border-primary/50 hover:bg-white/[0.09] focus:outline-none focus:ring-2 focus:ring-primary/40 md:flex"
          >
            <span className="flex-1 truncate text-sm font-medium">
              Search product
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_16px_-4px_rgba(229,9,20,0.8)] transition group-hover:brightness-110">
              <Search className="h-4 w-4" strokeWidth={2.5} />
            </span>
          </button>

          {/* Right: quick actions */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Mobile search icon */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:border-primary/60 hover:text-primary md:hidden"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Offers — animated flame pill */}
            <a
              href="#products"
              className="group hidden h-10 items-center gap-2 rounded-full border border-primary/40 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent px-4 text-sm font-bold uppercase tracking-wide text-primary transition hover:border-primary hover:bg-primary hover:text-primary-foreground md:inline-flex"
            >
              <Flame className="h-4 w-4 animate-pulse" strokeWidth={2.5} />
              Offers
              <span className="ml-0.5 rounded-full bg-primary/20 px-1.5 py-0.5 text-[9px] font-black text-primary group-hover:bg-white/25 group-hover:text-primary-foreground">
                HOT
              </span>
            </a>

            {/* Store Locator */}
            <a
              href="https://www.facebook.com/share/1HTm4Rz58F/"
              target="_blank"
              rel="noreferrer"
              className="hidden h-10 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white/85 transition hover:border-primary/60 hover:text-primary lg:inline-flex"
            >
              <MapPin className="h-4 w-4" />
              Store Locator
            </a>


            {/* Login / Sign out */}
            <button
              onClick={handleUser}
              className={`hidden h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition md:inline-flex ${
                user
                  ? "border border-white/15 bg-white/5 text-white/85 hover:border-primary/60 hover:text-primary"
                  : "bg-primary text-primary-foreground shadow-[0_0_18px_-4px_rgba(229,9,20,0.7)] hover:brightness-110"
              }`}
            >
              {user ? <LogOut className="h-4 w-4" /> : <User className="h-4 w-4" />}
              {user ? "Sign Out" : "Login"}
            </button>

            {/* Cart */}
            <button
              onClick={onCartClick}
              aria-label="Cart"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:text-white sm:h-10 sm:w-auto sm:px-4"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:ml-2 sm:inline text-sm font-medium text-white">Cart</span>
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground shadow-[0_0_10px_rgba(229,9,20,0.6)]">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>


      {/* SEARCH OVERLAY */}
      <div
        onClick={() => setSearchOpen(false)}
        className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-md transition-opacity ${searchOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <div
        className={`fixed left-1/2 top-4 z-50 w-[95%] max-w-2xl -translate-x-1/2 transition-all sm:top-10 ${searchOpen ? "opacity-100 translate-y-0" : "pointer-events-none -translate-y-4 opacity-0"}`}
      >
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Search className="h-5 w-5 text-primary" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Netflix, Spotify, CapCut…"
              className="flex-1 bg-transparent text-base font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-[65vh] overflow-y-auto p-2">
            {results.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                কোনো product পাওয়া যায়নি "{query}" এর জন্য।
              </div>
            ) : (
              <ul className="space-y-1">
                {results.map((p) => {
                  const inCart = items.some((i) => i.product.id === p.id);
                  return (
                    <li key={p.id}>
                      <div className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition hover:bg-secondary/60">
                        <span
                          className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-border"
                          style={{ background: `linear-gradient(135deg, ${p.accent}33, ${p.accent}08)` }}
                        >
                          <img
                            src={p.logo}
                            alt=""
                            className={p.logoFill ? "h-full w-full object-cover" : "h-7 w-7 object-contain"}
                            referrerPolicy="no-referrer"
                          />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-foreground">{p.name}</p>
                          <p className="truncate text-[11px] text-muted-foreground">{p.tagline} • {p.duration}</p>
                        </div>
                        <span className="text-sm font-black text-foreground">৳{p.price}</span>
                        <button
                          onClick={() => add(p)}
                          disabled={inCart}
                          aria-label={inCart ? "Added" : "Add to cart"}
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors ${
                            inCart
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                              : "border-border bg-white/5 text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground"
                          }`}
                        >
                          {inCart ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" strokeWidth={3} />}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="border-t border-border px-4 py-2 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
            {results.length} result{results.length === 1 ? "" : "s"} • ESC to close
          </div>
        </div>
      </div>

      {/* SIDE MENU */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity ${menuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-[85%] max-w-sm flex-col border-r border-border bg-background transition-transform ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 leading-none">
            <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-black ring-1 ring-primary/40">
              <img src={logoAsset.url} alt="CineVault" className="h-full w-full object-cover" />
            </span>
            <span className="font-display text-xl uppercase italic tracking-wider text-foreground">
              Cine<span className="text-primary">Vault</span>
            </span>
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="grid h-9 w-9 place-items-center rounded-full border border-border hover:border-primary/60 hover:text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {menuItems.map((it) => (
              <li key={it.label}>
                <a
                  href={it.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary/60 hover:text-primary"
                >
                  <it.icon className="h-4 w-4 text-primary" />
                  {it.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-border pt-6">
            <p className="mb-3 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Support
            </p>
            <a
              href="https://wa.me/8801785897167"
              target="_blank"
              rel="noreferrer"
              className="mx-3 flex h-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-[0_0_15px_rgba(229,9,20,0.4)]"
            >
              WhatsApp: 01785-897167
            </a>
          </div>
        </nav>

        <div className="border-t border-border px-5 py-4 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
          © {new Date().getFullYear()} CineVault
        </div>
      </aside>
    </>
  );
}
