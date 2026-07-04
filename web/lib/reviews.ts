import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { profiles, reviews, type Review } from "@/lib/db/schema";

// Review đã duyệt cho trang chủ — mới nhất trước.
export async function getApprovedReviews(limit = 9): Promise<Review[]> {
  return db
    .select()
    .from(reviews)
    .where(eq(reviews.approved, true))
    .orderBy(desc(reviews.updatedAt))
    .limit(limit);
}

// Review của chính user (để form hiện lại cho sửa).
export async function getOwnReview(userId: string): Promise<Review | null> {
  const [row] = await db.select().from(reviews).where(eq(reviews.userId, userId)).limit(1);
  return row ?? null;
}

export type ReviewInput = {
  name: string;
  role: string | null;
  rating: number;
  comment: string;
};

// Gửi/sửa review của chính mình. Sửa lại → luôn quay về chờ duyệt (approved=false).
export async function upsertOwnReview(userId: string, data: ReviewInput): Promise<void> {
  await db
    .insert(reviews)
    .values({ userId, ...data })
    .onConflictDoUpdate({
      target: reviews.userId,
      set: { ...data, approved: false, updatedAt: new Date() },
    });
}

export type AdminReview = Review & { email: string | null };

// Danh sách cho admin duyệt — chưa duyệt lên đầu, rồi mới nhất trước; kèm email người gửi.
export async function getReviewsForAdmin(limit = 50): Promise<AdminReview[]> {
  const rows = await db
    .select({ review: reviews, email: profiles.email })
    .from(reviews)
    .leftJoin(profiles, eq(reviews.userId, profiles.id))
    .orderBy(reviews.approved, desc(reviews.updatedAt))
    .limit(limit);
  return rows.map((r) => ({ ...r.review, email: r.email }));
}
