# SPEC — D2 · Binary Cross-Entropy (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `D2-binary-cross-entropy` · English *BCE* · ~12 phút.
> Tiền đề: B3 (logistic), A18 (log). Dùng bảng tra ln.

## 1. Định vị
Loss cho **phân loại nhị phân**: phạt theo `−ln(xác suất gán cho nhãn đúng)`. Ghép với sigmoid thành bộ phân loại chuẩn.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** MSE không hợp cho xác suất (gradient yếu khi sai chắc). BCE phạt **rất nặng** khi mô hình tự tin mà sai
  (p→0 cho nhãn 1 → loss→∞), thúc mô hình chỉnh nhanh. Là loss của logistic regression và đầu ra nhị phân.
- `.formula`:
  ```
  BCE = −[ y·ln p + (1−y)·ln(1−p) ]      (y ∈ {0,1}, p = xác suất lớp 1)
  ```

## 3. Trực giác (`.intuition`)
> BCE hỏi: "mô hình gán bao nhiêu xác suất cho **đáp án đúng**?" Gán cao → loss nhỏ; gán thấp → loss lớn; gán ~0 cho đáp án đúng
> → loss bùng nổ. Tự tin mà sai bị phạt nặng nhất.

## 4. Các bước
- **⓪ Cho sẵn + bảng ln** · pill `2 mẫu`: (y=1, p=0.8) và (y=0, p=0.3). Bảng: `ln(0.8)=−0.22, ln(0.7)=−0.36, ln(0.3)=−1.20, ln(0.5)=−0.69`. (`.cell.given`)
- **① Mẫu y=1** — `BCE = −ln p = −ln(0.8) = __` → 0.22. `.why`: nhãn 1 nên chỉ còn số hạng −ln p; p càng gần 1 loss càng nhỏ.
- **② Mẫu y=0** — `BCE = −ln(1−p) = −ln(0.7) = __` → 0.36. `.hint`: nhãn 0 thì "xác suất đúng" là 1−p.
- **③ Trung bình batch** — `(0.22 + 0.36)/2 = __` → 0.29. `.why`: loss tổng = trung bình loss mỗi mẫu.
- **④ Phạt khi tự tin sai** · pill `−ln → ∞` — `nếu y=1, p=0.5: −ln(0.5) = __ (0.69)`; nếu p→0.01 thì −ln rất lớn. `.note`: gradient ghép
  sigmoid+BCE = `p − y` (gọn — Bài B3/D9). SVG: đường −ln p dốc đứng khi p→0.

## 5. Tự kiểm tra (`.quiz`)
1. BCE phạt nặng nhất khi nào? → `.qa` **Khi mô hình tự tin (p cực đoan) nhưng sai nhãn.**
2. Với y=0, "xác suất đúng" là gì? → `.qa` **1 − p (xác suất lớp 0).**

## 6. Rút ra
> **Rút ra.** BCE = −ln(xác suất nhãn đúng); phạt mạnh sai tự tin, gradient gọn với sigmoid. Bài tiếp (D4): so hai **phân phối** bằng
> KL divergence (tổng quát của cross-entropy).

## 7. `data-q` & số mẫu
- Chọn p rơi mốc bảng ln; y ∈ {0,1}.
- Khóa: `y1,p1,y2,p2`; `bce1, bce2`, `bceMean`.

## Phụ lục — số mẫu
| mẫu | BCE |
|---|---|
| y=1, p=0.8 | 0.22 |
| y=0, p=0.3 | 0.36 |
| trung bình | 0.29 |
