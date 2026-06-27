# SPEC — C9 · Đếm tham số mạng (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `C9-dem-tham-so` · English *Parameter counting* · ~11 phút.
> Tiền đề: 03 (lớp tuyến tính), 06/07 (lớp, MLP).

## 1. Định vị
Đếm **tổng số trọng số + bias** của một mạng fully-connected. Kỹ năng "đọc kích cỡ mô hình" (vì sao GPT có tỉ tham số).

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Số tham số quyết định **bộ nhớ, tốc độ, nguy cơ overfit**. Biết đếm giúp ước lượng chi phí một kiến
  trúc và hiểu vì sao mô hình lớn cần nhiều dữ liệu/điện.
- `.formula`:
  ```
  Một lớp (in → out):  params = in·out (trọng số) + out (bias)
  Tổng = Σ qua mọi lớp
  ```

## 3. Trực giác (`.intuition`)
> Mỗi nơ-ron ở lớp sau **nối tới mọi** nơ-ron lớp trước → một trọng số cho mỗi dây; cộng thêm **một bias** cho mỗi nơ-ron.
> Lớp càng rộng và nối càng dày, số dây (tham số) phình theo **tích** in × out.

## 4. Các bước
- **⓪ Cho sẵn** · pill `3 → 4 → 2`: mạng có đầu vào 3, một lớp ẩn 4 nơ-ron, đầu ra 2 nơ-ron. (`.cell.given`)
- **① Lớp 1 (3 → 4)** — `trọng số = 3·4 = __ (12) ; bias = __ (4) ; cộng = __` → 16.
  `.why`: 4 nơ-ron, mỗi nơ-ron có 3 trọng số (một cho mỗi đầu vào) + 1 bias.
- **② Lớp 2 (4 → 2)** — `4·2 = __ (8) ; bias = __ (2) ; cộng = __` → 10.
- **③ Tổng mạng** — `16 + 10 = __` → 26. `.hint`: cộng tham số mọi lớp; đừng quên **bias** (out cái mỗi lớp).
- **④ Quy mô thực** · pill `vì sao tỉ tham số` — `.note`: một lớp 1000→1000 đã có ~1 triệu tham số (10⁶). Xếp hàng trăm lớp rộng
  4096 + embedding khổng lồ → hàng tỉ. SVG: sơ đồ 3-4-2 với số dây.

## 5. Tự kiểm tra (`.quiz`)
1. Lớp in→out có bao nhiêu bias? → `.qa` **out (một bias mỗi nơ-ron đầu ra).**
2. Yếu tố nào làm tham số tăng nhanh nhất? → `.qa` **Tích in×out — lớp rộng nối dày.**

## 6. Rút ra
> **Rút ra.** Tham số mỗi lớp = in·out + out; tổng cộng dồn. Đây là "thước đo cỡ" mô hình. Hết Phần C nền; sang K2 — Bài tiếp
> (D1): đo sai số bằng MSE/MAE.

## 7. `data-q` & số mẫu
- Sinh kích thước các lớp (số nhỏ); tính params từng lớp & tổng.
- Khóa: `n0,n1,n2`; `w1,b1,L1`, `w2,b2,L2`, `total`.

## Phụ lục — số mẫu
| Lớp | params |
|---|---|
| 3→4 | 16 |
| 4→2 | 10 |
| Tổng | 26 |
