# SPEC v3 — L7 · FLOPs một lớp (bản HIỂU RÕ, A4 dọc)

> **v3 = LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File: `K4/L7-flops-hieu-ro.html`. KHÔNG ghi đè canonical. Template H4/I5.

## 0. 2→**3 trang**; 1→**1 hình** (figLayer); thẻ vai trò; ĐÁP ÁN badge ✓.

## 1. Định vị: `MAC=in·out`, `FLOPs≈2·MAC`, ×batch; khác số tham số. Phiếu 1 lớp tuyến tính.

## 2. Mã màu: `CIN='#0e7490'(in), COUT='#b45309'(out), CMAC='#7c5cff'(MAC/FLOPs & dây)`. Legend: in lam · out cam · MAC/FLOPs tím.

## 3. Trung thực: nin∈{3,4,5}, nout∈{6,8,10}, batch∈{8,16,32}. Số nguyên nhỏ (bỏ bias không đáng kể).

## 4. Layout: T1 ĐỀ intro+legend+intuition+given+Cụm1(figLayer+calc2 MAC); T2 ĐỀ Cụm2(FLOPs=2MAC calc2)+Cụm3(batch calc2)+Cụm4(tham số≠FLOPs note); T3 ĐÁP ÁN 4 keylist. calc2 cụm1,2,3.

## 5. data-q: given `nin,nout,batch`; ĐÁP ÁN `mac,flops,flopsBatch`.

## 6. Sơ đồ:
| id | viewBox | Đ/T | dạy | bất biến |
|---|---|---|---|---|
| figLayer | 250×130 76×42mm | ĐỘNG | fully-connected in (lam) → out (cam), dây (tím) = in·out MAC | mỗi out nối mọi in |

## 7-9. `.legend/.qset/.qtag/.figcap/.calc2/.keylist` additive. `drawLayer` ĐỘNG→generate().

## 10. Nghiệm thu đạt: tràn 0px×5 · de-key 0 lệch · console sạch.

## 11. Bất biến: MAC=in·out; FLOPs=2·MAC; batch nhân FLOPs không nhân tham số; conv ít param nhiều FLOPs.
