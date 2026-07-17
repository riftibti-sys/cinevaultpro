import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Lock, LogOut, Star, Trash2, Users, MessageSquare, ShieldCheck } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import {
  adminDeleteQuestion,
  adminDeleteReview,
  adminGetData,
  adminIsUnlocked,
  adminLock,
  adminUnlock,
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

type Data = {
  reviews: Review[];
  questions: Question[];
  profiles: Profile[];
  errors: { reviews: string | null; questions: string | null; profiles: string | null };
};

function AdminPage() {
  const isUnlockedFn = useServerFn(adminIsUnlocked);
  const unlockFn = useServerFn(adminUnlock);
  const lockFn = useServerFn(adminLock);
  const getDataFn = useServerFn(adminGetData);
  const delReviewFn = useServerFn(adminDeleteReview);
  const delQuestionFn = useServerFn(adminDeleteQuestion);

  const [checking, setChecking] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<Data | null>(null);
  const [tab, setTab] = useState<"reviews" | "questions" | "users">("reviews");

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

  async function handleDeleteQuestion(id: string) {
    if (!confirm("Delete this question?")) return;
    await delQuestionFn({ data: { id } });
    toast.success("Deleted");
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
          <ReviewsTable rows={data.reviews} onDelete={handleDeleteReview} error={data.errors.reviews} />
        ) : tab === "questions" ? (
          <QuestionsTable rows={data.questions} onDelete={handleDeleteQuestion} error={data.errors.questions} />
        ) : (
          <UsersTable rows={data.profiles} error={data.errors.profiles} />
        )}
      </main>
    </div>
  );
}

function ReviewsTable({
  rows,
  onDelete,
  error,
}: {
  rows: Review[];
  onDelete: (id: string) => void;
  error: string | null;
}) {
  if (error) return <ErrorBox message={error} />;
  if (rows.length === 0) return <EmptyBox label="No reviews yet" />;
  return (
    <div className="grid gap-3">
      {rows.map((r) => (
        <div key={r.id} className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-foreground">{r.name}</span>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                  {r.product_id}
                </span>
                <span className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </span>
              </div>
              {r.comment && <p className="mt-1 text-sm text-foreground/80">{r.comment}</p>}
              <p className="mt-1 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</p>
            </div>
            <button
              onClick={() => onDelete(r.id)}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function QuestionsTable({
  rows,
  onDelete,
  error,
}: {
  rows: Question[];
  onDelete: (id: string) => void;
  error: string | null;
}) {
  if (error) return <ErrorBox message={error} />;
  if (rows.length === 0) return <EmptyBox label="No questions yet" />;
  return (
    <div className="grid gap-3">
      {rows.map((q) => (
        <div key={q.id} className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-foreground">{q.name}</span>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                  {q.product_id}
                </span>
              </div>
              <p className="mt-1 text-sm text-foreground/90">Q: {q.question}</p>
              {q.answer && <p className="mt-1 text-sm text-primary">A: {q.answer}</p>}
              <p className="mt-1 text-xs text-muted-foreground">{new Date(q.created_at).toLocaleString()}</p>
            </div>
            <button
              onClick={() => onDelete(q.id)}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function UsersTable({ rows, error }: { rows: Profile[]; error: string | null }) {
  if (error) return <ErrorBox message={error} />;
  if (rows.length === 0) return <EmptyBox label="No users yet" />;
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Address</th>
            <th className="px-4 py-3">Joined</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id} className="border-t border-border">
              <td className="px-4 py-3 font-semibold text-foreground">{p.full_name || "—"}</td>
              <td className="px-4 py-3 text-foreground/80">{p.phone || "—"}</td>
              <td className="px-4 py-3 text-foreground/80">{p.address || "—"}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(p.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
