-- Migration ĐỢT 2 "hoãn đăng nhập": cho phép quà thuộc về KHÁCH ẨN DANH (cookie 'gv').
-- CHẠY TAY trong Supabase → SQL Editor (như gift-discounts.sql / flash-sale.sql). Idempotent.
--
-- VÌ SAO: 19 người thấy hộp quà, chỉ 2 người nhận. Rào lớn nhất là phải đăng nhập TRƯỚC khi
-- biết mình được giảm bao nhiêu. Sau migration này, khách quay quà và thấy % NGAY khi chưa có
-- tài khoản; chỉ tới bước bấm "Nhận giá này" / tạo đơn mới đòi đăng nhập.
--
-- Trước: gift_discounts.user_id NOT NULL → buộc phải có tài khoản mới quay được quà.
-- Sau:   một dòng quà thuộc về HOẶC user_id (đã đăng nhập) HOẶC visitor (id trong cookie 'gv');
--        khi khách đăng nhập sau thì dòng theo cookie được GẮN user_id vào ("hấp thụ").
--
-- ⚠️  CODE CHẠY ĐƯỢC TRƯỚC KHI ÁP FILE NÀY. lib/gift.ts dò cột "visitor" (giftAnonSupported);
--     chưa có cột → luồng ẩn danh tự tắt và popup quay về đòi đăng nhập ĐÚNG NHƯ TRƯỚC.
--     Không có truy vấn nào đọc/ghi "visitor" khi chưa dò thấy cột, nên trang bán hàng
--     và luồng quà của người ĐÃ đăng nhập không bị ảnh hưởng gì.

BEGIN;

-- 1) Quà ẩn danh chưa gắn tài khoản → user_id phải cho phép NULL.
ALTER TABLE "gift_discounts" ALTER COLUMN "user_id" DROP NOT NULL;

-- 2) Chủ sở hữu ẩn danh = id trong cookie 'gv' (CÙNG nguồn với gift_impressions.visitor,
--    do api/gift/seen sinh ra) → nối được "người thấy quà" với "người quay quà".
ALTER TABLE "gift_discounts" ADD COLUMN IF NOT EXISTS "visitor" text;

-- 3) Unique cũ (user_id, product) KHÔNG còn đủ: các dòng ẩn danh đều có user_id NULL, mà trong
--    Postgres NULL không "bằng" NULL nên unique cũ không chặn được trùng theo visitor — khách
--    refresh là quay lại được, % đổi mỗi lần. Thay bằng 2 PARTIAL unique index: mỗi loại chủ
--    sở hữu đúng 1 dòng / 1 gói.
--    (Xoá cả 2 dạng: gift-discounts.sql tạo bằng CREATE UNIQUE INDEX, nhưng nếu có lúc nào
--     drizzle-kit chạy thì nó lại là CONSTRAINT cùng tên.)
ALTER TABLE "gift_discounts" DROP CONSTRAINT IF EXISTS "gift_discounts_user_product_unique";
DROP INDEX IF EXISTS "gift_discounts_user_product_unique";

CREATE UNIQUE INDEX IF NOT EXISTS "gift_discounts_user_product_unique"
  ON "gift_discounts" ("user_id", "product") WHERE "user_id" IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "gift_discounts_visitor_product_unique"
  ON "gift_discounts" ("visitor", "product") WHERE "visitor" IS NOT NULL;

-- 4) Chặn dòng "vô chủ" (không user_id, không visitor) — không ai lấy được quà đó, chỉ làm
--    nhiễu số liệu /admin. Đây là bất biến của bảng sau khi user_id thôi NOT NULL.
ALTER TABLE "gift_discounts" DROP CONSTRAINT IF EXISTS "gift_discounts_owner_check";
ALTER TABLE "gift_discounts" ADD CONSTRAINT "gift_discounts_owner_check"
  CHECK ("user_id" IS NOT NULL OR "visitor" IS NOT NULL);

-- 5) Tra quà theo cookie ở MỖI lần mở popup / render /checkout / tạo đơn. Chỉ các dòng chưa
--    hấp thụ (user_id IS NULL) mới được tra theo visitor → partial index đúng vệt truy vấn.
CREATE INDEX IF NOT EXISTS "gift_discounts_visitor_unclaimed_idx"
  ON "gift_discounts" ("visitor") WHERE "user_id" IS NULL;

COMMIT;

-- KIỂM SAU KHI CHẠY (kỳ vọng: visitor có mặt, user_id is_nullable = YES, 3 index dưới đây):
--   SELECT column_name, is_nullable FROM information_schema.columns
--    WHERE table_name = 'gift_discounts' ORDER BY ordinal_position;
--   SELECT indexname FROM pg_indexes WHERE tablename = 'gift_discounts';
