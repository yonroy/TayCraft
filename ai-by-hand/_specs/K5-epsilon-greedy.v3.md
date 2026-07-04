# SPEC v3 — K5 · ε-greedy (bản HIỂU RÕ, A4 dọc)

> **v3 = LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File: `K4/K5-epsilon-greedy-hieu-ro.html`. KHÔNG ghi đè canonical. Template H4/I5.

## 0. 2→**3 trang (2 ĐỀ+1 ĐÁP ÁN)**; 1→**2 hình** (figProb, figEps); thẻ vai trò; ĐÁP ÁN badge ✓.

## 1. Định vị: `P(best)=1−ε+ε/n`, `P(khác)=ε/n`; khai thác↔khám phá. Phiếu n=3, ε∈{.1,.2,.3}.

## 2. Mã màu: `CBEST='#b45309'(khai thác), COTHER='#0e7490'(khám phá), CEPS='#7c5cff'(ε)`. Legend: best cam · khác lam · ε tím.

## 3. Trung thực: Q=(q1>q2>q3) → best=a1 cố định. ε/n cho sẵn (số lẻ 0.033) để tránh làm tròn khó. q1-3 chỉ để xác định best.

## 4. Layout: T1 ĐỀ intro+legend+intuition+given+Cụm1(figProb+calc2 P(best)); T2 ĐỀ Cụm2(P(khác)+kiểm tổng calc2)+Cụm3(figEps+Dự đoán)+Cụm4(note vì sao khám phá); T3 ĐÁP ÁN 4 keylist. calc2 cụm1,2.

## 5. data-q: given `eps,n,q1,q2,q3,best,epsOverN,oneMinus,nm1`; ĐÁP ÁN `pBest,pOther`.

## 6. Sơ đồ:
| id | viewBox | Đ/T | dạy | bất biến |
|---|---|---|---|---|
| figProb | 250×120 80×38mm | ĐỘNG | cột a1 cao (cam) vs khác thấp (lam), đỉnh "?", vạch 1.0 | Σ=1 |
| figEps | 280×100 92×33mm | ĐỘNG | thanh ε 0→1, điểm ε (tím) | ε nhỏ gần đầu |

## 7-9. `.legend/.qset/.qtag/.figcap/.calc2/.keylist` additive. `drawProb,drawEps` ĐỘNG→generate().

## 10. Nghiệm thu đạt: tràn 0px×5 · de-key 0 lệch (info q1-3) · console sạch.

## 11. Bất biến: P(best)+（n−1)P(khác)=1; ε=0 kẹt, ε=1 bỏ khai thác; tăng ε → khám phá nhiều.
