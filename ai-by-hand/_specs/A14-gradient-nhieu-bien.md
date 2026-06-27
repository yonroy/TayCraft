# SPEC — A14 · Gradient hàm nhiều biến (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `A14-gradient-nhieu-bien` · English *Gradient* · ~13 phút.
> Tiền đề: A12 (đạo hàm), A13 (quy tắc chuỗi).

## 1. Định vị
Đạo hàm **riêng từng biến** gom thành vectơ ∇ — hướng **tăng nhanh nhất** của hàm. Gradient descent đi **ngược** ∇.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Hàm mất mát phụ thuộc **hàng triệu trọng số**. Gradient gói toàn bộ "độ nhạy theo từng trọng số"
  vào một vectơ; trừ nó (×học suất) là **một bước huấn luyện**. Đây là động cơ tối ưu của mọi mạng nơ-ron.
- `.formula`:
  ```
  ∇f = ( ∂f/∂x , ∂f/∂y )      bước học:  w ← w − η · ∇f
  ```

## 3. Trực giác (`.intuition`)
> Đứng trên một **quả đồi** (mặt hàm). Gradient là mũi tên chỉ **hướng dốc lên gắt nhất**. Muốn xuống đáy (loss nhỏ) thì
> bước **ngược** mũi tên đó. Độ dài mũi tên = độ dốc.

## 4. Các bước
- **⓪ Cho sẵn** · pill `f(x,y)`: f = x² + x·y + y², xét tại điểm (1, 2). (`.cell.given`)
- **① Đạo hàm riêng ∂f/∂x** — coi y là hằng: `∂f/∂x = 2x + y = __` (tổng quát) → tại (1,2): `= __` → 4.
  `.why`: đạo hàm riêng = "đổi một biến, giữ nguyên các biến khác" — đo độ nhạy theo đúng trục đó.
- **② Đạo hàm riêng ∂f/∂y** — coi x là hằng: `∂f/∂y = x + 2y = __` → tại (1,2): `= __` → 5.
- **③ Gom thành ∇f** — `∇f(1,2) = (__, __)` → (4, 5). `.hint`: thứ tự thành phần khớp thứ tự biến (x trước, y sau).
- **④ Một bước gradient descent** · pill `η = 0.1` — `(x,y) ← (1,2) − 0.1·(4,5) = (__, __)` → (0.6, 1.5).
  `.why`: trừ gradient kéo điểm về phía **f nhỏ hơn**; η nhỏ để không "vọt qua" đáy. SVG: đường đồng mức + mũi tên −∇.

## 5. Tự kiểm tra (`.quiz`)
1. Gradient là một số hay một vectơ? → `.qa` **Vectơ — mỗi thành phần là một đạo hàm riêng.**
2. Để **giảm** f, đi theo hay ngược ∇? → `.qa` **Ngược ∇ (hướng dốc xuống).**

## 6. Rút ra
> **Rút ra.** Gradient = vectơ đạo hàm riêng = hướng tăng nhanh nhất; trừ nó là một bước học. Bài tiếp (A15): khi đầu ra là
> **vectơ nhiều thành phần**, bảng đạo hàm riêng trở thành **ma trận Jacobian**.

## 7. `data-q` & số động
- Sinh f bậc hai 2 biến với hệ số nguyên nhỏ (vd `x² + k·xy + y²`); điểm (x₀,y₀) nguyên nhỏ; η ∈ {0.1, 0.2}.
- Khóa: hệ số; `dfx, dfy` (giá trị tại điểm); `gx, gy` (= ∇); `nx, ny` (điểm sau bước).

## Phụ lục — số mẫu
| | Kết quả |
|---|---|
| ∂f/∂x tại (1,2) | 4 |
| ∂f/∂y tại (1,2) | 5 |
| ∇f | (4, 5) |
| sau bước η=0.1 | (0.6, 1.5) |
