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
  Reply,
  ShieldCheck,
  Star,
  Trash2,
  Users,
  MessageSquare,
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
  const [tab, setTab] = useState<"orders" | "reviews" | "questions" | "users">("orders");


  useEffect(() => {
    isUnlockedFn()
      .then((r) => setUnlocked(r.unlocked))
      .finally(() => setChecking(false));
  }, [isUnlockedFn]);

  useEffect(() => {
    if (!unlocked) return;
    getDataFn().then((d) => setData(d as Data));
  }, [unlocked, getDataFn]);

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
    { key: "reviews" as const, label: "Reviews", icon: Star, count: data?.reviews.length ?? 0 },
    { key: "questions" as const, label: "Q&A", icon: MessageSquare, count: data?.questions.length ?? 0 },
    { key: "users" as const, label: "Users", icon: Users, count: data?.profiles.length ?? 0 },
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
        ) : (
          <UsersTable
            rows={data.profiles}
            onDelete={handleDeleteUser}
            onUpdate={handleUpdateUser}
            error={data.errors.profiles}
          />
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
