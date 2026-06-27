# SPEC — L2 · ROC & AUC (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `L2-roc-auc` · English *ROC & AUC* · ~13 phút.
> Tiền đề: L1 (confusion matrix).

## 1. Định vị
Đường ROC vẽ **TPR vs FPR** khi quét ngưỡng; **AUC** (diện tích dưới đường) đo khả năng **xếp hạng** dương trên âm — không phụ thuộc ngưỡng.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Một mô hình cho **điểm số**, ta chọn ngưỡng để quyết. ROC tóm tắt chất lượng ở **mọi ngưỡng**; AUC = một số duy
  nhất so sánh mô hình mà không cần cố định ngưỡng. AUC = xác suất xếp một dương ngẫu nhiên trên một âm ngẫu nhiên.
- `.formula`:
  ```
  TPR = TP/(TP+FN)   FPR = FP/(FP+TN)      AUC = P( điểm(dương) > điểm(âm) )
  ```

## 3. Trực giác (`.intuition`)
> Hạ ngưỡng → bắt được nhiều dương hơn (TPR ↑) nhưng cũng báo nhầm nhiều âm hơn (FPR ↑). ROC là quỹ đạo đánh đổi đó. AUC = 1: xếp hạng
> hoàn hảo (mọi dương điểm cao hơn mọi âm); AUC = 0.5: đoán mò (đường chéo).

## 4. Các bước
- **⓪ Cho sẵn** · pill `4 mẫu`: điểm & nhãn (giảm dần): 0.9(+), 0.6(−), 0.5(+), 0.2(−). (`.cell.given`)
- **① Đếm cặp (dương, âm)** — có 2 dương × 2 âm = `__` → 4 cặp. `.why`: AUC đếm tỉ lệ cặp được **xếp đúng** (dương > âm về điểm).
- **② Cặp xếp đúng** — `(0.9+ vs 0.6−)✓, (0.9+ vs 0.2−)✓, (0.5+ vs 0.6−)✗, (0.5+ vs 0.2−)✓` → __ cặp đúng → 3. `.hint`: cặp sai là khi một âm có điểm **cao hơn** một dương.
- **③ AUC** — `AUC = 3/4 = __` → 0.75. `.why`: 75% khả năng mô hình cho dương điểm cao hơn âm → xếp hạng khá tốt (> 0.5).
- **④ ROC & chọn ngưỡng** · pill `TPR vs FPR` — `.note`: mỗi ngưỡng cho một điểm (FPR, TPR) trên ROC; chọn ngưỡng theo nhu cầu (ưu tiên ít báo nhầm → FPR thấp). AUC độc lập ngưỡng. SVG: đường ROC bậc thang + đường chéo 0.5.

## 5. Tự kiểm tra (`.quiz`)
1. AUC = 0.5 nghĩa là gì? → `.qa` **Mô hình xếp hạng như đoán mò (đường chéo).**
2. ROC vẽ hai trục nào? → `.qa` **TPR (trục dọc) vs FPR (trục ngang) khi quét ngưỡng.**

## 6. Rút ra
> **Rút ra.** ROC = đánh đổi TPR/FPR theo ngưỡng; AUC = xác suất xếp dương trên âm, độc lập ngưỡng. Bài tiếp (L3): đo chất lượng embedding bằng cosine.

## 7. `data-q` & số mẫu
- Sinh điểm & nhãn 4–5 mẫu; đếm cặp đúng → AUC.
- Khóa: điểm/nhãn; `nPairs, nCorrect, auc`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| cặp đúng / tổng | 3 / 4 |
| AUC | 0.75 |
