import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

export function Header({ onCartClick }: { onCartClick: () => void }) {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary font-bold text-primary-foreground">C</span>
          <span className="text-lg font-semibold tracking-tight">
            Cine<span className="text-primary">Vault</span>
          </span>
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
