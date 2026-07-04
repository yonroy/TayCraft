# SPEC v3 — L2 · ROC & AUC (bản HIỂU RÕ, A4 dọc)

> **v3 = LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File: `K4/L2-roc-auc-hieu-ro.html`. KHÔNG ghi đè canonical. Template H4/I5.

## 0. 2→**3 trang (2 ĐỀ+1 ĐÁP ÁN)**; 1→**2 hình** (figScores, figROC); thẻ vai trò; ĐÁP ÁN badge ✓.

## 1. Định vị: `AUC=P(điểm dương>điểm âm)`=cặp đúng/tổng cặp; ROC=TPR vs FPR theo ngưỡng. Phiếu 4 mẫu, pattern ∈{+-+-, ++--}.

## 2. Mã màu: `CPOS='#0e7490'(+), CNEG='#b45309'(−), CROC='#7c5cff'(ROC/AUC)`. Legend: dương lam · âm cam · ROC tím.

## 3. Trung thực: 4 điểm phân biệt sort giảm; pattern +-+- → AUC 0.75, ++-- → AUC 1. nPairs=nPos·nNeg.

## 4. Layout: T1 ĐỀ intro+legend+intuition+given+Cụm1(figScores+calc2 số cặp); T2 ĐỀ Cụm2(cặp đúng calc2)+Cụm3(figROC+calc2 AUC)+Cụm4(ngưỡng note); T3 ĐÁP ÁN 4 keylist. calc2 cụm1,2,3.

## 5. data-q: given `s0-s3,l0-l3,nPos,nNeg`; ĐÁP ÁN `nPairs,nCorrect,auc,pairNote`.

## 6. Sơ đồ:
| id | viewBox | Đ/T | dạy | bất biến |
|---|---|---|---|---|
| figScores | 270×100 90×33mm | ĐỘNG | trục điểm 0-1, chấm + (lam) & − (cam) theo điểm | bên phải điểm cao |
| figROC | 250×130 74×42mm | ĐỘNG | bậc thang ROC (tím) + chéo (cam); dương→lên, âm→phải | phình góc trên-trái = AUC lớn |

## 7-9. `.legend/.qset/.qtag/.figcap/.calc2/.keylist` additive. `drawScores,drawROC` ĐỘNG→generate().

## 10. Nghiệm thu đạt: tràn 0px×5 · de-key 0 lệch (info điểm/nhãn) · ảnh 2 trang ĐỀ · console sạch.

## 11. Bất biến: số cặp=nPos·nNeg; cặp sai=âm điểm>dương; AUC=đúng/tổng; mọi dương>âm→AUC=1; AUC=0.5 đoán mò.
