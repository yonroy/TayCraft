-- Migration: bảng quà giảm giá "hộp quà" ở landing. Chạy trong Supabase → SQL Editor
-- (DB local bị ISP chặn cổng → áp tay như flash-sale.sql / packages.sql). Idempotent.
-- Server chốt % (chống khách tự chế); 1 user 1 quà/gói; hết hạn ở expires_at.

CREATE TABLE IF NOT EXISTS "gift_discounts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "product" text NOT NULL DEFAULT 'k1',
  "percent" integer NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "expires_at" timestamptz NOT NULL
);

-- 1 user chỉ 1 quà mỗi gói → idempotent, % không đổi khi refresh.
CREATE UNIQUE INDEX IF NOT EXISTS "gift_discounts_user_product_unique"
  ON "gift_discounts" ("user_id", "product");
