# SPEC — C2 · Sigmoid chi tiết + đạo hàm (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `C2-sigmoid` · English *Sigmoid* · ~11 phút.
> Tiền đề: A18 (exp/log), A12 (đạo hàm). Dùng bảng tra σ.

## 1. Định vị
Hàm kích hoạt hình chữ S ép số về (0,1). Đạo hàm cực gọn `σ' = σ(1−σ)` — và lý do nó gây **vanishing gradient**.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Sigmoid biến điểm thô thành xác suất (đầu ra nhị phân) và từng là kích hoạt phổ biến. Hiểu đạo hàm
  của nó giải thích vì sao mạng sâu dùng sigmoid bị **tắt gradient** ở hai đầu bão hòa.
- `.formula`:
  ```
  σ(z) = 1 / (1 + e^−z)      σ'(z) = σ(z)·(1 − σ(z))      σ'(z) ≤ 0.25
  ```

## 3. Trực giác (`.intuition`)
> Sigmoid như **công tắc mờ**: z rất âm → gần 0 (tắt), rất dương → gần 1 (bật), quanh 0 → dốc nhất (nhạy). Ở hai đầu nó **phẳng
> lì** → đạo hàm ≈ 0 → tín hiệu học gần như không qua được.

## 4. Các bước
- **⓪ Cho sẵn + bảng σ** · pill `tra cứu`: z = 1. Bảng: `σ(−2)=0.12, σ(−1)=0.27, σ(0)=0.5, σ(1)=0.73, σ(2)=0.88`. (`.cell.given`)
- **① Giá trị σ(1)** — tra bảng: `σ(1) = __` → 0.73. `.why`: luôn trong (0,1) → đọc được như "độ bật".
- **② Đạo hàm** — `σ'(1) = σ(1)(1−σ(1)) = 0.73·0.27 = __` → 0.197. `.hint`: không cần đạo hàm lại từ đầu — dùng chính giá trị σ.
- **③ Đỉnh đạo hàm** — `tại z=0: σ'=0.5·0.5 = __` → 0.25 (lớn nhất); `tại z=2: σ'=0.88·0.12 = __` → 0.106 (đã nhỏ).
  `.why`: đạo hàm cực đại chỉ 0.25; càng ra biên càng nhỏ → nhân dồn qua nhiều lớp ⇒ **vanishing gradient**.
- **④ Hình** · pill `chữ S` — SVG: đường σ(z) + tiếp tuyến tại z=1. `.note`: vì σ' ≤ 0.25, gradient teo nhanh ở mạng sâu — lý do
  ReLU (Bài 04) lên ngôi.

## 5. Tự kiểm tra (`.quiz`)
1. Đạo hàm sigmoid lớn nhất bằng bao nhiêu, ở đâu? → `.qa` **0.25 tại z = 0.**
2. Vì sao sigmoid gây vanishing gradient? → `.qa` **σ' ≤ 0.25 và ≈ 0 ở vùng bão hòa → nhân dồn teo dần.**

## 6. Rút ra
> **Rút ra.** σ' = σ(1−σ) ≤ 0.25; bão hòa hai đầu làm tắt gradient. Bài tiếp (C3): tanh — họ hàng đối xứng quanh 0.

## 7. `data-q` & số mẫu
- Chọn z rơi mốc bảng σ; tính σ' từ giá trị tra.
- Khóa: `z`, `sig`, `dsig`, `dsig0`, `dsig2`.

## Phụ lục — số mẫu
| z | σ | σ' |
|---|---|---|
| 0 | 0.5 | 0.25 |
| 1 | 0.73 | 0.197 |
| 2 | 0.88 | 0.106 |
