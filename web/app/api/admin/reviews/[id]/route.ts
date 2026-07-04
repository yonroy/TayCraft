import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { getUser, isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";

async function requireAdmin() {
  const user = await getUser();
  if (!user || !isAdmin(user.email)) return null;
  return user;
}

// Duyệt / ẩn một review: body { approved: boolean }.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as { approved?: unknown } | null;
  if (typeof body?.approved !== "boolean") {
    return NextResponse.json({ error: "Thiếu approved" }, { status: 400 });
  }

  const updated = await db
    .update(reviews)
    .set({ approved: body.approved })
    .where(eq(reviews.id, id))
    .returning({ id: reviews.id });
  if (updated.length === 0) {
    return NextResponse.json({ error: "Không tìm thấy đánh giá" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

// Xóa hẳn một review (spam/xúc phạm).
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.delete(reviews).where(eq(reviews.id, id));
  return NextResponse.json({ success: true });
}
