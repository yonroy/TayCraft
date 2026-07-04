# SPEC v3 — L3 · Cosine đo embedding (bản HIỂU RÕ, A4 dọc)

> **v3 = LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File: `K4/L3-cosine-eval-hieu-ro.html`. KHÔNG ghi đè canonical. Template H4/I5.

## 0. 2→**3 trang**; 1→**2 hình** (figVecs, figScale); thẻ vai trò; ĐÁP ÁN badge ✓.

## 1. Định vị: cos=a·b/25 (‖·‖=5); embedding tốt = cos(giống) cao vs cos(khác) thấp (tách bạch). Phiếu a,b,c 2D.

## 2. Mã màu: `CA='#0e7490'(a mốc), CB='#7c5cff'(b cùng nghĩa), CC='#b45309'(c khác nghĩa)`. Legend: a lam · b tím · c cam.

## 3. Trung thực: a∈{(3,4),(4,3)}, b cùng nghĩa (‖·‖=5), c=(−a_y,a_x) vuông góc a → cos(a,c)=0. Mẫu=25.

## 4. Layout: T1 ĐỀ intro+legend+intuition+given+Cụm1(figVecs+calc2 cos giống); T2 ĐỀ Cụm2(cos khác calc2)+Cụm3(figScale+calc2 chênh lệch)+Cụm4(ngưỡng note); T3 ĐÁP ÁN 4 keylist. calc2 cụm1,2,3.

## 5. data-q: given `ax,ay,bx,by,cx,cy,dotAB,dotAC`; ĐÁP ÁN `cosSame,cosDiff,gap`.

## 6. Sơ đồ:
| id | viewBox | Đ/T | dạy | bất biến |
|---|---|---|---|---|
| figVecs | 250×130 76×40mm | ĐỘNG | a(lam)&b(tím) sát, c(cam) vuông góc a | góc a-b nhỏ, a-c 90° |
| figScale | 260×100 86×33mm | ĐỘNG | thang cosine: giống (lam) cao, khác (cam) thấp, khoảng tách (tím) | giống>khác |

## 7-9. `.legend/.qset/.qtag/.figcap/.calc2/.keylist` additive. `drawVecs,drawScale` ĐỘNG→generate().

## 10. Nghiệm thu đạt: tràn 0px×5 · de-key 0 lệch · console sạch.

## 11. Bất biến: cos(giống) cao (~0.96), cos(khác)=0 (vuông góc); tách rộng=embedding tốt; kém→chồng lấn.
