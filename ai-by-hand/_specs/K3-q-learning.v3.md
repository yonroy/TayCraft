# SPEC v3 — K3 · Q-learning (bản HIỂU RÕ, A4 dọc)

> **v3 = v(n−1) + LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File: `K4/K3-q-learning-hieu-ro.html`. KHÔNG ghi đè canonical. Template mẫu H4/I5.

## 0. Khác biệt: 2→**3 trang (2 ĐỀ+1 ĐÁP ÁN)**; 1→**2 hình** (figGap, figPull); thẻ vai trò; ĐÁP ÁN gọn badge ✓.

## 1. Định vị: `Q←Q+α(r+γmaxQ'−Q)`; mục tiêu Bellman → TD error δ → cập nhật một phần α. off-policy. Phiếu: α∈{.5,.2}, γ∈{.9,.8}.

## 2. Mã màu: `CQ='#0e7490'(Q hiện), CT='#b45309'(mục tiêu,Q mới), CD='#7c5cff'(δ,α), CNEW='#16a34a'`. Legend: Q hiện lam · mục tiêu&Q mới cam · δ&α tím.

## 3. Trung thực: Q=randInt(1-3), r=randInt(1-3), maxQ=randInt(3-5) → δ>0 (dạy nâng Q). Q mới xanh lá (nhấn "mới").

## 4. Layout: T1 ĐỀ intro+legend+intuition+given+Cụm1(mục tiêu calc2)+Cụm2(figGap+calc2 δ); T2 ĐỀ Cụm3(figPull+calc2 Q mới)+Cụm4(off-policy note); T3 ĐÁP ÁN 4 keylist. calc2 cụm1,2,3. Parity ĐỀ{0..4}.

## 5. data-q: given `alpha,gamma,Q,r,maxQ`; ĐÁP ÁN `target,td,Qnew`.

## 6. Sơ đồ:
| id | viewBox | Đ/T | dạy | bất biến |
|---|---|---|---|---|
| figGap | 260×110 80×34mm | ĐỘNG | cột Q hiện (lam) vs mục tiêu (cam), gap=δ (tím) | δ=mục tiêu−Q |
| figPull | 260×96 84×31mm | ĐỘNG | trục Q cũ→Q mới(xanh)→mục tiêu, α phần | Q mới giữa Q cũ & mục tiêu |

## 7-9. `.legend/.qset/.qtag/.figcap/.calc2/.keylist` additive. `drawGap,drawPull` ĐỘNG→generate().

## 10. Nghiệm thu đạt: tràn 0px×5 · de-key 0 lệch · ảnh 2 trang ĐỀ · console sạch.

## 11. Bất biến: mục tiêu>Q (δ>0); Q mới nằm giữa (α<1); α=1→nhảy hẳn; dùng maxQ'→off-policy.
