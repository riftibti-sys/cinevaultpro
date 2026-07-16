import { Link } from "@tanstack/react-router";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, setQty, remove, total, count } = useCart();

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-background transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-semibold">Your Cart ({count})</h2>
          <button onClick={onClose} className="rounded-md p-2 hover:bg-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="mt-20 text-center text-sm text-muted-foreground">Your cart is empty</p>
          ) : (
            <ul className="space-y-3">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-3 rounded-xl border border-border bg-card p-3">
                  <div
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-lg font-bold text-white"
                    style={{ background: product.accent }}
                  >
                    {product.initials}
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
          <div className="border-t border-border px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-xl font-bold">৳{total}</span>
            </div>
            <Link
              to="/checkout"
              onClick={onClose}
              className="flex h-11 items-center justify-center rounded-lg bg-primary font-semibold text-primary-foreground transition hover:brightness-110"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
