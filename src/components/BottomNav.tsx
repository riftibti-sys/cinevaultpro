import { ShoppingCart, ClipboardList, User, MessageCircle, LogOut } from "lucide-react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSiteSettings, buildWhatsAppUrl } from "@/lib/site-settings";

export function BottomNav({ onCartClick }: { onCartClick: () => void }) {
  const { count } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();
  const settings = useSiteSettings();
  const whatsappSupportUrl = buildWhatsAppUrl(settings.get("contact_phone_intl"), settings.get("support_message"));

  const preloadAuth = () => {
    if (!user) router.preloadRoute({ to: "/auth" }).catch(() => {});
  };

  const handleUser = () => {
    if (user) {
      // Simple confirm-based sign out for now
      if (confirm("আপনি কি sign out করতে চান?")) {
        supabase.auth.signOut().then(() => {
          toast.success("Sign out হয়েছে");
        });
      }
    } else {
      navigate({ to: "/auth" });
    }
  };

  const items: Array<{
    key: string;
    label: string;
    icon: typeof ShoppingCart;
    onClick: () => void;
    badge?: number;
    highlight?: boolean;
  }> = [
    { key: "cart", label: "Cart", icon: ShoppingCart, onClick: onCartClick, badge: count },
    {
      key: "request",
      label: "Request Order",
      icon: ClipboardList,
      onClick: () => navigate({ to: "/request-order" }),
    },
    {
      key: "user",
      label: user ? "Sign Out" : "Login",
      icon: user ? LogOut : User,
      onClick: handleUser,
      highlight: false,
    },
    {
      key: "store",
      label: "Support",
      icon: MessageCircle,
      onClick: () =>
        window.open(whatsappSupportUrl, "_blank"),
    },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 md:hidden">
      <nav className="border-t border-white/10 bg-[#0a0a0a] px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <ul className="mx-auto flex max-w-md items-stretch justify-between gap-1">
          {items.map((it) => (
            <li key={it.key} className="flex-1">
              <button
                onClick={it.onClick}
                onPointerEnter={it.key === "user" ? preloadAuth : undefined}
                onTouchStart={it.key === "user" ? preloadAuth : undefined}
                className={`group relative flex w-full flex-col items-center gap-1 rounded-2xl px-2 py-2 transition-colors hover:bg-white/5 active:scale-[0.97] ${
                  it.highlight ? "text-primary" : "text-white/80 hover:text-white"
                }`}
              >
                <span className="relative grid h-6 w-6 place-items-center">
                  <it.icon className="h-5 w-5" strokeWidth={2} />
                  {"badge" in it && it.badge && it.badge > 0 ? (
                    <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground shadow-[0_0_10px_rgba(229,9,20,0.7)]">
                      {it.badge}
                    </span>
                  ) : null}
                </span>
                <span className="text-[10px] font-semibold leading-none tracking-wide">
                  {it.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
