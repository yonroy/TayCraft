# SPEC v3 — M5 · Knowledge distillation (bản HIỂU RÕ, A4 dọc)

> **v3 = LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File: `K4/M5-knowledge-distillation-hieu-ro.html`. KHÔNG ghi đè canonical. Template H4/I5.

## 0. 2→**3 trang**; 1→**1 hình** (figDist); thẻ vai trò; ĐÁP ÁN badge ✓.

## 1. Định vị: `soft=softmax(z/T)`; loss = α·CE(nhãn cứng) + (1−α)·T²·KL(soft thầy‖trò). Phiếu 3 lớp, T=2.

## 2. Mã màu: `CSOFT='#0e7490'(soft T cao), CHARD='#b45309'(hard T=1), CT='#7c5cff'(nhiệt độ T)`. Legend: soft lam · hard cam · T tím.

## 3. Trung thực: z ∈ 4 hoán vị {0,1,2}; T=2 cố định → z/T ∈ {0,0.5,1}; bảng eˣ (gồm e^0.5=1.65) cho sẵn. soft phẳng hơn hard.

## 4. Layout: T1 ĐỀ intro+legend+intuition+given(z, bảng eˣ)+Cụm1(figDist+calc2 soft); T2 ĐỀ Cụm2(so T=1 calc2)+Cụm3(loss KL+CE note)+Cụm4(T² note); T3 ĐÁP ÁN 4 keylist. calc2 cụm1,2.

## 5. data-q: given `T,z1-3,zt1-3,es1-3,sumS,hard1-3`; ĐÁP ÁN `soft1-3`.

## 6. Sơ đồ:
| id | viewBox | Đ/T | dạy | bất biến |
|---|---|---|---|---|
| figDist | 250×120 82×38mm | ĐỘNG | cột soft T=2 (lam, phẳng) vs hard T=1 (cam, nhọn) | soft phẳng hơn |

## 7-9. `.legend/.qset/.qtag/.figcap/.calc2/.keylist` additive. `drawDist` ĐỘNG→generate().

## 10. Nghiệm thu đạt: tràn 0px×5 · de-key 0 lệch (info z1-3) · console sạch.

## 11. Bất biến: chia T → phẳng hơn (lộ lớp nhỏ); soft giàu thông tin hơn hard; loss=KL soft+CE cứng; T² cân gradient.
