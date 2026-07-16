import { Plus, Check } from "lucide-react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const { items, add } = useCart();
  const inCart = items.some((i) => i.product.id === product.id);

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 transition hover:border-primary/60"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div
        className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-3xl transition group-hover:opacity-40"
        style={{ background: product.accent }}
      />
      <div
        className="grid h-14 w-14 place-items-center rounded-xl bg-white/95 p-2"
      >
        <img src={product.logo} alt={`${product.name} logo`} className="h-full w-full object-contain" loading="lazy" />
      </div>
      <h3 className="mt-4 text-base font-semibold">{product.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{product.tagline}</p>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-2xl font-bold">৳{product.price}</span>
        <span className="text-xs text-muted-foreground">/ {product.duration}</span>
      </div>
      <button
        onClick={() => add(product)}
        disabled={inCart}
        className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:bg-secondary disabled:text-muted-foreground"
      >
        {inCart ? (<><Check className="h-4 w-4" /> Added</>) : (<><Plus className="h-4 w-4" /> Add to Cart</>)}
      </button>
    </div>
  );
}
