# SPEC — F8 · Transposed conv (upsampling) (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `F8-transposed-conv` · English *Transposed conv* · ~12 phút.
> Tiền đề: 16 (conv), F2 (kích thước).

## 1. Định vị
Phép "conv ngược" để **phóng to** feature map (upsample). Mỗi pixel vào **rải** kernel ra vùng lớn hơn, các vùng chồng nhau **cộng dồn**.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Bộ giải mã (decoder) của U-Net, GAN, autoencoder cần **tăng độ phân giải** từ đặc trưng nhỏ về ảnh lớn.
  Transposed conv làm việc đó **có học được** (khác nội suy cố định) — học cách "vẽ thêm chi tiết".
- `.formula`:
  ```
  out = ⊕ (xᵢ · kernel) đặt theo stride (overlap-add)      out_size = (in−1)·S − 2P + K
  ```

## 3. Trực giác (`.intuition`)
> Conv thường: nhiều pixel → một số (thu nhỏ). Transposed: **một pixel → một mảng** (kernel nhân giá trị pixel), trượt theo stride và
> **cộng chỗ chồng lấn**. Như "tô vết" rộng ra rồi đắp các vết lên nhau.

## 4. Các bước
- **⓪ Cho sẵn (1D cho gọn)** · pill `stride 2`: đầu vào x = (2, 3); kernel k = (1, 1). (`.cell.given`)
- **① Rải pixel x₀ = 2** — `2·(1,1) = (2, 2)` đặt ở vị trí 0–1. `.why`: mỗi giá trị vào nhân toàn bộ kernel → "nở" thành một mảng.
- **② Rải pixel x₁ = 3 (lệch stride 2)** — `3·(1,1) = (3, 3)` đặt ở vị trí 2–3. `.hint`: stride quyết định khoảng cách giữa các vết rải.
- **③ Cộng dồn (overlap-add)** — ghép: vị trí 0..3 = `(2, 2, 3, 3)`; độ dài ra `= (2−1)·2 + 2 = __` → 4. `.why`: đầu vào dài 2 → đầu ra dài 4 (phóng to ×2);
  nếu vết chồng nhau thì cộng lại.
- **④ Lưu ý "checkerboard"** · pill `artifact` — `.note`: kernel & stride không khớp → vết chồng không đều → **ô bàn cờ** lốm đốm. Khắc phục: chọn K chia hết S,
  hoặc dùng **upsample + conv** thay thế. SVG: 2 pixel rải kernel → cộng thành 4 ô.

## 5. Tự kiểm tra (`.quiz`)
1. Transposed conv làm gì với kích thước? → `.qa` **Phóng to (upsample) feature map.**
2. Vì sao có hiện tượng checkerboard? → `.qa` **Vết kernel chồng không đều khi K không chia hết stride.**

## 6. Rút ra
> **Rút ra.** Transposed conv = rải kernel theo pixel + overlap-add → upsample có học được. Bài tiếp (F9): đường tắt residual giúp
> mạng rất sâu học được.

## 7. `data-q` & số mẫu
- Sinh đầu vào 1D ngắn + kernel + stride; rải & cộng dồn; tính out_size.
- Khóa: `x1,x2`, kernel; `o1..o4`, `outSize`.

## Phụ lục — số mẫu (1D)
| | KQ |
|---|---|
| rải x₀ | (2, 2) @ 0–1 |
| rải x₁ | (3, 3) @ 2–3 |
| đầu ra | (2, 2, 3, 3), dài 4 |
