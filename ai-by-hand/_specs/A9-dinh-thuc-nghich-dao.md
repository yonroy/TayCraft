# SPEC — A9 · Định thức & nghịch đảo 2×2 (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `A9-dinh-thuc-nghich-dao` · English *Determinant* · ~12 phút.

## 1. Định vị
Định thức = **hệ số phóng đại diện tích** của phép biến đổi; det ≠ 0 ⇔ ma trận **khả nghịch**. Nghịch đảo giúp **đảo ngược**
một biến đổi và **giải hệ** `Ax = b`.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Khi nào một biến đổi tuyến tính có thể **hoàn tác**? Khi nó không làm "bẹp" không gian — tức
  **det ≠ 0**. Định thức và nghịch đảo là công cụ kiểm tra và đảo ngược đó (giải hệ, đổi cơ sở, ổn định số học).
- `.formula`:
  ```
  A = [[a, b], [c, d]]      det A = ad − bc
  A⁻¹ = (1/det) · [[ d, −b], [−c,  a]]      (khi det ≠ 0)
  ```

## 3. Trực giác (`.intuition`)
> Hai **cột** của A là hai mũi tên; chúng căng ra một **hình bình hành**. **Định thức = diện tích** hình đó (có dấu).
> Nếu hai cột thẳng hàng → diện tích 0 → không gian bị ép phẳng → **không đảo ngược được**.

## 4. Các bước
- **⓪ Cho sẵn** · pill `A 2×2`: A = [[2, 1], [1, 1]]. (`.cell.given`)
- **① Định thức** — `det = 2·1 − 1·1 = __` → 1. `.why`: ad − bc đo diện tích hình bình hành hai cột; ≠ 0 nên khả nghịch.
- **② Ma trận phụ hợp** — `đổi chỗ a↔d, đổi dấu b,c → [[1, −1], [−1, 2]]` (điền). `.hint`: nhớ "đổi chéo, đổi dấu lệch".
- **③ Chia cho det → A⁻¹** — `A⁻¹ = (1/1)·[[1,−1],[−1,2]] = [[__,__],[__,__]]` → [[1,−1],[−1,2]].
  `.why`: chia cho det để `A·A⁻¹` ra đúng ma trận đơn vị (phóng đại × thu nhỏ = 1).
- **④ Kiểm `A·A⁻¹ = I`** · pill `xác nhận` — `.calc`: nhân thử ra `[[1,0],[0,1]]` (điền 4 ô). `.note`: det = 0 ⇒ bước ③
  chia cho 0 ⇒ **không có nghịch đảo** (ma trận suy biến).

## 5. Tự kiểm tra (`.quiz`)
1. det A = 0 nghĩa là gì? → `.qa` **A suy biến — không khả nghịch (hai cột phụ thuộc).**
2. Về hình học, |det| là gì? → `.qa` **Diện tích hình bình hành do hai cột tạo ra (hệ số phóng đại diện tích).**

## 6. Rút ra
> **Rút ra.** det cho biết biến đổi có **đảo ngược** được không; A⁻¹ là phép đảo. Hai khái niệm này đứng sau việc **giải hệ
> phương trình**. Bài tiếp (A10): giải `Ax = b` 2×2 bằng khử Gauss.

## 7. `data-q` & số động
- Sinh A 2×2 có **det = ±1** (để A⁻¹ nguyên): chọn `a,b,c,d` thỏa `ad−bc ∈ {1,−1}` (vd lặp random tới khi đạt).
- Khóa: `a,b,c,d`; `det`; `i11..i22` (nghịch đảo); 4 ô kiểm `A·A⁻¹`.

## Phụ lục — số mẫu
| | Kết quả |
|---|---|
| det A | 1 |
| A⁻¹ | [[1,−1],[−1,2]] |
| A·A⁻¹ | [[1,0],[0,1]] = I |
