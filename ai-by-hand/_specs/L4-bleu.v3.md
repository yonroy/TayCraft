# SPEC v3 — L4 · BLEU n-gram (bản HIỂU RÕ, A4 dọc)

> **v3 = LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File: `K4/L4-bleu-hieu-ro.html`. KHÔNG ghi đè canonical. Template H4/I5.

## 0. 2→**3 trang**; 1→**2 hình** (figWords, figLen); thẻ vai trò; ĐÁP ÁN badge ✓.

## 1. Định vị: `p₁=(trùng)/(số từ máy)`, `BP=exp(1−ref/cand)`, `BLEU=BP·p₁`. Phiếu chỉ 1-gram, câu ngắn.

## 2. Mã màu: `CMATCH='#0e7490'(từ máy trùng), CREF='#b45309'(từ tham chiếu), CBP='#7c5cff'(brevity penalty)`. Legend: trùng lam · tham chiếu cam · BP tím.

## 3. Trung thực: 5 cặp câu cho sẵn (SC), earg & eval (=BP=exp) tra bảng. matched đếm từ máy có trong ref. p₁ thường =1 (trùng hết) để dạy BP kéo xuống.

## 4. Layout: T1 ĐỀ intro+legend+intuition+given(cand,ref,eˣ)+Cụm1(figWords 2 hàng+calc2 p₁); T2 ĐỀ Cụm2(figLen+calc2 BP)+Cụm3(BLEU calc2)+Cụm4(hạn chế note); T3 ĐÁP ÁN 4 keylist. calc2 cụm1,2,3.

## 5. data-q: given `cand,ref,lc,lr,earg,eval`; ĐÁP ÁN `matched,p1,bp,bleu`.

## 6. Sơ đồ:
| id | viewBox | Đ/T | dạy | bất biến |
|---|---|---|---|---|
| figWords | 270×110 90×36mm | ĐỘNG | 2 hàng từ: câu máy (lam) & tham chiếu (cam), đối chiếu đếm trùng | neutral để đếm |
| figLen | 260×100 82×32mm | ĐỘNG | thanh độ dài: câu máy ngắn hơn, phần thiếu (tím) → BP<1 | máy < ref |

## 7-9. `.legend/.qset/.qtag/.figcap/.calc2/.keylist` additive. `drawWords,drawLen` ĐỘNG→generate().

## 10. Nghiệm thu đạt: tràn 0px×5 · de-key 0 lệch (info cand,ref) · ảnh 2 trang ĐỀ · console sạch.

## 11. Bất biến: p₁=trùng/số-từ-máy; BP<1 khi máy ngắn hơn ref (=1 khi bằng); BLEU=BP·p₁; đếm bề mặt không hiểu nghĩa.
