# SPEC — K3 · Q-learning — một cập nhật (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `K3-q-learning` · English *Q-learning* · ~13 phút.
> Tiền đề: K2 (Bellman), 10 (một bước học).

## 1. Định vị
Học bảng Q từ kinh nghiệm: kéo Q(s,a) về phía **mục tiêu Bellman** `r + γ·maxQ'` từng bước. **Off-policy** (dùng max).

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Q-learning học giá trị hành động **chỉ từ trải nghiệm** (s,a,r,s'), không cần mô hình môi trường. Hội tụ về Q tối
  ưu → chính sách tối ưu = chọn argmax Q. Là gốc của Deep Q-Network (DQN).
- `.formula`:
  ```
  Q(s,a) ← Q(s,a) + α·[ r + γ·maxₐ' Q(s',a') − Q(s,a) ]      (TD error trong ngoặc)
  ```

## 3. Trực giác (`.intuition`)
> Mỗi trải nghiệm cho một **ước lượng mới** (mục tiêu Bellman). Q cũ có thể sai → kéo nó **một phần α** về phía mục tiêu. Phần trong ngoặc
> là "ngạc nhiên" (TD error): dương thì nâng Q, âm thì hạ.

## 4. Các bước
- **⓪ Cho sẵn** · pill `α=0.5, γ=0.9`: Q(s,a) hiện = 2; trải nghiệm: r = 1, sang s' có maxₐ' Q(s',a') = 4. (`.cell.given`)
- **① Mục tiêu Bellman** — `r + γ·maxQ' = 1 + 0.9·4 = __` → 4.6. `.why`: đây là ước lượng tốt hơn cho Q(s,a) dựa trên trải nghiệm.
- **② TD error** — `δ = mục tiêu − Q = 4.6 − 2 = __` → 2.6. `.hint`: δ là "ngạc nhiên" — Q hiện thấp hơn thực tế.
- **③ Cập nhật** — `Q ← 2 + 0.5·2.6 = __` → 3.3. `.why`: đi **một phần α** về mục tiêu (không nhảy hẳn) → mượt, ổn định trước nhiễu.
- **④ Off-policy** · pill `dùng max` — `.note`: Q-learning dùng **maxₐ'** (hành động tốt nhất giả định) bất kể agent thực sự làm gì → off-policy. SARSA (K4) dùng hành động **thật** đã chọn → on-policy. SVG: Q kéo về mục tiêu theo α.

## 5. Tự kiểm tra (`.quiz`)
1. TD error đo gì? → `.qa` **Chênh lệch giữa mục tiêu Bellman và Q hiện tại ("ngạc nhiên").**
2. Vì sao Q-learning là off-policy? → `.qa` **Dùng maxₐ' Q' (hành động tốt nhất), không phải hành động agent thực hiện.**

## 6. Rút ra
> **Rút ra.** Q-learning: Q ← Q + α·(r+γmaxQ'−Q); off-policy, gốc của DQN. Bài tiếp (K4): biến thể on-policy — SARSA.

## 7. `data-q` & số mẫu
- Sinh Q, α, γ, r, maxQ' nguyên/nhỏ; tính mục tiêu, δ, Q mới.
- Khóa: `Q, alpha, gamma, r, maxQ`; `target, td, Qnew`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| mục tiêu | 4.6 |
| TD error | 2.6 |
| Q mới | 3.3 |
