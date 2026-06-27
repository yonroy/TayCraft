# SPEC — E3 · L2 regularization / weight decay (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `E3-l2-regularization` · English *L2 / weight decay* · ~12 phút.
> Tiền đề: A2 (chuẩn), D1 (loss), gradient.

## 1. Định vị
Thêm phạt **‖w‖²** vào loss để ép trọng số **nhỏ** → mô hình mượt hơn, ít overfit. Tương đương "weight decay".

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Trọng số lớn → hàm "gồ ghề", khớp cả nhiễu (overfit). L2 thêm áp lực kéo mọi trọng số về 0 → đường biên
  mượt, khái quát tốt hơn trên dữ liệu mới. λ điều tiết mức phạt.
- `.formula`:
  ```
  L_tổng = L_data + λ·Σ wᵢ²      ∂(phạt)/∂wᵢ = 2λ·wᵢ      → w ← w − η(g + 2λw)
  ```

## 3. Trực giác (`.intuition`)
> Mỗi bước học, ngoài đi theo gradient dữ liệu, trọng số còn bị **kéo co về 0** một chút (tỉ lệ với chính nó). Trọng số lớn bị kéo
> mạnh hơn → cả mô hình "nhẹ" và mượt. Vì thế gọi là **weight decay** (trọng số rò rỉ dần).

## 4. Các bước
- **⓪ Cho sẵn** · pill `λ=0.1`: trọng số w = (2, −1, 3); gradient dữ liệu g = (0.5, 0.5, −0.5); η = 0.1. (`.cell.given`)
- **① Phạt L2** — `λ·Σw² = 0.1·(2² + (−1)² + 3²) = 0.1·(4+1+9) = __` → 1.4. `.why`: cộng vào loss → tối ưu phải **đánh đổi** giữa khớp dữ liệu và giữ w nhỏ.
- **② Gradient phạt** — `2λw = 0.2·(2,−1,3) = (__, __, __)` → (0.4, −0.2, 0.6). `.hint`: gradient phạt **tỉ lệ chính w** → kéo về 0.
- **③ Gradient tổng & cập nhật** — `g+2λw = (0.9, 0.3, 0.1)`; `w ← w − η·(...) = (2,−1,3) − 0.1·(0.9,0.3,0.1) = (__, __, __)` → (1.91, −1.03, 2.99).
  `.why`: mọi trọng số bị thu nhỏ thêm so với chỉ dùng g.
- **④ Vai trò λ** · pill `đánh đổi` — `.note`: λ lớn → w bị ép quá nhỏ → **underfit**; λ nhỏ → ít tác dụng → vẫn overfit. AdamW (D14) áp decay
  **tách rời** đúng tinh thần này. SVG: đường biên mượt dần khi tăng λ.

## 5. Tự kiểm tra (`.quiz`)
1. L2 ép trọng số về đâu? → `.qa` **Về 0 (nhỏ lại) — mô hình mượt, ít overfit.**
2. λ quá lớn gây gì? → `.qa` **Underfit (phạt mạnh quá, w bị ép quá nhỏ).**

## 6. Rút ra
> **Rút ra.** L2 = phạt ‖w‖², gradient 2λw kéo trọng số về 0 (weight decay). Bài tiếp (E4): L1 phạt |w| → tạo **trọng số bằng 0**
> (thưa, chọn đặc trưng).

## 7. `data-q` & số mẫu
- Sinh w nguyên nhỏ, g nhỏ, λ, η; tính phạt, gradient phạt, cập nhật.
- Khóa: `w1..w3, g1..g3, lam, eta`; `pen`, `gp1..gp3`, `wn1..wn3`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| phạt L2 | 1.4 |
| 2λw | (0.4, −0.2, 0.6) |
| w mới | (1.91, −1.03, 2.99) |
