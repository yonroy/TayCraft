# SPEC — J7 · Sampling DDPM vs DDIM (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `J7-ddpm-ddim` · English *DDPM vs DDIM* · ~12 phút.
> Tiền đề: J4 (forward), 25 (khử nhiễu), J6 (schedule).

## 1. Định vị
Hai cách **lấy mẫu ngược** (từ nhiễu về ảnh): **DDPM** ngẫu nhiên, nhiều bước, chất lượng cao; **DDIM** tất định, **bỏ bước**, nhanh hơn.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Sinh ảnh bằng DDPM tốn hàng trăm-nghìn bước → chậm. DDIM cho phép **nhảy bước** (vd 50 thay vì 1000) mà vẫn
  giữ chất lượng, và **tất định** (cùng nhiễu → cùng ảnh). Đây là đánh đổi tốc độ ↔ đa dạng khi triển khai.
- `.formula`:
  ```
  Cả hai: dự đoán nhiễu εθ(xₜ,t) → ước lượng x₀ → đi về xₜ₋₁
  DDPM: xₜ₋₁ = (ước lượng) + σₜ·z   (thêm nhiễu mới z)        DDIM: bỏ σₜ·z (tất định) → bỏ bước được
  ```

## 3. Trực giác (`.intuition`)
> Cả hai đều "đoán ảnh gốc rồi lùi một bước". **DDPM** mỗi bước **rắc thêm chút nhiễu** (ngẫu nhiên) → mượt nhưng cần nhiều bước.
> **DDIM** lùi **thẳng, không rắc nhiễu** → đi tắt được, cùng hạt nhiễu đầu cho cùng ảnh.

## 4. Các bước
- **⓪ Cho sẵn** · pill `1 pixel`: tại bước t, xₜ = 2.2; mô hình dự đoán nhiễu εθ = 1; ᾱₜ = 0.64 (√ᾱ=0.8, √(1−ᾱ)=0.6). (`.cell.given`)
- **① Ước lượng ảnh gốc x₀** — đảo công thức forward: `x̂₀ = (xₜ − √(1−ᾱ)·εθ)/√ᾱ = (2.2 − 0.6·1)/0.8 = __` → 2. `.why`: biết nhiễu thì gỡ ra → suy ngược ảnh sạch.
- **② DDIM (tất định)** — dùng x̂₀ để tính xₜ₋₁ **không thêm nhiễu** → đường đi trơn, **bỏ bước** được (t: 1000→50). `.hint`: cùng nhiễu khởi đầu → cùng ảnh (tái lập được).
- **③ DDPM (ngẫu nhiên)** — thêm `σₜ·z` (z mới mỗi bước) → cần **nhiều bước** nhỏ, đa dạng hơn, thường nét hơn. `.why`: nhiễu bơm lại giúp sửa lỗi tích lũy, nhưng làm chậm.
- **④ Đánh đổi** · pill `nhanh ↔ đa dạng` — `.note`: DDIM nhanh & tái lập (hợp chỉnh sửa, nội suy ẩn); DDPM chậm & đa dạng. Thực tế chọn số bước theo nhu cầu. SVG: hai đường lùi từ nhiễu → ảnh (DDPM nhiều bước gợn, DDIM ít bước trơn).

## 5. Tự kiểm tra (`.quiz`)
1. DDIM khác DDPM ở điểm cốt lõi nào? → `.qa` **DDIM tất định, không thêm nhiễu mỗi bước → bỏ bước được.**
2. Vì sao DDIM nhanh hơn? → `.qa` **Nhảy bước (vài chục thay vì hàng nghìn) mà giữ chất lượng.**

## 6. Rút ra
> **Rút ra.** Cả hai đoán ε → ước lượng x₀ → lùi bước; DDPM rắc nhiễu (chậm, đa dạng), DDIM tất định (nhanh, tái lập). **Hết Phần J & khóa K3.**
> Tiếp K4 — Bài tiếp (K1): phần thưởng & chiết khấu (RL).

## 7. `data-q` & số mẫu
- Cho xₜ, εθ, ᾱ (Pythagore) → ước lượng x̂₀.
- Khóa: `xt, eps, abar`; `sqA, sq1A`, `x0hat`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| x̂₀ | 2 |
| DDIM | tất định, bỏ bước |
| DDPM | +σ·z, nhiều bước |
