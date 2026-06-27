# SPEC — E2 · Vanishing / Exploding gradient (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `E2-vanishing-exploding` · English *Vanishing/Exploding* · ~12 phút.
> Tiền đề: A13 (chuỗi), D8 (backprop), C2 (σ').

## 1. Định vị
Gradient qua mạng sâu = **tích** nhiều thừa số; nếu mỗi thừa số <1 → teo về 0 (vanishing), >1 → nổ (exploding).

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Đây là lý do mạng sâu/RNN dài **khó học**: lớp đầu gần như không nhận tín hiệu (vanishing) hoặc cập nhật
  loạn (exploding). Hiểu nó dẫn tới mọi cách chữa: ReLU, init tốt, normalize, residual, gradient clipping, LSTM.
- `.formula`:
  ```
  ∂L/∂(lớp đầu) = ∏ (đạo hàm cục bộ mỗi lớp)      r^L → 0 nếu r<1 · → ∞ nếu r>1
  ```

## 3. Trực giác (`.intuition`)
> Gradient truyền ngược như **tiếng vọng qua L căn phòng**: mỗi phòng nhân âm lượng với r. r=0.5 qua 10 phòng còn ~0.001 (tắt
> ngấm); r=1.5 thành ~58 (nổ tai). Chỉ r≈1 mới giữ tín hiệu ổn định.

## 4. Các bước
- **⓪ Cho sẵn** · pill `10 lớp`: mỗi lớp nhân gradient với hệ số r. Xét r = 0.5 (vd σ' nhỏ) và r = 1.5. (`.cell.given`)
- **① Vanishing (r=0.5)** — `0.5¹⁰ = __` → ≈ 0.001. `.why`: nhân dồn số <1 → teo theo cấp số nhân → lớp đầu **học rất chậm**.
- **② Exploding (r=1.5)** — `1.5¹⁰ = __` → ≈ 57.7. `.hint`: số >1 nhân dồn → nổ → cập nhật khổng lồ, loss thành NaN.
- **③ Vùng an toàn (r≈1)** — `1.0¹⁰ = __` → 1. `.why`: muốn gradient sống sót qua nhiều lớp, mỗi lớp phải giữ "độ khuếch đại" ≈ 1.
- **④ Cách chữa** · pill `ReLU/init/norm/skip` — `.note`: σ' ≤ 0.25 gây vanishing → **ReLU** (đạo hàm 1); **init He** giữ r≈1; **BatchNorm/LayerNorm**
  ổn định; **residual** cho đường tắt gradient; **clipping** (E9) chặn nổ. SVG: đường gradient theo độ sâu cho 3 giá trị r.

## 5. Tự kiểm tra (`.quiz`)
1. Vì sao sigmoid sâu gây vanishing? → `.qa` **σ' ≤ 0.25 < 1, nhân dồn qua nhiều lớp → teo về 0.**
2. Điều kiện để gradient ổn định qua độ sâu? → `.qa` **Hệ số khuếch đại mỗi lớp ≈ 1.**

## 6. Rút ra
> **Rút ra.** Gradient = tích thừa số; r<1 teo, r>1 nổ, cần r≈1. Bài tiếp (E3): một cách kiểm soát độ lớn trọng số — L2 regularization
> (weight decay).

## 7. `data-q` & số mẫu
- Sinh số lớp L và hệ số r (vd {0.5, 0.8, 1.0, 1.2, 1.5}); tính r^L.
- Khóa: `L`, `r1,r2`; `vanish`, `explode`, `stable`.

## Phụ lục — số mẫu (L=10)
| r | r^10 |
|---|---|
| 0.5 | ≈ 0.001 |
| 1.0 | 1 |
| 1.5 | ≈ 57.7 |
