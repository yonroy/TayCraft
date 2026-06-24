# Hướng dẫn cài đặt — TayCraft (web bán "AI by Hand")

Website bán trọn bộ phiếu "AI by Hand". Stack: **Next.js 16 + Supabase + Drizzle + Tailwind v4**, thanh toán **VietQR + SePay**. Host miễn phí trên **Vercel + Supabase**.

> Sản phẩm (các phiếu HTML) nằm ở `../ai-by-hand` (nguồn gốc). Script `pnpm sync:content` tự copy sang `web/content/ai-by-hand` mỗi lần dev/build. **Không sửa file trong `web/content`** — sửa ở `../ai-by-hand`.

---

## 1. Tạo Supabase project (đã có tài khoản)

1. https://supabase.com → **New project**. Chọn region gần VN (Singapore).
2. Vào **Project Settings → API**, lấy:
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role key
3. Vào **Project Settings → Database → Connection string → URI** (chọn **Transaction pooler**, cổng 6543), copy thành `DATABASE_URL` (nhớ thay `[YOUR-PASSWORD]`).

### Bật đăng nhập Google
- **Authentication → Providers → Google** → bật, điền Client ID/Secret (tạo ở Google Cloud Console, OAuth consent + Credentials).
- Redirect URL Google: `https://<PROJECT>.supabase.co/auth/v1/callback`.
- **Authentication → URL Configuration**: Site URL = `http://localhost:3000` (local) / domain Vercel (production). Thêm cả hai vào **Redirect URLs** kèm `/auth/callback`.
- Email magic link bật sẵn mặc định.

---

## 2. Cấu hình môi trường

```bash
cd web
cp .env.example .env.local
```
Điền `.env.local` bằng giá trị thật:
- 3 khóa Supabase + `DATABASE_URL` ở bước 1.
- `BANK_CODE` (vd `VCB`, `TCB`, `MB`…), `BANK_ACCOUNT_NUMBER`, `BANK_ACCOUNT_NAME` (tài khoản nhận tiền).
- `COURSE_PRICE_VND` (mặc định 199000).
- `ADMIN_EMAILS` = email của bạn (để xác nhận đơn thủ công khi chưa có SePay).
- `SEPAY_WEBHOOK_API_KEY` = tự đặt một chuỗi bí mật.

---

## 3. Tạo bảng + chạy thử

```bash
pnpm install
pnpm sync:content      # copy phiếu vào content/ (tự chạy khi dev/build)
pnpm db:push           # tạo bảng profiles / orders / enrollments trên Supabase
pnpm dev               # http://localhost:3000
```

Kiểm tra: mở `/` → thấy 19 bài; bài 01–03 bấm "Xem thử" chạy được 🎲 + in PDF. Đăng nhập Google → `/learn` thấy bài khóa 🔒.

---

## 4. Quy trình thanh toán

1. Khách đăng nhập → `/checkout` → hệ thống tạo đơn + hiện **QR VietQR** (số tiền + nội dung `TCxxxxxx`).
2. Khách chuyển khoản đúng nội dung.
3. **Khi đã nối SePay** → webhook tự đánh dấu đơn `paid` → mở khóa.
4. **Khi CHƯA có SePay** → bạn (admin) xác nhận thủ công:
   ```bash
   # Lấy order id trong Supabase Table Editor (bảng orders, đơn pending), rồi:
   curl -X POST https://<domain>/api/admin/orders/<ORDER_ID>/confirm \
     -H "Cookie: <cookie phiên admin>"
   ```
   (Hoặc đăng nhập bằng email admin và gọi endpoint từ trình duyệt.) Cách nhanh nhất: sửa tay trong Supabase — set `orders.status = 'paid'` rồi thêm dòng vào `enrollments`.

### Nối SePay (tự động hóa — làm sau, miễn phí)
1. Đăng ký https://sepay.vn, kết nối tài khoản ngân hàng của bạn.
2. **Webhooks → Thêm webhook**:
   - URL: `https://<domain>/api/sepay/webhook`
   - Kiểu xác thực: **API Key** → giá trị = `SEPAY_WEBHOOK_API_KEY` trong env (SePay gửi header `Authorization: Apikey <key>`).
3. Test: chuyển khoản thật một đơn → SePay gọi webhook → đơn chuyển `paid` tự động.

---

## 5. Deploy lên Vercel (miễn phí)

1. Push repo lên GitHub.
2. Vercel → **New Project** → chọn repo → **Root Directory = `web`**.
3. Thêm tất cả biến trong `.env.local` vào **Environment Variables**.
4. Deploy. Cập nhật lại Supabase **URL Configuration** + Google redirect bằng domain Vercel.
5. Cập nhật `SEPAY` webhook URL sang domain thật.

Chi phí: Vercel free + Supabase free ≈ **0đ** tới vài nghìn user. Chỉ tốn khi mua tên miền riêng.

---

## Lệnh hữu ích
```bash
pnpm dev            # chạy local
pnpm build          # build production (tự sync content)
pnpm db:push        # đẩy schema lên DB
pnpm db:generate    # sinh file migration SQL (drizzle/)
pnpm db:studio      # mở Drizzle Studio xem/sửa dữ liệu
```
