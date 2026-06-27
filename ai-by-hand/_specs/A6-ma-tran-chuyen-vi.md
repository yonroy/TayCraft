# SPEC — A6 · Ma trận chuyển vị (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `A6-ma-tran-chuyen-vi` · English *Transpose* · ~10 phút.

## 1. Định vị
Lật **hàng ↔ cột**. Thao tác nhỏ nhưng có mặt khắp nơi: Kᵀ trong điểm attention `QKᵀ`, Wᵀ khi lan ngược gradient, ma trận Gram `AᵀA`.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Để hai ma trận **nhân được** thì kích thước phải khớp; chuyển vị là cách **xoay chiều** một ma trận
  cho khớp. Trong backprop, gradient chảy ngược qua đúng **Wᵀ**. Nắm chuyển vị là gỡ được một nửa rối rắm chỉ số.
- `.formula`:
  ```
  (Aᵀ)_ij = A_ji        A là m×n  ⇒  Aᵀ là n×m
  ```

## 3. Trực giác (`.intuition`)
> Đặt một **tấm gương trên đường chéo chính** (góc trên-trái xuống dưới-phải) rồi soi: ma trận lật qua đường chéo đó.
> Các số **trên đường chéo đứng yên**; mọi số khác đổi chỗ với "đối xứng" của nó.

## 4. Các bước
- **⓪ Cho sẵn** · pill `A 2×3`: A = [[1, 2, 3], [4, 5, 6]]. (`.cell.given`)
- **① Viết Aᵀ** · pill `3×2` — hộp rỗng để điền: hàng i của A thành **cột i** của Aᵀ → [[1,4],[2,5],[3,6]].
  `.why`: phần tử ở (hàng i, cột j) chuyển sang (hàng j, cột i) — chỉ là **đổi tên trục**, không đổi giá trị.
- **② Kích thước** — `A là 2×3 ⇒ Aᵀ là __ × __` → 3×2. `.hint`: hai số kích thước **đảo chỗ** cho nhau.
- **③ Lật hai lần** — `(Aᵀ)ᵀ = __` → trở lại A. `.why`: chuyển vị là phép **đối hợp** (làm hai lần ra chính nó).
- **④ Dùng thật: QKᵀ** · pill `attention` — `.note` + SVG nhỏ: Q (2×3) và K (2×3); để tính điểm tương đồng cần
  `Q · Kᵀ` (3×2) → ra ma trận điểm 2×2. `.calc`: kích thước `QKᵀ` = (2×3)·(3×2) = __ × __ → 2×2.

## 5. Tự kiểm tra (`.quiz`)
1. Ma trận m×n sau chuyển vị có kích thước gì? → `.qa` **n×m.**
2. Phần tử nào **không đổi chỗ** khi chuyển vị? → `.qa` **Các phần tử trên đường chéo chính.**

## 6. Rút ra
> **Rút ra.** Chuyển vị = lật qua đường chéo, đảo kích thước, giữ đường chéo. Nó làm cho các tích như `QKᵀ`, `AᵀA`, `Wᵀδ`
> khớp chiều. Bài tiếp (A8): nhân **ma trận × vectơ** — mỗi hàng một tích vô hướng.

## 7. `data-q` & số động
- Sinh A là 2×3 số nguyên nhỏ; Aᵀ suy ra trực tiếp.
- Khóa: `a11..a23` (given) + `t11..t32` (= a tương ứng đảo chỉ số) cho trang ĐÁP ÁN.
- Sơ đồ QKᵀ có thể tĩnh (chỉ minh họa khớp chiều).

## Phụ lục — số mẫu
| | Kết quả |
|---|---|
| A (2×3) | [[1,2,3],[4,5,6]] |
| Aᵀ (3×2) | [[1,4],[2,5],[3,6]] |
| (Aᵀ)ᵀ | = A |
| dim QKᵀ | 2×2 |
