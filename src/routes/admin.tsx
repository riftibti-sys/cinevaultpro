import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  Loader2,
  Lock,
  LogOut,
  Package,
  Pencil,
  Plus,
  Reply,
  ShieldCheck,
  ShoppingBag,
  Star,
  Sparkles,
  Trash2,
  Users,
  MessageSquare,
  Image as ImageIcon,
  X,
} from "lucide-react";

import { Toaster } from "@/components/ui/sonner";
import {
  adminAnswerQuestion,
  adminDeleteOrder,
  adminDeleteQuestion,
  adminDeleteReview,
  adminDeleteUser,
  adminGetData,
  adminIsUnlocked,
  adminLock,
  adminUnlock,
  adminUpdateOrderStatus,
  adminUpdateReview,
  adminUpdateUser,
} from "@/lib/admin.functions";
import {
  adminDeleteProduct,
  adminListProducts,
  adminSaveProduct,
  type ProductInput,
  type ProductRow,
} from "@/lib/products.functions";
import {
  adminDeleteCombo,
  adminListCombos,
  adminSaveCombo,
  type ComboInput,
  type ComboRow,
} from "@/lib/combos.functions";
import {
  adminUpdateSiteSettings,
  listSiteSettings,
  type SettingRow,
} from "@/lib/site-settings.functions";
import { Settings as SettingsIcon } from "lucide-react";


export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — CineVault" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Review = {
  id: string;
  name: string;
  product_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

type Question = {
  id: string;
  name: string;
  product_id: string;
  question: string;
  answer: string | null;
  created_at: string;
};

type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
};

type Order = {
  id: string;
  product_name: string;
  full_name: string;
  phone: string;
  email: string | null;
  address: string;
  notes: string | null;
  status: string;
  created_at: string;
};

type Data = {
  reviews: Review[];
  questions: Question[];
  profiles: Profile[];
  orders: Order[];
  errors: { reviews: string | null; questions: string | null; profiles: string | null; orders: string | null };
};


function AdminPage() {
  const isUnlockedFn = useServerFn(adminIsUnlocked);
  const unlockFn = useServerFn(adminUnlock);
  const lockFn = useServerFn(adminLock);
  const getDataFn = useServerFn(adminGetData);
  const delReviewFn = useServerFn(adminDeleteReview);
  const delQuestionFn = useServerFn(adminDeleteQuestion);
  const answerQuestionFn = useServerFn(adminAnswerQuestion);
  const updateReviewFn = useServerFn(adminUpdateReview);
  const delUserFn = useServerFn(adminDeleteUser);
  const updateUserFn = useServerFn(adminUpdateUser);
  const delOrderFn = useServerFn(adminDeleteOrder);
  const updateOrderFn = useServerFn(adminUpdateOrderStatus);

  const [checking, setChecking] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<Data | null>(null);
  const [products, setProducts] = useState<ProductRow[] | null>(null);
  const [combos, setCombos] = useState<ComboRow[] | null>(null);
  const [settings, setSettings] = useState<SettingRow[] | null>(null);
  const [tab, setTab] = useState<"orders" | "products" | "combos" | "hero" | "reviews" | "questions" | "users" | "settings">("orders");

  const listProductsFn = useServerFn(adminListProducts);
  const saveProductFn = useServerFn(adminSaveProduct);
  const delProductFn = useServerFn(adminDeleteProduct);
  const listCombosFn = useServerFn(adminListCombos);
  const saveComboFn = useServerFn(adminSaveCombo);
  const delComboFn = useServerFn(adminDeleteCombo);
  const listSettingsFn = useServerFn(listSiteSettings);
  const saveSettingsFn = useServerFn(adminUpdateSiteSettings);

  useEffect(() => {
    isUnlockedFn()
      .then((r) => setUnlocked(r.unlocked))
      .finally(() => setChecking(false));
  }, [isUnlockedFn]);

  useEffect(() => {
    if (!unlocked) return;
    getDataFn().then((d) => setData(d as Data));
    listProductsFn().then((p) => setProducts(p as ProductRow[]));
    listCombosFn().then((c) => setCombos(c as ComboRow[]));
    listSettingsFn().then((s) => setSettings(s as SettingRow[]));
  }, [unlocked, getDataFn, listProductsFn, listCombosFn, listSettingsFn]);

  async function handleSaveSettings(updates: { key: string; value: string }[]) {
    await saveSettingsFn({ data: { updates } });
    toast.success("Settings saved");
    const s = await listSettingsFn();
    setSettings(s as SettingRow[]);
  }

  async function refreshProducts() {
    const p = await listProductsFn();
    setProducts(p as ProductRow[]);
  }
  async function handleSaveProduct(product: ProductInput, isNew: boolean, originalId?: string) {
    await saveProductFn({ data: { product, isNew, originalId } });
    toast.success(isNew ? "Product created" : "Product updated");
    await refreshProducts();
  }
  async function handleDeleteProduct(id: string) {
    if (!confirm(`Delete product "${id}"?`)) return;
    await delProductFn({ data: { id } });
    toast.success("Deleted");
    await refreshProducts();
  }

  async function refreshCombos() {
    const c = await listCombosFn();
    setCombos(c as ComboRow[]);
  }
  async function handleSaveCombo(combo: ComboInput, isNew: boolean, originalId?: string) {
    await saveComboFn({ data: { combo, isNew, originalId } });
    toast.success(isNew ? "Combo created" : "Combo updated");
    await refreshCombos();
  }
  async function handleDeleteCombo(id: string) {
    if (!confirm(`Delete combo "${id}"?`)) return;
    await delComboFn({ data: { id } });
    toast.success("Deleted");
    await refreshCombos();
  }

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const r = await unlockFn({ data: { password } });
      if (r.ok) {
        setUnlocked(true);
        setPassword("");
        toast.success("Welcome, admin");
      } else {
        toast.error("ভুল password");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLock() {
    await lockFn();
    setUnlocked(false);
    setData(null);
    toast.success("Signed out");
  }

  async function refresh() {
    const d = await getDataFn();
    setData(d as Data);
  }

  async function handleDeleteReview(id: string) {
    if (!confirm("Delete this review?")) return;
    await delReviewFn({ data: { id } });
    toast.success("Deleted");
    refresh();
  }
  async function handleUpdateReview(id: string, rating: number, comment: string) {
    await updateReviewFn({ data: { id, rating, comment } });
    toast.success("Updated");
    refresh();
  }
  async function handleDeleteQuestion(id: string) {
    if (!confirm("Delete this question?")) return;
    await delQuestionFn({ data: { id } });
    toast.success("Deleted");
    refresh();
  }
  async function handleAnswerQuestion(id: string, answer: string) {
    await answerQuestionFn({ data: { id, answer } });
    toast.success("Saved");
    refresh();
  }
  async function handleDeleteUser(id: string) {
    if (!confirm("Delete this user permanently? Their reviews & questions will also be removed.")) return;
    await delUserFn({ data: { id } });
    toast.success("User deleted");
    refresh();
  }
  async function handleUpdateUser(id: string, full_name: string, phone: string, address: string) {
    await updateUserFn({ data: { id, full_name, phone, address } });
    toast.success("Updated");
    refresh();
  }
  async function handleDeleteOrder(id: string) {
    if (!confirm("Delete this order?")) return;
    await delOrderFn({ data: { id } });
    toast.success("Deleted");
    refresh();
  }
  async function handleUpdateOrderStatus(id: string, status: "new" | "contacted" | "completed" | "cancelled") {
    await updateOrderFn({ data: { id, status } });
    toast.success("Status updated");
    refresh();
  }


  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-background">
        <Toaster position="top-center" />
        <header className="border-b border-white/10 bg-[#0a0a0a] text-white">
          <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
            <Link
              to="/"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 hover:border-primary/60"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="font-display text-xl uppercase italic tracking-wider">
                Admin <span className="text-primary">Panel</span>
              </span>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-md px-4 py-10">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.4)]">
            <div className="mb-4 text-center">
              <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
                <Lock className="h-6 w-6" />
              </div>
              <h1 className="font-display text-2xl uppercase">Restricted Area</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter admin password to continue
              </p>
            </div>
            <form onSubmit={handleUnlock} className="space-y-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                autoFocus
                className="w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                disabled={submitting || !password}
                className="flex h-12 w-full items-center justify-center rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-[0_10px_25px_-10px_rgba(229,9,20,0.6)] disabled:opacity-60"
              >
                {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Unlock"}
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  const tabs = [
    { key: "orders" as const, label: "Orders", icon: Package, count: data?.orders.length ?? 0 },
    { key: "products" as const, label: "Products", icon: ShoppingBag, count: products?.length ?? 0 },
    { key: "combos" as const, label: "Combos", icon: Sparkles, count: combos?.length ?? 0 },
    { key: "hero" as const, label: "Hero", icon: ImageIcon, count: (settings ?? []).filter((s) => s.key.startsWith("hero_")).length },

    { key: "reviews" as const, label: "Reviews", icon: Star, count: data?.reviews.length ?? 0 },
    { key: "questions" as const, label: "Q&A", icon: MessageSquare, count: data?.questions.length ?? 0 },
    { key: "users" as const, label: "Users", icon: Users, count: data?.profiles.length ?? 0 },
    { key: "settings" as const, label: "Settings", icon: SettingsIcon, count: settings?.length ?? 0 },
  ];


  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0a0a] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 hover:border-primary/60"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="font-display text-xl uppercase italic tracking-wider">
                Admin <span className="text-primary">Panel</span>
              </span>
            </div>
          </div>
          <button
            onClick={handleLock}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:border-primary/60 hover:text-primary"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                tab === t.key
                  ? "bg-primary text-primary-foreground shadow-[0_10px_25px_-10px_rgba(229,9,20,0.6)]"
                  : "border border-border bg-card text-foreground hover:border-primary/60"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
              <span className={`rounded-full px-2 py-0.5 text-[10px] ${tab === t.key ? "bg-white/20" : "bg-secondary text-muted-foreground"}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {!data ? (
          <div className="grid place-items-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : tab === "orders" ? (
          <OrdersTable
            rows={data.orders}
            onDelete={handleDeleteOrder}
            onStatus={handleUpdateOrderStatus}
            error={data.errors.orders}
          />
        ) : tab === "products" ? (
          <ProductsManager
            rows={products ?? []}
            onSave={handleSaveProduct}
            onDelete={handleDeleteProduct}
          />
        ) : tab === "combos" ? (
          <CombosManager
            rows={combos ?? []}
            onSave={handleSaveCombo}
            onDelete={handleDeleteCombo}
          />
        ) : tab === "reviews" ? (
          <ReviewsTable
            rows={data.reviews}
            onDelete={handleDeleteReview}
            onUpdate={handleUpdateReview}
            error={data.errors.reviews}
          />
        ) : tab === "questions" ? (
          <QuestionsTable
            rows={data.questions}
            onDelete={handleDeleteQuestion}
            onAnswer={handleAnswerQuestion}
            error={data.errors.questions}
          />
        ) : tab === "users" ? (
          <UsersTable
            rows={data.profiles}
            onDelete={handleDeleteUser}
            onUpdate={handleUpdateUser}
            error={data.errors.profiles}
          />
        ) : (
          <SettingsManager rows={settings ?? []} onSave={handleSaveSettings} />
        )}

      </main>
    </div>
  );
}

function ReviewsTable({
  rows,
  onDelete,
  onUpdate,
  error,
}: {
  rows: Review[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, rating: number, comment: string) => void;
  error: string | null;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  if (error) return <ErrorBox message={error} />;
  if (rows.length === 0) return <EmptyBox label="No reviews yet" />;
  return (
    <div className="grid gap-3">
      {rows.map((r) => {
        const isEditing = editing === r.id;
        return (
          <div key={r.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-foreground">{r.name}</span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                    {r.product_id}
                  </span>
                  {!isEditing && (
                    <span className="flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </span>
                  )}
                </div>
                {isEditing ? (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          onClick={() => setRating(n)}
                          className={`text-lg ${n <= rating ? "text-amber-500" : "text-muted-foreground/40"}`}
                          type="button"
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={2}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onUpdate(r.id, rating, comment);
                          setEditing(null);
                        }}
                        className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
                      >
                        <Check className="h-3.5 w-3.5" /> Save
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-bold"
                      >
                        <X className="h-3.5 w-3.5" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {r.comment && <p className="mt-1 text-sm text-foreground/80">{r.comment}</p>}
                    <p className="mt-1 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</p>
                  </>
                )}
              </div>
              {!isEditing && (
                <div className="flex shrink-0 flex-col gap-2">
                  <button
                    onClick={() => {
                      setEditing(r.id);
                      setRating(r.rating);
                      setComment(r.comment ?? "");
                    }}
                    className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary"
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(r.id)}
                    className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function QuestionsTable({
  rows,
  onDelete,
  onAnswer,
  error,
}: {
  rows: Question[];
  onDelete: (id: string) => void;
  onAnswer: (id: string, answer: string) => void;
  error: string | null;
}) {
  const [answering, setAnswering] = useState<string | null>(null);
  const [text, setText] = useState("");
  if (error) return <ErrorBox message={error} />;
  if (rows.length === 0) return <EmptyBox label="No questions yet" />;
  return (
    <div className="grid gap-3">
      {rows.map((q) => {
        const isAnswering = answering === q.id;
        return (
          <div key={q.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-foreground">{q.name}</span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                    {q.product_id}
                  </span>
                </div>
                <p className="mt-1 text-sm text-foreground/90">Q: {q.question}</p>
                {q.answer && !isAnswering && (
                  <p className="mt-1 text-sm text-primary">A: {q.answer}</p>
                )}
                {isAnswering ? (
                  <div className="mt-2 space-y-2">
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      rows={3}
                      placeholder="Your answer..."
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onAnswer(q.id, text);
                          setAnswering(null);
                        }}
                        className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
                      >
                        <Check className="h-3.5 w-3.5" /> Save Answer
                      </button>
                      <button
                        onClick={() => setAnswering(null)}
                        className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-bold"
                      >
                        <X className="h-3.5 w-3.5" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1 text-xs text-muted-foreground">{new Date(q.created_at).toLocaleString()}</p>
                )}
              </div>
              {!isAnswering && (
                <div className="flex shrink-0 flex-col gap-2">
                  <button
                    onClick={() => {
                      setAnswering(q.id);
                      setText(q.answer ?? "");
                    }}
                    className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary"
                    aria-label={q.answer ? "Edit answer" : "Answer"}
                  >
                    <Reply className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(q.id)}
                    className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function UsersTable({
  rows,
  onDelete,
  onUpdate,
  error,
}: {
  rows: Profile[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, full_name: string, phone: string, address: string) => void;
  error: string | null;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  if (error) return <ErrorBox message={error} />;
  if (rows.length === 0) return <EmptyBox label="No users yet" />;
  return (
    <div className="grid gap-3">
      {rows.map((p) => {
        const isEditing = editing === p.id;
        return (
          <div key={p.id} className="rounded-2xl border border-border bg-card p-4">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onUpdate(p.id, name, phone, address);
                      setEditing(null);
                    }}
                    className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
                  >
                    <Check className="h-3.5 w-3.5" /> Save
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-bold"
                  >
                    <X className="h-3.5 w-3.5" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1 text-sm">
                  <div className="font-bold text-foreground">{p.full_name || "—"}</div>
                  <div className="text-foreground/80">📞 {p.phone || "—"}</div>
                  <div className="text-foreground/80">📍 {p.address || "—"}</div>
                  <div className="text-xs text-muted-foreground">
                    Joined {new Date(p.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <button
                    onClick={() => {
                      setEditing(p.id);
                      setName(p.full_name ?? "");
                      setPhone(p.phone ?? "");
                      setAddress(p.address ?? "");
                    }}
                    className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary"
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(p.id)}
                    className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary"
                    aria-label="Delete user"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-600">
      {message}
    </div>
  );
}

function EmptyBox({ label }: { label: string }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-card py-16 text-sm text-muted-foreground">
      {label}
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  contacted: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  completed: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  cancelled: "bg-red-500/15 text-red-600 border-red-500/30",
};

function OrdersTable({
  rows,
  onDelete,
  onStatus,
  error,
}: {
  rows: Order[];
  onDelete: (id: string) => void;
  onStatus: (id: string, s: "new" | "contacted" | "completed" | "cancelled") => void;
  error: string | null;
}) {
  if (error) return <ErrorBox message={error} />;
  if (rows.length === 0) return <EmptyBox label="No orders yet" />;
  return (
    <div className="grid gap-3">
      {rows.map((o) => (
        <div key={o.id} className="rounded-2xl border border-border bg-card p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-1 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-foreground">{o.product_name}</span>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                    STATUS_STYLES[o.status] ?? "border-border bg-secondary text-muted-foreground"
                  }`}
                >
                  {o.status}
                </span>
              </div>
              <div className="text-foreground/80">👤 {o.full_name}</div>
              <div className="text-foreground/80">📞 {o.phone}{o.email ? ` · ✉️ ${o.email}` : ""}</div>
              <div className="text-foreground/80">📍 {o.address}</div>
              {o.notes && <div className="text-foreground/70">📝 {o.notes}</div>}
              <div className="text-xs text-muted-foreground">
                {new Date(o.created_at).toLocaleString()}
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <select
                value={o.status}
                onChange={(e) => onStatus(o.id, e.target.value as "new" | "contacted" | "completed" | "cancelled")}
                className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs font-bold"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/${o.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                >
                  <MessageSquare className="h-4 w-4" />
                </a>
                <button
                  onClick={() => onDelete(o.id)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const CATEGORIES: Array<{ value: ProductInput["category"]; label: string }> = [
  { value: "streaming", label: "Streaming" },
  { value: "editing", label: "Editing" },
  { value: "music", label: "Music" },
  { value: "other", label: "AI & Others" },
];

const EMPTY_PRODUCT: ProductInput = {
  id: "",
  name: "",
  tagline: "",
  price: 0,
  original_price: null,
  duration: "1 Month",
  category: "streaming",
  accent: "#e50914",
  logo: "",
  logo_fill: false,
  logo_large: false,
  rating: 5.0,
  reviews: 0,
  description: "",
  features: [],
  warranty: "30-Day Replacement Warranty",
  sort_order: 100,
  is_active: true,
};

function ProductsManager({
  rows,
  onSave,
  onDelete,
}: {
  rows: ProductRow[];
  onSave: (product: ProductInput, isNew: boolean, originalId?: string) => Promise<void>;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState<{ product: ProductInput; isNew: boolean; originalId?: string } | null>(null);
  const [saving, setSaving] = useState(false);

  function startEdit(r: ProductRow) {
    setEditing({
      product: {
        id: r.id,
        name: r.name,
        tagline: r.tagline,
        price: r.price,
        original_price: r.original_price,
        duration: r.duration,
        category: (["streaming", "editing", "music", "other"].includes(r.category) ? r.category : "other") as ProductInput["category"],
        accent: r.accent,
        logo: r.logo,
        logo_fill: r.logo_fill,
        logo_large: r.logo_large,
        rating: r.rating,
        reviews: r.reviews,
        description: r.description ?? "",
        features: r.features ?? [],
        warranty: r.warranty ?? "",
        sort_order: r.sort_order,
        is_active: r.is_active,
      },
      isNew: false,
      originalId: r.id,
    });
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    try {
      await onSave(editing.product, editing.isNew, editing.originalId);
      setEditing(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Products ({rows.length})
        </h2>
        <button
          onClick={() => setEditing({ product: { ...EMPTY_PRODUCT }, isNew: true })}
          className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-[0_10px_25px_-10px_rgba(229,9,20,0.6)]"
        >
          <Plus className="h-4 w-4" /> New Product
        </button>
      </div>

      {editing && (
        <ProductEditor
          value={editing.product}
          isNew={editing.isNew}
          saving={saving}
          onChange={(p) => setEditing({ ...editing, product: p })}
          onCancel={() => setEditing(null)}
          onSave={save}
        />
      )}

      <div className="grid gap-3">
        {rows.map((r) => (
          <div key={r.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
            <img src={r.logo} alt={r.name} className="h-12 w-12 rounded-lg object-contain bg-white/5 p-1" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-foreground">{r.name}</span>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                  {r.category}
                </span>
                {!r.is_active && (
                  <span className="rounded-full bg-destructive/20 px-2 py-0.5 text-[10px] font-black uppercase text-destructive">
                    Hidden
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Tk. {r.price}{r.original_price ? ` · was ${r.original_price}` : ""} · {r.duration} · #{r.sort_order}
              </div>
              <div className="truncate text-xs text-foreground/60">{r.tagline}</div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => startEdit(r)}
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary"
                aria-label="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(r.id)}
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {rows.length === 0 && <EmptyBox label="No products yet — click 'New Product'" />}
      </div>
    </div>
  );
}

function ProductEditor({
  value,
  isNew,
  saving,
  onChange,
  onCancel,
  onSave,
}: {
  value: ProductInput;
  isNew: boolean;
  saving: boolean;
  onChange: (p: ProductInput) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  const featuresText = (value.features ?? []).join("\n");
  return (
    <div className="rounded-2xl border border-primary/40 bg-card p-4 shadow-[0_10px_40px_-20px_rgba(229,9,20,0.5)]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold text-foreground">{isNew ? "New Product" : `Edit: ${value.name || value.id}`}</h3>
        <button onClick={onCancel} className="grid h-8 w-8 place-items-center rounded-full border border-border hover:border-primary">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="ID (slug)">
          <input
            value={value.id}
            disabled={!isNew}
            onChange={(e) => onChange({ ...value, id: e.target.value })}
            placeholder="e.g. netflix"
            className="input"
          />
        </Field>
        <Field label="Name">
          <input value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} className="input" />
        </Field>
        <Field label="Tagline">
          <input value={value.tagline} onChange={(e) => onChange({ ...value, tagline: e.target.value })} className="input" />
        </Field>
        <Field label="Duration">
          <input value={value.duration} onChange={(e) => onChange({ ...value, duration: e.target.value })} className="input" />
        </Field>
        <Field label="Price (Tk.)">
          <input type="number" value={value.price} onChange={(e) => onChange({ ...value, price: Number(e.target.value) })} className="input" />
        </Field>
        <Field label="Original Price (Tk.)">
          <input
            type="number"
            value={value.original_price ?? ""}
            onChange={(e) => onChange({ ...value, original_price: e.target.value === "" ? null : Number(e.target.value) })}
            className="input"
          />
        </Field>
        <Field label="Category">
          <select
            value={value.category}
            onChange={(e) => onChange({ ...value, category: e.target.value as ProductInput["category"] })}
            className="input"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Accent Color">
          <div className="flex items-center gap-2">
            <input type="color" value={value.accent} onChange={(e) => onChange({ ...value, accent: e.target.value })} className="h-10 w-14 cursor-pointer rounded-lg border border-border bg-transparent" />
            <input value={value.accent} onChange={(e) => onChange({ ...value, accent: e.target.value })} className="input flex-1" />
          </div>
        </Field>
        <Field label="Logo URL">
          <input value={value.logo} onChange={(e) => onChange({ ...value, logo: e.target.value })} placeholder="https://... or /src/assets/..." className="input" />
        </Field>
        <Field label="Rating (0–5)">
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={value.rating ?? ""}
            onChange={(e) => onChange({ ...value, rating: e.target.value === "" ? null : Number(e.target.value) })}
            className="input"
          />
        </Field>
        <Field label="Reviews Count">
          <input
            type="number"
            value={value.reviews ?? ""}
            onChange={(e) => onChange({ ...value, reviews: e.target.value === "" ? null : Number(e.target.value) })}
            className="input"
          />
        </Field>
        <Field label="Sort Order (lower = first)">
          <input type="number" value={value.sort_order} onChange={(e) => onChange({ ...value, sort_order: Number(e.target.value) })} className="input" />
        </Field>
        <Field label="Warranty">
          <input value={value.warranty ?? ""} onChange={(e) => onChange({ ...value, warranty: e.target.value })} className="input" />
        </Field>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Field label="Description">
          <textarea
            value={value.description ?? ""}
            onChange={(e) => onChange({ ...value, description: e.target.value })}
            rows={4}
            className="input"
          />
        </Field>
        <Field label="Features (one per line)">
          <textarea
            value={featuresText}
            onChange={(e) => onChange({ ...value, features: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
            rows={4}
            className="input"
          />
        </Field>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={value.is_active} onChange={(e) => onChange({ ...value, is_active: e.target.checked })} />
          Active (visible on site)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={value.logo_fill} onChange={(e) => onChange({ ...value, logo_fill: e.target.checked })} />
          Logo fill (edge-to-edge)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={value.logo_large} onChange={(e) => onChange({ ...value, logo_large: e.target.checked })} />
          Logo large
        </label>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-[0_10px_25px_-10px_rgba(229,9,20,0.6)] disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          {isNew ? "Create Product" : "Save Changes"}
        </button>
        <button onClick={onCancel} className="rounded-full border border-border px-5 py-2.5 text-sm font-bold hover:border-primary/60">
          Cancel
        </button>
      </div>
      <style>{`.input{width:100%;border-radius:0.5rem;border:1px solid hsl(var(--border));background:hsl(var(--background));padding:0.5rem 0.75rem;font-size:0.875rem;color:hsl(var(--foreground));outline:none}.input:focus{border-color:hsl(var(--primary))}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

const SETTING_LABELS: Record<string, { label: string; hint?: string; textarea?: boolean }> = {
  contact_phone: { label: "Contact phone (display)", hint: "e.g. 01785-897167" },
  contact_phone_intl: { label: "WhatsApp phone (international)", hint: "e.g. 8801785897167 — no + or spaces" },
  messenger_url: { label: "Messenger URL", hint: "https://m.me/yourpage" },
  support_message: { label: "Default support message", textarea: true },
  bkash_number: { label: "bKash number" },
  nagad_number: { label: "Nagad number" },
  hero_since_text: { label: "Header 'since' text" },
  hero_badge_text: { label: "Header FIFA badge text" },
  footer_tagline: { label: "Footer tagline", textarea: true },
  footer_address: { label: "Footer address" },
  hero_featured_ids: { label: "Hero featured product IDs", hint: "Comma-separated product IDs — e.g. netflix,prime,spotify" },
  hero_recommended_text: { label: "Hero badge text" },
  hero_starts_text: { label: "Hero 'Starts at' label" },
  hero_shop_text: { label: "Hero shop button text" },
};

function SettingsManager({
  rows,
  onSave,
}: {
  rows: SettingRow[];
  onSave: (updates: { key: string; value: string }[]) => Promise<void>;
}) {
  const [draft, setDraft] = useState<Record<string, string>>(() => {
    const d: Record<string, string> = {};
    for (const r of rows) d[r.key] = r.value;
    return d;
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const d: Record<string, string> = {};
    for (const r of rows) d[r.key] = r.value;
    setDraft(d);
  }, [rows]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updates = rows.map((r) => ({ key: r.key, value: draft[r.key] ?? r.value }));
      await onSave(updates);
    } finally {
      setSaving(false);
    }
  };

  if (rows.length === 0) {
    return <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">No settings yet.</div>;
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-display text-xl uppercase italic tracking-wide">Site Settings</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {rows.map((r) => {
            const meta = SETTING_LABELS[r.key] ?? { label: r.key };
            return (
              <Field key={r.key} label={meta.label}>
                {meta.textarea ? (
                  <textarea
                    value={draft[r.key] ?? ""}
                    onChange={(e) => setDraft((d) => ({ ...d, [r.key]: e.target.value }))}
                    rows={3}
                    className="w-full rounded-lg border border-border bg-background p-2 text-sm"
                  />
                ) : (
                  <input
                    value={draft[r.key] ?? ""}
                    onChange={(e) => setDraft((d) => ({ ...d, [r.key]: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background p-2 text-sm"
                  />
                )}
                {meta.hint && <span className="mt-1 block text-[10px] text-muted-foreground">{meta.hint}</span>}
              </Field>
            );
          })}
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-black uppercase tracking-wide text-primary-foreground disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <SettingsIcon className="h-4 w-4" />}
          Save Settings
        </button>
      </div>
    </form>
  );
}

const EMPTY_COMBO: ComboInput = {
  id: "",
  title: "",
  subtitle: "",
  tag: "",
  duration: "1 Month",
  price: 0,
  original_price: 0,
  gradient: "linear-gradient(135deg, #1a0000 0%, #6b0f14 100%)",
  glow: "rgba(229,9,20,0.35)",
  perks: [],
  services: [],
  sort_order: 100,
  is_active: true,
};

function CombosManager({
  rows,
  onSave,
  onDelete,
}: {
  rows: ComboRow[];
  onSave: (combo: ComboInput, isNew: boolean, originalId?: string) => Promise<void>;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState<{ combo: ComboInput; isNew: boolean; originalId?: string } | null>(null);
  const [saving, setSaving] = useState(false);

  function startEdit(r: ComboRow) {
    setEditing({
      combo: {
        id: r.id,
        title: r.title,
        subtitle: r.subtitle,
        tag: r.tag,
        duration: r.duration,
        price: r.price,
        original_price: r.original_price,
        gradient: r.gradient,
        glow: r.glow,
        perks: r.perks ?? [],
        services: r.services ?? [],
        sort_order: r.sort_order,
        is_active: r.is_active,
      },
      isNew: false,
      originalId: r.id,
    });
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    try {
      await onSave(editing.combo, editing.isNew, editing.originalId);
      setEditing(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Combos ({rows.length})
        </h2>
        <button
          onClick={() => setEditing({ combo: { ...EMPTY_COMBO }, isNew: true })}
          className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-[0_10px_25px_-10px_rgba(229,9,20,0.6)]"
        >
          <Plus className="h-4 w-4" /> New Combo
        </button>
      </div>

      {editing && (
        <ComboEditor
          value={editing.combo}
          isNew={editing.isNew}
          saving={saving}
          onChange={(c) => setEditing({ ...editing, combo: c })}
          onCancel={() => setEditing(null)}
          onSave={save}
        />
      )}

      <div className="grid gap-3">
        {rows.map((r) => (
          <div key={r.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
            <div
              className="grid h-12 w-12 shrink-0 place-items-center rounded-lg text-[10px] font-black text-white"
              style={{ background: r.gradient }}
            >
              {(r.services ?? []).length}×
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-foreground">{r.title}</span>
                {r.tag && (
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                    {r.tag}
                  </span>
                )}
                {!r.is_active && (
                  <span className="rounded-full bg-destructive/20 px-2 py-0.5 text-[10px] font-black uppercase text-destructive">
                    Hidden
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Tk. {r.price}{r.original_price ? ` · was ${r.original_price}` : ""} · {r.duration} · #{r.sort_order}
              </div>
              <div className="truncate text-xs text-foreground/60">{r.subtitle}</div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => startEdit(r)}
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary"
                aria-label="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(r.id)}
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {rows.length === 0 && <EmptyBox label="No combos yet — click 'New Combo'" />}
      </div>
    </div>
  );
}

function ComboEditor({
  value,
  isNew,
  saving,
  onChange,
  onCancel,
  onSave,
}: {
  value: ComboInput;
  isNew: boolean;
  saving: boolean;
  onChange: (c: ComboInput) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  const perksText = (value.perks ?? []).join("\n");
  const servicesText = JSON.stringify(value.services ?? [], null, 2);
  return (
    <div className="rounded-2xl border border-primary/40 bg-card p-4 shadow-[0_10px_40px_-20px_rgba(229,9,20,0.5)]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold text-foreground">{isNew ? "New Combo" : `Edit: ${value.title || value.id}`}</h3>
        <button onClick={onCancel} className="grid h-8 w-8 place-items-center rounded-full border border-border hover:border-primary">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="ID (slug)">
          <input
            value={value.id}
            disabled={!isNew}
            onChange={(e) => onChange({ ...value, id: e.target.value })}
            placeholder="e.g. combo-netflix-prime"
            className="input"
          />
        </Field>
        <Field label="Title">
          <input value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} className="input" />
        </Field>
        <Field label="Subtitle">
          <input value={value.subtitle} onChange={(e) => onChange({ ...value, subtitle: e.target.value })} className="input" />
        </Field>
        <Field label="Tag (e.g. MOST POPULAR)">
          <input value={value.tag} onChange={(e) => onChange({ ...value, tag: e.target.value })} className="input" />
        </Field>
        <Field label="Duration">
          <input value={value.duration} onChange={(e) => onChange({ ...value, duration: e.target.value })} className="input" />
        </Field>
        <Field label="Price (Tk.)">
          <input type="number" value={value.price} onChange={(e) => onChange({ ...value, price: Number(e.target.value) })} className="input" />
        </Field>
        <Field label="Original Price (Tk.)">
          <input type="number" value={value.original_price} onChange={(e) => onChange({ ...value, original_price: Number(e.target.value) })} className="input" />
        </Field>
        <Field label="Sort Order (lower = first)">
          <input type="number" value={value.sort_order} onChange={(e) => onChange({ ...value, sort_order: Number(e.target.value) })} className="input" />
        </Field>
        <Field label="Gradient (CSS)">
          <input value={value.gradient} onChange={(e) => onChange({ ...value, gradient: e.target.value })} className="input" />
        </Field>
        <Field label="Glow color (rgba)">
          <input value={value.glow} onChange={(e) => onChange({ ...value, glow: e.target.value })} className="input" />
        </Field>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Field label="Perks (one per line)">
          <textarea
            value={perksText}
            onChange={(e) => onChange({ ...value, perks: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
            rows={4}
            className="input"
          />
        </Field>
        <Field label='Services (JSON array of {name, logo, accent})'>
          <textarea
            value={servicesText}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                if (Array.isArray(parsed)) onChange({ ...value, services: parsed });
              } catch {
                // ignore until valid JSON
              }
            }}
            rows={6}
            className="input font-mono text-[11px]"
          />
        </Field>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={value.is_active} onChange={(e) => onChange({ ...value, is_active: e.target.checked })} />
          Active (visible on site)
        </label>
        <div
          className="ml-auto grid h-10 w-40 place-items-center rounded-lg text-[10px] font-black uppercase tracking-wider text-white"
          style={{ background: value.gradient, boxShadow: `0 0 25px -5px ${value.glow}` }}
        >
          Preview
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-[0_10px_25px_-10px_rgba(229,9,20,0.6)] disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          {isNew ? "Create Combo" : "Save Changes"}
        </button>
        <button onClick={onCancel} className="rounded-full border border-border px-5 py-2.5 text-sm font-bold hover:border-primary/60">
          Cancel
        </button>
      </div>
      <style>{`.input{width:100%;border-radius:0.5rem;border:1px solid hsl(var(--border));background:hsl(var(--background));padding:0.5rem 0.75rem;font-size:0.875rem;color:hsl(var(--foreground));outline:none}.input:focus{border-color:hsl(var(--primary))}`}</style>
    </div>
  );
}

