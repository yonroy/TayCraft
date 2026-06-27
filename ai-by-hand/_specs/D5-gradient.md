# SPEC — D5 · Gradient — một bước học (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `10-gradient` · English *Gradient step* · ~12 phút.
> Tiền đề: A12 (đạo hàm), 09 (đầu ra). **Đã có phiếu** — spec để nâng cấp/tái tạo. Mở đầu K2.

## 1. Định vị
Trọn **một bước học** trên một tham số: dự đoán → đo sai → tính đạo hàm loss → trừ gradient. Vòng lặp lõi của huấn luyện.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Mọi mạng học bằng cách lặp **đúng một động tác** này trên hàng triệu tham số. Làm tay một tham số cho thấy
  toàn bộ cơ chế: sai số đẩy gradient, gradient đẩy cập nhật.
- `.formula`:
  ```
  ŷ = w·x      L = ½(ŷ − y)²      ∂L/∂w = (ŷ − y)·x      w ← w − η·∂L/∂w
  ```

## 3. Trực giác (`.intuition`)
> Gradient là **mũi tên chỉ "sai theo hướng nào"** của một tham số. Đi **ngược** mũi tên một đoạn η → loss giảm. Lặp đủ nhiều bước
> nhỏ → trượt tới đáy.

## 4. Các bước
- **⓪ Cho sẵn** · pill `1 tham số`: x = 2, nhãn y = 3, trọng số w = 1, η = 0.1. (`.cell.given`)
- **① Dự đoán & sai số** — `ŷ = w·x = 1·2 = __ (2) ; ŷ − y = 2 − 3 = __` → −1. `.why`: sai số là gốc của tín hiệu học.
- **② Gradient** — `∂L/∂w = (ŷ − y)·x = (−1)·2 = __` → −2. `.hint`: quy tắc chuỗi: đạo hàm loss × đạo hàm ŷ theo w (= x).
- **③ Cập nhật** — `w ← 1 − 0.1·(−2) = 1 + 0.2 = __` → 1.2. `.why`: gradient âm → w **tăng** (đi ngược gradient) → ŷ tiến gần y hơn.
- **④ Kiểm tiến bộ** · pill `loss giảm` — `ŷ_mới = 1.2·2 = 2.4`, gần 3 hơn → loss nhỏ hơn. `.note`: lặp bước này = gradient descent; nhiều tham số → gradient là vectơ (A14),
  tính bằng backprop (Bài 12). SVG: parabol loss theo w + một bước trượt xuống.

## 5. Tự kiểm tra (`.quiz`)
1. Vì sao trừ gradient (không cộng)? → `.qa` **Để đi xuống — giảm loss (ngược hướng tăng).**
2. Nếu η quá lớn? → `.qa` **Vọt qua đáy, dao động/phân kỳ.**

## 6. Rút ra
> **Rút ra.** Một bước học = dự đoán → sai số → gradient → trừ η·gradient. Bài tiếp (12): tính gradient cho **mạng nhiều lớp** bằng backpropagation.

## 7. `data-q` & số mẫu
- Sinh x, y, w, η nguyên/nhỏ; tính ŷ, sai số, gradient, w mới.
- Khóa: `x, y, w, eta`; `yhat`, `err`, `grad`, `wNew`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| ŷ | 2 |
| ∂L/∂w | −2 |
| w mới | 1.2 |
