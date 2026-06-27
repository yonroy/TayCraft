# SPEC — A18 · exp & log (dùng bảng tra) (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `A18-exp-log` · English *Exp & Log* · ~12 phút.

## 1. Định vị
eˣ và ln x là hai hàm đứng sau **softmax** và **cross-entropy**. Làm tay được nhờ **bảng tra cho sẵn** trên phiếu.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Softmax dùng eˣ để biến logit thành xác suất dương; cross-entropy dùng ln để phạt dự đoán sai.
  Nắm tính chất exp/log giúp hiểu **vì sao** các công thức đó hoạt động, và tính nhẩm được kết quả.
- `.formula`:
  ```
  e^(a+b) = e^a · e^b      ln(a·b) = ln a + ln b      ln(eˣ) = x      e^(ln x) = x
  ```

## 3. Trực giác (`.intuition`)
> **exp** biến phép cộng thành phép nhân (tăng **rất nhanh**, luôn dương). **log** làm điều ngược lại: nén số lớn lại, biến
> nhân thành cộng. Chúng là **hai chiều của một cánh cửa** — đi qua rồi đi ngược lại thì về chỗ cũ.

## 4. Các bước
- **⓪ Bảng tra cho sẵn** · pill `tra cứu` — bảng (`.cell.given`, KHÔNG để random):
  ```
  x     0     0.5    1      2      3
  eˣ    1     1.65   2.72   7.39   20.1
  ln x  —     ln1=0  ln2=0.69  ln(2.72)=1  ln10=2.30
  ```
- **① Tính eˣ** — `e² = __ (7.39) ; e⁰ = __ (1)`. `.why`: eˣ luôn > 0 → dùng làm "điểm số dương" trong softmax.
- **② Tính ln** — `ln 1 = __ (0) ; ln(2.72) ≈ __ (1)`. `.hint`: ln của số < 1 là **âm** → `−ln p` (loss) luôn ≥ 0.
- **③ Tính chất** — `e^(1+1) = e¹·e¹ = 2.72·2.72 ≈ __ (7.39 = e²) ✓`; `ln(2·... ) = ln2 + ln... `.
  `.why`: nhờ "cộng↔nhân", softmax/CE rút gọn được; ln(eˣ)=x là lý do log-softmax gọn.
- **④ Xem trước softmax/CE** · pill `ứng dụng` — `.note`: softmax(z)ₖ = e^zₖ / Σ e^zⱼ; cross-entropy = −ln(p lớp đúng).
  Ví dụ tra bảng: `−ln(0.37) ≈ 1` (dự đoán đúng với xác suất 0.37 tốn ~1 nat loss).

## 5. Tự kiểm tra (`.quiz`)
1. ln 1 = ? và e⁰ = ? → `.qa` **ln 1 = 0 ; e⁰ = 1.**
2. log có "đảo" exp không? ln(eˣ) = ? → `.qa` **Có — chúng là hàm ngược; ln(eˣ) = x.**

## 6. Rút ra
> **Rút ra.** exp tạo số dương (softmax), log nén & phạt (cross-entropy); "cộng↔nhân" là tính chất ta sẽ xài liên tục.
> Bài tiếp (A19): **chuẩn hóa dữ liệu** (min-max & z-score) — đưa số về thang chuẩn trước khi đưa vào mô hình.

## 7. `data-q` & số động
- Bảng tra **cố định** (không random). Phần random: chọn vài x từ cột bảng để hỏi (vd `pick` các mốc đã có trong bảng) →
  đảm bảo luôn tra được, không ra số lạ.
- Khóa: các ô đáp án eˣ/ln theo mốc đã chọn; ví dụ −ln(p) với p lấy từ bảng.

## Phụ lục — số mẫu (bảng tra)
| x | 0 | 0.5 | 1 | 2 | 3 |
|---|---|---|---|---|---|
| eˣ | 1 | 1.65 | 2.72 | 7.39 | 20.1 |
| ln x | — | ln2=0.69 | ln(2.72)=1 | — | ln10=2.30 |
