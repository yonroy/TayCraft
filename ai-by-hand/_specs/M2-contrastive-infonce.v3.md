# SPEC v3 — M2 · Contrastive InfoNCE (bản HIỂU RÕ, A4 dọc)

> **v3 = LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File: `K4/M2-contrastive-infonce-hieu-ro.html`. KHÔNG ghi đè canonical. Template H4/I5.

## 0. 2→**3 trang**; 1→**1 hình** (figNCE); thẻ vai trò; ĐÁP ÁN badge ✓.

## 1. Định vị: `L=−ln[exp(sim(a,p))/Σexp(sim(a,x))]`; kéo dương gần đẩy âm xa; = cross-entropy chọn cặp dương. Phiếu 1 dương + 2 âm, τ=1.

## 2. Mã màu: `CA='#0e7490'(neo a), CP='#7c5cff'(dương p kéo gần), CN='#b45309'(âm n đẩy xa)`. Legend: a lam · dương tím · âm cam.

## 3. Trung thực: sp=2 (cao nhất); âm ∈ {[0,1],[1,1],[0,0]}. Bảng eˣ {0:1,1:2.72,2:7.39} + bảng −ln {0.79:0.24, 0.67:0.40, 0.58:0.54} cho sẵn (tránh tính ln).

## 4. Layout: T1 ĐỀ intro+legend+intuition+given(sim, bảng eˣ+−ln)+Cụm1(figNCE+calc2 mũ hóa); T2 ĐỀ Cụm2(Σ,p calc2)+Cụm3(loss calc2)+Cụm4(τ note); T3 ĐÁP ÁN 4 keylist. calc2 cụm1,2,3.

## 5. data-q: given `sp,sn1,sn2`; ĐÁP ÁN `ep,en1,en2,sum,pPos,loss`.

## 6. Sơ đồ:
| id | viewBox | Đ/T | dạy | bất biến |
|---|---|---|---|---|
| figNCE | 250×120 74×38mm | TĨNH | neo a (lam), dương p (tím) kéo gần, âm n (cam) đẩy xa | dương kéo, âm đẩy |

## 7-9. `.legend/.qset/.qtag/.figcap/.calc2/.keylist/.extbl` additive. `drawNCE` TĨNH; số đổi ở keylist qua generate().

## 10. Nghiệm thu đạt: tràn 0px×5 · de-key 0 lệch · console sạch.

## 11. Bất biến: eˣ dương lớn nhất; p=e^p/Σ; L=−ln p; giảm L kéo dương/đẩy âm; = cross-entropy; τ nhỏ & nhiều âm → phân biệt tốt.
