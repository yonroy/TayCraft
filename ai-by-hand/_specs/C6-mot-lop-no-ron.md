# SPEC — C6 · Một lớp nơ-ron (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `06-mot-lop-no-ron` · English *A neuron layer* · ~13 phút.
> Tiền đề: 03 (lớp tuyến tính), 05 (một nơ-ron).

## 1. Định vị
Nhiều nơ-ron **chung đầu vào** chạy song song: `a = f(Wx + b)` với W là ma trận (mỗi hàng một nơ-ron). Một tầng của mạng.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Gom các nơ-ron thành **một phép ma trận** là lý do GPU chạy mạng cực nhanh. Một lớp = trích **nhiều đặc
  trưng** từ cùng đầu vào cùng lúc.
- `.formula`:
  ```
  z = W·x + b      a = f(z)   (áp f cho từng phần tử)
  W là (số nơ-ron × số đầu vào)
  ```

## 3. Trực giác (`.intuition`)
> Một **hội đồng** nhiều người chấm: mỗi nơ-ron (hàng W) nhìn cùng đầu vào nhưng theo tiêu chí riêng → cho ra một đặc trưng. Lớp
> = bó các góc nhìn đó thành vectơ đầu ra.

## 4. Các bước
- **⓪ Cho sẵn** · pill `3 → 2 nơ-ron`: W = [[1,0,2],[−1,3,0]], x = (2,1,1), b = (1, −2), f = ReLU. (`.cell.given`)
- **① z = Wx + b** — `z₁ = (1·2+0+2·1)+1 = __ (5) ; z₂ = (−1·2+3·1+0)+(−2) = __` → −1. `.why`: mỗi hàng W·x là một tích vô hướng (một nơ-ron, Bài 05).
- **② Kích hoạt từng phần tử** — `a₁ = ReLU(5) = __ (5) ; a₂ = ReLU(−1) = __` → 0. `.hint`: áp ReLU **riêng** từng nơ-ron, không trộn nhau.
- **③ Đầu ra lớp** — `a = (__, __)` → (5, 0). `.why`: nơ-ron 2 "tắt" → lớp tự chọn đặc trưng nào kích hoạt cho mẫu này.
- **④ Sơ đồ** · pill `song song` — SVG: 3 đầu vào nối tới 2 nơ-ron (lưới dây) → 2 đầu ra. `.note`: đổi số nơ-ron = đổi số hàng W = đổi
  số chiều đầu ra; đây là một "tầng" để chồng tiếp (Bài 07).

## 5. Tự kiểm tra (`.quiz`)
1. Số nơ-ron của lớp = ? → `.qa` **Số hàng của W (= số chiều đầu ra).**
2. Vì sao gộp nơ-ron thành ma trận? → `.qa` **Một phép Wx tính mọi nơ-ron cùng lúc → nhanh trên GPU.**

## 6. Rút ra
> **Rút ra.** Một lớp = f(Wx + b), mỗi hàng W một nơ-ron, áp kích hoạt từng phần tử. Bài tiếp (07): chồng hai lớp → **MLP** với lớp ẩn.

## 7. `data-q` & số mẫu
- Sinh W (2×3), x, b nguyên nhỏ; tính z, a (ReLU). Cho z₂ âm để minh họa nơ-ron tắt.
- Khóa: `w11..w23, x1..x3, b1,b2`; `z1,z2`, `a1,a2`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| z | (5, −1) |
| a = ReLU(z) | (5, 0) |
