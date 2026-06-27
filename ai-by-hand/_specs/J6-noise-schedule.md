# SPEC — J6 · Noise schedule (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `J6-noise-schedule` · English *Noise schedule* · ~11 phút.
> Tiền đề: J4 (forward diffusion).

## 1. Định vị
Lịch βₜ quyết định **thêm bao nhiêu nhiễu mỗi bước**. Từ βₜ suy ra αₜ = 1−βₜ và tích lũy ᾱₜ = ∏αᵢ — "còn lại bao nhiêu ảnh gốc".

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Lịch nhiễu xấu (thêm quá nhanh/chậm) làm diffusion học kém. ᾱₜ là đại lượng then chốt: cho phép "nhảy thẳng"
  (Bài J4) và định "ảnh gốc tan ở bước nào". Hiểu nó để đọc/chỉnh diffusion.
- `.formula`:
  ```
  αₜ = 1 − βₜ        ᾱₜ = α₁·α₂·…·αₜ   (tích lũy, giảm dần về 0)
  ```

## 3. Trực giác (`.intuition`)
> βₜ là "liều nhiễu mỗi bước". αₜ là "phần ảnh sống sót qua một bước". Nhân dồn các αₜ ra ᾱₜ = "phần ảnh sống sót sau t bước" —
> như **độ trong còn lại** của ly nước khi nhỏ mực liên tục.

## 4. Các bước
- **⓪ Cho sẵn** · pill `2 bước`: β₁ = 0.1, β₂ = 0.2. (`.cell.given`)
- **① αₜ = 1 − βₜ** — `α₁ = 1−0.1 = __ (0.9) ; α₂ = 1−0.2 = __` → 0.8. `.why`: phần ảnh giữ lại mỗi bước = 1 trừ liều nhiễu.
- **② Tích lũy ᾱ** — `ᾱ₁ = α₁ = __ (0.9) ; ᾱ₂ = α₁·α₂ = 0.9·0.8 = __` → 0.72. `.hint`: ᾱ là **tích dồn**, luôn giảm.
- **③ Đọc ý nghĩa** — ᾱ₂ = 0.72 → `√ᾱ₂ ≈ 0.85` còn lại ảnh gốc, phần nhiễu `√(1−0.72) ≈ 0.53`. `.why`: ᾱ càng nhỏ → ảnh gốc càng tan → tiến tới nhiễu thuần.
- **④ Kiểu lịch** · pill `linear / cosine` — `.note`: lịch **tuyến tính** tăng β đều; **cosine** giữ ảnh lâu hơn ở đầu, tan nhanh ở cuối → thường cho mẫu đẹp hơn. SVG: đường ᾱₜ giảm theo t (linear vs cosine).

## 5. Tự kiểm tra (`.quiz`)
1. ᾱₜ tính thế nào từ αᵢ? → `.qa` **Tích dồn α₁·…·αₜ (giảm dần).**
2. ᾱₜ nhỏ nghĩa là gì? → `.qa` **Ảnh gốc đã tan nhiều, nhiễu lấn át.**

## 6. Rút ra
> **Rút ra.** βₜ → αₜ=1−βₜ → ᾱₜ=∏αᵢ; ᾱ đo phần ảnh gốc còn lại. Bài tiếp (J7): chọn cách lấy mẫu ngược — DDPM vs DDIM.

## 7. `data-q` & số mẫu
- Sinh β nhỏ (bội 0.1) cho α, ᾱ ra số đẹp.
- Khóa: `b1, b2`; `a1, a2`, `abar1, abar2`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| α | (0.9, 0.8) |
| ᾱ | (0.9, 0.72) |
