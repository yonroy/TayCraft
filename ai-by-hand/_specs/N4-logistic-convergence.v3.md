# SPEC v3 — N4 · Logistic regression hội tụ (bản HIỂU RÕ, A4 dọc)

> **v3 = LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File: `K4/N4-logistic-convergence-hieu-ro.html`. KHÔNG ghi đè canonical. Template H4/I5. **Bài CUỐI khóa K4.**

## 0. 2→**3 trang**; 1→**1 hình** (figLoss); thẻ vai trò; ĐÁP ÁN badge ✓.

## 1. Định vị: 3 bước GD logistic: z=wx, p=σ(z), L=−ln(p_đúng), w←w−η(p−y)x; loss 0.69→0.48→0.34 → hội tụ. Phiếu η=1,x=1,w₀=0.

## 2. Mã màu: `CL='#0e7490'(loss/đường cong), CW='#b45309'(trọng số w), CP='#7c5cff'(xác suất p)`. Legend: loss lam · w cam · p tím.

## 3. Trung thực: y∈{0,1} (quỹ đạo đối xứng, L giảm như nhau). Bảng σ {0,0.5,0.9} + bảng −ln cho sẵn (σ(−z)=1−σ(z)). z bám 0→±0.5→±0.9.

## 4. Layout: T1 ĐỀ intro+legend+intuition+given(σ,−ln,y)+Cụm1(bước1 calc2 L₁,grad,w₁); T2 ĐỀ Cụm2(bước2 calc2)+Cụm3(bước3 calc2)+Cụm4(figLoss+hội tụ); T3 ĐÁP ÁN 4 keylist. calc2 cụm1,2,3.

## 5. data-q: given `y,p1,pc1,g1w,z2,p2,pc2,w1,g2w,z3,p3,pc3`; ĐÁP ÁN `L1,g1,w1,L2,w2,L3`.

## 6. Sơ đồ:
| id | viewBox | Đ/T | dạy | bất biến |
|---|---|---|---|---|
| figLoss | 250×120 80×38mm | ĐỘNG | đường loss (lam) giảm 0.69→0.48→0.34→thoải; điểm cam | đi xuống & thoải dần |

## 7-9. `.legend/.qset/.qtag/.figcap/.calc2/.keylist/.extbl` additive. `drawLoss` ĐỘNG→generate().

## 10. Nghiệm thu đạt: tràn 0px×5 · de-key 0 lệch · console sạch.

## 11. Bất biến: L giảm dần (gradient teo); w đổi ít dần; đường thoải = hội tụ; η lớn → dao động, nhỏ → chậm. **Kết khóa K4.**
