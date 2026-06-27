# SPEC — E11 · Early stopping (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `E11-early-stopping` · English *Early stopping* · ~11 phút.
> Tiền đề: D1 (loss), E3 (overfit). Kết Phần E.

## 1. Định vị
Theo dõi **loss trên tập kiểm định (validation)**; dừng khi nó **không giảm nữa** dù train loss vẫn xuống. Chống overfit, tiết kiệm.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Train loss luôn giảm, nhưng quá lâu thì mô hình bắt đầu **học thuộc nhiễu** → val loss tăng lại. Early
  stopping bắt đúng "đỉnh khái quát": dừng ở val loss thấp nhất, lưu mô hình ở đó.
- `.formula`:
  ```
  Theo dõi val_loss; nếu không cải thiện trong "patience" epoch → dừng,
  khôi phục trọng số tại val_loss tốt nhất.
  ```

## 3. Trực giác (`.intuition`)
> Như **ôn thi**: học thêm giúp tới một điểm, sau đó **học tủ** làm điểm thi tụt. Early stopping = "ngừng học khi điểm thi thử bắt
> đầu tệ đi", giữ lại bản tốt nhất.

## 4. Các bước
- **⓪ Cho sẵn** · pill `patience=2`: val_loss qua 6 epoch = (0.50, 0.40, 0.35, **0.34**, 0.36, 0.38); train_loss vẫn giảm đều. (`.cell.given`)
- **① Tìm val thấp nhất** — nhỏ nhất = `__ tại epoch __` → 0.34 tại epoch 4. `.why`: đây là điểm khái quát tốt nhất — nơi ta muốn giữ mô hình.
- **② Đếm "không cải thiện"** — epoch 5 (0.36 > 0.34): xấu lần 1; epoch 6 (0.38): xấu lần 2 → đạt patience = 2. `.hint`: patience cho phép **dao động nhỏ**
  trước khi kết luận đã qua đỉnh.
- **③ Dừng & khôi phục** — dừng sau epoch 6, **khôi phục trọng số epoch 4** (val=0.34). `.why`: train loss thấp hơn ở epoch 6 nhưng đó là overfit → bỏ.
- **④ Đường cong** · pill `train↓ val↑` — `.note`: dấu hiệu overfit là **khoảng cách** train–val nới rộng. Early stopping rẻ và hiệu quả; thường đi kèm
  lưu checkpoint tốt nhất. SVG: hai đường train (giảm mãi) & val (chữ U), đánh dấu điểm dừng.

## 5. Tự kiểm tra (`.quiz`)
1. Dừng dựa trên loss nào? → `.qa` **Validation loss (không phải train loss).**
2. "Patience" để làm gì? → `.qa` **Cho phép dao động nhỏ trước khi kết luận đã qua đỉnh khái quát.**

## 6. Rút ra
> **Rút ra.** Early stopping = dừng khi val loss hết cải thiện, giữ bản tốt nhất; chống overfit, tiết kiệm. Hết Phần E. Sang Phần F
> (CNN) — Bài tiếp (16): một bộ lọc tích chập.

## 7. `data-q` & số mẫu
- Sinh chuỗi val_loss có đáy rõ rồi tăng; patience nhỏ.
- Khóa: `v1..v6`, `patience`; `best`, `bestEpoch`, `stopEpoch`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| val tốt nhất | 0.34 @ epoch 4 |
| dừng tại | epoch 6 (patience 2) |
| khôi phục | trọng số epoch 4 |
