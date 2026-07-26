-- Migration: audit trail MỌI lần webhook SePay gọi tới, kể cả bị BỎ QUA. Chạy trong Supabase
-- → SQL Editor (DB local bị ISP chặn cổng → áp tay như các file khác trong thư mục này). Idempotent.
--
-- Vì sao cần: app/api/sepay/webhook/route.ts có 3 nhánh "skip" (thiếu mã đơn trong nội dung
-- chuyển khoản / có mã nhưng không khớp đơn đang chờ / số tiền chuyển ít hơn giá đơn) — trước đây
-- CẢ 3 nhánh chỉ console.warn, KHÔNG để lại dấu vết nào trong DB. Hậu quả thật: khách có thể đã
-- chuyển khoản thành công (tiền vào tài khoản ngân hàng của shop) nhưng ghi sai/thiếu nội dung
-- nên hệ thống không khớp được đơn — khách mất tiền mà không được mở khóa, và admin hoàn toàn
-- không biết trừ khi khách tự nhắn báo. Bảng này ghi CẢ lượt thành công lẫn 3 loại bị bỏ qua để
-- /admin surface được card "Giao dịch vào tiền nhưng chưa khớp đơn".
--
-- raw_payload lưu payload ĐÃ QUA zod validate (payloadSchema trong route.ts), KHÔNG lưu toàn bộ
-- request body thô từ SePay — hạn chế rủi ro lưu thừa trường nhạy cảm ngoài ý muốn.

CREATE TABLE IF NOT EXISTS "payment_webhook_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "received_at" timestamptz NOT NULL DEFAULT now(),
  "raw_payload" jsonb,
  "transfer_amount" integer,
  "matched_transfer_code" text,
  "matched_order_id" uuid,
  "skip_reason" text
);

-- Lọc nhanh "chỉ hiện các dòng bị bỏ qua" cho card cảnh báo ở /admin.
CREATE INDEX IF NOT EXISTS "payment_webhook_events_skip_reason_idx"
  ON "payment_webhook_events" ("skip_reason") WHERE "skip_reason" IS NOT NULL;
