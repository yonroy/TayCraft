# SPEC — C5 · Một nơ-ron (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `05-mot-no-ron` · English *A neuron* · ~12 phút.
> Tiền đề: 01 (tích vô hướng), 03 (lớp tuyến tính), 04 (kích hoạt).

## 1. Định vị
Đơn vị tính của mạng: `a = f(w·x + b)`. Gộp trọn ba bài trước thành **một** thực thể — viên gạch lặp lại hàng tỉ lần.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Mọi mạng nơ-ron chỉ là **rất nhiều nơ-ron** kiểu này nối lại. Hiểu một nơ-ron = hiểu phép cơ bản: chấm
  điểm đầu vào (tích vô hướng), thêm ngưỡng (bias), rồi quyết định "bật" bao nhiêu (kích hoạt).
- `.formula`:
  ```
  z = w·x + b      a = f(z)      (f = ReLU / sigmoid / …)
  ```

## 3. Trực giác (`.intuition`)
> Một nơ-ron như một **người chấm thi**: mỗi đầu vào xᵢ có trọng số wᵢ (mức quan trọng), cộng lại thành điểm thô z (kèm thiên
> kiến b), rồi hàm kích hoạt quyết định "phát tín hiệu" mạnh yếu ra sao.

## 4. Các bước
- **⓪ Cho sẵn** · pill `3 đầu vào`: x = (2, 1, 3), w = (1, −1, 2), b = 1, dùng f = ReLU. (`.cell.given`)
- **① Tổng có trọng số z** — `z = (1·2 + (−1)·1 + 2·3) + 1 = (2 − 1 + 6) + 1 = __` → 8. `.why`: chính là tích vô hướng w·x + bias — "điểm thô".
- **② Kích hoạt a** — `a = ReLU(8) = max(0, 8) = __` → 8. `.hint`: ReLU chỉ chặn âm; ở đây z dương nên giữ nguyên.
- **③ Đổi đầu vào → nơ-ron "tắt"** — nếu z âm (vd w·x+b = −3): `a = ReLU(−3) = __` → 0. `.why`: nơ-ron có thể **im lặng** khi điểm
  thô âm → tạo tính thưa, chọn lọc đặc trưng.
- **④ Sơ đồ** · pill `x → z → a` — SVG: 3 mũi tên đầu vào có trọng số → ô tổng (Σ) → hàm f → đầu ra a. `.note`: đây là một dòng của
  lớp nơ-ron (Bài 06); xếp nhiều nơ-ron song song thành một lớp.

## 5. Tự kiểm tra (`.quiz`)
1. Một nơ-ron gồm những phép gì? → `.qa` **Tích vô hướng w·x + bias, rồi hàm kích hoạt.**
2. Khi nào nơ-ron ReLU "im lặng" (ra 0)? → `.qa` **Khi điểm thô z = w·x + b ≤ 0.**

## 6. Rút ra
> **Rút ra.** Nơ-ron = f(w·x + b): chấm điểm + ngưỡng + kích hoạt. Bài tiếp (06): nhiều nơ-ron chung đầu vào → **một lớp** (W là ma trận).

## 7. `data-q` & số mẫu
- Sinh x, w nguyên nhỏ, b nhỏ; tính z, a (ReLU). Có thể random để z lúc dương lúc âm minh họa "tắt".
- Khóa: `x1..x3, w1..w3, b`; `z`, `a`; biến thể âm `zNeg, aNeg`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| z | 8 |
| a = ReLU(z) | 8 |
| nếu z=−3 | a = 0 |
