# SPEC — N2 · Mini-CNN nhận chữ số (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `N2-mini-cnn` · English *Mini-CNN* · ~15 phút.
> Tiền đề: 16 (conv), F5 (pooling), 04 (ReLU), 03/09 (FC/softmax). **Capstone — có thể 3 trang.**

## 1. Định vị
Chạy **trọn luồng forward một CNN nhỏ** trên ảnh 3×3: conv → ReLU → pooling → flatten → lớp phân loại. Ráp Phần F lại.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Đây là "CNN tối giản" làm tay được từ pixel tới điểm lớp. Thấy rõ chuỗi: **dò đặc trưng** (conv) → **phi tuyến**
  (ReLU) → **thu nhỏ** (pool) → **quyết định** (FC). Hiểu nó là hiểu mọi CNN nhận diện ảnh.
- `.formula`:
  ```
  ảnh → Conv → ReLU → Pool → flatten → Linear → logit (→ softmax)
  ```

## 3. Trực giác (`.intuition`)
> Từng tầng **rút gọn & trừu tượng**: conv tìm cạnh/đốm, ReLU giữ tín hiệu mạnh, pool tóm vùng, flatten duỗi thành vectơ, lớp cuối **chấm
> điểm lớp**. Ảnh to → vài con số đặc trưng → một quyết định.

## 4. Các bước
- **⓪ Cho sẵn** · pill `ảnh 3×3`: X=[[1,2,0],[3,4,1],[0,1,2]]; kernel 2×2 K=[[1,0],[0,1]] (chéo); b=0. (`.cell.given`)
- **① Conv (2×2 đầu ra)** — góc trên-trái `1·1+4·1=5`; trượt → feature map `[[5, 3], [__, __]]` → hàng dưới `[7, 6]`. `.why`: mỗi ô là tích vô hướng kernel·vùng (Bài 16).
- **② ReLU** — feature map ≥ 0 → giữ nguyên `[[5,3],[7,6]]`. `.hint`: ở đây không có giá trị âm nên ReLU không đổi.
- **③ Max-pool 2×2** — toàn bản đồ thành một số: `max(5,3,7,6) = __` → 7. `.why`: giữ phản hồi mạnh nhất → "đặc trưng có xuất hiện", thu về 1 giá trị.
- **④ Flatten → FC → logit** · pill `phân loại` — flatten = (7); lớp cuối `logit = w·7 + b` (vd w=1,b=−2 → 5) → softmax/argmax ra lớp. `.note`: CNN thật nhiều kênh & lớp, nhưng **đúng luồng này** lặp lại. SVG: ảnh → conv → pool → vectơ → lớp.

## 5. Tự kiểm tra (`.quiz`)
1. Thứ tự các tầng CNN nhận ảnh? → `.qa` **Conv → ReLU → Pool → flatten → Linear.**
2. Pooling làm gì với feature map? → `.qa` **Thu nhỏ (tóm tắt vùng) → ít số hơn, bền dịch chuyển nhẹ.**

## 6. Rút ra
> **Rút ra.** Mini-CNN = conv → ReLU → pool → flatten → FC; rút gọn ảnh thành quyết định. Bài tiếp (N3): ráp một mini-GPT.

## 7. `data-q` & số mẫu
- Sinh ảnh 3×3 & kernel 2×2 nhỏ; tính conv (4 ô), ReLU, max-pool, logit.
- Khóa: ảnh, kernel; `c11,c12,c21,c22`, `pool`, `logit`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| feature map | [[5,3],[7,6]] |
| max-pool | 7 |
