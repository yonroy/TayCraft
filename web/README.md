# TayCraft Web — bán khóa học "AI by Hand ✍️"

Website bán trọn bộ phiếu tính tay "AI by Hand" cho người Việt. Sản phẩm số (HTML/PDF), thanh toán QR chuyển khoản + SePay, host miễn phí trên Vercel + Supabase.

## Stack
- **Next.js 16** (App Router) + TypeScript + **Tailwind v4**
- **Supabase** Auth (Google + magic link) + Postgres
- **Drizzle ORM** (migrations)
- Thanh toán: **VietQR** (QR ảnh) + **SePay** webhook (đối soát tự động) + fallback admin xác nhận tay

## Cấu trúc
```
web/
├── app/                  # routes (landing, /learn, /checkout, /account, /login, /api/*)
├── components/           # UI (header, qr-checkout, paywall, login-form…)
├── lib/
│   ├── lessons.ts        # manifest 26 bài (trích từ ../ai-by-hand/index.html)
│   ├── db/               # Drizzle schema + client
│   ├── supabase/         # client/server/proxy auth
│   ├── auth.ts           # getUser / hasAccess / isAdmin
│   ├── vietqr.ts         # sinh QR + mã chuyển khoản
│   └── orders.ts         # markOrderPaid (cấp enrollment)
├── content/ai-by-hand/   # ARTIFACT (gitignored) — copy từ ../ai-by-hand
└── scripts/sync-content.mjs
```

Sản phẩm gốc nằm ở `../ai-by-hand` — **sửa ở đó**, không sửa `content/`.

## Bắt đầu
Xem **[SETUP.md](./SETUP.md)** để cấu hình Supabase, env, thanh toán và deploy.

```bash
pnpm install && pnpm dev   # http://localhost:3000
```
