# SPEC — A16 · Xác suất, kỳ vọng, phương sai (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `A16-xac-suat-ky-vong` · English *Probability* · ~13 phút.

## 1. Định vị
Tính `E[X]` (trung bình có trọng số) và `Var(X)` (mức trải) trên một bảng nhỏ. Nền của loss kỳ vọng, đánh giá, lấy mẫu.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Mô hình AI nói bằng **xác suất** (softmax ra phân phối lớp). Để đo "trung bình mong đợi" và "độ
  bất định", ta dùng kỳ vọng và phương sai. Mọi hàm mất mát đều là một **kỳ vọng** trên dữ liệu.
- `.formula`:
  ```
  Σ pᵢ = 1      E[X] = Σ pᵢ·xᵢ = μ      Var(X) = Σ pᵢ·(xᵢ − μ)² = E[X²] − μ²
  ```

## 3. Trực giác (`.intuition`)
> Kỳ vọng = **điểm cân bằng** của bảng giá trị nếu mỗi giá trị nặng theo xác suất của nó (trung bình có trọng số). Phương
> sai = các giá trị **trải rộng** quanh điểm cân bằng đó cỡ nào (0 = chụm một chỗ).

## 4. Các bước
- **⓪ Cho sẵn** · pill `bảng 3 giá trị`: x = {1, 2, 3}, p = {0.5, 0.3, 0.2}. (`.cell.given`)
- **① Kiểm tổng xác suất** — `0.5 + 0.3 + 0.2 = __` → 1. `.why`: một phân phối hợp lệ **phải tổng = 1**; sai là tính toán vô nghĩa.
- **② Kỳ vọng E[X]** — `0.5·1 + 0.3·2 + 0.2·3 = __` → 1.7. `.hint`: nhân từng cặp (p·x) rồi cộng — y như tích vô hướng p·x.
- **③ Phương sai** — qua `E[X²] − μ²`: `E[X²] = 0.5·1 + 0.3·4 + 0.2·9 = __ (3.5)`; `Var = 3.5 − 1.7² = __` → 0.61.
  `.why`: bình phương khoảng cách tới μ phạt các giá trị xa; công thức `E[X²]−μ²` cho cách tính nhanh.
- **④ Hình** · pill `cột xác suất` — SVG: biểu đồ cột p theo x, vạch đứng tại μ = 1.7. `.note`: độ lệch chuẩn `σ = √Var ≈ 0.78`
  là "bán kính trải" theo đúng đơn vị x.

## 5. Tự kiểm tra (`.quiz`)
1. Tổng các xác suất trong một phân phối phải bằng bao nhiêu? → `.qa` **1.**
2. Var(X) = 0 nghĩa là gì? → `.qa` **X luôn nhận đúng một giá trị (không trải).**

## 6. Rút ra
> **Rút ra.** E[X] = trung bình có trọng số; Var = mức trải. Hai số này tóm tắt một phân phối. Bài tiếp (A17): hai phân phối
> rời rạc cốt lõi của AI — **Bernoulli** (2 lớp) và **Categorical** (K lớp).

## 7. `data-q` & số động
- Sinh xác suất "đẹp" (bội 0.1) tổng = 1 (vd `pickDistinct` rồi chuẩn về tổng 1); giá trị x nguyên nhỏ.
- Khóa: `x1..x3, p1..p3`; `psum`; `EX`; `EX2`, `varX`, `sigma` (fmt2).

## Phụ lục — số mẫu
| | Kết quả |
|---|---|
| Σp | 1 |
| E[X] | 1.7 |
| E[X²] | 3.5 |
| Var | 0.61 (σ ≈ 0.78) |
