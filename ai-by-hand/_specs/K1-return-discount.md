# SPEC — K1 · Phần thưởng & chiết khấu (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `K1-return-discount` · English *Return & discount* · ~12 phút.
> Tiền đề: A16 (kỳ vọng), A18 (lũy thừa). Mở đầu Phần K (Reinforcement Learning, K4).

## 1. Định vị
**Return** G = tổng phần thưởng tương lai, có **chiết khấu** γ (thưởng xa giảm giá trị). Mục tiêu RL là tối đa G kỳ vọng.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Agent không tối ưu thưởng **tức thời** mà tối ưu **tổng dài hạn**. γ cân bằng "ăn xổi" vs "đầu tư dài hạn",
  và đảm bảo tổng hữu hạn với chuỗi vô hạn. Đây là đại lượng mọi thuật toán RL cố ước lượng/tối đa.
- `.formula`:
  ```
  Gₜ = rₜ + γ·rₜ₊₁ + γ²·rₜ₊₂ + … = Σ_{k≥0} γᵏ·rₜ₊ₖ      (0 ≤ γ ≤ 1)
  ```

## 3. Trực giác (`.intuition`)
> Thưởng **bây giờ** đáng giá hơn thưởng **mai sau** (như tiền hôm nay > tiền năm sau). γ là "tỉ lệ chiết khấu": γ gần 1 → nhìn xa,
> kiên nhẫn; γ gần 0 → thiển cận, chỉ quan tâm thưởng ngay.

## 4. Các bước
- **⓪ Cho sẵn** · pill `γ=0.5`: chuỗi phần thưởng r = (1, 0, 2) từ bước t. (`.cell.given`)
- **① Chiết khấu từng bước** — `γ⁰·1 = 1 ; γ¹·0 = 0 ; γ²·2 = 0.25·2 = __` → 0.5. `.why`: thưởng càng xa nhân γ lũy thừa càng cao → giảm giá trị.
- **② Cộng → Return** — `G = 1 + 0 + 0.5 = __` → 1.5. `.hint`: G là **tổng có trọng số** giảm dần theo thời gian.
- **③ Đổi γ** — với γ=0.9: `G = 1 + 0 + 0.81·2 = __` → 2.62. `.why`: γ lớn coi trọng thưởng xa hơn → G lớn hơn; γ định "tầm nhìn" của agent.
- **④ Vì sao chiết khấu** · pill `hội tụ + ưu tiên` — `.note`: γ<1 làm tổng **hữu hạn** dù chuỗi vô hạn, và ưu tiên thưởng sớm (bất định tương lai). RL = tìm chính sách tối đa **E[G]**. SVG: cột thưởng giảm dần theo γᵏ.

## 5. Tự kiểm tra (`.quiz`)
1. γ gần 0 khiến agent thế nào? → `.qa` **Thiển cận — chỉ quan tâm thưởng tức thời.**
2. Vì sao cần chiết khấu? → `.qa` **Giữ tổng hữu hạn & ưu tiên thưởng sớm (tương lai bất định).**

## 6. Rút ra
> **Rút ra.** Return = Σγᵏrₜ₊ₖ; γ định tầm nhìn & đảm bảo hữu hạn. RL tối đa E[G]. Bài tiếp (K2): ước lượng giá trị bằng phương trình Bellman.

## 7. `data-q` & số mẫu
- Sinh chuỗi thưởng nguyên nhỏ; γ ∈ {0.5, 0.9}; tính G.
- Khóa: `r1..r3`, `gamma`; `g1,g2,g3`, `G`.

## Phụ lục — số mẫu
| γ | G |
|---|---|
| 0.5 | 1.5 |
| 0.9 | 2.62 |
