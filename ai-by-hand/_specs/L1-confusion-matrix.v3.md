# SPEC v3 — L1 · Ma trận nhầm lẫn (bản HIỂU RÕ, A4 dọc)

> **v3 = LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File: `K4/L1-confusion-matrix-hieu-ro.html`. KHÔNG ghi đè canonical. Template H4/I5.

## 0. 2→**3 trang (2 ĐỀ+1 ĐÁP ÁN)**; 1→**2 hình** (figConf, figPR); thẻ vai trò; ĐÁP ÁN badge ✓.

## 1. Định vị: `Acc=(TP+TN)/tổng, P=TP/(TP+FP), R=TP/(TP+FN), F1=2PR/(P+R)`. Phiếu TP,TN∈[6,9], FP,FN∈[1,3].

## 2. Mã màu: `COK='#0e7490'(đúng TP/TN), CBAD='#b45309'(sai FP/FN), CHL='#7c5cff'(vùng P/R)`. Legend: đúng lam · sai cam · Precision/Recall tím.

## 3. Trung thực: 4 ô ngẫu nhiên → P,R,F1 tính được, tròn 2 chữ số. Ma trận: rows=thực tế(+,−), cols=dự đoán(+,−); TP/TN chéo.

## 4. Layout: T1 ĐỀ intro+legend+intuition+given+Cụm1(figConf+calc2 Acc); T2 ĐỀ Cụm2(figPR khoanh cột P+hàng R+calc2 P,R)+Cụm3(F1 calc2)+Cụm4(đánh đổi note); T3 ĐÁP ÁN 4 keylist. calc2 cụm1,2,3.

## 5. data-q: given `TP,FP,FN,TN,total`; ĐÁP ÁN `acc,prec,rec,f1`.

## 6. Sơ đồ:
| id | viewBox | Đ/T | dạy | bất biến |
|---|---|---|---|---|
| figConf | 260×140 80×43mm | ĐỘNG | ma trận 2×2: chéo TP/TN (lam), ngoài FP/FN (cam) | chéo=đúng |
| figPR | 260×140 80×43mm | ĐỘNG | cùng ma trận + khoanh cột P (tím đứt) & hàng R (tím chấm) | P cột, R hàng |

## 7-9. `.legend/.qset/.qtag/.figcap/.calc2/.keylist` additive. `matrix()` helper, `matrixPR()` chồng khoanh R. Cả 2 ĐỘNG→WB.wire + init IIFE.

## 10. Nghiệm thu đạt: tràn 0px×5 · de-key 0 lệch · ảnh 2 trang ĐỀ · console sạch. (Đã dọn hàm generate() chết.)

## 11. Bất biến: chéo=đúng; P theo cột báo+, R theo hàng thực+; FP↑→P↓, FN↑→R↓; F1 điều hòa phạt cái thấp; lệch lớp → Acc bẫy.
