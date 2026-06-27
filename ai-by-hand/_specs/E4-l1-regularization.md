# SPEC — E4 · L1 regularization (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `E4-l1-regularization` · English *L1 regularization* · ~11 phút.
> Tiền đề: E3 (L2), A2 (chuẩn L1).

## 1. Định vị
Phạt **Σ|w|** thay vì Σw². Khác biệt then chốt: L1 đẩy nhiều trọng số về **đúng 0** → mô hình **thưa**, tự chọn đặc trưng.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** L1 không chỉ làm w nhỏ mà **tắt hẳn** đặc trưng ít quan trọng (w=0). Cho mô hình gọn, dễ giải thích, và
  loại tự động đặc trưng nhiễu — đặc biệt hữu ích khi nhiều đặc trưng.
- `.formula`:
  ```
  L_tổng = L_data + λ·Σ|wᵢ|      ∂(phạt)/∂wᵢ = λ·sign(wᵢ)      (subgradient; sign(0) ∈ [−1,1])
  ```

## 3. Trực giác (`.intuition`)
> L1 kéo trọng số về 0 bằng **một lực không đổi** λ (theo dấu), bất kể w lớn hay nhỏ. Lực hằng đó đủ sức "ghim" các w nhỏ về đúng
> 0. L2 thì lực giảm dần khi w nhỏ nên chỉ làm w bé chứ hiếm khi = 0.

## 4. Các bước
- **⓪ Cho sẵn** · pill `λ=0.1`: w = (2, −1, 3); gradient dữ liệu g = (0.5, 0.5, −0.5); η = 0.1. (`.cell.given`)
- **① Phạt L1** — `λ·Σ|w| = 0.1·(|2|+|−1|+|3|) = 0.1·6 = __` → 0.6. `.why`: phạt tổng độ lớn tuyệt đối — không bình phương nên không "tha" w lớn.
- **② Gradient phạt = λ·sign(w)** — `0.1·(sign 2, sign −1, sign 3) = (__, __, __)` → (0.1, −0.1, 0.1). `.hint`: chỉ phụ thuộc **dấu** w, không phụ thuộc độ lớn.
- **③ Cập nhật** — `w ← w − η·(g + λ·sign(w)) = (2,−1,3) − 0.1·(0.6, 0.4, −0.4) = (__, __, __)` → (1.94, −1.04, 3.04). `.why`: lực hằng λ·sign tiếp tục
  đẩy về 0; lặp nhiều bước, w nhỏ sẽ chạm 0 và **dừng** ở đó.
- **④ Thưa vs mượt** · pill `L1 ⟂ L2` — `.note`: L1 → nhiều w = 0 (thưa, chọn đặc trưng); L2 → mọi w nhỏ đều nhau (mượt). Ghép cả hai = **Elastic Net**.
  SVG: contour hình thoi (L1) cắt trục → nghiệm tại 0; hình tròn (L2) không.

## 5. Tự kiểm tra (`.quiz`)
1. Vì sao L1 tạo trọng số bằng 0? → `.qa` **Lực phạt hằng λ·sign(w) ghim được w nhỏ về đúng 0.**
2. Khi nào nên dùng L1? → `.qa` **Cần mô hình thưa / chọn đặc trưng tự động.**

## 6. Rút ra
> **Rút ra.** L1 = phạt |w|, gradient λ·sign(w) → trọng số thưa (nhiều 0). Bài tiếp (E5): chống overfit bằng cách "tắt ngẫu nhiên"
> nơ-ron — Dropout.

## 7. `data-q` & số mẫu
- Sinh w (có dấu khác nhau), g, λ, η; tính phạt, sign, cập nhật.
- Khóa: `w1..w3, g1..g3, lam, eta`; `pen`, `s1..s3`, `wn1..wn3`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| phạt L1 | 0.6 |
| λ·sign(w) | (0.1, −0.1, 0.1) |
| w mới | (1.94, −1.04, 3.04) |
