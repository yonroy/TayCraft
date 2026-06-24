-- Bật Row Level Security cho 3 bảng.
-- App kết nối bằng role 'postgres' (qua DATABASE_URL) → là owner nên BỎ QUA RLS, vẫn chạy bình thường.
-- Bật RLS + KHÔNG tạo policy = chặn mọi truy cập qua anon/authenticated key (PostgREST).
-- Chạy đoạn này trong Supabase → SQL Editor.

alter table "profiles" enable row level security;
alter table "orders" enable row level security;
alter table "enrollments" enable row level security;

-- (Tùy chọn) Nếu sau này muốn đọc dữ liệu qua client bằng anon key, thêm policy có kiểm soát ở đây.
