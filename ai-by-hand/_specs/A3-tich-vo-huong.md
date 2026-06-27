# SPEC — A3 · Tích vô hướng (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `01-tich-vo-huong` · English *Dot Product* · ~12 phút.
> **Đã có phiếu chuẩn** `K1/01-tich-vo-huong.html` (mẫu tham chiếu của cả bộ GIẢNG GIẢI). Spec để tài liệu hóa/tái tạo.

## 1. Định vị
Phép tính **nền tảng nhất** của AI: mỗi nơ-ron, mỗi ô nhân ma trận, mỗi điểm attention đều là một tích vô hướng.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Cả mạng nơ-ron chỉ là **hàng ngàn tích vô hướng** lặp lại. Nó vừa là phép cộng-nhân gộp đầu vào của một
  nơ-ron, vừa đo **độ giống nhau** giữa hai vectơ.
- `.formula`:
  ```
  a·b = a₁b₁ + a₂b₂ + … + aₙbₙ = Σ aᵢbᵢ      a·b = |a||b|cos θ
  ```

## 3. Trực giác (`.intuition`)
> Nhân **từng cặp cùng vị trí** rồi cộng lại → một con số. Số đó lớn khi hai vectơ "cùng chiều mạnh", bằng 0 khi vuông góc, âm
> khi ngược chiều.

## 4. Các bước
- **⓪ Cho sẵn** · pill `n = 3`: a = (2,1,3), b = (1,4,2). (`.cell.given`)
- **① Nhân từng cặp** — `a₁b₁ = 2·1 = __ ; a₂b₂ = 1·4 = __ ; a₃b₃ = 3·2 = __` → 2, 4, 6. `.why`: mỗi tích đo đóng góp cùng chiều của một cặp thành phần.
- **② Cộng lại** — `a·b = 2 + 4 + 6 = __` → 12. `.note`: đây là giá trị một nơ-ron tính **trước** bias & kích hoạt.
- **③ Luyện thêm** — `(1,0,0)·(0,1,0) = __ (0, vuông góc) ; (1,2)·(2,1) = __ (4) ; (3,3,3)·(1,1,1) = __ (9)`.
- **④ Hình học** · pill `cos θ` — SVG: u=(3,1), v=(1,2) + cung góc + hình chiếu. `u·v = __`; `cos θ = (u·v)/(|u||v|)`. `.note`: u·v = |u|×(độ dài bóng của v lên u).

## 5. Tự kiểm tra (`.quiz`)
1. Tích vô hướng ra một con số hay một vectơ? → `.qa` **Một con số (vô hướng).**
2. a·b = 0 thì góc giữa a và b? → `.qa` **90° (vuông góc).**

## 6. Rút ra
> **Rút ra.** Tích vô hướng vừa gộp đầu vào (nơ-ron) vừa đo độ giống (cos θ). Bài tiếp (02): xếp nhiều tích vô hướng thành **phép nhân ma trận**.

## 7. `data-q` & số mẫu
- Sinh a, b ∈ [−4,5]³ (tránh vectơ 0); cặp 2D dương không song song cho hình.
- Khóa: `a1..a3,b1..b3` (+`…w`), `p1..p3`, `dot`; `u1,u2,v1,v2`, `udotv`, `normU,normV`, `cosU`, `degU`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| tích cặp | 2, 4, 6 |
| a·b | 12 |
| luyện | 0, 4, 9 |
