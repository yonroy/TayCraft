# SPEC — F5 · Max / Average Pooling (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `F5-pooling` · English *Pooling* · ~11 phút.
> Tiền đề: F2 (kích thước), 16 (conv).

## 1. Định vị
**Thu nhỏ** feature map bằng cách tóm tắt mỗi cửa sổ thành một số: max (giá trị mạnh nhất) hoặc average (trung bình). Giảm tính toán & cho bất biến vị trí nhẹ.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Sau khi dò đặc trưng, ta không cần biết **chính xác từng pixel** — chỉ cần "có đặc trưng đó quanh đây". Pooling
  nén vùng → giảm kích thước, giảm tham số lớp sau, và làm mạng **ít nhạy với dịch chuyển nhỏ**.
- `.formula`:
  ```
  Max pool:  out = max(cửa sổ)      Avg pool:  out = trung bình(cửa sổ)      (thường 2×2, stride 2)
  ```

## 3. Trực giác (`.intuition`)
> Max pooling = "**vùng này có thấy đặc trưng mạnh không?**" → giữ tín hiệu mạnh nhất, bỏ vị trí chính xác. Average pooling = "**trung
> bình vùng**" → mượt hơn. Cả hai **thu nhỏ** ảnh và làm mạng bền với dịch chuyển nhỏ.

## 4. Các bước
- **⓪ Cho sẵn** · pill `4×4 → 2×2`: feature map [[1,3,2,4],[2,0,1,1],[5,6,0,2],[1,2,3,4]], cửa sổ 2×2 stride 2. (`.cell.given`)
- **① Max pool ô trái-trên** — cửa sổ [[1,3],[2,0]] → `max = __` → 3. `.why`: giữ phản hồi mạnh nhất → "đặc trưng có ở vùng này".
- **② Avg pool cùng ô** — `(1+3+2+0)/4 = __` → 1.5. `.hint`: max nhạy đỉnh, avg mượt nhiễu.
- **③ Hoàn tất max pool** — 4 ô: `[[3, 4], [6, 4]]` (điền). `.why`: ảnh 4×4 → 2×2, giảm ¾ số phần tử mà giữ "điểm nóng" đặc trưng.
- **④ Tính chất** · pill `bất biến dịch nhẹ` — `.note`: dịch ảnh 1 pixel thường **không đổi** kết quả max pool → bền với dịch chuyển nhỏ. Pooling **không có
  tham số** học. Xu hướng hiện đại: thay bằng conv stride-2. SVG: lưới 4×4 chia 4 cửa sổ → 2×2.

## 5. Tự kiểm tra (`.quiz`)
1. Max vs average pooling khác gì? → `.qa` **Max giữ giá trị mạnh nhất; average lấy trung bình (mượt hơn).**
2. Pooling có tham số học không? → `.qa` **Không — chỉ là phép tóm tắt cố định.**

## 6. Rút ra
> **Rút ra.** Pooling tóm tắt cửa sổ → thu nhỏ + bất biến dịch nhẹ, không tham số. Bài tiếp (F6): tầm nhìn của một nơ-ron sâu —
> receptive field.

## 7. `data-q` & số mẫu
- Sinh feature map 4×4 số nguyên nhỏ; tính max & avg cho từng cửa sổ 2×2.
- Khóa: 16 ô vào; `max1..4`, `avg1` (mẫu).

## Phụ lục — số mẫu
| | KQ |
|---|---|
| max (ô TL) | 3 |
| avg (ô TL) | 1.5 |
| max pool | [[3,4],[6,4]] |
