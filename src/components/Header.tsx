import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Logo } from "@/components/Logo";

export function Header({ onCartClick }: { onCartClick: () => void }) {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      {/* Mobile: centered logo row */}
      <div className="mx-auto grid max-w-6xl grid-cols-[40px_1fr_40px] items-center gap-2 px-5 py-3 sm:hidden">
        <div />
        <Link to="/" className="flex justify-center">
          <Logo />
        </Link>
        <button
          onClick={onCartClick}
          className="relative grid h-10 w-10 place-items-center justify-self-end rounded-full border border-border bg-secondary"
          aria-label="Cart"
        >
          <ShoppingBag className="h-4 w-4" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
              {count}
            </span>
          )}
        </button>
      </div>

      {/* Desktop */}
      <div className="mx-auto hidden h-20 max-w-6xl items-center justify-between px-5 sm:flex">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>
        <nav className="hidden gap-8 text-sm text-muted-foreground sm:flex">
          <a href="#products" className="transition hover:text-foreground">Products</a>
          <a href="#how" className="transition hover:text-foreground">How it works</a>
          <a href="#contact" className="transition hover:text-foreground">Contact</a>
        </nav>
        <button
          onClick={onCartClick}
          className="relative inline-flex h-10 items-center gap-2 rounded-full border border-border bg-secondary px-4 text-sm font-medium transition hover:border-primary/60"
        >
          <ShoppingBag className="h-4 w-4" />
          Cart
          {count > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
