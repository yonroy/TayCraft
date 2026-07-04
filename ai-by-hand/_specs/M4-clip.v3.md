# SPEC v3 — M4 · CLIP đa phương thức (bản HIỂU RÕ, A4 dọc)

> **v3 = LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File: `K4/M4-clip-hieu-ro.html`. KHÔNG ghi đè canonical. Template H4/I5.

## 0. 2→**3 trang**; 1→**1 hình** (figMat); thẻ vai trò; ĐÁP ÁN badge ✓.

## 1. Định vị: ma trận S[i][j]=cos(ảnhᵢ,chữⱼ)/τ; loss = CE hàng+cột, chéo=cặp đúng → zero-shot. Phiếu 2×2, τ=1.

## 2. Mã màu: `CIMG='#0e7490'(ảnh hàng), CTXT='#b45309'(chữ cột), CDIAG='#7c5cff'(chéo cặp đúng)`. Legend: ảnh lam · chữ cam · chéo tím.

## 3. Trung thực: S ∈ 4 ma trận, chéo luôn ≥ off-diagonal (cặp đúng dominant). Bảng eˣ {0,1,2,3} + bảng −ln {0.95:0.05, 0.88:0.13, 0.73:0.31} cho sẵn.

## 4. Layout: T1 ĐỀ intro+legend+intuition+given(S, bảng eˣ+−ln)+Cụm1(figMat+calc2 softmax hàng1); T2 ĐỀ Cụm2(softmax hàng2 calc2)+Cụm3(loss calc2)+Cụm4(zero-shot note); T3 ĐÁP ÁN 4 keylist. calc2 cụm1,2,3.

## 5. data-q: given `s11,s12,s21,s22`; ĐÁP ÁN `e11,e12,e21,e22,sum1,sum2,p11,p12,p21,p22,loss`.

## 6. Sơ đồ:
| id | viewBox | Đ/T | dạy | bất biến |
|---|---|---|---|---|
| figMat | 250×130 70×42mm | ĐỘNG | ma trận 2×2 tương đồng, ô chéo viền tím, ô đậm=cao | chéo=cặp đúng |

## 7-9. `.legend/.qset/.qtag/.figcap/.calc2/.keylist/.extbl` additive. `drawMat` ĐỘNG→generate().

## 10. Nghiệm thu đạt: tràn 0px×5 · de-key 0 lệch · console sạch.

## 11. Bất biến: chéo=cặp đúng; softmax hàng → p chéo cao; loss=trung bình −ln p(chéo); zero-shot bằng caption chữ.
