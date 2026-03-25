import type { User } from "@supabase/supabase-js";

import { getAdminEmails } from "@/lib/config/env";
import { AppError } from "@/lib/utils/app-error";
import { requireAuthenticatedUser } from "@/lib/auth/server-auth";

export function isAdminUser(user: Pick<User, "email">) {
  const adminEmails = getAdminEmails();
  const normalizedEmail = user.email?.trim().toLowerCase();

  if (!normalizedEmail) {
    return false;
  }

  return adminEmails.includes(normalizedEmail);
}

export async function requireAdminUser() {
  const user = await requireAuthenticatedUser();

  if (!isAdminUser(user)) {
    throw new AppError("Acesso restrito a administradores.", 403);
  }

  return user;
}
