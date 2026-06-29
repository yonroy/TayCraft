import { eq } from "drizzle-orm";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { enrollments, profiles } from "@/lib/db/schema";
import { isFreeSlug, courseOf, FREE_COURSES, type Course } from "@/lib/lessons";
import { packagesGrantingCourse, coursesOfProduct, productById, COURSES } from "@/lib/products";

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
  // Bài thuộc khóa miễn phí (K1) mở cho mọi người — khỏi truy DB.
  if (slug && (isFreeSlug(slug) || FREE_COURSES.includes(courseOf(slug)!))) return true;

  // Admin (ADMIN_EMAILS) mở mọi bài để tiện kiểm tra nội dung.
  if (await isAdminUser(userId)) return true;

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

// Khóa user THỰC SỰ sở hữu qua enrollment (luôn gồm khóa free). KHÔNG tính admin-override —
// dùng cho kiểm tra mua lại/nâng cấp để admin vẫn test được luồng thanh toán.
async function ownedCourses(userId: string): Promise<Course[]> {
  const rows = await db
    .select({ package: enrollments.package })
    .from(enrollments)
    .where(eq(enrollments.userId, userId));
  const set = new Set<Course>(FREE_COURSES);
  for (const r of rows) {
    const p = productById(r.package);
    if (p) for (const c of coursesOfProduct(p)) set.add(c);
  }
  return [...set];
}

// Tài khoản admin (theo ADMIN_EMAILS) — được mở mọi khóa để tiện kiểm tra nội dung.
async function isAdminUser(userId: string): Promise<boolean> {
  const [row] = await db
    .select({ email: profiles.email })
    .from(profiles)
    .where(eq(profiles.id, userId));
  return isAdmin(row?.email);
}

// Tập khóa user xem được (luôn gồm khóa free; admin mở TẤT CẢ). Dùng để gate per-khóa ở catalog.
export async function accessibleCourses(userId: string): Promise<Course[]> {
  if (await isAdminUser(userId)) return COURSES.map((c) => c.id);
  return ownedCourses(userId);
}

// User đã sở hữu đủ MỌI khóa của gói này chưa (gồm grandfather all-access). Dùng để chặn mua lại
// nhưng vẫn cho NÂNG CẤP lên gói cao hơn. Dựa trên sở hữu THẬT (không tính admin) để admin vẫn
// test được luồng thanh toán.
export async function ownsProduct(userId: string, productId: string): Promise<boolean> {
  const product = productById(productId);
  if (!product) return false;
  const owned = new Set(await ownedCourses(userId));
  return coursesOfProduct(product).every((c) => owned.has(c));
}

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase());
}
