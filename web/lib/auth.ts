import { eq } from "drizzle-orm";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { enrollments, profiles } from "@/lib/db/schema";
import { isFreeSlug, courseOf } from "@/lib/lessons";
import { packagesGrantingCourse } from "@/lib/products";

export async function getUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Tạo/đồng bộ profile (gọi sau khi đăng nhập). Idempotent.
export async function ensureProfile(user: User): Promise<void> {
  await db
    .insert(profiles)
    .values({
      id: user.id,
      email: user.email ?? "",
      fullName: (user.user_metadata?.full_name as string | undefined) ?? null,
    })
    .onConflictDoNothing();
}

// Quyền truy cập theo gói.
//  - Không truyền slug → "có bất kỳ gói nào" (gating nav/UI tổng quát).
//  - Có slug → bài free luôn mở; ngược lại phải sở hữu gói mở được khóa của bài (gồm all-access).
// Khách cũ đã backfill thành 'all-access' → mở mọi bài (không hồi quy).
export async function hasAccess(userId: string, slug?: string): Promise<boolean> {
  const rows = await db
    .select({ package: enrollments.package })
    .from(enrollments)
    .where(eq(enrollments.userId, userId));
  if (rows.length === 0) return slug ? isFreeSlug(slug) : false;

  const owned = new Set(rows.map((r) => r.package));
  if (owned.has("all-access")) return true;
  if (!slug) return true; // có ít nhất một gói

  if (isFreeSlug(slug)) return true;
  const course = courseOf(slug);
  if (!course) return false;
  return packagesGrantingCourse(course).some((p) => owned.has(p));
}

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase());
}
