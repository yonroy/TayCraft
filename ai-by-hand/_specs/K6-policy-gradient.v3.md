# SPEC v3 — K6 · Policy Gradient (bản HIỂU RÕ, A4 dọc)

> **v3 = LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File: `K4/K6-policy-gradient-hieu-ro.html`. KHÔNG ghi đè canonical. Template H4/I5.

## 0. 2→**3 trang (2 ĐỀ+1 ĐÁP ÁN)**; 1→**1 hình** (figPi); thẻ vai trò; ĐÁP ÁN badge ✓.

## 1. Định vị: `θ←θ+α·G·∇log π`; ∇log π(a₁)=1−π(a₁); G dương nâng, âm hạ. Phiếu 2 hành động softmax.

## 2. Mã màu: `CPI='#0e7490'(π), CUPD='#b45309'(gradient·G,cập nhật), CG='#7c5cff'(return G)`. Legend: π lam · cập nhật cam · G tím. (figPi: trước tím, sau cam.)

## 3. Trung thực: pi1∈{.5,.6,.7}, pi2=1−pi1; G=randInt(2-3); grad=1−pi1. Cụm 3 dùng G âm (−G) minh họa hạ.

## 4. Layout: T1 ĐỀ intro+legend+intuition+given+Cụm1(grad calc2)+Cụm2(figPi+calc2 G·∇); T2 ĐỀ Cụm3(G âm calc2)+Cụm4(baseline note); T3 ĐÁP ÁN 4 keylist. calc2 cụm1,2,3.

## 5. data-q: given `alpha,pi1,pi2,G,Gneg,Gnegw`; ĐÁP ÁN `grad,upd,updNeg`.

## 6. Sơ đồ:
| id | viewBox | Đ/T | dạy | bất biến |
|---|---|---|---|---|
| figPi | 250×120 80×38mm | ĐỘNG | π trước (tím) vs sau (cam); G>0 → a₁ tăng | a₁ tăng, a₂ giảm (Σ=1) |

## 7-9. `.legend/.qset/.qtag/.figcap/.calc2/.keylist` additive. `drawPi` ĐỘNG→generate().

## 10. Nghiệm thu đạt: tràn 0px×5 · de-key 0 lệch (info pi2) · console sạch.

## 11. Bất biến: ∇log π=1−π (dương, bão hòa khi π→1); G·∇ dương nâng/âm hạ; |G| lớn → cập nhật mạnh; REINFORCE phương sai cao → baseline.
