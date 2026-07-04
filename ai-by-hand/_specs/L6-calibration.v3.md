# SPEC v3 — L6 · Calibration (bản HIỂU RÕ, A4 dọc)

> **v3 = LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File: `K4/L6-calibration-hieu-ro.html`. KHÔNG ghi đè canonical. Template H4/I5.

## 0. 2→**3 trang**; 1→**1 hình** (figRel); thẻ vai trò; ĐÁP ÁN badge ✓.

## 1. Định vị: `ECE=Σ(nₘ/N)|conf−acc|`; mô hình đáng tin khi conf khớp acc. Phiếu 2 bin, N=10.

## 2. Mã màu: `CACC='#0e7490'(acc), CCONF='#b45309'(conf/lý tưởng), CGAP='#7c5cff'(độ lệch ECE)`. Legend: acc lam · conf(chéo) cam · lệch tím.

## 3. Trung thực: n1ok=randInt(3-5) → acc1 tùy (có thể quá/dưới tự tin); n2ok=round(conf2·5) → bin2 thường khớp (gap2≈0). ECE tròn 3 chữ số.

## 4. Layout: T1 ĐỀ intro+legend+intuition+given+Cụm1(figRel+calc2 acc); T2 ĐỀ Cụm2(lệch calc2)+Cụm3(ECE calc2)+Cụm4(temp scaling note); T3 ĐÁP ÁN 4 keylist. calc2 cụm1,2,3.

## 5. data-q: given `N,n1,n2,conf1,conf2,n1ok,n2ok`; ĐÁP ÁN `acc1,acc2,gap1,gap2,ece`.

## 6. Sơ đồ:
| id | viewBox | Đ/T | dạy | bất biến |
|---|---|---|---|---|
| figRel | 250×120 74×38mm | ĐỘNG | reliability: chéo lý tưởng (cam), cột acc (lam), khe hở=lệch (tím) | cột dưới chéo=quá tự tin |

## 7-9. `.legend/.qset/.qtag/.figcap/.calc2/.keylist` additive. `drawRel` ĐỘNG→generate().

## 10. Nghiệm thu đạt: tràn 0px×5 · de-key 0 lệch · ảnh 2 trang ĐỀ · console sạch.

## 11. Bất biến: acc=đúng/mẫu; lệch=|conf−acc|; ECE=trọng số nₘ/N; quá tự tin=conf>acc; temp T>1 hạ conf.
