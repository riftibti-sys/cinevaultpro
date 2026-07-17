import { Check, Star, Zap } from "lucide-react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const { items, add } = useCart();
  const inCart = items.some((i) => i.product.id === product.id);

  const rating = product.rating ?? 5.0;
  const reviews = product.reviews ?? 0;
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/70 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_10px_30px_-15px_rgba(229,9,20,0.45)] active:scale-[0.98]">
      {/* IMAGE */}
      <div
        className="relative grid aspect-square place-items-center overflow-hidden border-b border-border"
        style={{ background: `linear-gradient(135deg, ${product.accent}22, ${product.accent}05)` }}
      >
        <img
          src={product.logo}
          alt={`${product.name} logo`}
          className={
            product.logoFill
              ? "h-full w-full object-cover opacity-95"
              : "h-16 w-16 object-contain opacity-95 transition-transform group-hover:scale-105"
          }
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Discount ribbon (unique diagonal) */}
        {discount > 0 && (
          <div className="absolute left-0 top-3 flex items-center gap-1 rounded-r-full bg-primary px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-primary-foreground shadow-md">
            <Zap className="h-3 w-3" strokeWidth={3} />
            {discount}% OFF
          </div>
        )}

        {/* Instant delivery pill */}
        <div className="absolute right-2 top-2 rounded-md border border-emerald-500/30 bg-black/70 px-2 py-0.5 text-[9px] font-bold tracking-wide text-emerald-400 backdrop-blur">
          INSTANT
        </div>
      </div>

      {/* BODY */}
      <div className="flex flex-1 flex-col p-3">
        <h4 className="line-clamp-1 text-sm font-bold leading-tight text-foreground">{product.name}</h4>
        <p className="mt-0.5 line-clamp-1 text-[10px] text-muted-foreground">
          {product.tagline} • {product.duration}
        </p>

        {/* PRICE */}
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-lg font-black tracking-tight text-primary">৳{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-[11px] font-medium text-muted-foreground line-through">
              ৳{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* RATING */}
        <div className="mt-1.5 flex items-center gap-1">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => {
              const filled = i < Math.round(rating);
              return (
                <Star
                  key={i}
                  className={`h-3 w-3 ${filled ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
                />
              );
            })}
          </div>
          <span className="text-[10px] font-bold text-foreground">({rating.toFixed(1)})</span>
          {reviews > 0 && <span className="text-[9px] text-muted-foreground">· {reviews}</span>}
        </div>

        {/* BUY NOW */}
        <button
          onClick={() => add(product)}
          disabled={inCart}
          aria-label={inCart ? "Added to cart" : "Buy now"}
          className={`mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full border text-xs font-black uppercase tracking-wider transition ${
            inCart
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
              : "border-primary/40 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          {inCart ? (
            <>
              <Check className="h-3.5 w-3.5" strokeWidth={3} /> Added
            </>
          ) : (
            "Buy Now"
          )}
        </button>
      </div>
    </div>
  );
}
