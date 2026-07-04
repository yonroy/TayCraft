# SPEC v3 — L5 · Top-k accuracy (bản HIỂU RÕ, A4 dọc)

> **v3 = LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File: `K4/L5-topk-accuracy-hieu-ro.html`. KHÔNG ghi đè canonical. Template H4/I5.

## 0. 2→**3 trang**; 1→**2 hình** (figBars, figTopk); thẻ vai trò; ĐÁP ÁN badge ✓.

## 1. Định vị: Top-k đúng ⇔ nhãn thật ∈ {k lớp xác suất cao nhất}; top-k ≥ top-1. Phiếu 4 lớp.

## 2. Mã màu: `CP='#0e7490'(xác suất lớp), CTRUE='#b45309'(nhãn thật), CK='#7c5cff'(ranh giới top-k)`. Legend: lớp lam · nhãn thật cam · ranh giới top-k tím.

## 3. Trung thực: phân phối giảm dần, nhãn thật ở hạng 2/3/4 (top-1 SAI, top-3 tùy). figBars/figTopk cùng cột, chỉ khác đường top-3.

## 4. Layout: T1 ĐỀ intro+legend+intuition+given+Cụm1(figBars+calc2 hạng); T2 ĐỀ Cụm2(top-1 calc2)+Cụm3(figTopk+calc2 top-3)+Cụm4(dùng note); T3 ĐÁP ÁN 4 keylist. calc2 cụm1,2,3.

## 5. data-q: given `pA-pD,trueCls,top1Cls,top3Set`; ĐÁP ÁN `rank,top1,top3`.

## 6. Sơ đồ:
| id | viewBox | Đ/T | dạy | bất biến |
|---|---|---|---|---|
| figBars | 250×120 80×38mm | ĐỘNG | 4 cột xác suất giảm, nhãn thật viền cam (★) | giảm dần |
| figTopk | 250×120 80×38mm | ĐỘNG | cùng cột + đường ranh giới top-3 (tím) | nhãn thật trong/ngoài top-3 |

## 7-9. `.legend/.qset/.qtag/.figcap/.calc2/.keylist` additive. `bars(showTop3)` ĐỘNG→generate() gọi 2 lần.

## 10. Nghiệm thu đạt: tràn 0px×5 · de-key 0 lệch (info pA-D) · console sạch.

## 11. Bất biến: top-k chỉ xét thứ hạng; top-1 đúng ⇔ hạng=1; nới k → tập lớn → top-k ≥ top-1.
