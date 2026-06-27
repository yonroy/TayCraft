# SPEC — A20 · One-hot encoding (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `A20-one-hot` · English *One-hot* · ~10 phút.
> Tiền đề: A17 (Categorical), A20 dẫn sang softmax/cross-entropy.

## 1. Định vị
Biến **nhãn rời rạc** (mèo/chó/…) thành **vectơ 0/1** để máy xử lý số. Đây là **nhãn đích** của cross-entropy.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Máy chỉ tính trên số, nhưng nhãn lớp **không có thứ tự** (mèo không "nhỏ hơn" chó). Gán 0,1,2,3
  vô tình tạo thứ tự giả. One-hot cho mỗi lớp một **trục riêng** → công bằng, và khớp đúng với đầu ra softmax.
- `.formula`:
  ```
  lớp k trong K lớp  →  vectơ dài K, vị trí k = 1, còn lại = 0      (Σ = 1)
  ```

## 3. Trực giác (`.intuition`)
> One-hot như một **dãy bóng đèn**: bật đúng **một** bóng (lớp đúng), tắt hết phần còn lại. Không bóng nào "to" hơn bóng nào
> — mọi lớp bình đẳng, chỉ khác **vị trí** sáng.

## 4. Các bước
- **⓪ Cho sẵn** · pill `K = 4`: các lớp = {mèo(0), chó(1), chim(2), cá(3)}; nhãn cần mã hóa = **"chó"**. (`.cell.given`)
- **① Tìm chỉ số lớp** — `"chó" → index __` → 1. `.why`: one-hot chỉ cần biết **vị trí** lớp, không cần giá trị độ lớn.
- **② Dựng vectơ one-hot** — điền 4 ô: `(__, __, __, __)` → (0, 1, 0, 0). `.hint`: đúng **một** số 1, đặt tại index tìm được.
- **③ Tính chất** — `tổng các ô = __ (1)`; one-hot **·** vectơ xác suất p = `pₖ` của lớp đúng. `.why`: nhân one-hot với
  dự đoán softmax sẽ **lọc ra đúng xác suất lớp thật** — chính là số đi vào cross-entropy `−ln pₖ`.
- **④ Nối với softmax/CE** · pill `nhãn đích` — SVG/`.note`: cột one-hot (nhãn thật) đặt cạnh cột softmax (dự đoán);
  CE phạt khi cột "1" của nhãn rơi vào lớp mà mô hình cho xác suất thấp. Giải mã ngược: **argmax** → tên lớp.

## 5. Tự kiểm tra (`.quiz`)
1. Tổng các phần tử của một vectơ one-hot bằng bao nhiêu? → `.qa` **1 (đúng một số 1).**
2. Vì sao không mã hóa lớp bằng 0,1,2,3 trực tiếp? → `.qa` **Tạo thứ tự/khoảng cách giả giữa các lớp vốn bình đẳng.**

## 6. Rút ra
> **Rút ra.** One-hot = bật một bóng đèn cho lớp đúng; tổng = 1, khớp với đầu ra softmax (Categorical, A17). Nhân one-hot với
> dự đoán = lấy xác suất lớp thật → nền của cross-entropy. **Hết Phần A (Toán nền)** — sẵn sàng sang ML cổ điển (Phần B) và nơ-ron (Phần C).

## 7. `data-q` & số động
- Sinh danh sách lớp cố định (hoặc `pick` bộ nhãn); chọn ngẫu nhiên nhãn đích trong danh sách → index & one-hot suy ra.
- Khóa: `labels` (tĩnh), `target`, `idx`; `oh0..oh3`; (tùy chọn) vectơ p mẫu để minh họa one-hot·p.

## Phụ lục — số mẫu
| | Kết quả |
|---|---|
| lớp "chó" | index 1 |
| one-hot | (0, 1, 0, 0) |
| Σ one-hot | 1 |
