# SPEC — J5 · Diffusion — một bước khử nhiễu (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `25-diffusion-khu-nhieu` · English *Diffusion denoise* · ~13 phút.
> Tiền đề: J4 (forward), J6 (schedule), J7 (DDPM/DDIM). **Đã có phiếu** — spec để nâng cấp/tái tạo. Số Pythagore.

## 1. Định vị
Quá trình ngược của diffusion: từ ảnh nhiễu xₜ, mạng **dự đoán nhiễu** rồi gỡ bớt → ảnh bớt nhiễu xₜ₋₁. Lặp T bước ra ảnh sạch.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Sinh ảnh = bắt đầu từ **nhiễu thuần** rồi khử dần. Mỗi bước, mạng đoán "phần nhiễu" để trừ ra → lộ ảnh. Đây là
  cơ chế của Stable Diffusion, DALL·E — một trong những họ mô hình sinh mạnh nhất.
- `.formula`:
  ```
  x̂₀ = (xₜ − √(1−ᾱₜ)·εθ) / √ᾱₜ        rồi đi về xₜ₋₁ (DDPM thêm nhiễu / DDIM tất định — Bài J7)
  ```

## 3. Trực giác (`.intuition`)
> Forward (J4) **thêm** nhiễu; reverse **đoán và trừ** nhiễu. Mạng học "trong ảnh mờ này, đâu là nhiễu?" → gỡ ra một ít → ảnh rõ hơn
> một chút. Lặp nhiều bước nhỏ, như **lau dần** lớp bụi để hiện bức tranh.

## 4. Các bước
- **⓪ Cho sẵn** · pill `1 pixel`: ảnh nhiễu xₜ = 2.2; mạng dự đoán nhiễu εθ = 1; ᾱₜ = 0.64 (√ᾱ=0.8, √(1−ᾱ)=0.6). (`.cell.given`)
- **① Ước lượng ảnh gốc x̂₀** — `x̂₀ = (xₜ − √(1−ᾱ)·εθ)/√ᾱ = (2.2 − 0.6·1)/0.8 = __` → 2. `.why`: đảo công thức forward — biết nhiễu thì suy ra ảnh sạch.
- **② Đi về bước trước** — dùng x̂₀ (+ một phần nhiễu còn lại) tính xₜ₋₁ → bớt nhiễu hơn xₜ. `.hint`: không nhảy thẳng về x₀ một phát vì εθ chỉ là **ước lượng**; đi từng bước cho chính xác.
- **③ Lặp** — lặp t = T → 1, mỗi bước gỡ thêm nhiễu → ảnh sạch dần. `.why`: nhiều bước nhỏ ổn định hơn một bước lớn (mỗi bước εθ đáng tin hơn).
- **④ DDPM vs DDIM** · pill `chọn cách lùi` — `.note`: DDPM rắc lại chút nhiễu mỗi bước (chậm, đa dạng); DDIM tất định, bỏ bước (nhanh) — Bài J7. SVG: dãy ảnh từ nhiễu → rõ dần.

## 5. Tự kiểm tra (`.quiz`)
1. Mỗi bước khử nhiễu, mạng dự đoán gì? → `.qa` **Phần nhiễu εθ trong ảnh để trừ ra.**
2. Vì sao lùi từng bước nhỏ thay vì về x₀ ngay? → `.qa` **εθ chỉ là ước lượng; nhiều bước nhỏ chính xác & ổn định hơn.**

## 6. Rút ra
> **Rút ra.** Reverse diffusion = đoán nhiễu → ước lượng x₀ → lùi một bước, lặp tới ảnh sạch. Bài tiếp (26): định tuyến chuyên gia — Mixture of Experts.

## 7. `data-q` & số mẫu
- Cho xₜ, εθ, ᾱ (Pythagore) → x̂₀ nguyên.
- Khóa: `xt, eps, abar`; `sqA, sq1A`, `x0hat`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| x̂₀ | 2 |
