# SPEC v3 — K4 · SARSA (bản HIỂU RÕ, A4 dọc)

> **v3 = LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File: `K4/K4-sarsa-hieu-ro.html`. KHÔNG ghi đè canonical. Template H4/I5.

## 0. 2→**3 trang (2 ĐỀ+1 ĐÁP ÁN)**; 1→**2 hình** (figTwo, figCliff); thẻ vai trò; ĐÁP ÁN badge ✓.

## 1. Định vị: `Q←Q+α(r+γQ(s',a')−Q)` a' THẬT (on-policy); thận trọng hơn Q-learning (max). Phiếu α∈{.5,.2}, γ∈{.9,.8}.

## 2. Mã màu: `CSA='#0e7490'(SARSA a'thật), CQL='#b45309'(Q-learn max), CD='#7c5cff'(TD)`. Legend: SARSA lam · Q-learning cam · TD tím.

## 3. Trung thực: maxQ=randInt(4-6), qNext=maxQ−randInt(1-2) < max (dạy a'thật<max). figCliff minh họa khái niệm (không số).

## 4. Layout: T1 ĐỀ intro+legend+intuition+given+Cụm1(mục tiêu SARSA calc2)+Cụm2(TD&Q mới calc2); T2 ĐỀ Cụm3(figTwo+calc2 đối chiếu)+Cụm4(figCliff+Dự đoán); T3 ĐÁP ÁN 4 keylist. calc2 cụm1,2,3.

## 5. data-q: given `alpha,gamma,Q,r,qNext,maxQ`; ĐÁP ÁN `targetS,targetS2,targetQ,tdS,QnewS,QnewQ`.

## 6. Sơ đồ:
| id | viewBox | Đ/T | dạy | bất biến |
|---|---|---|---|---|
| figTwo | 260×100 82×32mm | ĐỘNG | trục: mục tiêu SARSA (lam) < Q-learn (cam) | SARSA ≤ Q-learn |
| figCliff | 260×120 86×40mm | TĨNH | lưới vách đá: Q-learn sát mép (cam đứt), SARSA vòng an toàn (lam) | 2 đường khác nhau |

## 7-9. `.legend/.qset/.qtag/.figcap/.calc2/.keylist` additive. `drawTwo` ĐỘNG→generate(); `drawCliff` TĨNH.

## 10. Nghiệm thu đạt: tràn 0px×5 · de-key 0 lệch · ảnh 2 trang ĐỀ · console sạch.

## 11. Bất biến: a'thật≤max → SARSA≤Q-learning; on-policy tính rủi ro khám phá → an toàn; cùng công thức cập nhật, khác mục tiêu.
