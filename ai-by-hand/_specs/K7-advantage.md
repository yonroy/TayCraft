# SPEC — K7 · Advantage / baseline (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `K7-advantage` · English *Advantage* · ~12 phút.
> Tiền đề: K2 (Bellman/V), K6 (policy gradient).

## 1. Định vị
**Advantage** A = "hành động này tốt hơn **mức trung bình** bao nhiêu" = Q(s,a) − V(s). Dùng thay return G để giảm phương sai gradient.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Return thô G dao động lớn (lúc cao lúc thấp tùy may rủi) → gradient nhiễu. Trừ một **baseline** V(s) cho biết
  "hành động hơn/kém kỳ vọng" → tín hiệu sạch hơn, học nhanh & ổn định. Lõi của A2C, PPO (GAE).
- `.formula`:
  ```
  A(s,a) = Q(s,a) − V(s) ≈ r + γ·V(s') − V(s)   (TD advantage)        ∇J = E[∇log π · A]
  ```

## 3. Trực giác (`.intuition`)
> Không hỏi "hành động này được bao nhiêu điểm" (G — phụ thuộc cả ngữ cảnh), mà hỏi "**hơn mức bình thường** ở đây bao nhiêu" (A). Trừ đi
> "điểm nền" V(s) → chỉ còn phần **do hành động** tạo ra → tín hiệu học bớt nhiễu.

## 4. Các bước
- **⓪ Cho sẵn** · pill `γ=0.9`: r = 1; V(s) = 9; sang s' có V(s') = 10. (`.cell.given`)
- **① Ước lượng giá trị hành động** — `r + γ·V(s') = 1 + 0.9·10 = __` → 10 (≈ Q). `.why`: đây là "thực nhận" sau một bước (TD target).
- **② Advantage** — `A = (r + γV(s')) − V(s) = 10 − 9 = __` → 1. `.hint`: A > 0 → hành động **trên** kỳ vọng; A < 0 → dưới.
- **③ Dùng trong cập nhật** — `θ ← θ + α·A·∇log π` (thay G bằng A). `.why`: baseline V(s) không đổi kỳ vọng gradient (không thiên lệch) nhưng **giảm phương sai** → học ổn.
- **④ Vì sao không thiên lệch** · pill `baseline an toàn` — `.note`: vì E[∇log π · V(s)] = 0 (V(s) không phụ thuộc a), trừ V(s) chỉ bớt nhiễu, không lệch nghiệm. SVG: G dao động rộng vs A quanh 0.

## 5. Tự kiểm tra (`.quiz`)
1. Advantage A đo gì? → `.qa` **Hành động tốt hơn mức trung bình (baseline) bao nhiêu = Q − V.**
2. Trừ baseline ảnh hưởng kỳ vọng gradient không? → `.qa` **Không (không thiên lệch) — chỉ giảm phương sai.**

## 6. Rút ra
> **Rút ra.** A = Q − V ≈ r+γV'−V; thay G bằng A → gradient bớt nhiễu, không lệch. Bài tiếp (K8): cập nhật an toàn bằng PPO clip.

## 7. `data-q` & số mẫu
- Sinh r, γ, V(s), V(s') nguyên nhỏ; tính TD target & advantage.
- Khóa: `r, gamma, Vs, Vnext`; `target, A`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| r + γV(s') | 10 |
| Advantage | 1 |
