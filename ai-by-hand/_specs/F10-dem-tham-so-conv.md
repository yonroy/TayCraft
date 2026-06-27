# SPEC — F10 · Đếm tham số một lớp conv (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `F10-dem-tham-so-conv` · English *Conv param count* · ~11 phút.
> Tiền đề: F3 (conv đa kênh), F4 (nhiều filter), C9 (đếm tham số FC).

## 1. Định vị
Tính số tham số một lớp conv: `(K·K·Cin + 1)·Cout`. So sánh **tiết kiệm tham số khủng** của conv so với lớp fully-connected.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Conv chia sẻ **cùng một filter trượt khắp ảnh** → ít tham số bất kể ảnh lớn nhỏ. Biết đếm để hiểu vì sao
  CNN gọn hơn MLP hàng nghìn lần trên ảnh, và để ước lượng bộ nhớ/tốc độ.
- `.formula`:
  ```
  params(conv) = (K·K·Cin + 1)·Cout      (kernel K×K trên Cin kênh + 1 bias, lặp cho Cout filter)
  ```

## 3. Trực giác (`.intuition`)
> Một filter = một **khối nhỏ K×K×Cin** dùng lại ở **mọi vị trí** ảnh → số tham số **không phụ thuộc kích thước ảnh** (khác FC).
> Có Cout filter thì nhân lên Cout, cộng Cout bias.

## 4. Các bước
- **⓪ Cho sẵn** · pill `3×3, 3→4`: kernel 3×3, Cin = 3 kênh vào, Cout = 4 filter. (`.cell.given`)
- **① Tham số một filter** — `K·K·Cin = 3·3·3 = __ (27) ; + 1 bias = __` → 28. `.why`: một filter là khối 3×3×3 = 27 trọng số + 1 bias.
- **② Nhân số filter** — `28·Cout = 28·4 = __` → 112. `.hint`: mỗi filter có bias riêng → +Cout, không phải +1.
- **③ So với fully-connected** — ảnh 32×32×3 → 4 kênh ra cùng kích thước qua FC cần `(3072)·(4·1024)` ≈ **12.6 triệu** tham số; conv chỉ **112**.
  `.why`: chia sẻ trọng số (cùng filter khắp ảnh) → tiết kiệm khổng lồ & bất biến tịnh tiến.
- **④ Phụ thuộc gì** · pill `không phụ thuộc H,W` — `.note`: số tham số conv chỉ phụ thuộc K, Cin, Cout — **không** phụ thuộc kích thước ảnh. SVG: filter 3×3×3
  trượt khắp ảnh (dùng lại).

## 5. Tự kiểm tra (`.quiz`)
1. Tham số conv có phụ thuộc kích thước ảnh không? → `.qa` **Không — chỉ phụ thuộc K, Cin, Cout.**
2. Vì sao conv ít tham số hơn FC nhiều? → `.qa` **Chia sẻ cùng filter ở mọi vị trí (weight sharing).**

## 6. Rút ra
> **Rút ra.** params = (K²·Cin + 1)·Cout, độc lập kích thước ảnh; weight sharing giúp CNN cực gọn. Hết Phần F (CNN). Sang Phần G —
> Bài tiếp (21): RNN một bước hồi quy.

## 7. `data-q` & số mẫu
- Sinh K, Cin, Cout nhỏ; tính params từng filter & tổng.
- Khóa: `K, Cin, Cout`; `perFilter`, `total`.

## Phụ lục — số mẫu (3×3, 3→4)
| | KQ |
|---|---|
| 1 filter | 27 + 1 = 28 |
| tổng | 112 |
