import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, Menu, X, Home, Store, HelpCircle, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";

export function Header({ onCartClick }: { onCartClick: () => void }) {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { label: "Home", href: "#", icon: Home },
    { label: "Products", href: "#products", icon: Store },
    { label: "How it works", href: "#how", icon: HelpCircle },
    { label: "Contact", href: "#contact", icon: MessageCircle },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-secondary/60 text-foreground transition hover:border-primary/60 hover:text-primary"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/" className="flex items-center tracking-tighter leading-none">
              <span className="text-3xl font-black text-primary">C</span>
              <span className="text-2xl font-black text-foreground">ineVault</span>
            </Link>
          </div>

          <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
            <a href="#products" className="transition hover:text-foreground">Products</a>
            <a href="#how" className="transition hover:text-foreground">How it works</a>
            <a href="#contact" className="transition hover:text-foreground">Contact</a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              aria-label="Search"
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-secondary/60 text-muted-foreground transition hover:text-foreground"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              onClick={onCartClick}
              aria-label="Cart"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-secondary/60 text-muted-foreground transition hover:text-foreground sm:h-10 sm:w-auto sm:px-4"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:ml-2 sm:inline text-sm font-medium text-foreground">Cart</span>
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground shadow-[0_0_10px_rgba(229,9,20,0.6)]">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* SIDE MENU */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity ${menuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-[85%] max-w-sm flex-col border-r border-border bg-background transition-transform ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center tracking-tighter leading-none">
            <span className="text-2xl font-black text-primary">C</span>
            <span className="text-xl font-black text-foreground">ineVault</span>
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
