# SPEC — B1 · Hồi quy tuyến tính 1 biến (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `B1-hoi-quy-tuyen-tinh` · English *Linear regression* · ~13 phút.
> Tiền đề: A1 (vectơ), A12 (đạo hàm). Mở đầu Phần B (ML cổ điển).

## 1. Định vị
Tìm **đường thẳng khớp nhất** một đám điểm: `y = w·x + b`. Mô hình học máy đơn giản nhất — đặt nền cho mọi mô hình "khớp dữ liệu".

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** "Học" trong ML = **chọn tham số** để dự đoán khớp dữ liệu. Hồi quy tuyến tính cho thấy trọn vòng:
  có dữ liệu → chọn w, b → đo sai số → đó cũng là khung của một nơ-ron sau này.
- `.formula`:
  ```
  ŷ = w·x + b      w = Σ(xᵢ−x̄)(yᵢ−ȳ) / Σ(xᵢ−x̄)²      b = ȳ − w·x̄
  ```

## 3. Trực giác (`.intuition`)
> Đặt một **cây thước** lên đám điểm sao cho tổng "khoảng hụt" nhỏ nhất. Độ dốc w cho biết x tăng 1 thì y tăng mấy; b là
> điểm cắt trục y. Công thức trên chính là vị trí thước **tối ưu** (bình phương nhỏ nhất).

## 4. Các bước
- **⓪ Cho sẵn** · pill `3 điểm`: (1, 1), (2, 3), (3, 5). (`.cell.given`)
- **① Trung bình** — `x̄ = (1+2+3)/3 = __ (2) ; ȳ = (1+3+5)/3 = __ (3)`. `.why`: hồi quy "xoay quanh" điểm trung bình (x̄, ȳ).
- **② Độ dốc w** — `tử = Σ(x−2)(y−3) = (−1)(−2)+0+1·2 = __ (4) ; mẫu = Σ(x−2)² = 1+0+1 = __ (2)`; `w = 4/2 = __` → 2.
  `.why`: tử số đo "x và y cùng lệch khỏi trung bình thế nào" (hiệp phương sai); chia cho độ trải của x → độ dốc.
- **③ Chặn b & dự đoán** — `b = ȳ − w·x̄ = 3 − 2·2 = __` → −1 → đường `y = 2x − 1`; dự đoán x=4: `ŷ = __` → 7.
  `.hint`: thử lại 3 điểm: 2·1−1=1 ✓, 2·2−1=3 ✓, 2·3−1=5 ✓ (khớp hoàn hảo → MSE = 0).
- **④ Hình** · pill `đường khớp` — SVG: 3 điểm + đường y=2x−1. `.note`: phần dư (điểm − đường) ở đây = 0; dữ liệu thật thường
  có dư ≠ 0, và ta tối thiểu hóa **tổng bình phương dư** (MSE, Bài D1).

## 5. Tự kiểm tra (`.quiz`)
1. w cho biết điều gì về quan hệ x–y? → `.qa` **Độ dốc: x tăng 1 đơn vị thì ŷ đổi w đơn vị.**
2. Vì sao bình phương sai số (không phải trị tuyệt đối)? → `.qa` **Phạt mạnh sai lớn & có công thức đóng (đạo hàm gọn).**

## 6. Rút ra
> **Rút ra.** Hồi quy tuyến tính = chọn w, b tối thiểu sai số bình phương; đây là "nguyên tử" của học có giám sát. Bài tiếp
> (B2): nhiều đặc trưng → `ŷ = w·x + b` với x là vectơ.

## 7. `data-q` & số mẫu
- Sinh dữ liệu **thẳng hàng có nhiễu nhỏ** hoặc thẳng hàng hoàn hảo (chọn w,b nguyên rồi sinh y) để số đẹp; kiểm mẫu ≠ 0.
- Khóa: `x1..x3, y1..y3`; `xb, yb`; `numw, denw, w, b`; `pred4`.

## Phụ lục — số mẫu
| | KQ | | |
|---|---|---|---|
| x̄, ȳ | 2, 3 | w | 2 |
| b | −1 | ŷ(4) | 7 |
