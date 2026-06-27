# SPEC — A15 · Ma trận Jacobian (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `A15-jacobian` · English *Jacobian* · ~13 phút.
> Tiền đề: A14 (gradient), A8 (ma trận × vectơ).

## 1. Định vị
Khi hàm nhận **vectơ → vectơ**, bảng đạo hàm riêng trở thành **ma trận Jacobian**. Backprop qua một lớp = nhân với Jacobian của lớp đó.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Mỗi lớp mạng là một hàm vectơ→vectơ. Để lan gradient qua lớp, ta cần biết **mỗi đầu ra nhạy thế nào
  với mỗi đầu vào** — đúng là Jacobian. Nó là "gradient" cho hàm nhiều đầu ra.
- `.formula`:
  ```
  f: ℝⁿ → ℝᵐ      J_ij = ∂f_i / ∂x_j      (J là ma trận m×n)
  ```

## 3. Trực giác (`.intuition`)
> Jacobian xếp chồng các gradient: **mỗi hàng là gradient của một đầu ra**. Tại một điểm, nó là **phép biến đổi tuyến tính
> xấp xỉ** hàm — cho biết một nhiễu nhỏ ở đầu vào lan ra đầu ra thế nào.

## 4. Các bước
- **⓪ Cho sẵn** · pill `f: ℝ²→ℝ²`: f₁ = x² + y, f₂ = x·y; xét tại (1, 2). (`.cell.given`)
- **① Hàng 1 = ∇f₁** — `∂f₁/∂x = 2x = __ ; ∂f₁/∂y = __ (1)`; tại (1,2): (2, 1).
  `.why`: hàng i chỉ quan tâm đầu ra fᵢ; mỗi cột là một biến đầu vào.
- **② Hàng 2 = ∇f₂** — `∂f₂/∂x = y = __ ; ∂f₂/∂y = x = __`; tại (1,2): (2, 1).
- **③ Gom thành J(1,2)** — điền ma trận 2×2: `[[2, 1], [2, 1]]`. `.hint`: vị trí (i,j) = ∂fᵢ/∂xⱼ.
- **④ Ý nghĩa** · pill `biến đổi cục bộ` — `.note`: một nhiễu nhỏ `dx = (Δx, Δy)` đổi đầu ra ≈ `J·dx` (dùng A8).
  `det J` = hệ số phóng đại diện tích cục bộ; J = 0 → lớp "ép phẳng" thông tin.

## 5. Tự kiểm tra (`.quiz`)
1. f: ℝⁿ→ℝᵐ thì Jacobian có kích thước gì? → `.qa` **m×n.**
2. Mỗi **hàng** của Jacobian là gì? → `.qa` **Gradient của một thành phần đầu ra.**

## 6. Rút ra
> **Rút ra.** Jacobian = chồng các gradient = xấp xỉ tuyến tính cục bộ của hàm vectơ→vectơ; backprop nhân các Jacobian dọc
> mạng. Hết phần giải tích nền. Bài tiếp (A16): sang **xác suất** — kỳ vọng & phương sai.

## 7. `data-q` & số động
- Sinh f₁, f₂ là biểu thức bậc hai đơn giản theo (x,y) với hệ số nguyên nhỏ; điểm (x₀,y₀) nguyên nhỏ.
- Khóa: hệ số; 4 đạo hàm riêng tại điểm `j11,j12,j21,j22`.

## Phụ lục — số mẫu
| | Kết quả |
|---|---|
| ∇f₁ tại (1,2) | (2, 1) |
| ∇f₂ tại (1,2) | (2, 1) |
| J(1,2) | [[2,1],[2,1]] |
