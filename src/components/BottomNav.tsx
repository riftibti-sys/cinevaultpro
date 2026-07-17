import { Home, Store, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/lib/cart";

export function BottomNav({ onCartClick }: { onCartClick: () => void }) {
  const { count } = useCart();
  const items: Array<{ key: string; label: string; icon: typeof Home; active?: boolean; onClick: () => void; badge?: number }> = [
    { key: "home", label: "Home", icon: Home, active: true, onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    { key: "store", label: "Store", icon: Store, onClick: () => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }) },
    { key: "cart", label: "Cart", icon: ShoppingCart, onClick: onCartClick, badge: count },
    { key: "user", label: "Support", icon: User, onClick: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }) },
  ];

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:hidden">
      <nav className="w-full max-w-[380px] rounded-full border border-white/10 bg-[oklch(0.11_0_0/0.9)] p-2 shadow-[0_15px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        <ul className="flex items-center justify-between px-2">
          {items.map((it) => (
            <li key={it.key} className="flex-1">
              <button
                onClick={it.onClick}
                className={`relative flex w-full flex-col items-center py-2 transition-colors ${it.active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <it.icon className="mb-1 h-5 w-5" />
                <span className="text-[9px] font-black uppercase tracking-widest">{it.label}</span>
                {"badge" in it && it.badge && it.badge > 0 ? (
                  <span className="absolute right-2 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                    {it.badge}
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
