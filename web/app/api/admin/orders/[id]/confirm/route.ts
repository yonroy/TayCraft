import { NextResponse, type NextRequest } from "next/server";
import { getUser, isAdmin } from "@/lib/auth";
import { markOrderPaid } from "@/lib/orders";

// Fallback khi chưa nối SePay: admin xác nhận đơn đã chuyển khoản thủ công.
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getUser();
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await markOrderPaid(id, "admin-manual");
  return NextResponse.json({ success: true });
}
