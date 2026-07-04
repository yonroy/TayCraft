import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getUser, hasAccess } from "@/lib/auth";
import { upsertOwnReview } from "@/lib/reviews";

const ReviewSchema = z.object({
  name: z.string().trim().min(2, "Tên tối thiểu 2 ký tự").max(60),
  role: z.string().trim().max(60).optional().default(""),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(10, "Cảm nhận tối thiểu 10 ký tự").max(500),
});

// Học viên (có ≥1 gói, kể cả K1 free) gửi/sửa đánh giá của mình → chờ admin duyệt.
export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Cần đăng nhập" }, { status: 401 });
  }
  if (!(await hasAccess(user.id))) {
    return NextResponse.json(
      { error: "Chỉ học viên đã có khóa học mới gửi được đánh giá." },
      { status: 403 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = ReviewSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const { name, role, rating, comment } = parsed.data;
  await upsertOwnReview(user.id, { name, role: role || null, rating, comment });
  return NextResponse.json({ success: true });
}
