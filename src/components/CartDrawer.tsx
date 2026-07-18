import { Link } from "@tanstack/react-router";
import { X, Minus, Plus, Trash2 } from "lucide-react";
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
        className={`fixed right-0 top-0 z-[100] flex h-[100dvh] max-h-[100dvh] w-full max-w-md flex-col overflow-hidden border-l border-border bg-background shadow-[-24px_0_60px_rgba(0,0,0,0.25)] transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="shrink-0 flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-semibold">Your Cart ({count})</h2>
          <button onClick={onClose} className="rounded-md p-2 hover:bg-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 pb-5 [-webkit-overflow-scrolling:touch] [touch-action:pan-y]">
          {items.length === 0 ? (
            <p className="mt-20 text-center text-sm text-muted-foreground">Your cart is empty</p>
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
          <div className="shrink-0 border-t border-border bg-background px-5 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4 shadow-[0_-12px_30px_rgba(0,0,0,0.08)]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-xl font-bold">৳{total}</span>
            </div>
            <Link
              to="/checkout"
              onClick={onClose}
              className="flex h-12 items-center justify-center rounded-lg bg-primary font-semibold text-primary-foreground transition hover:brightness-110"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );

  return createPortal(drawer, document.body);
}
