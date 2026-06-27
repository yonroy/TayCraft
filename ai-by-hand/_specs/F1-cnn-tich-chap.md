# SPEC — F1 · CNN — một bộ lọc (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `16-cnn-tich-chap` · English *Convolution* · ~13 phút.
> Tiền đề: 01 (tích vô hướng). **Đã có phiếu** — spec để nâng cấp/tái tạo. Mở đầu mạch CNN (Phần F).

## 1. Định vị
Phép **tích chập**: trượt một filter nhỏ khắp ảnh, mỗi vị trí tính một tích vô hướng → bản đồ "đặc trưng xuất hiện ở đâu".

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Lớp fully-connected bỏ qua cấu trúc không gian và tốn tham số khủng cho ảnh. Conv khai thác **tính cục bộ**
  (đặc trưng nằm trong vùng nhỏ) và **chia sẻ trọng số** (cùng filter khắp ảnh) → ít tham số, bất biến tịnh tiến.
- `.formula`:
  ```
  out(i,j) = Σ_{u,v} K(u,v)·X(i+u, j+v) + b      (filter trượt theo i, j)
  ```

## 3. Trực giác (`.intuition`)
> Filter như một **khuôn dò mẫu** (cạnh, góc…). Trượt khắp ảnh, ở đâu vùng ảnh "khớp khuôn" thì cho số lớn → bản đồ đặc trưng sáng ở
> đó. Cùng một khuôn dùng khắp nơi → học một lần, dùng mọi chỗ.

## 4. Các bước
- **⓪ Cho sẵn** · pill `ảnh 3×3, kernel 2×2`: X = [[1,2,0],[3,4,1],[0,1,2]]; K = [[1,0],[0,1]] (đường chéo); b = 0; stride 1. (`.cell.given`)
- **① Tích chập ở góc trên-trái** — cửa sổ [[1,2],[3,4]] · K: `1·1 + 2·0 + 3·0 + 4·1 = __` → 5. `.why`: đúng một tích vô hướng (Bài 01) giữa khuôn và vùng ảnh.
- **② Trượt sang phải** — cửa sổ [[2,0],[4,1]] · K: `2·1 + 0 + 0 + 1·1 = __` → 3. `.hint`: dịch cửa sổ 1 ô (stride 1), lặp phép chấm.
- **③ Hoàn tất feature map** — 4 vị trí (2×2 đầu ra): `[[5, 3], [?, ?]]` → tính nốt hàng dưới. `.why`: ảnh 3×3, kernel 2×2 → đầu ra **2×2** (công thức Bài F2).
- **④ Vì sao tiết kiệm** · pill `weight sharing` — `.note`: chỉ **4 trọng số** (kernel) dùng cho cả ảnh, bất kể ảnh to. So với FC cần một trọng số cho mỗi cặp pixel.
  Chia sẻ trọng số = ít tham số + bất biến tịnh tiến. SVG: kernel 2×2 trượt trên lưới 3×3.

## 5. Tự kiểm tra (`.quiz`)
1. Conv khai thác hai tính chất nào của ảnh? → `.qa` **Tính cục bộ + chia sẻ trọng số (bất biến tịnh tiến).**
2. Ảnh 3×3, kernel 2×2, stride 1 → đầu ra? → `.qa` **2×2.**

## 6. Rút ra
> **Rút ra.** Conv = trượt filter + tích vô hướng cục bộ; chia sẻ trọng số → gọn & bất biến tịnh tiến. Bài tiếp (Phần F): kích thước
> đầu ra, đa kênh, nhiều filter, pooling…

## 7. `data-q` & số mẫu
- Sinh ảnh 3×3 & kernel 2×2 nguyên nhỏ; tính 4 giá trị feature map.
- Khóa: `x11..x33`, kernel; `o11, o12, o21, o22`.

## Phụ lục — số mẫu
| vị trí | KQ |
|---|---|
| TL | 5 |
| TR | 3 |
