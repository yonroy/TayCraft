# SPEC — G2 · RNN — một bước hồi quy (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `21-rnn-mot-buoc` · English *RNN step* · ~12 phút.
> Tiền đề: 05 (nơ-ron), C3 (tanh). **Đã có phiếu** — spec để nâng cấp/tái tạo. Mở đầu mạch RNN (Phần G).

## 1. Định vị
Một bước RNN: trạng thái mới `hₜ = tanh(W·xₜ + U·hₜ₋₁ + b)` — trộn **đầu vào hiện tại** với **trí nhớ** từ bước trước.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Văn bản, âm thanh, chuỗi thời gian có **thứ tự**. RNN xử lý từng bước nhưng **mang trí nhớ** hₜ₋₁ sang →
  "ghi nhớ" ngữ cảnh. Đây là ý tưởng nền của LSTM/GRU và mọi mô hình chuỗi trước Transformer.
- `.formula`:
  ```
  hₜ = tanh(W·xₜ + U·hₜ₋₁ + b)      (cùng W, U, b dùng lại mọi bước)
  ```

## 3. Trực giác (`.intuition`)
> RNN như **đọc truyện và cập nhật bản tóm tắt** sau mỗi từ: trạng thái h là "những gì nhớ tới giờ". Mỗi bước trộn từ mới (W·x) với
> tóm tắt cũ (U·h) → tóm tắt mới. Cùng một bộ quy tắc (W, U) áp cho mọi từ.

## 4. Các bước
- **⓪ Cho sẵn + bảng tanh** · pill `1 bước, scalar`: W=1, U=0.5, b=−0.25; đầu vào x=1; trí nhớ cũ h_prev=0.5. Bảng: `tanh(0)=0, tanh(0.5)=0.46, tanh(1)=0.76`. (`.cell.given`)
- **① Tổng tuyến tính (pre-activation)** — `W·x + U·h_prev + b = 1·1 + 0.5·0.5 + (−0.25) = 1 + 0.25 − 0.25 = __` → 1. `.why`: trộn đầu vào mới với trí nhớ cũ — như một nơ-ron có thêm "hồi tiếp".
- **② Qua tanh** — `hₜ = tanh(1) = __` → 0.76. `.hint`: tanh ép trạng thái về (−1,1) → không nổ qua nhiều bước.
- **③ Dùng cho bước sau** — hₜ = 0.76 trở thành **h_prev** của bước kế. `.why`: trí nhớ **cuốn chiếu** qua thời gian — đó là "hồi quy" (recurrent).
- **④ Trọng số dùng chung** · pill `cùng W,U mọi bước` — `.note`: W, U, b **không đổi** theo bước → mô hình xử lý chuỗi dài bất kỳ; nhưng nhân U nhiều lần gây vanishing/exploding (Bài E2/G3) → cần LSTM/GRU.
  SVG: ô RNN với vòng hồi tiếp h.

## 5. Tự kiểm tra (`.quiz`)
1. hₜ phụ thuộc những gì? → `.qa` **Đầu vào hiện tại xₜ và trí nhớ trước hₜ₋₁.**
2. Vì sao RNN dùng chung W, U mọi bước? → `.qa` **Để xử lý chuỗi độ dài bất kỳ với cùng bộ quy tắc.**

## 6. Rút ra
> **Rút ra.** RNN một bước = tanh(W·x + U·h_prev + b), trí nhớ cuốn chiếu, trọng số dùng chung. Bài tiếp (22): ô nhớ có cổng — LSTM
> (chống quên).

## 7. `data-q` & số mẫu
- Chọn pre-activation rơi mốc bảng tanh; W, U, b, x, h_prev nhỏ.
- Khóa: `W, U, b, x, hprev`; `pre`, `h`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| pre-activation | 1 |
| hₜ = tanh(1) | 0.76 |
