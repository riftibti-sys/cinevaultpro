import { useSession } from "@tanstack/react-start/server";

export type AdminSession = { unlocked?: boolean };

export function adminSessionConfig() {
  const password = process.env.ADMIN_SESSION_SECRET;
  if (!password) throw new Error("ADMIN_SESSION_SECRET is not set");
  return {
    password,
    name: "cv-admin",
    maxAge: 60 * 60 * 8,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

export async function requireAdminUnlocked() {
  const session = await useSession<AdminSession>(adminSessionConfig());
  if (!session.data.unlocked) throw new Error("LOCKED");
  return session;
}
