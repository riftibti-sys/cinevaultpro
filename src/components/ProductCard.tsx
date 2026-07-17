import { Plus, Check } from "lucide-react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const { items, add } = useCart();
  const inCart = items.some((i) => i.product.id === product.id);

  return (
    <div className="group flex flex-col rounded-3xl border border-border bg-card/60 p-3 transition-all active:scale-[0.98]">
      <div
        className="relative mb-3 grid aspect-square place-items-center overflow-hidden rounded-2xl border border-border bg-secondary/50"
        style={{ background: `linear-gradient(135deg, ${product.accent}22, ${product.accent}05)` }}
      >
        <img
          src={product.logo}
          alt={`${product.name} logo`}
          className={product.logoFill ? "h-full w-full object-cover opacity-90" : "h-14 w-14 object-contain opacity-90 transition-opacity group-hover:opacity-100"}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute right-2 top-2 rounded-md border border-white/10 bg-black/60 px-2 py-0.5 text-[9px] font-bold text-emerald-400 backdrop-blur-md">
          INSTANT
        </div>
      </div>
      <div className="px-1">
        <h4 className="text-sm font-bold leading-tight text-foreground">{product.name}</h4>
        <p className="mt-1 text-[10px] text-muted-foreground">{product.tagline} • {product.duration}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-base font-black tracking-tight text-foreground">৳{product.price}</span>
          <button
            onClick={() => add(product)}
            disabled={inCart}
            aria-label={inCart ? "Added to cart" : "Add to cart"}
            className={`grid h-9 w-9 place-items-center rounded-full border transition-colors ${
              inCart
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : "border-border bg-white/5 text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground"
            }`}
          >
            {inCart ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" strokeWidth={3} />}
          </button>
        </div>
      </div>
    </div>
  );
}
