# SPEC — L1 · Ma trận nhầm lẫn → Acc/P/R/F1 (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `L1-confusion-matrix` · English *Confusion matrix* · ~13 phút.
> Tiền đề: A17 (phân loại). Mở đầu Phần L (Đánh giá, K4).

## 1. Định vị
Bảng 2×2 đếm **đúng/sai theo lớp** (TP, FP, FN, TN), từ đó tính Accuracy, Precision, Recall, F1 — bộ chỉ số phân loại cơ bản.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** "Độ chính xác" đơn lẻ **gây hiểu lầm** khi dữ liệu lệch lớp (99% âm → đoán toàn âm vẫn 99%). Precision/Recall/F1
  cho bức tranh thật: bắt sót (FN) hay báo nhầm (FP) nhiều? Đây là cách đọc chất lượng mô hình thực tế.
- `.formula`:
  ```
  Acc = (TP+TN)/tổng      P = TP/(TP+FP)      R = TP/(TP+FN)      F1 = 2PR/(P+R)
  ```

## 3. Trực giác (`.intuition`)
> **Precision** = "trong số ca tôi **báo dương**, bao nhiêu đúng?" (sợ báo nhầm). **Recall** = "trong số ca **thực sự dương**, tôi bắt được
> bao nhiêu?" (sợ bỏ sót). F1 là dung hòa hai cái. Chọn ưu tiên tùy bài (ung thư → trọng recall).

## 4. Các bước
- **⓪ Cho sẵn** · pill `20 mẫu`: TP = 8, FP = 2, FN = 2, TN = 8. (`.cell.given`)
- **① Accuracy** — `(TP+TN)/tổng = (8+8)/20 = __` → 0.8. `.why`: tỉ lệ đoán đúng chung — nhưng cẩn thận với dữ liệu lệch lớp.
- **② Precision & Recall** — `P = 8/(8+2) = __ (0.8) ; R = 8/(8+2) = __` → 0.8. `.hint`: P nhìn cột "báo dương"; R nhìn hàng "thực dương".
- **③ F1** — `F1 = 2·0.8·0.8/(0.8+0.8) = __` → 0.8. `.why`: F1 = trung bình điều hòa P, R → phạt mạnh nếu một trong hai thấp.
- **④ Đánh đổi P–R** · pill `ngưỡng` — `.note`: hạ ngưỡng → báo dương nhiều hơn → Recall ↑, Precision ↓ (và ngược lại). Đường cong P–R / ROC (L2) cho thấy đánh đổi này. SVG: bảng 2×2 tô TP/TN xanh, FP/FN đỏ.

## 5. Tự kiểm tra (`.quiz`)
1. Khi nào Accuracy gây hiểu lầm? → `.qa` **Khi dữ liệu lệch lớp (mất cân bằng).**
2. Recall đo gì? → `.qa` **Tỉ lệ ca thực sự dương được mô hình bắt được (TP/(TP+FN)).**

## 6. Rút ra
> **Rút ra.** Confusion matrix → Acc/P/R/F1; P sợ báo nhầm, R sợ bỏ sót, F1 dung hòa. Bài tiếp (L2): đánh đổi ngưỡng qua ROC & AUC.

## 7. `data-q` & số mẫu
- Sinh TP, FP, FN, TN nhỏ; tính 4 chỉ số.
- Khóa: `TP, FP, FN, TN`; `acc, prec, rec, f1`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| Acc | 0.8 |
| P, R | 0.8, 0.8 |
| F1 | 0.8 |
