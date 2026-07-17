import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

export function Header({ onCartClick }: { onCartClick: () => void }) {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4">
        <Link to="/" className="flex items-center tracking-tighter leading-none">
          <span className="text-3xl font-black text-primary">C</span>
          <span className="text-2xl font-black text-foreground">ineVault</span>
        </Link>

        <nav className="hidden gap-8 text-sm text-muted-foreground sm:flex">
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
  );
}
