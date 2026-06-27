# SPEC — A13 · Quy tắc chuỗi (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `A13-quy-tac-chuoi` · English *Chain rule* · ~12 phút.
> Tiền đề: A12 (đạo hàm một biến).

## 1. Định vị
Đạo hàm của **hàm lồng hàm**: `dy/dx = dy/du · du/dx`. Đây là **gốc của backpropagation** — gradient nhân dồn qua từng lớp.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Mạng nơ-ron là **hàm lồng hàm lồng hàm…** Muốn biết loss đổi thế nào theo một trọng số ở lớp sâu,
  ta **nhân các đạo hàm dọc chuỗi**. Quy tắc chuỗi chính là cơ chế backprop.
- `.formula`:
  ```
  y = f(u),  u = g(x)   ⇒   dy/dx = (dy/du) · (du/dx)
  ```

## 3. Trực giác (`.intuition`)
> Chuỗi hàm như **dây chuyền bánh răng**: bánh x quay làm bánh u quay, bánh u quay làm bánh y quay. Tốc độ y theo x =
> **tích** các tỉ số truyền của từng khâu. Nhiều khâu thì cứ nhân tiếp.

## 4. Các bước
- **⓪ Cho sẵn** · pill `hàm lồng`: y = u², u = 3x + 1, xét tại x = 1. (`.cell.given`)
- **① Đạo hàm ngoài dy/du** — `y = u² → dy/du = __` → 2u. Tại u(1) = 4 → `dy/du = __` → 8.
  `.why`: tạm coi u là biến, đạo hàm lớp ngoài trước — đúng "từ ngoài vào trong".
- **② Đạo hàm trong du/dx** — `u = 3x+1 → du/dx = __` → 3 (hằng số dốc).
- **③ Nhân lại** — `dy/dx = (dy/du)·(du/dx) = 8 · 3 = __` → 24.
  `.why`: nhân vì ảnh hưởng **truyền nối tiếp** — x lay u, u lay y; tổng hiệu ứng là tích.
- **④ Kiểm bằng khai triển** · pill `xác nhận` — `y = (3x+1)² → y' = 2(3x+1)·3 = 6(3x+1)`; tại x=1: `= __` → 24 (khớp).
  `.note`: trong backprop, đây là "δ của lớp trên × đạo hàm cục bộ" lan ngược.

## 5. Tự kiểm tra (`.quiz`)
1. Vì sao backprop chính là quy tắc chuỗi? → `.qa` **Mạng là hàm lồng nhau; gradient nhân dồn các đạo hàm cục bộ.**
2. dy/dx ghép hai khâu bằng phép gì? → `.qa` **Phép nhân (dy/du · du/dx).**

## 6. Rút ra
> **Rút ra.** Quy tắc chuỗi = nhân đạo hàm dọc theo chuỗi hàm; đó là cách gradient chảy ngược qua mạng. Bài tiếp (A14):
> mở rộng sang **nhiều biến** → gradient (vectơ đạo hàm riêng).

## 7. `data-q` & số động
- Sinh `u = a·x + b` (a,b nguyên nhỏ), lớp ngoài cố định y = u² (hoặc pick {u², u³}); điểm x₀ nguyên nhỏ.
- Khóa: `a,b,x0`; `u_val`; `dydu`, `dudx`, `dydx`; kết quả khai triển kiểm tra.

## Phụ lục — số mẫu
| | Kết quả |
|---|---|
| u(1) | 4 |
| dy/du | 2u = 8 |
| du/dx | 3 |
| dy/dx | 24 |
