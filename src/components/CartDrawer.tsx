import { Link } from "@tanstack/react-router";
import { X, Minus, Plus, Trash2, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/lib/cart";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, setQty, remove, total, count } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const drawer = (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        className={`fixed inset-y-0 left-0 right-0 z-[100] flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden bg-background shadow-[-24px_0_60px_rgba(0,0,0,0.25)] transition-transform duration-300 sm:left-auto sm:max-w-md sm:border-l sm:border-border ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="shrink-0 flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-semibold">Your Cart ({count})</h2>
          <button onClick={onClose} className="rounded-md p-2 hover:bg-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 pb-6 [-webkit-overflow-scrolling:touch] [touch-action:pan-y]">
          {items.length === 0 ? (
            <div className="mt-20 flex flex-col items-center gap-3 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-secondary text-muted-foreground">
                <Zap className="h-7 w-7" />
              </div>
              <p className="text-sm text-muted-foreground">Your cart is empty</p>
              <button onClick={onClose} className="mt-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">
                Browse subscriptions
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-3 rounded-xl border border-border bg-card p-3">
                  <div
                    className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg ring-1 ring-white/10"
                    style={{ background: `linear-gradient(135deg, ${product.accent}22, ${product.accent}05)` }}
                  >
                    <img src={product.logo} alt="" className={product.logoFill ? "h-full w-full object-cover" : "h-8 w-8 object-contain"} referrerPolicy="no-referrer" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.duration}</p>
                      </div>
                      <button onClick={() => remove(product.id)} className="text-muted-foreground hover:text-primary">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 rounded-md border border-border">
                        <button className="p-1.5 hover:bg-secondary" onClick={() => setQty(product.id, qty - 1)}>
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm">{qty}</span>
                        <button className="p-1.5 hover:bg-secondary" onClick={() => setQty(product.id, qty + 1)}>
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold">৳{product.price * qty}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="shrink-0 border-t border-border bg-gradient-to-b from-background to-secondary/40 px-5 pb-[calc(env(safe-area-inset-bottom)+5.5rem)] pt-4 shadow-[0_-12px_30px_rgba(0,0,0,0.10)] sm:pb-[calc(env(safe-area-inset-bottom)+1rem)]">
            <div className="mb-3 flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Secure checkout</span>
              <span className="inline-flex items-center gap-1"><Zap className="h-3.5 w-3.5 text-primary" /> Instant delivery</span>
            </div>
            <div className="mb-3 flex items-end justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Total ({count} {count === 1 ? "item" : "items"})</p>
                <p className="text-2xl font-extrabold leading-tight">৳{total}</p>
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">No hidden fees</span>
            </div>
            <Link
              to="/checkout"
              onClick={onClose}
              className="group flex h-14 items-center justify-between rounded-2xl bg-primary px-5 font-semibold text-primary-foreground shadow-[0_10px_30px_-10px_hsl(var(--primary))] transition hover:brightness-110 active:scale-[0.99]"
            >
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Checkout Securely
              </span>
              <span className="inline-flex items-center gap-2">
                ৳{total}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">bKash · Nagad · Card — takes under a minute</p>
          </div>
        )}
      </aside>
    </>
  );

  return createPortal(drawer, document.body);
}
