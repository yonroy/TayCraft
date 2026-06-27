# SPEC — M4 · Multi-modal (CLIP) (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `M4-clip` · English *CLIP* · ~13 phút.
> Tiền đề: A4 (cosine), M2 (contrastive), 09 (softmax). Dùng bảng eˣ.

## 1. Định vị
CLIP học **chung một không gian** cho ảnh và chữ: ảnh và caption đúng của nó phải **gần nhau**. Đối lập theo lô (contrastive) trên ma trận tương đồng.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Nối **hai phương thức** (ảnh ↔ chữ) cho phép tìm ảnh bằng câu mô tả, phân loại **zero-shot** (không cần huấn luyện lớp
  mới — chỉ cần mô tả chữ). Nền của tìm kiếm đa phương thức và mô hình sinh ảnh có điều kiện.
- `.formula`:
  ```
  S[i][j] = cos(ảnhᵢ, chữⱼ)/τ        loss = CE theo hàng + CE theo cột (đường chéo là cặp đúng)
  ```

## 3. Trực giác (`.intuition`)
> Xếp một **lô ảnh** và **lô caption** thành ma trận điểm tương đồng. Cặp đúng nằm trên **đường chéo**. CLIP ép mỗi ảnh chọn đúng caption
> của mình (softmax theo hàng) và ngược lại (theo cột) → kéo cặp đúng sáng nhất.

## 4. Các bước
- **⓪ Cho sẵn + bảng eˣ** · pill `2 ảnh, 2 chữ, τ=1`: ma trận tương đồng S = [[2, 0], [1, 3]] (hàng = ảnh, cột = chữ). Bảng: e⁰=1, e¹=2.72, e²=7.39, e³=20.1. (`.cell.given`)
- **① Softmax hàng ảnh 1** — `e²=7.39, e⁰=1, Σ=8.39 → p = (__, __)` → (0.88, 0.12). `.why`: ảnh 1 nên khớp chữ 1 (đường chéo) → p[0] cao là tốt.
- **② Softmax hàng ảnh 2** — `e¹=2.72, e³=20.1, Σ=22.8 → p = (__, __)` → (0.12, 0.88). `.hint`: ảnh 2 khớp chữ 2 (chéo) → p[1] cao.
- **③ Loss (chéo là nhãn)** — `L_ảnh1 = −ln(0.88) = __ (0.13) ; L_ảnh2 = −ln 0.88 = 0.13 → trung bình = __` → 0.13. `.why`: loss nhỏ khi đường chéo sáng → ảnh–caption khớp.
- **④ Zero-shot** · pill `phân loại bằng chữ` — `.note`: để phân loại ảnh, tạo caption "ảnh con {mèo/chó/…}", chọn caption cosine cao nhất → **không cần huấn luyện lớp**. SVG: ma trận 2×2, tô đường chéo.

## 5. Tự kiểm tra (`.quiz`)
1. Cặp ảnh–chữ đúng nằm ở đâu trên ma trận? → `.qa` **Đường chéo.**
2. "Zero-shot" của CLIP nghĩa là gì? → `.qa` **Phân loại bằng mô tả chữ, không cần huấn luyện lớp mới.**

## 6. Rút ra
> **Rút ra.** CLIP = không gian chung ảnh–chữ; contrastive ép đường chéo sáng; cho zero-shot. Bài tiếp (M5): truyền tri thức từ thầy sang trò — distillation.

## 7. `data-q` & số mẫu
- Sinh ma trận tương đồng 2×2 với chéo lớn; softmax theo hàng + loss.
- Khóa: `s11,s12,s21,s22`; `p11,p12,p21,p22`, `loss`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| p ảnh1 | (0.88, 0.12) |
| loss trung bình | 0.13 |
