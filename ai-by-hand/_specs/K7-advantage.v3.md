# SPEC v3 — K7 · Advantage (bản HIỂU RÕ, A4 dọc)

> **v3 = LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File: `K4/K7-advantage-hieu-ro.html`. KHÔNG ghi đè canonical. Template H4/I5.

## 0. 2→**3 trang (2 ĐỀ+1 ĐÁP ÁN)**; 1→**2 hình** (figBase, figScatter); thẻ vai trò; ĐÁP ÁN badge ✓.

## 1. Định vị: `A=(r+γV')−V(s)`; thay G bằng A → giảm phương sai, không thiên lệch. Phiếu γ∈{.9,.8}.

## 2. Mã màu: `CV='#0e7490'(baseline V), CQ='#b45309'(Q,A), CG='#7c5cff'(G thô)`. Legend: V(s) lam · Q&A cam · G thô tím.

## 3. Trung thực: Vnext∈{8,10,12}, Vs=round(target)−randInt(1-2) → A>0 (dạy "trên kỳ vọng"). figScatter dùng điểm cố định (minh họa nhiễu).

## 4. Layout: T1 ĐỀ intro+legend+intuition+given+Cụm1(target calc2)+Cụm2(figBase+calc2 A); T2 ĐỀ Cụm3(figScatter+note thay G bằng A)+Cụm4(không lệch note); T3 ĐÁP ÁN 4 keylist. calc2 cụm1,2.

## 5. data-q: given `gamma,r,Vnext,Vs`; ĐÁP ÁN `target,A`.

## 6. Sơ đồ:
| id | viewBox | Đ/T | dạy | bất biến |
|---|---|---|---|---|
| figBase | 250×120 80×38mm | ĐỘNG | cột Q (cam) vs V (lam), phần vượt = A | A=Q−V |
| figScatter | 250×120 82×40mm | TĨNH | chấm G (tím) rộng vs A (cam) quanh 0 | A gom quanh 0 |

## 7-9. `.legend/.qset/.qtag/.figcap/.calc2/.keylist` additive. `drawBase` ĐỘNG→generate(); `drawScatter` TĨNH.

## 10. Nghiệm thu đạt: tràn 0px×5 · de-key 0 lệch · console sạch.

## 11. Bất biến: TD target≈Q; A=Q−V (A>0 trên kỳ vọng); A ít nhiễu hơn G; trừ baseline không lệch (E[∇logπ·V]=0).
