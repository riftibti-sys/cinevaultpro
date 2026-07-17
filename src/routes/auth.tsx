import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Mail, Lock, User as UserIcon, Phone, MapPin, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";
import { Toaster } from "@/components/ui/sonner";
import { SiteFooter } from "@/components/SiteFooter";
import logoAsset from "@/assets/cinevault-logo.jpg.asset.json";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Login / Register — CineVault" },
      { name: "description", content: "CineVault-এ Login বা Register করুন সহজে।" },
    ],
  }),
  component: AuthPage,
});

type Mode = "login" | "register";

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!loading && user) navigate({ to: "/", replace: true });
  }, [user, loading, navigate]);

  const normalizeEmail = (val: string) => {
    const v = val.trim();
    // If user typed a phone number, synthesize an email so Supabase accepts it.
    if (/^\+?\d[\d\s-]{5,}$/.test(v)) {
      const digits = v.replace(/\D/g, "");
      return `${digits}@cinevault.user`;
    }
    return v;
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!emailOrPhone.trim() || !password) {
      toast.error("Email/phone এবং password দিন");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: normalizeEmail(emailOrPhone),
      password,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "ভুল email/phone বা password" : error.message);
      return;
    }
    toast.success("স্বাগতম!");
    navigate({ to: "/", replace: true });
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !emailOrPhone.trim() || !password || !phone.trim()) {
      toast.error("সব দরকারি field পূরণ করুন");
      return;
    }
    if (password.length < 6) {
      toast.error("Password কমপক্ষে ৬ character");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email: normalizeEmail(emailOrPhone),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: fullName.trim(),
          phone: phone.trim(),
          address: address.trim(),
        },
      },
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account তৈরি হয়েছে!");
    navigate({ to: "/", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0a0a] text-white">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link
            to="/"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white hover:border-primary/60 hover:text-primary"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2 leading-none">
            <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-black ring-1 ring-primary/50">
              <img src={logoAsset.url} alt="CineVault" className="h-full w-full object-cover" />
            </span>
            <span className="font-display text-xl uppercase italic tracking-wider text-white">
              Cine<span className="text-primary">Vault</span>
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-8">
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_20px_60px_-30px_rgba(0,0,0,0.4)]">
          {/* Tabs */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-1 rounded-full bg-secondary p-1">
              {(["login", "register"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-full py-2.5 text-sm font-bold transition ${
                    mode === m
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "login" ? "Login" : "Register"}
                </button>
              ))}
            </div>
          </div>

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-3 px-5 pb-6">
              <Field
                icon={<UserIcon className="h-4 w-4" />}
                placeholder="Enter your email or phone number"
                value={emailOrPhone}
                onChange={setEmailOrPhone}
                autoComplete="username"
              />
              <PasswordField
                value={password}
                onChange={setPassword}
                show={showPw}
                onToggle={() => setShowPw((s) => !s)}
              />
              <div className="pt-1 text-right">
                <button type="button" className="text-sm font-bold text-primary hover:underline">
                  Forgot Password?
                </button>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="mt-2 flex h-12 w-full items-center justify-center rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-[0_10px_25px_-10px_rgba(229,9,20,0.6)] transition active:scale-[0.98] disabled:opacity-70"
              >
                {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Log In"}
              </button>
              <p className="pt-2 text-center text-sm text-foreground">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="font-bold text-primary hover:underline"
                >
                  Register Here
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3 px-5 pb-6">
              <Field
                icon={<UserIcon className="h-4 w-4" />}
                placeholder="Full name"
                value={fullName}
                onChange={setFullName}
                autoComplete="name"
              />
              <Field
                icon={<Mail className="h-4 w-4" />}
                placeholder="Email or phone number"
                value={emailOrPhone}
                onChange={setEmailOrPhone}
                autoComplete="username"
              />
              <Field
                icon={<Phone className="h-4 w-4" />}
                placeholder="Phone (WhatsApp)"
                value={phone}
                onChange={setPhone}
                type="tel"
                autoComplete="tel"
              />
              <Field
                icon={<MapPin className="h-4 w-4" />}
                placeholder="Address (optional)"
                value={address}
                onChange={setAddress}
                autoComplete="street-address"
              />
              <PasswordField
                value={password}
                onChange={setPassword}
                show={showPw}
                onToggle={() => setShowPw((s) => !s)}
              />
              <button
                type="submit"
                disabled={submitting}
                className="mt-2 flex h-12 w-full items-center justify-center rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-[0_10px_25px_-10px_rgba(229,9,20,0.6)] transition active:scale-[0.98] disabled:opacity-70"
              >
                {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Account"}
              </button>
              <p className="pt-2 text-center text-sm text-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="font-bold text-primary hover:underline"
                >
                  Login Here
                </button>
              </p>
            </form>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Register/Login করে অর্ডারের ইতিহাস track করতে পারবেন।
        </p>
      </main>
    </div>
  );
}

function Field({
  icon,
  placeholder,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3.5 focus-within:border-primary">
      <span className="text-muted-foreground">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
    </label>
  );
}

function PasswordField({
  value,
  onChange,
  show,
  onToggle,
}: {
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3.5 focus-within:border-primary">
      <Lock className="h-4 w-4 text-muted-foreground" />
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Password"
        autoComplete="current-password"
        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
      <button
        type="button"
        onClick={onToggle}
        className="text-muted-foreground hover:text-foreground"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </label>
  );
}
