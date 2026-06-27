# SPEC — G9 · Teacher forcing (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `G9-teacher-forcing` · English *Teacher forcing* · ~11 phút.
> Tiền đề: G7 (seq2seq), 17 (cross-entropy). Kết Phần G.

## 1. Định vị
Mẹo huấn luyện decoder: lúc train, **cho ăn token đúng** (ground-truth) ở bước trước thay vì token mô hình tự đoán. Hội tụ nhanh, nhưng gây lệch train–test.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Nếu train mà cho decoder ăn **dự đoán sai của chính nó**, lỗi **dồn** ngay đầu → học rất chậm. Teacher forcing dùng
  đáp án đúng làm đầu vào → mỗi bước học độc lập, nhanh. Cái giá: lúc **suy luận** không có đáp án → **exposure bias**.
- `.formula`:
  ```
  Train (TF):       đầu vào bước t = yₜ₋₁ (token THẬT)
  Suy luận / free:  đầu vào bước t = ŷₜ₋₁ (token MÔ HÌNH tự sinh)
  ```

## 3. Trực giác (`.intuition`)
> Như **tập đàn có thầy bẻ tay**: mỗi nốt sai được thầy chỉnh ngay nên trò tiến nhanh. Nhưng khi **biểu diễn một mình**, một nốt sai
> kéo theo cả đoạn lệch — vì lúc tập chưa quen tự sửa lỗi của chính mình.

## 4. Các bước
- **⓪ Cho sẵn** · pill `câu đích "A B C"`: ở bước 2, token đúng trước đó là **B**; mô hình lại đoán **X** (sai). (`.cell.given`)
- **① Có teacher forcing** — đầu vào bước 2 = **B** (token thật) → mô hình học bước 2 trên ngữ cảnh **đúng**, lỗi bước 1 **không lan**. `.why`: mỗi bước được "đặt lại" về đường đúng → gradient sạch, hội tụ nhanh.
- **② Không teacher forcing (free-running)** — đầu vào bước 2 = **X** (dự đoán sai) → bước 2 học trên ngữ cảnh **hỏng** → lỗi **dồn**. `.hint`: đây đúng là cảnh lúc suy luận.
- **③ Exposure bias** — train luôn thấy token đúng, test phải tự đi bằng dự đoán → **lệch phân phối** → dễ trượt dài khi sinh. `.why`: mô hình chưa từng tập "phục hồi sau lỗi".
- **④ Dung hòa** · pill `scheduled sampling` — `.note`: trộn dần token tự sinh vào lúc train (xác suất tăng theo thời gian) để mô hình quen tự đi. Transformer vẫn dùng TF + masking
  song song. SVG: hai luồng decoder (TF dùng y thật vs free dùng ŷ).

## 5. Tự kiểm tra (`.quiz`)
1. Teacher forcing cho decoder ăn gì lúc train? → `.qa` **Token đúng (ground-truth) của bước trước.**
2. "Exposure bias" là gì? → `.qa` **Lệch train–test: train thấy token đúng, test phải tự đi bằng dự đoán.**

## 6. Rút ra
> **Rút ra.** Teacher forcing = cho ăn token thật khi train → nhanh, nhưng gây exposure bias (dung hòa bằng scheduled sampling). **Hết
> Phần G & khóa K2.** Tiếp theo (K3): cơ chế **attention** & Transformer (Phần H).

## 7. `data-q` & số mẫu
- Chủ yếu khái niệm; có thể random câu đích ngắn & token sai minh họa.
- Khóa: token đích & token dự đoán sai (minh họa).

## Phụ lục — ý chính
| chế độ | đầu vào bước t |
|---|---|
| Teacher forcing | yₜ₋₁ (thật) |
| Free-running / test | ŷₜ₋₁ (tự sinh) |
