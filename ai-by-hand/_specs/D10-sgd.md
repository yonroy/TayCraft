# SPEC — D10 · SGD vanilla (1 mini-batch) (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `D10-sgd` · English *SGD* · ~12 phút.
> Tiền đề: D6 (gradient descent), 10 (một bước học).

## 1. Định vị
**Stochastic Gradient Descent**: ước lượng gradient trên một **mini-batch** nhỏ rồi cập nhật. Bộ tối ưu nền của deep learning.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Tính gradient trên **toàn bộ** dữ liệu mỗi bước quá đắt. SGD lấy **mẫu nhỏ** ước lượng gradient → cập nhật
  thường xuyên, nhanh hơn, và nhiễu của mini-batch còn giúp **thoát điểm yên ngựa**.
- `.formula`:
  ```
  g = (1/|B|) Σ_{i∈B} ∇Lᵢ      w ← w − η·g
  ```

## 3. Trực giác (`.intuition`)
> Thay vì hỏi **cả lớp** rồi mới bước (đắt, chính xác), SGD hỏi **vài người** rồi bước ngay. Mỗi bước hơi lệch (nhiễu) nhưng đi
> được **nhiều bước** hơn trong cùng thời gian → tổng thể tới đáy nhanh hơn.

## 4. Các bước
- **⓪ Cho sẵn** · pill `batch 3 mẫu`: trọng số w = 0.5; gradient từng mẫu trong batch g = (0.2, −0.4, 0.6); η = 0.3. (`.cell.given`)
- **① Gradient mini-batch** — `g = (0.2 + (−0.4) + 0.6)/3 = 0.4/3 = __` → 0.133. `.why`: trung bình gradient các mẫu = ước lượng gradient
  thật (không thiên lệch), rẻ hơn nhiều so với cả tập.
- **② Cập nhật** — `w ← 0.5 − 0.3·0.133 = 0.5 − 0.04 = __` → 0.46. `.hint`: bước ngược gradient một đoạn η.
- **③ Vì sao "stochastic"** — đổi batch khác → g khác chút → đường đi **răng cưa** nhưng vẫn hướng đáy. `.why`: nhiễu mini-batch là tính
  năng, không phải lỗi — giúp tránh kẹt cực tiểu địa phương nông.
- **④ batch size** · pill `nhỏ vs lớn` — `.note`: batch nhỏ → nhiễu nhiều, cập nhật nhanh, ít bộ nhớ; batch lớn → mượt, hợp GPU, cần η lớn hơn.
  SVG: quỹ đạo răng cưa của SGD vs đường mượt của full-batch về đáy.

## 5. Tự kiểm tra (`.quiz`)
1. SGD ước lượng gradient từ đâu? → `.qa` **Một mini-batch nhỏ (không phải cả tập).**
2. Nhiễu mini-batch có lợi gì? → `.qa` **Giúp thoát điểm yên ngựa / cực tiểu địa phương nông.**

## 6. Rút ra
> **Rút ra.** SGD = gradient trên mini-batch → w ← w − ηg; nhanh & nhiễu có ích. Nhưng nhiễu cũng làm chậm hội tụ → Bài tiếp (D11):
> **Momentum** làm mượt đường đi.

## 7. `data-q` & số mẫu
- Sinh w, η, và vài gradient mẫu nhỏ; tính trung bình & cập nhật.
- Khóa: `w`, `eta`, `g1,g2,g3`; `gAvg`, `wNew`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| g (batch) | 0.133 |
| w mới | 0.46 |
