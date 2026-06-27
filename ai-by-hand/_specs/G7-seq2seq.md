# SPEC — G7 · Seq2seq encoder → decoder (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `G7-seq2seq` · English *Seq2seq* · ~13 phút.
> Tiền đề: 21 (RNN), G3 (BPTT). Dẫn sang attention (Phần H).

## 1. Định vị
**Hai RNN nối nhau**: encoder nén chuỗi vào → một **vectơ ngữ cảnh c**; decoder sinh chuỗi ra từ c. Khung dịch máy trước Transformer.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Dịch/ tóm tắt = ánh xạ **chuỗi → chuỗi** độ dài khác nhau. Seq2seq tách "hiểu" (encoder) khỏi "sinh" (decoder).
  Điểm yếu — nhồi cả câu vào **một** vectơ c — chính là động lực ra đời **attention** (Phần H).
- `.formula`:
  ```
  Encoder: c = hₙ (trạng thái cuối sau khi đọc x₁…xₙ)
  Decoder: s₀ = c;  sₜ = RNN(yₜ₋₁, sₜ₋₁);  yₜ = softmax(W·sₜ)
  ```

## 3. Trực giác (`.intuition`)
> Encoder như người **đọc xong cả câu rồi tóm tắt vào một mẩu giấy** (c). Decoder cầm mẩu giấy đó **viết ra câu dịch**, từng từ một,
> mỗi từ dựa trên giấy tóm tắt + từ vừa viết.

## 4. Các bước
- **⓪ Cho sẵn** · pill `encoder 3 bước`: đọc x = (x₁,x₂,x₃) ra trạng thái cuối c = (2, 1). Decoder bắt đầu từ s₀ = c. (`.cell.given`)
- **① Nén thành ngữ cảnh** — toàn bộ câu vào dồn vào `c = (2, 1)`. `.why`: c là "bản tóm tắt" cố định độ dài, **bất kể câu dài ngắn**.
- **② Decoder bước 1** — `s₁` tính từ token mở đầu `<bos>` & s₀=c; `y₁ = softmax(W·s₁)` → token đầu ra. `.hint`: decoder là RNN khác, khởi tạo bằng c.
- **③ Sinh tiếp** — `y₂` dựa trên `y₁` vừa sinh & s₁; lặp tới khi gặp `<eos>`. `.why`: tự hồi quy — từ trước làm đầu vào cho từ sau.
- **④ Nút thắt cổ chai** · pill `→ attention` — `.note`: nhồi câu dài vào **một** c → mất chi tiết, dịch kém ở câu dài. **Attention** (Phần H) cho decoder nhìn lại
  **mọi** trạng thái encoder thay vì chỉ c → cú nhảy vọt dẫn tới Transformer. SVG: encoder→c→decoder, mũi tên tự hồi quy.

## 5. Tự kiểm tra (`.quiz`)
1. Vectơ ngữ cảnh c là gì? → `.qa` **Bản tóm tắt cố định-độ-dài của cả chuỗi vào (trạng thái cuối encoder).**
2. Điểm yếu của seq2seq cơ bản? → `.qa` **Nhồi cả câu vào một c → mất thông tin câu dài (→ cần attention).**

## 6. Rút ra
> **Rút ra.** Seq2seq = encoder nén → c → decoder sinh tự hồi quy; nút thắt c dẫn tới attention. Bài tiếp (G8): chọn token khi sinh —
> Greedy vs Beam search.

## 7. `data-q` & số mẫu
- Sinh trạng thái cuối c (vectơ nhỏ); minh họa decoder khởi tạo từ c (chủ yếu sơ đồ + khái niệm).
- Khóa: `c1, c2`; token sinh minh họa.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| ngữ cảnh c | (2, 1) |
| decoder s₀ | = c |
