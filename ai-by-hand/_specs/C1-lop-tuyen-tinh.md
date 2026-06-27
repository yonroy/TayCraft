# SPEC — C1 · Lớp tuyến tính y = Wx + b (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `03-lop-tuyen-tinh` · English *Linear layer* · ~13 phút.
> Tiền đề: 01 (tích vô hướng), 02 (nhân ma trận), A8 (ma trận×vectơ). **Đã có phiếu** — spec để nâng cấp/tái tạo.

## 1. Định vị
Khối cơ bản nhất của mạng nơ-ron: `y = Wx + b`. Gộp **nhiều nơ-ron** (mỗi hàng W) thành một phép ma trận × vectơ + bias.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Mọi mạng (MLP, Transformer) chồng các lớp tuyến tính xen kẽ phi tuyến. Một lớp = **biến đổi không gian**
  đặc trưng (xoay/co + dịch). Nắm nó là nắm "viên gạch" của toàn bộ deep learning.
- `.formula`:
  ```
  y = W·x + b      W là (out×in), x là (in), b là (out) → y là (out)
  yᵢ = (hàng i của W)·x + bᵢ
  ```

## 3. Trực giác (`.intuition`)
> W **xoay & co giãn** không gian đầu vào, b **dịch** nó đi. Mỗi hàng W là một nơ-ron "chấm điểm" x theo cách riêng; bias là
> ngưỡng nền của nơ-ron đó.

## 4. Các bước
- **⓪ Cho sẵn** · pill `W 2×3, x, b`: W = [[1,0,2],[−1,3,0]], x = (2,1,1), b = (1, −2). (`.cell.given`)
- **① Nơ-ron 1 (hàng 1)** — `y₁ = (1·2 + 0·1 + 2·1) + 1 = __` → 5. `.why`: hàng W·x là tích vô hướng (Bài 01); cộng bias dịch kết quả.
- **② Nơ-ron 2 (hàng 2)** — `y₂ = (−1·2 + 3·1 + 0·1) + (−2) = __` → −1.
- **③ Gom thành y** — `y = (__, __)` → (5, −1). `.hint`: kích thước y = số hàng W = số nơ-ron lớp.
- **④ Ý nghĩa biến đổi** · pill `xoay + dịch` — `.note`: bỏ b thì y = Wx là biến đổi tuyến tính qua gốc (Bài 02); thêm b cho phép
  **dịch khỏi gốc** (affine). Phi tuyến (Bài 04) mới làm mạng "cong" được. SVG: x → [W,b] → y.

## 5. Tự kiểm tra (`.quiz`)
1. Số chiều của y phụ thuộc cái gì? → `.qa` **Số hàng của W (số nơ-ron đầu ra).**
2. Bias b thêm khả năng gì so với chỉ Wx? → `.qa` **Dịch chuyển đầu ra khỏi gốc (biến đổi affine).**

## 6. Rút ra
> **Rút ra.** Lớp tuyến tính = ma trận×vectơ + bias = nhiều nơ-ron song song. Chồng tuyến tính vẫn ra tuyến tính → cần **hàm
> kích hoạt** (Bài 04) để mạng học quan hệ phi tuyến.

## 7. `data-q` & số mẫu
- Sinh W (2×3), x (3), b (2) nguyên nhỏ; tính y trong generate().
- Khóa: `w11..w23`, `x1..x3`, `b1,b2`; `y1,y2`; biểu thức từng hàng qua `sumExpr`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| y₁ | 5 |
| y₂ | −1 |
| y | (5, −1) |
