# SPEC — K5 · Chính sách ε-greedy (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `K5-epsilon-greedy` · English *ε-greedy* · ~11 phút.
> Tiền đề: K3 (Q-learning), A17 (xác suất).

## 1. Định vị
Cân bằng **khai thác** (chọn hành động tốt nhất) và **khám phá** (thử ngẫu nhiên): với xác suất ε chọn ngẫu nhiên, còn lại chọn argmax Q.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Nếu luôn chọn "tốt nhất hiện biết", agent **không bao giờ khám phá** hành động có thể tốt hơn → kẹt. ε-greedy
  buộc thử ngẫu nhiên một chút → thu thập dữ liệu mới. Đây là cách giải tiến thoái khám phá–khai thác đơn giản nhất.
- `.formula`:
  ```
  P(best) = 1 − ε + ε/n        P(mỗi hành động khác) = ε/n        (n = số hành động)
  ```

## 3. Trực giác (`.intuition`)
> Hầu hết lần đi **đường quen tốt nhất** (khai thác), nhưng thỉnh thoảng (ε) **thử đường lạ** xem có ngon hơn không (khám phá). ε lớn →
> liều, khám phá nhiều; ε nhỏ → bảo thủ. Thường **giảm ε dần** khi đã học đủ.

## 4. Các bước
- **⓪ Cho sẵn** · pill `ε=0.1, n=3`: 3 hành động, Q = (5, 2, 1) → hành động tốt nhất = a₁. (`.cell.given`)
- **① Xác suất hành động tốt nhất** — `1 − ε + ε/n = 0.9 + 0.1/3 = __` → 0.933. `.why`: phần 1−ε chắc chắn khai thác, cộng phần nhỏ ε/n vì khám phá cũng có thể trúng a₁.
- **② Xác suất hành động khác** — `ε/n = 0.1/3 = __` → 0.033 (mỗi a₂, a₃). `.hint`: kiểm tổng: 0.933 + 0.033 + 0.033 = 1 ✓.
- **③ Vai trò ε** — ε=0 → tham lam thuần (không khám phá, dễ kẹt); ε=1 → ngẫu nhiên thuần (không khai thác). `.why`: ε điều tiết đánh đổi; giá trị vừa phải + giảm dần là tốt.
- **④ Vì sao cần khám phá** · pill `tránh kẹt` — `.note`: ước lượng Q ban đầu sai; không thử thì không sửa được. Khám phá thu dữ liệu để Q hội tụ đúng. SVG: cột xác suất (a₁ cao, a₂,a₃ thấp đều).

## 5. Tự kiểm tra (`.quiz`)
1. ε = 0 gây vấn đề gì? → `.qa` **Không khám phá → dễ kẹt ở hành động "tốt nhất hiện biết" (có thể sai).**
2. Tổng xác suất các hành động? → `.qa` **1.**

## 6. Rút ra
> **Rút ra.** ε-greedy: 1−ε khai thác + ε khám phá; ε điều tiết & nên giảm dần. Bài tiếp (K6): học **chính sách trực tiếp** — policy gradient.

## 7. `data-q` & số mẫu
- Sinh ε (bội 0.1), n; Q để xác định best; tính xác suất.
- Khóa: `eps, n`; `pBest, pOther`.

## Phụ lục — số mẫu (ε=0.1, n=3)
| | KQ |
|---|---|
| P(best) | 0.933 |
| P(khác) | 0.033 |
