# SPEC — A10 · Hệ phương trình tuyến tính 2×2 (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `A10-he-phuong-trinh` · English *Linear system* · ~13 phút.
> Tiền đề: A8 (ma trận × vectơ), A9 (định thức).

## 1. Định vị
Giải `Ax = b` cho ẩn x bằng **khử Gauss** với số thật. Nền của bình phương nhỏ nhất, cân bằng, và mọi nơi cần "tìm trọng số".

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Rất nhiều bài toán quy về "tìm bộ số thỏa đồng thời nhiều ràng buộc" — đó là **hệ phương trình**.
  Hồi quy tuyến tính (B1) giải đúng một hệ như vậy. Làm tay một hệ 2×2 giúp thấy cơ chế.
- `.formula`:
  ```
  a₁x + b₁y = c₁
  a₂x + b₂y = c₂      ⇔   A·[x, y]ᵀ = [c₁, c₂]ᵀ
  ```

## 3. Trực giác (`.intuition`)
> Mỗi phương trình là một **đường thẳng** trên mặt phẳng. **Nghiệm** = **giao điểm** hai đường. Hai đường cắt nhau → một
> nghiệm; song song → vô nghiệm; trùng nhau → vô số nghiệm.

## 4. Các bước
- **⓪ Cho sẵn** · pill `hệ 2×2`: `2x + y = 5` và `x + 3y = 10`. (`.cell.given`)
- **① Khử một ẩn** — nhân pt2 với 2: `2x + 6y = 20`; trừ pt1: `(6−1)y = 20−5 → 5y = __` → 15.
  `.why`: nhân để **hệ số x bằng nhau** rồi trừ → x biến mất, còn một ẩn một phương trình.
- **② Tìm y rồi thế ngược** — `y = 15/5 = __` → 3; thế vào pt1: `2x + 3 = 5 → x = __` → 1.
  `.hint`: thế vào phương trình **đơn giản hơn** cho nhẹ tính.
- **③ Thử lại** · pill `kiểm` — `2·1 + 3 = __ (=5 ✓) ; 1 + 3·3 = __ (=10 ✓)`. `.why`: nghiệm đúng phải thỏa **cả hai** phương trình.
- **④ Hình học** · pill `giao 2 đường` — SVG: vẽ hai đường thẳng trên lưới, đánh dấu giao điểm (1, 3). `.note`: nếu hai
  đường **song song** (det A = 0) thì **vô nghiệm**; A9 cho biết điều đó qua định thức.

## 5. Tự kiểm tra (`.quiz`)
1. Khi nào hệ **vô nghiệm**? → `.qa` **Khi hai đường song song (det A = 0, vế phải không khớp).**
2. Nghiệm của hệ tương ứng với điều gì trên hình? → `.qa` **Giao điểm của hai đường thẳng.**

## 6. Rút ra
> **Rút ra.** Khử Gauss = biến hệ thành một ẩn rồi thế ngược; nghiệm là giao điểm hình học. Định thức (A9) báo trước có
> nghiệm duy nhất hay không. Bài tiếp (A11): trị riêng — hướng mà ma trận **không xoay**, chỉ co giãn.

## 7. `data-q` & số động
- Sinh hệ có **nghiệm nguyên**: chọn nghiệm (x,y) nguyên trước rồi tạo hệ số `a,b` ngẫu nhiên → tính `c = a·x + b·y`.
  Kiểm det ≠ 0 (hai pt không song song).
- Khóa: `a1,b1,c1,a2,b2,c2`; bước khử `mul, ycoef, yrhs`; `xsol, ysol`; 2 ô kiểm.

## Phụ lục — số mẫu
| | Kết quả |
|---|---|
| Hệ | 2x+y=5 ; x+3y=10 |
| y | 3 |
| x | 1 |
| Thử lại | 5 ✓ ; 10 ✓ |
