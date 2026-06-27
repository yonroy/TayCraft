# SPEC — I9 · Repetition penalty / logit bias (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `I9-repetition-penalty` · English *Repetition penalty* · ~11 phút.
> Tiền đề: I2 (sampling), I8 (decode). Dùng bảng eˣ.

## 1. Định vị
Chống LLM **lặp lại** chính nó: hạ logit của các token **đã xuất hiện** trước khi softmax → giảm xác suất chọn lại.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Greedy/sampling dễ rơi vào vòng lặp ("rất rất rất…"). Repetition penalty & logit bias là cách **can thiệp
  trực tiếp** vào logits để ép đa dạng hoặc cấm/khuyến khích token cụ thể — công cụ điều khiển đầu ra thực dụng.
- `.formula`:
  ```
  logit bias:  z'ₖ = zₖ + biasₖ      repetition penalty: token đã dùng → hạ logit (vd z/p, p>1)
  ```

## 3. Trực giác (`.intuition`)
> Trước khi bốc thăm token kế, **đánh thuế** các token vừa nói → chúng khó được chọn lại → câu bớt lặp. Hoặc **cộng/trừ điểm** thẳng
> vào một token (logit bias) để cấm (−∞) hay ưu ái nó.

## 4. Các bước
- **⓪ Cho sẵn + bảng eˣ** · pill `3 token`: logits z = (2, 1, 3); token C (chỉ số 3, logit 3) **đã sinh** ở bước trước; phạt: hạ logit token đã dùng đi 1 (bias −1). Bảng: e⁰=1, e¹=2.72, e²=7.39. (`.cell.given`)
- **① Áp phạt** — `z' = (2, 1, 3−1) = (__, __, __)` → (2, 1, 2). `.why`: chỉ token đã dùng (C) bị hạ → bớt được chọn lại.
- **② Softmax sau phạt** — `e=(7.39, 2.72, 7.39), Σ=17.5 → p = (__, __, __)` → (0.42, 0.16, 0.42). `.hint`: trước phạt C áp đảo (logit 3); sau phạt A và C ngang nhau.
- **③ So với không phạt** — không phạt: p(C)=0.67; có phạt: p(C)=0.42 → **giảm** khả năng lặp C. `.why`: can thiệp logit đổi hẳn phân phối chọn.
- **④ logit bias / cấm token** · pill `+∞ / −∞` — `.note`: đặt bias = −∞ để **cấm** một token; +lớn để ép chọn. Dùng cho an toàn nội dung, ép định dạng, tránh lặp. SVG: cột logit trước/sau phạt.

## 5. Tự kiểm tra (`.quiz`)
1. Repetition penalty tác động ở đâu? → `.qa` **Vào logits (trước softmax) — hạ token đã xuất hiện.**
2. Cấm hẳn một token bằng cách nào? → `.qa` **Đặt logit bias = −∞ (xác suất → 0).**

## 6. Rút ra
> **Rút ra.** Hạ logit token đã dùng (hoặc logit bias) → giảm lặp / điều khiển đầu ra. Bài tiếp (I10): định dạng hội thoại thành token — chat template.

## 7. `data-q` & số mẫu
- Sinh logits rơi mốc bảng eˣ; token đã dùng + mức phạt; softmax trước/sau.
- Khóa: `z1..z3`, `used`; `zp1..zp3`, `p1..p3`, `pNoPen`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| z sau phạt | (2, 1, 2) |
| p sau phạt | (0.42, 0.16, 0.42) |
| p(C) trước/sau | 0.67 → 0.42 |
