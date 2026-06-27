# SPEC — B2 · Hồi quy tuyến tính nhiều biến (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `B2-hoi-quy-da-bien` · English *Multivariate regression* · ~13 phút.
> Tiền đề: B1, A8 (ma trận × vectơ).

## 1. Định vị
Mỗi mẫu có **nhiều đặc trưng**: `ŷ = w·x + b` (tích vô hướng vectơ). Cầu nối thẳng tới **lớp tuyến tính** của mạng nơ-ron.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Dữ liệu thật có nhiều cột (tuổi, cân, giờ học…). Dự đoán = **tổ hợp tuyến tính** các đặc trưng có
  trọng số. Đây đúng là phép một nơ-ron làm trước khi qua hàm kích hoạt.
- `.formula`:
  ```
  ŷ = w₁x₁ + w₂x₂ + … + wₙxₙ + b = w·x + b      MSE = (1/m) Σ (ŷⱼ − yⱼ)²
  ```

## 3. Trực giác (`.intuition`)
> Mỗi đặc trưng có một **núm chỉnh** (trọng số wᵢ): núm lớn → đặc trưng đó ảnh hưởng mạnh tới dự đoán. Dự đoán = cộng các
> đóng góp wᵢxᵢ rồi thêm "mức nền" b.

## 4. Các bước
- **⓪ Cho sẵn** · pill `2 đặc trưng`: w = (1, 2), b = 1; hai mẫu x⁽¹⁾ = (2, 3), x⁽²⁾ = (1, 1) với nhãn y = (9, 5). (`.cell.given`)
- **① Dự đoán mẫu 1** — `ŷ₁ = 1·2 + 2·3 + 1 = __` → 9. `.why`: đúng là một tích vô hướng w·x rồi cộng bias — "một nơ-ron tuyến tính".
- **② Dự đoán mẫu 2 & sai số** — `ŷ₂ = 1·1 + 2·1 + 1 = __ (4)`; sai số `ŷ₂ − y₂ = 4 − 5 = __` → −1.
- **③ MSE** — `MSE = ½[(9−9)² + (4−5)²] = __` → 0.5. `.hint`: bình phương dư, lấy trung bình.
- **④ Một gradient cho w₁** · pill `∂MSE/∂w₁` — `= (2/m) Σ (ŷ−y)·x₁ = (2/2)[(0)(2) + (−1)(1)] = __` → −1.
  `.why`: gradient chỉ hướng giảm sai số; trừ nó (×học suất) là một bước cập nhật trọng số.

## 5. Tự kiểm tra (`.quiz`)
1. wᵢ lớn nghĩa là gì? → `.qa` **Đặc trưng i ảnh hưởng mạnh tới dự đoán.**
2. `ŷ = w·x + b` giống thành phần nào của mạng nơ-ron? → `.qa` **Phần tuyến tính của một nơ-ron (trước hàm kích hoạt).**

## 6. Rút ra
> **Rút ra.** Hồi quy nhiều biến = tích vô hướng trọng số + bias + đo sai số bằng MSE; gradient cho biết chỉnh trọng số ra sao.
> Bài tiếp (B3): thêm hàm **sigmoid** để dự đoán **xác suất** (hồi quy logistic).

## 7. `data-q` & số mẫu
- Sinh w, b, x nguyên nhỏ; nhãn y có thể đặt để một mẫu khớp, một mẫu lệch (cho MSE ≠ 0 đẹp).
- Khóa: `w1,w2,b`, `x11,x12,x21,x22`, `y1,y2`; `p1,p2`, `err2`, `mse`, `gw1`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| ŷ₁, ŷ₂ | 9, 4 |
| MSE | 0.5 |
| ∂MSE/∂w₁ | −1 |
