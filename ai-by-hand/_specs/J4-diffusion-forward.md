# SPEC — J4 · Diffusion: forward (thêm nhiễu) (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `J4-diffusion-forward` · English *Diffusion forward* · ~12 phút.
> Tiền đề: A16 (phương sai), J6 (noise schedule). Số Pythagore.

## 1. Định vị
Quá trình **thêm nhiễu dần** biến ảnh sạch x₀ thành nhiễu thuần qua T bước. Một bước rút gọn cho phép "nhảy thẳng" tới bước t.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Diffusion học cách **đảo ngược** việc thêm nhiễu (khử nhiễu, Bài 25). Để huấn luyện, ta cần tạo nhanh ảnh
  nhiễu ở bước t bất kỳ — công thức "nhảy thẳng" dùng tích lũy ᾱ làm điều đó trong một phép.
- `.formula`:
  ```
  xₜ = √ᾱₜ · x₀ + √(1 − ᾱₜ) · ε,  ε ~ N(0,1)      (ᾱₜ = ∏ αᵢ, giảm dần về 0)
  ```

## 3. Trực giác (`.intuition`)
> Mỗi bước **pha loãng** ảnh gốc và **thêm một ít nhiễu**. √ᾱ là "còn lại bao nhiêu ảnh gốc", √(1−ᾱ) là "đã thêm bao nhiêu nhiễu";
> hai trọng số này luôn thỏa `(√ᾱ)² + (√(1−ᾱ))² = 1` (giữ tổng phương sai). t lớn → ảnh gốc mờ dần, nhiễu lấn át.

## 4. Các bước
- **⓪ Cho sẵn** · pill `1 pixel`: x₀ = 2; tại bước t có ᾱₜ = 0.64; nhiễu ε = 1. (`.cell.given`)
- **① Hệ số trộn** — `√ᾱ = √0.64 = __ (0.8) ; √(1−ᾱ) = √0.36 = __` → 0.6. `.why`: cặp (0.8, 0.6) là bộ Pythagore → 0.8² + 0.6² = 1 (bảo toàn phương sai).
- **② Trộn ảnh + nhiễu** — `xₜ = 0.8·2 + 0.6·1 = __` → 2.2. `.hint`: phần ảnh gốc (1.6) + phần nhiễu (0.6).
- **③ Bước t lớn hơn** — nếu ᾱ → 0: `√ᾱ → 0, √(1−ᾱ) → 1 → xₜ ≈ ε` (nhiễu thuần). `.why`: cuối quá trình, ảnh gốc biến mất hoàn toàn → điểm xuất phát để khử nhiễu ngược.
- **④ Vì sao "nhảy thẳng"** · pill `dùng ᾱₜ` — `.note`: nhờ ᾱₜ = ∏αᵢ (Bài J6), tính xₜ **trực tiếp** từ x₀ trong một phép, khỏi lặp t bước → huấn luyện hiệu quả. SVG: ảnh rõ → mờ dần → nhiễu.

## 5. Tự kiểm tra (`.quiz`)
1. Tổng `(√ᾱ)² + (√(1−ᾱ))²` bằng bao nhiêu? → `.qa` **1 (bảo toàn phương sai).**
2. Khi t → T (ᾱ → 0), xₜ thành gì? → `.qa` **Nhiễu thuần N(0,1).**

## 6. Rút ra
> **Rút ra.** Forward diffusion = √ᾱ·x₀ + √(1−ᾱ)·ε, nhảy thẳng tới bước t nhờ ᾱₜ. Bài tiếp (25): học đảo ngược — một bước khử nhiễu.

## 7. `data-q` & số mẫu
- Chọn ᾱ là bình phương số đẹp (0.64, 0.36…) cho √ ra số tròn; x₀, ε nhỏ.
- Khóa: `x0, abar, eps`; `sqA, sq1A`, `xt`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| √ᾱ, √(1−ᾱ) | 0.8, 0.6 |
| xₜ | 2.2 |
