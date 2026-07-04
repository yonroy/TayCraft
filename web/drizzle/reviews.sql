-- Bảng đánh giá của học viên (chạy trong Supabase → SQL Editor, hoặc `pnpm db:push`).
-- 1 user 1 review (unique user_id); gửi lại = sửa + chờ duyệt lại (approved=false).
-- Trang chủ chỉ hiện approved=true.

create table if not exists "reviews" (
  "id" uuid primary key default gen_random_uuid(),
  "user_id" uuid not null unique,
  "name" text not null,
  "role" text,
  "rating" integer not null,
  "comment" text not null,
  "approved" boolean not null default false,
  "created_at" timestamptz not null default now(),
  "updated_at" timestamptz not null default now()
);

-- RLS deny-all như các bảng khác (app nối bằng role postgres → owner, bỏ qua RLS).
alter table "reviews" enable row level security;
