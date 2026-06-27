# SPEC — A11 · Trị riêng / vectơ riêng 2×2 (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `A11-tri-rieng` · English *Eigen* · ~14 phút.
> Tiền đề: A9 (định thức), A10 (giải hệ).

## 1. Định vị
Hướng mà ma trận **chỉ co giãn, không xoay** (vectơ riêng), kèm hệ số co giãn (trị riêng). Nền của **PCA** (trục chính),
phân tích ổn định, spectral methods.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Một biến đổi tuyến tính làm rối mọi mũi tên, nhưng vài hướng đặc biệt **giữ nguyên hướng**, chỉ
  dài/ngắn đi. Tìm được chúng = tìm "trục tự nhiên" của dữ liệu/hệ thống — đó là PCA, là cách ta hiểu một ma trận làm gì.
- `.formula`:
  ```
  A·v = λ·v   (v ≠ 0)      ⇒   det(A − λI) = 0
  λ² − (trace A)·λ + (det A) = 0      trace = a+d, det = ad−bc
  ```

## 3. Trực giác (`.intuition`)
> Nhân A vào hầu hết mũi tên thì chúng **vừa xoay vừa co giãn**. Nhưng có những hướng "ngoan" — nhân A chỉ làm chúng
> **dài ra hay ngắn lại đúng theo đường cũ**. Hướng đó là **vectơ riêng**; tỉ lệ dài/ngắn là **trị riêng λ**.

## 4. Các bước
- **⓪ Cho sẵn** · pill `A 2×2 đối xứng`: A = [[2, 1], [1, 2]]. (`.cell.given`)
- **① trace & det** — `trace = 2+2 = __ (4) ; det = 2·2 − 1·1 = __ (3)`.
  `.why`: hai số này tóm gọn A vào đa thức đặc trưng — không cần khai triển det(A−λI) đầy đủ.
- **② Đa thức đặc trưng & giải λ** — `λ² − 4λ + 3 = 0 → λ = __ , __` → 1 và 3.
  `.hint`: nhẩm nghiệm: tổng nghiệm = trace (4), tích nghiệm = det (3) → (1, 3).
- **③ Vectơ riêng của λ = 3** — giải `(A − 3I)v = 0`: `[[−1,1],[1,−1]]·v = 0 → v = (__, __)` → (1, 1) (hay bội số).
  `.why`: λ làm `A − λI` **suy biến** (det = 0) nên hệ có nghiệm khác 0 — chính là vectơ riêng.
- **④ Hình học** · pill `hướng không xoay` — SVG: vẽ v=(1,1); A·v=(3,3) **cùng đường**, chỉ dài gấp 3. So với một mũi
  tên thường bị xoay. `.note`: λ = 1 ⇒ hướng (1,−1) **giữ nguyên độ dài**.

## 5. Tự kiểm tra (`.quiz`)
1. Vectơ riêng là gì? → `.qa` **Hướng mà A chỉ co giãn, không đổi hướng: A·v = λ·v.**
2. Ma trận 2×2 có tối đa mấy trị riêng? → `.qa` **Hai (nghiệm đa thức bậc hai).**

## 6. Rút ra
> **Rút ra.** Trị riêng/vectơ riêng = "trục tự nhiên" và "hệ số co giãn" của một ma trận. PCA chọn hướng có trị riêng lớn
> nhất (phương sai lớn nhất). Sang phần giải tích — Bài tiếp (A12): đạo hàm một biến, viên gạch của gradient.

## 7. `data-q` & số động
- Sinh A **đối xứng** số nguyên nhỏ sao cho trace²−4det là số chính phương ⇒ λ nguyên (vd lặp tới khi đạt).
- Khóa: `a,b,c,d`; `trace, det`; `lam1, lam2`; vectơ riêng `vx, vy`; `Avx, Avy`.

## Phụ lục — số mẫu
| | Kết quả |
|---|---|
| trace, det | 4, 3 |
| λ | 1, 3 |
| v (λ=3) | (1, 1) → A·v = (3, 3) |
| v (λ=1) | (1, −1) |
