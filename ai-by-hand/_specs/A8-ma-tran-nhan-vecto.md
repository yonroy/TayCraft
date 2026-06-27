# SPEC — A8 · Ma trận × vectơ (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `A8-ma-tran-nhan-vecto` · English *Matvec* · ~12 phút.
> Tiền đề: tích vô hướng (Bài 01), nhân ma trận (Bài 02).

## 1. Định vị
`A·x`: **mỗi hàng một tích vô hướng** → một vectơ kết quả. Đây chính là lõi của **lớp tuyến tính `y = W·x`** (chưa cộng bias).

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Một lớp mạng nơ-ron **là** một phép ma trận × vectơ: mỗi hàng của W là một nơ-ron "chấm điểm"
  đầu vào x. Hiểu phép này là hiểu cách tín hiệu **đi qua một lớp**.
- `.formula`:
  ```
  (A·x)_i = Σ_j A_ij · x_j      A là m×n, x là n → kết quả là vectơ m chiều
  ```

## 3. Trực giác (`.intuition`)
> Mỗi **hàng** của A là một "câu hỏi" có trọng số; nhân với x = **cho điểm** x theo câu hỏi đó. m hàng → m điểm →
> một vectơ m chiều. Cách khác: kết quả = **trộn các cột** của A theo hệ số là các thành phần của x.

## 4. Các bước
- **⓪ Cho sẵn** · pill `A 3×2, x 2`: A = [[1, 2], [3, 4], [0, 1]], x = (2, 1). (`.cell.given`)
- **① Từng hàng × x** · pill `3 tích vô hướng` — `.calc`:
  ```
  hàng1·x = 1·2 + 2·1 = __     (4)
  hàng2·x = 3·2 + 4·1 = __     (10)
  hàng3·x = 0·2 + 1·1 = __     (1)
  ```
  `.why`: mỗi hàng độc lập cho **một thành phần** kết quả; số hàng A quyết định số chiều đầu ra.
- **② Gom thành vectơ** — `A·x = (__, __, __)` → (4, 10, 1).
- **③ Kiểm thứ nguyên** — `(3×2)·(2) → vectơ __ chiều` → 3. `.hint`: số cột A phải bằng số chiều x.
- **④ Góc nhìn "trộn cột"** · pill `tổ hợp tuyến tính` — SVG/`.calc`: `A·x = 2·cột1 + 1·cột2 = 2·(1,3,0) + 1·(2,4,1) = (__,__,__)`
  → (4,10,1). `.why`: kết quả luôn nằm trong **không gian sinh bởi các cột** của A.

## 5. Tự kiểm tra (`.quiz`)
1. A là m×n, x là n chiều → kết quả bao nhiêu chiều? → `.qa` **m chiều.**
2. `A·x` có bằng `x·A` không? → `.qa` **Nói chung không — thứ tự & kích thước khác nhau.**

## 6. Rút ra
> **Rút ra.** Ma trận × vectơ = nhiều tích vô hướng (theo hàng) **hoặc** trộn các cột (theo x) — hai cách nhìn cùng kết quả.
> Thêm bias là thành lớp tuyến tính thật. Bài tiếp (A9): khi nào một ma trận **đảo ngược được** (định thức & nghịch đảo).

## 7. `data-q` & số động
- Sinh A 3×2 và x 2 chiều số nguyên nhỏ; kết quả tính trong `generate()`.
- Khóa: `a11..a32`, `x1,x2`; `r1,r2,r3` (kết quả); biểu thức từng hàng qua `sumExpr`.

## Phụ lục — số mẫu
| | Kết quả |
|---|---|
| hàng1·x | 4 |
| hàng2·x | 10 |
| hàng3·x | 1 |
| A·x | (4, 10, 1) |
