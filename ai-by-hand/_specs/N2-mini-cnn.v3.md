# SPEC v3 — N2 · Mini-CNN (bản HIỂU RÕ, A4 dọc)

> **v3 = LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File: `K4/N2-mini-cnn-hieu-ro.html`. KHÔNG ghi đè canonical. Template H4/I5.

## 0. 2→**3 trang**; 1→**1 hình** (figPipe); thẻ vai trò; ĐÁP ÁN badge ✓.

## 1. Định vị: ảnh 3×3 → Conv (kernel chéo) → ReLU → Max-pool → FC → logit. Kernel [[1,0],[0,1]] → conv[i][j]=X[i][j]+X[i+1][j+1].

## 2. Mã màu: `CIMG='#0e7490'(ảnh), CFEAT='#7c5cff'(feature map conv), COUT='#b45309'(pool & logit)`. Legend: ảnh lam · feature tím · pool&logit cam.

## 3. Trung thực: X = randInt(0,4) 3×3 (≥0 → ReLU không đổi). w∈{1,2}, b∈{−1,−2}. logit=w·pool+b.

## 4. Layout: T1 ĐỀ intro+legend+intuition+given(X,K)+Cụm1(figPipe+calc2 conv 4 ô); T2 ĐỀ Cụm2(ReLU calc2)+Cụm3(pool calc2)+Cụm4(logit calc2); T3 ĐÁP ÁN 4 keylist. calc2 cụm1,2,3,4.

## 5. data-q: given `x00..x22,w,bw`; ĐÁP ÁN `c11,c12,c21,c22,pool,logit`.

## 6. Sơ đồ:
| id | viewBox | Đ/T | dạy | bất biến |
|---|---|---|---|---|
| figPipe | 250×120 82×38mm | ĐỘNG | ảnh 3×3 (lam) → conv 2×2 (tím) → pool (cam) → logit (cam) | ít số dần |

## 7-9. `.legend/.qset/.qtag/.figcap/.calc2/.keylist` additive. `drawPipe` ĐỘNG→generate().

## 10. Nghiệm thu đạt: tràn 0px×5 · de-key 0 lệch (info x02,x20) · console sạch.

## 11. Bất biến: conv=kernel·vùng; ReLU cắt âm→0; pool=max (đặc trưng xuất hiện); logit=w·pool+b; luồng Conv→ReLU→Pool→FC.
