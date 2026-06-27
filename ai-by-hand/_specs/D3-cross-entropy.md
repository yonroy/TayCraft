# SPEC — D3 · Cross-Entropy (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `17-cross-entropy` · English *Cross-Entropy* · ~12 phút.
> Tiền đề: 09 (softmax), A20 (one-hot), A18 (log). **Đã có phiếu** — spec để nâng cấp/tái tạo.

## 1. Định vị
Loss cho **phân loại nhiều lớp**: phạt theo `−ln(xác suất gán cho lớp đúng)`. Cặp đôi mặc định với softmax.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Cross-entropy đo "mô hình **bất ngờ** cỡ nào trước đáp án đúng". Ghép softmax + CE cho gradient gọn `p − y`
  (Bài D9) → là loss của hầu hết bộ phân loại và mọi language model.
- `.formula`:
  ```
  CE = −Σₖ yₖ·ln pₖ = −ln p_(lớp đúng)      (y one-hot)
  ```

## 3. Trực giác (`.intuition`)
> CE hỏi: "bạn đặt bao nhiêu **niềm tin** vào đáp án đúng?" Đặt nhiều (p gần 1) → loss ~0; đặt ít (p gần 0) → loss bùng nổ. Nó **thưởng
> sự tự tin đúng** và **phạt nặng tự tin sai**.

## 4. Các bước
- **⓪ Cho sẵn + bảng ln** · pill `3 lớp`: softmax p = (0.7, 0.2, 0.1); nhãn đúng = lớp 1 → one-hot y = (1, 0, 0). Bảng: `ln(0.7)=−0.36, ln(0.5)=−0.69, ln(0.1)=−2.30`. (`.cell.given`)
- **① Chỉ lớp đúng đóng góp** — `CE = −(1·ln 0.7 + 0·ln 0.2 + 0·ln 0.1)`. `.why`: yₖ = 0 ở các lớp sai → biến mất; chỉ còn số hạng lớp đúng.
- **② Tính** — `CE = −ln(0.7) = __` → 0.36. `.hint`: dùng bảng ln; p càng gần 1, CE càng gần 0.
- **③ So sánh tự tin** — nếu mô hình đoán đúng nhưng yếu `p=0.5`: `−ln(0.5) = __ (0.69)`; nếu sai chắc `p=0.1`: `−ln(0.1) = __` → 2.30 (lớn). `.why`: CE phân biệt rõ "đúng tự tin"
  với "đúng may rủi" với "sai".
- **④ Liên hệ gradient** · pill `p − y` — `.note`: softmax + CE → ∂CE/∂logit = p − y (Bài D9) → cập nhật nâng lớp đúng, hạ lớp sai. CE = entropy + KL (Bài D4). SVG: cột p, đánh dấu lớp đúng, đường −ln p.

## 5. Tự kiểm tra (`.quiz`)
1. CE chỉ phụ thuộc xác suất của lớp nào? → `.qa` **Lớp đúng (vì one-hot triệt các lớp khác).**
2. Mô hình tự tin sai bị CE phạt thế nào? → `.qa` **Rất nặng (−ln p → ∞ khi p → 0).**

## 6. Rút ra
> **Rút ra.** CE = −ln(p lớp đúng); thưởng tự tin đúng, phạt tự tin sai; ghép softmax cho gradient p−y. Bài tiếp (20): chuẩn hóa kích hoạt
> trong một mẫu — LayerNorm/RMSNorm.

## 7. `data-q` & số mẫu
- Chọn p lớp đúng rơi mốc bảng ln; one-hot theo lớp đúng.
- Khóa: `p1..p3`, `tidx`; `ce`; biến thể `ce05, ce01`.

## Phụ lục — số mẫu
| p lớp đúng | CE |
|---|---|
| 0.7 | 0.36 |
| 0.5 | 0.69 |
| 0.1 | 2.30 |
