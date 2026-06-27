# SPEC — L5 · Top-k accuracy (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `L5-topk-accuracy` · English *Top-k accuracy* · ~11 phút.
> Tiền đề: 09 (softmax), A20 (nhãn).

## 1. Định vị
Đoán **đúng nếu nhãn thật nằm trong k dự đoán xác suất cao nhất**. Nới lỏng "đúng tuyệt đối" cho bài nhiều lớp gần giống nhau.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Với 1000 lớp (ImageNet), bắt mô hình trúng **chính xác hạng 1** quá khắt khe khi nhiều lớp na ná. Top-5 accuracy
  đo "câu trả lời đúng có nằm trong vài ứng viên hàng đầu không" — sát cách dùng thực tế (gợi ý k lựa chọn).
- `.formula`:
  ```
  Top-k đúng ⇔ nhãn thật ∈ {k lớp có xác suất lớn nhất}
  ```

## 3. Trực giác (`.intuition`)
> Top-1 = "đoán trúng phóc". Top-k = "đáp án nằm trong **k tấm vé hàng đầu**". k lớn → dễ đúng hơn (top-k accuracy ≥ top-1). Hữu ích khi
> mô hình phân vân giữa vài lớp hợp lý.

## 4. Các bước
- **⓪ Cho sẵn** · pill `4 lớp`: xác suất dự đoán A=0.4, B=0.3, **C=0.2**, D=0.1; nhãn thật = **C**. (`.cell.given`)
- **① Xếp hạng** — giảm dần: `A(0.4) > B(0.3) > C(0.2) > D(0.1)` → nhãn thật C ở **hạng 3**. `.why`: top-k chỉ quan tâm **thứ hạng** của nhãn thật, không quan tâm giá trị tuyệt đối.
- **② Top-1** — dự đoán hạng 1 = A ≠ C → `top-1 = __` → SAI. `.hint`: top-1 chính là argmax.
- **③ Top-3** — {A, B, C} chứa C → `top-3 = __` → ĐÚNG. `.why`: nới k tới 3 thì nhãn thật lọt vào → tính đúng.
- **④ Đọc & dùng** · pill `k tăng → dễ đúng` — `.note`: top-k accuracy luôn ≥ top-1; báo cáo thường ghi cả hai (vd top-1 76%, top-5 93%). Hợp bài có nhiều lớp gần nhau hoặc giao diện gợi ý k đáp án. SVG: cột xác suất, đánh dấu nhãn thật & ngưỡng top-k.

## 5. Tự kiểm tra (`.quiz`)
1. Top-k đúng khi nào? → `.qa` **Khi nhãn thật nằm trong k lớp xác suất cao nhất.**
2. Quan hệ top-k và top-1? → `.qa` **Top-k accuracy ≥ top-1 (k lớn dễ đúng hơn).**

## 6. Rút ra
> **Rút ra.** Top-k accuracy = nhãn thật trong k hạng đầu; nới khắt khe cho bài nhiều lớp. Bài tiếp (L6): độ tin cậy có khớp độ chính xác không — calibration.

## 7. `data-q` & số mẫu
- Sinh xác suất nhiều lớp + nhãn thật; xác định hạng, top-1, top-3.
- Khóa: probs, `trueIdx`; `rank, top1, top3`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| hạng nhãn thật | 3 |
| top-1 | SAI |
| top-3 | ĐÚNG |
