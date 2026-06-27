# SPEC — I10 · Chat template → token hóa (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `I10-chat-template` · English *Chat template* · ~11 phút.
> Tiền đề: I1 (tokenization), A20 (token rời rạc).

## 1. Định vị
LLM hội thoại không thấy "vai trò" — ta phải **gói tin nhắn** bằng **token đặc biệt** đánh dấu system/user/assistant trước khi token hóa.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Mô hình chỉ thấy một chuỗi token phẳng. Chat template thêm dấu mốc (vai + ranh giới lượt) để mô hình biết
  "ai đang nói" và "đến lượt mình trả lời". Sai template → mô hình trả lời lạc/loạn vai.
- `.formula`:
  ```
  <|im_start|>role  …nội dung…  <|im_end|>   (lặp cho từng tin nhắn) → nối → tokenize
  Kết bằng <|im_start|>assistant để mô hình "nối lời".
  ```

## 3. Trực giác (`.intuition`)
> Như **kịch bản sân khấu**: mỗi lượt thoại ghi rõ "[VAI]: lời" và dấu hết lượt. Mô hình đọc kịch bản, thấy "[assistant]:" ở cuối
> còn trống → nó **diễn tiếp** vai assistant. Token đặc biệt là các dấu mốc đó.

## 4. Các bước
- **⓪ Cho sẵn** · pill `2 tin nhắn`: system = "Bạn là trợ lý." · user = "Chào". Token đặc biệt: `<|im_start|>`, `<|im_end|>` (mỗi cái = 1 token). (`.cell.given`)
- **① Gói tin nhắn system** — `<|im_start|>system Bạn là trợ lý. <|im_end|>`. `.why`: dấu mốc cho mô hình biết đây là **chỉ dẫn hệ thống**, không phải lời người dùng.
- **② Gói tin nhắn user + mở lượt assistant** — `<|im_start|>user Chào <|im_end|> <|im_start|>assistant`. `.hint`: kết bằng `<|im_start|>assistant` (chưa có `<|im_end|>`) → mô hình hiểu "tới lượt mình".
- **③ Đếm token đặc biệt** — đã dùng `<|im_start|>` __ lần (3), `<|im_end|>` __ lần (2) → tổng token đặc biệt = __ → 5. `.why`: token đặc biệt cũng **tốn chỗ** trong cửa sổ ngữ cảnh; template dài ăn vào ngân sách token.
- **④ Vì sao đúng template quan trọng** · pill `khớp huấn luyện` — `.note`: phải dùng **đúng** định dạng mô hình được huấn luyện (mỗi model một kiểu: ChatML, Llama, …) → sai là lệch phân phối, trả lời kém. SVG: 2 khung tin nhắn → chuỗi token có mốc.

## 5. Tự kiểm tra (`.quiz`)
1. Vì sao cần token đặc biệt trong chat? → `.qa` **Đánh dấu vai & ranh giới lượt để mô hình biết ai nói / khi nào tới lượt.**
2. Chuỗi thường kết bằng gì để mô hình trả lời? → `.qa` **<|im_start|>assistant (mở lượt assistant đang trống).**

## 6. Rút ra
> **Rút ra.** Chat template gói tin nhắn bằng token đặc biệt đánh dấu vai/lượt; phải khớp định dạng huấn luyện. **Hết Phần I.**
> Tiếp Phần J (sinh) — Bài tiếp: VAE reparam + KL.

## 7. `data-q` & số mẫu
- Sinh số tin nhắn nhỏ; đếm token đặc biệt theo template.
- Khóa: nội dung tin nhắn; `nStart, nEnd, nSpecial`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| `<|im_start|>` | 3 |
| `<|im_end|>` | 2 |
| token đặc biệt | 5 |
