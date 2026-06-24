import { pgTable, uuid, text, integer, timestamp, pgEnum, unique } from "drizzle-orm/pg-core";

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

export type Order = typeof orders.$inferSelect;
export type Enrollment = typeof enrollments.$inferSelect;
