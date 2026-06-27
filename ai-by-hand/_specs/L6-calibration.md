# SPEC — L6 · Calibration (độ tin cậy) (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `L6-calibration` · English *Calibration* · ~12 phút.
> Tiền đề: A16 (xác suất), L1 (accuracy).

## 1. Định vị
Mô hình "**hiệu chỉnh tốt**" khi nói "tôi chắc 80%" thì **đúng khoảng 80%** thời gian. ECE đo độ lệch giữa độ tin cậy và độ chính xác.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Mô hình thường **quá tự tin** (nói 99% nhưng chỉ đúng 90%). Trong y tế, tài chính, độ tin cậy phải **đáng tin** để
  ra quyết định. Calibration đo điều đó; mô hình lệch thì cần hiệu chỉnh (temperature scaling).
- `.formula`:
  ```
  Chia theo bin độ tin cậy.  ECE = Σ (nₘ/N)·| conf(bin m) − acc(bin m) |
  ```

## 3. Trực giác (`.intuition`)
> Gom dự đoán theo "mức tự tin" rồi kiểm: trong nhóm "tự tin 90%", có đúng **90%** thật không? Nếu chỉ đúng 80% → **quá tự tin** ở nhóm đó.
> ECE = trung bình (có trọng số) độ lệch "nói vs làm" trên mọi nhóm.

## 4. Các bước
- **⓪ Cho sẵn** · pill `2 bin, 10 mẫu`: bin 1 — độ tin cậy 0.9, đúng 4/5; bin 2 — độ tin cậy 0.6, đúng 3/5. (`.cell.given`)
- **① Accuracy mỗi bin** — `bin1: 4/5 = __ (0.8) ; bin2: 3/5 = __` → 0.6. `.why`: so độ chính xác thật với độ tin cậy mô hình tuyên bố.
- **② Độ lệch mỗi bin** — `|0.9 − 0.8| = __ (0.1) ; |0.6 − 0.6| = __` → 0. `.hint`: bin1 quá tự tin 0.1; bin2 khớp hoàn hảo.
- **③ ECE (trọng số theo số mẫu)** — `(5/10)·0.1 + (5/10)·0 = __` → 0.05. `.why`: ECE nhỏ → mô hình đáng tin về độ tự tin; lớn → cần hiệu chỉnh.
- **④ Hiệu chỉnh** · pill `temperature scaling` — `.note`: chia logits cho T > 1 làm softmax **bớt nhọn** → hạ độ tự tin về khớp accuracy. Vẽ **reliability diagram** (conf vs acc) để thấy lệch. SVG: đường chéo lý tưởng + cột bin lệch.

## 5. Tự kiểm tra (`.quiz`)
1. Mô hình "quá tự tin" nghĩa là gì? → `.qa` **Độ tin cậy tuyên bố cao hơn độ chính xác thực tế.**
2. ECE = 0 nghĩa là gì? → `.qa` **Độ tin cậy khớp hoàn toàn độ chính xác ở mọi bin.**

## 6. Rút ra
> **Rút ra.** Calibration: "nói X% thì đúng X%"; ECE đo lệch, temperature scaling hiệu chỉnh. Bài tiếp (L7): đếm chi phí tính toán — FLOPs.

## 7. `data-q` & số mẫu
- Sinh 2 bin (conf, số đúng/tổng); tính acc, lệch, ECE.
- Khóa: `conf1, conf2, n1ok, n2ok`; `acc1, acc2, gap1, gap2, ece`.

## Phụ lục — số mẫu
| bin | conf / acc | lệch |
|---|---|---|
| 1 | 0.9 / 0.8 | 0.1 |
| 2 | 0.6 / 0.6 | 0 |
| ECE | | 0.05 |
