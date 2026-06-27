# SPEC — D6 · Gradient descent 2 biến (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `D6-gradient-descent-2-bien` · English *Gradient descent* · ~13 phút.
> Tiền đề: A14 (gradient), 10 (một bước học).

## 1. Định vị
Lặp **trừ gradient** để đi xuống đáy hàm mất mát 2 biến. Cơ chế tối ưu của mọi mạng — minh họa bằng đường đồng mức.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** "Huấn luyện" = chạy gradient descent trên hàng triệu tham số. Làm tay 2 biến cho thấy **trọn vòng lặp**:
  tính gradient → bước ngược → lặp; và vai trò của **học suất η** (quá lớn thì vọt, quá nhỏ thì ì).
- `.formula`:
  ```
  (x, y) ← (x, y) − η·∇f      ∇f = (∂f/∂x, ∂f/∂y)
  ```

## 3. Trực giác (`.intuition`)
> Thả một viên bi trên **lòng chảo**: mỗi bước nó lăn theo hướng dốc xuống (−∇f) một đoạn η. Lặp nhiều bước → tới đáy (∇f → 0).
> η là "độ dài sải chân".

## 4. Các bước
- **⓪ Cho sẵn** · pill `f = x²+y²`: điểm xuất phát (2, 1), η = 0.1. (`.cell.given`)
- **① Gradient tại điểm** — `∇f = (2x, 2y) = (__, __)` → (4, 2). `.why`: ∇f chỉ hướng dốc lên gắt nhất; ta đi **ngược** để giảm f.
- **② Một bước** — `(2,1) − 0.1·(4,2) = (2−0.4, 1−0.2) = (__, __)` → (1.6, 0.8). `.hint`: trừ từng thành phần; η nhân vào gradient.
- **③ Bước tiếp** — tại (1.6,0.8): `∇f=(3.2,1.6)`; `→ (1.6−0.32, 0.8−0.16) = (__, __)` → (1.28, 0.64). `.why`: gần đáy hơn → gradient nhỏ dần → bước ngắn dần.
- **④ Vai trò η** · pill `quá lớn / quá nhỏ` — `.note`: η lớn (vd 1.0) → `(2,1)−1·(4,2)=(−2,−1)` **vọt qua** đáy, có thể phân kỳ; η quá nhỏ → bò
  chậm. SVG: đường đồng mức tròn + quỹ đạo các bước về tâm (0,0).

## 5. Tự kiểm tra (`.quiz`)
1. Đi theo hướng nào để giảm f? → `.qa` **Ngược gradient (−∇f).**
2. η quá lớn gây gì? → `.qa` **Vọt qua đáy, dao động/phân kỳ.**

## 6. Rút ra
> **Rút ra.** GD = lặp (x,y) ← (x,y) − η∇f; gần đáy bước tự ngắn lại; η phải vừa. Bài tiếp (12): tính ∇ cho mạng nhiều lớp bằng
> **backpropagation**.

## 7. `data-q` & số mẫu
- Sinh điểm xuất phát nguyên nhỏ, η ∈ {0.1, 0.2}; hàm dạng x²+y² (hoặc có hệ số). Tính 2 bước.
- Khóa: `x0,y0`, `eta`; `gx,gy`; `x1,y1`, `x2,y2`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| ∇f(2,1) | (4, 2) |
| sau bước 1 | (1.6, 0.8) |
| sau bước 2 | (1.28, 0.64) |
