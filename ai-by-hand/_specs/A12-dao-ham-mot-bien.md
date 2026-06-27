# SPEC — A12 · Đạo hàm một biến (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `A12-dao-ham-mot-bien` · English *Derivatives* · ~12 phút.

## 1. Định vị
Đo **độ dốc** của hàm tại một điểm — viên gạch của **gradient descent**. Sang phần giải tích sau dãy đại số tuyến tính.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Học máy = **đi xuống dốc** của hàm mất mát. Để biết đi hướng nào và bước bao nhiêu, cần **độ dốc** —
  chính là đạo hàm. Một biến trước, nhiều biến (gradient) sau.
- `.formula`:
  ```
  d/dx (xⁿ) = n·x^(n−1)      d/dx (c) = 0      (f ± g)' = f' ± g'      (c·f)' = c·f'
  ```

## 3. Trực giác (`.intuition`)
> Đạo hàm tại x là **độ dốc của đường tiếp tuyến** ở đó: dốc **dương** → hàm đang đi lên, **âm** → đi xuống, **bằng 0** →
> đỉnh/đáy bằng phẳng. Nó trả lời "nhích x một chút thì f đổi nhanh cỡ nào?".

## 4. Các bước
- **⓪ Cho sẵn** · pill `đa thức`: f(x) = 3x² − 2x + 5. (`.cell.given`)
- **① Đạo hàm từng số hạng** — `3x² → __ ; −2x → __ ; 5 → __` → 6x, −2, 0. Gom: `f'(x) = 6x − 2`.
  `.why`: quy tắc lũy thừa hạ bậc nhân hệ số; hằng số không đổi nên đạo hàm = 0.
- **② Tính tại x₀ = 2** — `f'(2) = 6·2 − 2 = __` → 10. `.hint`: thay số **sau** khi đã có công thức f'.
- **③ Ý nghĩa dấu** — `f'(2) = 10 > 0 → tại x=2 hàm đang __ (tăng)`. `.why`: dốc dương ⇒ tăng x làm f tăng → muốn **giảm** f thì đi **ngược** dấu đạo hàm.
- **④ Hình học** · pill `tiếp tuyến` — SVG: parabol f, điểm (2, f(2)) và đường tiếp tuyến độ dốc 10. `.note`: gradient descent
  `x ← x − η·f'(x)` đẩy x về phía đáy (đạo hàm → 0).

## 5. Tự kiểm tra (`.quiz`)
1. Đạo hàm của một hằng số bằng bao nhiêu? → `.qa` **0.**
2. f'(x₀) < 0 cho biết điều gì? → `.qa` **Hàm đang giảm tại x₀ (dốc xuống).**

## 6. Rút ra
> **Rút ra.** Đạo hàm = độ dốc; dấu của nó cho hướng đi, độ lớn cho bước. Đó là toàn bộ ý của gradient descent một biến.
> Bài tiếp (A13): khi hàm **lồng nhau**, tính đạo hàm bằng **quy tắc chuỗi** — gốc của backprop.

## 7. `data-q` & số động
- Sinh hệ số `a,b,c` nguyên nhỏ cho f = a·x² + b·x + c; điểm x₀ nguyên nhỏ.
- Khóa: `a,b,c`, `x0`; `fp_x` (chuỗi "6x − 2"); `fp_val`; dấu/kết luận tăng-giảm.

## Phụ lục — số mẫu
| | Kết quả |
|---|---|
| f(x) | 3x² − 2x + 5 |
| f'(x) | 6x − 2 |
| f'(2) | 10 (đang tăng) |
