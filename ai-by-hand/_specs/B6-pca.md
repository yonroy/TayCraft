# SPEC — B6 · PCA 2D (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `B6-pca` · English *PCA* · ~14 phút.
> Tiền đề: A11 (trị riêng), A5 (phép chiếu), A16 (phương sai).

## 1. Định vị
Tìm **trục chính** của dữ liệu — hướng phương sai lớn nhất — rồi **chiếu** lên đó để giảm chiều. Ứng dụng trực tiếp của trị riêng.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Dữ liệu nhiều chiều khó nhìn và tốn tính. PCA giữ lại **vài hướng mang nhiều thông tin nhất** (phương
  sai lớn) và bỏ phần "phẳng". Nó là nén dữ liệu, khử nhiễu, và trực quan hóa.
- `.formula`:
  ```
  Centering: x' = x − x̄      Hiệp phương sai C = (1/m) Σ x'·x'ᵀ
  Trục chính = vectơ riêng của C ứng trị riêng lớn nhất      Tọa độ mới = x'·v
  ```

## 3. Trực giác (`.intuition`)
> Đám điểm như một **vệt khói nghiêng**. PCA xoay trục để **trục thứ nhất nằm dọc theo chiều vệt dài nhất** (trải nhiều nhất).
> Chiếu lên trục đó giữ được phần lớn "hình dạng" dữ liệu bằng một chiều.

## 4. Các bước
- **⓪ Cho sẵn** · pill `3 điểm 2D`: (1,1), (2,2), (3,3). (`.cell.given`)
- **① Trung tâm hóa** — `x̄ = (2,2)`; trừ ra: `(−1,−1), (0,0), (1,1)`. `.why`: PCA đo **độ trải quanh trung bình**, nên phải dời gốc về x̄.
- **② Hiệp phương sai C** — `C = (1/3)Σ x'x'ᵀ`: `C₁₁=Σx'₁²/3 = 2/3`, `C₁₂=Σx'₁x'₂/3 = 2/3`, `C₂₂ = 2/3` → `C = (2/3)·[[1,1],[1,1]]`.
  `.hint`: C đối xứng; phần tử ngoài đường chéo = đồng biến giữa hai trục.
- **③ Trục chính (vectơ riêng)** — C tỉ lệ `[[1,1],[1,1]]` → trị riêng lớn λ=2 ứng `v = (1,1)/√2`. `.why`: hướng (1,1) là nơi
  dữ liệu trải dài nhất (mọi điểm nằm trên đường này) → giữ 100% phương sai.
- **④ Chiếu xuống 1 chiều** · pill `giảm chiều` — `tọa độ mới = x'·v`: điểm (1,1) → `(1+1)/√2 = √2 ≈ __` (1.41); (−1,−1)→−1.41.
  `.note`: trục phụ (1,−1) có phương sai **0** → bỏ đi không mất gì; đó là sức mạnh giảm chiều của PCA.

## 5. Tự kiểm tra (`.quiz`)
1. Trục chính PCA là vectơ riêng ứng trị riêng nào? → `.qa` **Lớn nhất (phương sai lớn nhất).**
2. Vì sao phải trung tâm hóa trước? → `.qa` **Để đo phương sai quanh trung bình, không bị lệch bởi vị trí gốc.**

## 6. Rút ra
> **Rút ra.** PCA = trung tâm hóa → hiệp phương sai → vectơ riêng lớn nhất → chiếu. Giữ thông tin bằng ít chiều hơn. Hết
> mạch ML "thuần đại số"; Bài tiếp (B7): phân loại bằng xác suất — Naive Bayes.

## 7. `data-q` & số mẫu
- Để số đẹp: dùng dữ liệu trải dọc một đường (vd y=x) → vectơ riêng (1,1). Có thể random hệ số đường.
- Khóa: tọa độ; `xb,yb`; `C11,C12,C22`; `lam`, `vx,vy`; tọa độ chiếu.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| x̄ | (2, 2) |
| C | (2/3)·[[1,1],[1,1]] |
| trục chính | (1,1)/√2 (λ=2) |
| chiếu (3,3) | ≈ 1.41 |
