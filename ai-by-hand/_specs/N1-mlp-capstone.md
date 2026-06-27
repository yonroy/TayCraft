# SPEC — N1 · MLP phân loại điểm 2D — đủ vòng (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `N1-mlp-capstone` · English *MLP capstone* · ~16 phút.
> Tiền đề: 07 (MLP), 04 (ReLU), 12/D8 (backprop), 10 (cập nhật). Mở đầu Phần N (Capstone). **Có thể 3 trang.**

## 1. Định vị
Chạy **trọn một vòng huấn luyện** một MLP 2→2→1 trên một mẫu: forward → loss → backward → cập nhật. Gộp mọi mảnh K1/K2.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Đây là "bài tổng duyệt": thấy mọi viên gạch (tích vô hướng, ReLU, MSE, chuỗi, gradient) **ráp lại** thành một
  bước học hoàn chỉnh. Hiểu trọn vòng này = hiểu mạng nơ-ron học thế nào.
- `.formula`:
  ```
  Forward: h = ReLU(W₁x+b₁), o = W₂h+b₂        Loss: L = ½(o−t)²
  Backward: δ₂ = o−t → ∂W₂=δ₂h; δ₁=(W₂ᵀδ₂)⊙ReLU'(z); ∂W₁=δ₁xᵀ        Update: W ← W − η∂W
  ```

## 3. Trực giác (`.intuition`)
> Một vòng = **đoán → đo sai → truy trách nhiệm → chỉnh**. Forward đẩy tín hiệu ra dự đoán; loss đo lệch; backward chia trách nhiệm về
> từng trọng số; update nhích trọng số để lần sau bớt sai. Lặp vòng này hàng triệu lần = "huấn luyện".

## 4. Các bước
- **⓪ Cho sẵn** · pill `2→2→1, η=0.1`: x=(1,2); W₁=[[1,1],[0,−1]], b₁=(0,1); W₂=(1,2), b₂=−1; mục tiêu t=1. (`.cell.given`)
- **① Forward — lớp ẩn** — `z = W₁x+b₁ = (3, −1) → h = ReLU(z) = (__, __)` → (3, 0). `.why`: nơ-ron ẩn 2 tắt (z<0).
- **② Forward — đầu ra & loss** — `o = W₂·h + b₂ = 1·3+2·0−1 = __ (2) ; L = ½(2−1)² = __` → 0.5. `.hint`: o là dự đoán; L đo lệch với t.
- **③ Backward** — `δ₂ = o−t = __ (1) ; ∂W₂ = δ₂·h = (3, 0)`; `δ₁ = (W₂ᵀδ₂)⊙ReLU'(z) = (1,2)⊙(1,0) = (1, 0)`; `∂W₁ = δ₁⊗x = [[1,2],[0,0]]`.
  `.why`: trách nhiệm sai chảy ngược; hàng nơ-ron tắt → gradient 0.
- **④ Update & lặp** · pill `W ← W − η∂W` — `W₂ ← (1,2) − 0.1·(3,0) = (__, __)` → (0.7, 2); `b₂ ← −1 − 0.1·1 = __` → −1.1. `.note`: forward lại với W mới → o gần t hơn → L giảm. Lặp = hội tụ. SVG: đồ thị x→h→o với mũi tên gradient ngược.

## 5. Tự kiểm tra (`.quiz`)
1. Bốn pha của một vòng huấn luyện? → `.qa` **Forward → Loss → Backward → Update.**
2. Vì sao gradient của nơ-ron ẩn tắt = 0? → `.qa` **ReLU'(z<0)=0 chặn gradient qua nó.**

## 6. Rút ra
> **Rút ra.** Một vòng MLP = forward → loss → backward → update; lặp để hội tụ. Đây là toàn bộ deep learning thu nhỏ. Bài tiếp (N2): ráp một mini-CNN.

## 7. `data-q` & số mẫu
- Sinh W₁,b₁,W₂,b₂,x,t nguyên nhỏ (z₂ âm để minh họa tắt); tính forward, backward, update.
- Khóa: tất cả trọng số; `z1,z2,h1,h2,o,L`; `d2, gW2a,gW2b, d1a,d1b, gW1..`; `W2a_new,W2b_new,b2_new`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| h (ẩn) | (3, 0) |
| o, L | 2, 0.5 |
| δ₂ | 1 |
| W₂ mới | (0.7, 2) |
