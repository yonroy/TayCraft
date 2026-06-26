# TayCraft — Làm toán AI ✍️

Học nền tảng AI/Deep Learning **bằng tay**: tự điền ma trận, chạy softmax / attention / backprop bằng số thật trên giấy. Theo tinh thần Prof. Tom Yeh — "AI by Hand". Toàn bộ tiếng Việt.

## Hai phần
- **[`ai-by-hand/`](ai-by-hand/)** — bộ phiếu tính tay (HTML thuần, in A4/A3 → PDF). Mở `ai-by-hand/index.html` để xem mục lục. Nguồn gốc nội dung.
- **[`web/`](web/)** — website bán trọn bộ phiếu (Next.js + Supabase + thanh toán VietQR/SePay). Xem [`web/SETUP.md`](web/SETUP.md) để cài đặt & deploy.

## Chạy nhanh
```bash
# Xem phiếu (không cần build):
start "" "ai-by-hand/index.html"

# Chạy website bán hàng:
cd web && pnpm install && pnpm dev
```
