import { pgTable, uuid, text, integer, timestamp, pgEnum, unique, boolean, jsonb } from "drizzle-orm/pg-core";

export const orderStatus = pgEnum("order_status", ["pending", "paid", "canceled"]);

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // = auth.users.id
  email: text("email").notNull(),
  fullName: text("full_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  // Gói được mua (ProductId trong lib/products.ts). Mặc định all-access = bundle hiện tại.
  product: text("product").notNull().default("all-access"),
  amountVnd: integer("amount_vnd").notNull(),
  transferCode: text("transfer_code").notNull().unique(),
  status: orderStatus("status").notNull().default("pending"),
  sepayTxId: text("sepay_tx_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  paidAt: timestamp("paid_at", { withTimezone: true }),
});

export const enrollments = pgTable(
  "enrollments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    // Gói user đang sở hữu (ProductId). 1 user có thể giữ nhiều gói → unique theo (user, gói).
    package: text("package").notNull().default("all-access"),
    orderId: uuid("order_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [unique("enrollments_user_package_unique").on(t.userId, t.package)],
);

// Cấu hình flash-sale (1 dòng singleton) — admin chỉnh runtime. Đồng hồ đếm ngược là
// evergreen phía client (mỗi khách 1 mốc, hết thì reset); ở đây chỉ lưu tham số chung.
export const flashSale = pgTable("flash_sale", {
  id: text("id").primaryKey().default("singleton"),
  enabled: boolean("enabled").notNull().default(true),
  headline: text("headline").notNull().default("⚡ FLASH SALE — Ưu đãi early-bird sắp kết thúc"),
  countdownMinutes: integer("countdown_minutes").notNull().default(720), // độ dài đếm ngược/khách
  viewerMin: integer("viewer_min").notNull().default(6),
  viewerMax: integer("viewer_max").notNull().default(24),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Quà giảm giá "hộp quà" ở landing — server chốt % (chống khách tự chế %), lưu theo user.
// 1 user 1 quà/gói (unique) → idempotent, % không đổi khi refresh; hết hạn kiểm ở expires_at.
// Mức giảm THẬT: khi tạo đơn, amount đã trừ % được ghi vào orders.amount_vnd (webhook ép theo đó).
export const giftDiscounts = pgTable(
  "gift_discounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    // Gói được giảm (ProductId). Hiện chỉ áp cho "k1".
    product: text("product").notNull().default("k1"),
    percent: integer("percent").notNull(), // % giảm do server roll
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (t) => [unique("gift_discounts_user_product_unique").on(t.userId, t.product)],
);

// Lượt "đã THẤY hộp quà" — 1 dòng / 1 trình duyệt (cookie 'gv' chống trùng, không cần đăng nhập).
// Để /admin tính "số người không nhận" = số người thấy − số người nhận (gift_discounts).
export const giftImpressions = pgTable("gift_impressions", {
  visitor: text("visitor").primaryKey(), // id ẩn danh trong cookie 'gv'
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Đánh giá của học viên — chỉ người có ≥1 enrollment được gửi; 1 người 1 review
// (gửi lại = sửa và chờ duyệt lại). Trang chủ chỉ hiện approved=true (admin duyệt).
export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().unique(),
  name: text("name").notNull(), // tên hiển thị (user tự nhập)
  role: text("role"), // nghề/vai trò, tùy chọn
  rating: integer("rating").notNull(), // 1..5
  comment: text("comment").notNull(),
  approved: boolean("approved").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Nhật ký lỗi runtime có cấu trúc — context (vd "gift", "sepay", "admin-stats") + message +
// detail tùy ý (jsonb). Trước đây mọi lỗi chỉ console.error/warn → bắt buộc vào Vercel Logs mới
// thấy, /admin không có cách nào biết đang có lỗi xảy ra (đây là lý do sự cố /admin sập hoàn
// toàn 2026-07-26 không ai biết cho tới khi tự chụp ảnh gửi). Ghi SONG SONG với console, không
// thay thế — xem lib/log.ts.
export const appErrors = pgTable("app_errors", {
  id: uuid("id").primaryKey().defaultRandom(),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).defaultNow().notNull(),
  context: text("context").notNull(),
  message: text("message").notNull(),
  detail: jsonb("detail"),
});

// Audit trail MỌI lần webhook SePay gọi tới, kể cả bị BỎ QUA (skip_reason NOT NULL) — trước đây
// các nhánh skip (thiếu mã đơn / không khớp đơn pending / thiếu tiền) chỉ console.warn, không để
// lại dấu vết nào trong DB: khách có thể đã chuyển khoản thành công (tiền vào tài khoản ngân hàng
// thật) nhưng hệ thống không khớp được đơn → khách mất tiền mà không nhận được hàng, và không ai
// biết. rawPayload lưu payload ĐÃ QUA zod validate (lib/gift.ts's payloadSchema), KHÔNG lưu toàn
// bộ request body thô — hạn chế rủi ro lưu thừa trường nhạy cảm ngoài ý muốn từ SePay.
export const paymentWebhookEvents = pgTable("payment_webhook_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  receivedAt: timestamp("received_at", { withTimezone: true }).defaultNow().notNull(),
  rawPayload: jsonb("raw_payload"),
  transferAmount: integer("transfer_amount"),
  matchedTransferCode: text("matched_transfer_code"),
  matchedOrderId: uuid("matched_order_id"),
  skipReason: text("skip_reason"), // null = thành công; vd "no_transfer_code" | "order_not_found" | "amount_mismatch"
});

export type Order = typeof orders.$inferSelect;
export type Enrollment = typeof enrollments.$inferSelect;
export type FlashSale = typeof flashSale.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type GiftDiscount = typeof giftDiscounts.$inferSelect;
export type GiftImpression = typeof giftImpressions.$inferSelect;
export type AppError = typeof appErrors.$inferSelect;
export type PaymentWebhookEvent = typeof paymentWebhookEvents.$inferSelect;
