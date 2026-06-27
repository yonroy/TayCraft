# SPEC — E10 · Mini-batch vs full-batch (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `E10-mini-batch` · English *Mini-batch* · ~11 phút.
> Tiền đề: D10 (SGD), A16 (kỳ vọng/phương sai).

## 1. Định vị
So ba chế độ ước lượng gradient: **full-batch** (cả tập), **mini-batch** (vài mẫu), **stochastic** (1 mẫu). Đánh đổi nhiễu ↔ tốc độ ↔ bộ nhớ.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Kích thước batch là siêu tham số ảnh hưởng tốc độ, ổn định, dùng GPU và cả khả năng khái quát. Hiểu nó để
  chọn đúng: mini-batch là điểm cân bằng được dùng phổ biến nhất.
- `.formula`:
  ```
  g_batch = (1/|B|) Σ_{i∈B} ∇Lᵢ      phương sai ước lượng ∝ 1/|B|
  ```

## 3. Trực giác (`.intuition`)
> Hỏi **cả nước** (full-batch) thì chính xác nhưng tốn; hỏi **vài người** (mini-batch) thì hơi lệch nhưng nhanh và đủ tốt; hỏi **một
> người** (SGD) thì rất nhiễu. Càng nhiều mẫu, ước lượng càng mượt (phương sai ∝ 1/|B|).

## 4. Các bước
- **⓪ Cho sẵn** · pill `8 mẫu`: gradient từng mẫu = (2, 0, 4, −2, 2, 2, 0, 4). (`.cell.given`)
- **① Full-batch** — trung bình cả 8: `(2+0+4−2+2+2+0+4)/8 = 12/8 = __` → 1.5. `.why`: ước lượng "thật" nhất nhưng phải duyệt cả tập mỗi bước.
- **② Mini-batch (4 mẫu đầu)** — `(2+0+4−2)/4 = 4/4 = __` → 1.0. `.hint`: lệch so với 1.5 → đó là **nhiễu** của mini-batch.
- **③ Stochastic (1 mẫu)** — lấy mẫu đầu: `g = __` → 2.0; lệch nhiều nhất. `.why`: phương sai ∝ 1/|B| → batch 1 nhiễu gấp 8 lần batch 8.
- **④ Đánh đổi** · pill `nhiễu ↔ tốc độ` — `.note`: batch nhỏ → cập nhật nhiều, ít bộ nhớ, nhiễu giúp khái quát; batch lớn → mượt, tận dụng GPU,
  cần η lớn hơn & dễ kẹt minima "nhọn". SVG: 3 quỹ đạo (mượt → răng cưa) về đáy.

## 5. Tự kiểm tra (`.quiz`)
1. Phương sai ước lượng gradient tỉ lệ thế nào với |B|? → `.qa` **∝ 1/|B| — batch lớn thì mượt hơn.**
2. Vì sao mini-batch phổ biến nhất? → `.qa` **Cân bằng tốc độ, bộ nhớ, nhiễu — hợp GPU.**

## 6. Rút ra
> **Rút ra.** Full/mini/stochastic đánh đổi nhiễu ↔ tốc độ ↔ bộ nhớ; mini-batch là điểm vàng. Bài tiếp (E11): biết khi nào **dừng**
> huấn luyện — early stopping.

## 7. `data-q` & số mẫu
- Sinh 8 gradient nguyên nhỏ; tính trung bình full, mini (4), single.
- Khóa: `g1..g8`; `full`, `mini`, `single`.

## Phụ lục — số mẫu
| chế độ | g ước lượng |
|---|---|
| full (8) | 1.5 |
| mini (4) | 1.0 |
| single (1) | 2.0 |
