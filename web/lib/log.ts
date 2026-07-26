// Ghi log lỗi có cấu trúc — bảng app_errors SONG SONG với console.error/warn (Vercel Logs),
// KHÔNG thay thế console. Dùng cho mọi context quan trọng: gift, sepay, admin-stats, auth/callback.
//
// ⚠️ NGUYÊN TẮC BẤT DI BẤT DỊCH (bài học từ sự cố hộp quà 2026-07-26): hàm ghi log KHÔNG BAO GIỜ
// được ném lỗi ra ngoài. Thêm quan sát mà làm sập luồng chính (thanh toán, gift, đăng nhập...) là
// phản tác dụng — chính việc thêm 1 dòng lọc tài khoản test đã từng làm sập /admin hoàn toàn.
// Bảng app_errors là migration CHẠY TAY (drizzle/app-errors.sql, xem comment trong file đó) nên
// hoàn toàn có thể CHƯA tồn tại khi hàm này được gọi — nuốt lỗi, không log thêm (console.error đã
// có ở nơi gọi hoặc trong logAppError, không cần in "lỗi khi ghi lỗi" gây nhiễu Vercel Logs).
import { db } from "@/lib/db";
import { appErrors } from "@/lib/db/schema";

// Chỉ ghi DB, KHÔNG console.error — dùng khi nơi gọi đã tự console.error/warn theo format riêng
// của họ (giữ nguyên chuỗi log cũ đã quen tra trong Vercel Logs, tránh in trùng 2 lần).
export async function persistAppError(
  context: string,
  message: string,
  detail?: Record<string, unknown>,
): Promise<void> {
  try {
    await db.insert(appErrors).values({ context, message, detail: detail ?? null });
  } catch {
    // Bảng chưa tồn tại (chưa chạy drizzle/app-errors.sql) hoặc DB lỗi khác — im lặng bỏ qua.
  }
}

// Tiện ích 2-trong-1: console.error + ghi DB, cho nơi CHƯA có console.error riêng.
export async function logAppError(
  context: string,
  err: unknown,
  detail?: Record<string, unknown>,
): Promise<void> {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[${context}]`, err, detail ?? "");
  await persistAppError(context, message, detail);
}
