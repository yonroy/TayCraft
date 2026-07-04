# SPEC v3 — M3 · Triplet loss (bản HIỂU RÕ, A4 dọc)

> **v3 = LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File: `K4/M3-triplet-loss-hieu-ro.html`. KHÔNG ghi đè canonical. Template H4/I5.

## 0. 2→**3 trang**; 1→**1 hình** (figTr); thẻ vai trò; ĐÁP ÁN badge ✓.

## 1. Định vị: `L=max(0, d(a,p)−d(a,n)+margin)`; =0 khi d(a,n)≥d(a,p)+margin. Phiếu margin∈{1,2}.

## 2. Mã màu: `CA='#0e7490'(neo a), CP='#7c5cff'(dương p), CN='#b45309'(âm n), CMAR='#159a6b'(vòng lề)`. Legend: a lam · p tím · n cam.

## 3. Trung thực: dap∈[2,4], dan∈[1,3]; guard inner>0 (ca cho sẵn là vi phạm). Ca "đã thỏa" cố định d(a,p)=2,d(a,n)=4 → L=0. margin xanh lá là ngoại lệ semantic (vòng an toàn).

## 4. Layout: T1 ĐỀ intro+legend+intuition+given+Cụm1(figTr+calc2 biểu thức); T2 ĐỀ Cụm2(loss calc2)+Cụm3(ca đã thỏa calc2)+Cụm4(hard mining note); T3 ĐÁP ÁN 4 keylist. calc2 cụm1,2,3.

## 5. data-q: given `margin,dap,dan,innerOk`; ĐÁP ÁN `inner,loss,lossOk,verdict`.

## 6. Sơ đồ:
| id | viewBox | Đ/T | dạy | bất biến |
|---|---|---|---|---|
| figTr | 250×130 76×42mm | ĐỘNG | a (lam), p (tím) gần, n (cam), vòng lề = d(a,p)+margin (xanh) | n trong vòng lề = vi phạm |

## 7-9. `.legend/.qset/.qtag/.figcap/.calc2/.keylist` additive. `drawTriplet` ĐỘNG→generate().

## 10. Nghiệm thu đạt: tràn 0px×5 · de-key 0 lệch · console sạch.

## 11. Bất biến: biểu thức>0 → vi phạm; L=max(0,·); L=0 khi cách đủ lề (không học thừa); hard negative → tín hiệu mạnh.
