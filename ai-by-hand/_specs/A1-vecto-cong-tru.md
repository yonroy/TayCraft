# SPEC — A1 · Vectơ: cộng, trừ, nhân vô hướng (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung (2 trang, `data-q`, màu, checklist…): xem `_specs/README.md`. File này = phần **riêng** của phiếu.
> slug `A1-vecto-cong-tru` · English *Vector ops* · ~10 phút · Mức: nhập môn (free).

## 1. Định vị
Viên gạch đầu tiên: máy biểu diễn **mọi dữ liệu là vectơ** (điểm dữ liệu, embedding, trọng số). Ba phép cộng/trừ/scale
là nền của **mọi bước cập nhật trọng số** `w ← w − η·g`. Bản nâng cấp giải-thích = thêm `.intuition` + `.why`/bước + `.quiz`.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Vectơ là "đơn vị dữ liệu" của AI. Cộng/trừ hai vectơ là gộp/đối chiếu hai mẫu; nhân vô hướng
  là **phóng to/thu nhỏ** một vectơ. Một bước học `w ← w − η·g` chính là **trừ vectơ rồi nhân hệ số** — bạn sắp làm bằng tay.
- `.formula`:
  ```
  (a + b)_i = a_i + b_i      (a − b)_i = a_i − b_i      (c · a)_i = c · a_i
  ```

## 3. Trực giác (`.intuition`)
> Vectơ như một **mũi tên** (hoặc danh sách số). **Cộng** = nối đuôi mũi tên này vào đầu mũi tên kia (quy tắc hình bình hành).
> **Nhân vô hướng** = kéo dài (c>1), co lại (0<c<1), hay lật ngược hướng (c<0).

## 4. Các bước
- **⓪ Cho sẵn** · pill `n = 3`: a = (2, −1, 3), b = (1, 4, −2), hệ số c = 2. (`.cell.given`)
- **① a + b** · pill `cộng từng ô` — `.calc`: `(2+1, −1+4, 3+(−2)) = (__, __, __)` → (3, 3, 1).
  `.why`: cộng **từng cặp cùng vị trí**, độc lập theo chiều; vì thế hai vectơ phải **cùng số chiều**.
- **② a − b** · pill `trừ từng ô` — `(2−1, −1−4, 3−(−2)) = (__, __, __)` → (1, −5, 5).
  `.hint`: trừ số âm = cộng → 3 − (−2) = 5.
- **③ c · a** · pill `nhân hệ số` — `2·(2, −1, 3) = (__, __, __)` → (4, −2, 6).
  `.why`: nhân vô hướng **đổi độ dài, không đổi hướng** (trừ khi c<0 thì đảo hướng); đây đúng là động tác "đi một bước theo gradient".
- **④ Góc nhìn 2D** · pill `hình bình hành` — SVG: vẽ a₂=(3,1), b₂=(1,2) màu lam/cam và **a+b=(4,3)** màu tím
  cùng hình bình hành nét đứt. `.calc`: a+b = (3+1, 1+2) = (__, __). `.hint tự kiểm`: mũi tên tổng là **đường chéo** hình bình hành.

## 5. Tự kiểm tra (`.quiz`)
1. Cộng được hai vectơ khác số chiều không? → `.qa` **Không — phải cùng số chiều.**
2. Nhân vô hướng với c = −1 làm gì với mũi tên? → `.qa` **Đảo ngược hướng, giữ độ dài.**

## 6. Rút ra
> **Rút ra.** Ba phép này là **động tác tay nền** của học máy: gộp dữ liệu (cộng), so sánh (trừ), bước cập nhật (scale).
> Bài tiếp (A2): đo **độ lớn** của một vectơ bằng chuẩn.

## 7. `data-q` & số động
- Sinh: `a=[randInt(-4,5)×3]`, `b` tương tự (tránh toàn 0); `c=pick([2,3,-2])`.
- Khóa: `a1..a3, b1..b3, c`, bản `…w` (wrap) cho trừ số âm; kết quả `sum1..3, dif1..3, sc1..3`; cặp 2D `ax,ay,bx,by` + `abx,aby`.
- Vẽ SVG trong `generate()` theo a₂,b₂; gọi vẽ khởi tạo 1 lần.

## Phụ lục — số mẫu
| Phép | Kết quả |
|---|---|
| a+b | (3, 3, 1) |
| a−b | (1, −5, 5) |
| 2·a | (4, −2, 6) |
| a₂+b₂ (2D) | (4, 3) |
