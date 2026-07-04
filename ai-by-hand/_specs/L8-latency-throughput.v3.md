# SPEC v3 — L8 · Độ trễ & thông lượng (bản HIỂU RÕ, A4 dọc)

> **v3 = LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File: `K4/L8-latency-throughput-hieu-ro.html`. KHÔNG ghi đè canonical. Template H4/I5.

## 0. 2→**3 trang**; 1→**1 hình** (figThr); thẻ vai trò; ĐÁP ÁN badge ✓.

## 1. Định vị: `throughput=batch/thời-gian`; batch lớn → throughput↑ nhưng latency↑. Phiếu 2 cấu hình A (batch nhỏ) vs B (mẻ lớn).

## 2. Mã màu: `CA='#0e7490'(A batch nhỏ), CB='#b45309'(B batch lớn), CLAT='#7c5cff'(latency)`. Legend: A lam · B cam · latency tím.

## 3. Trung thực: A batch=1, tA∈{5,4,10}ms; B∈{[32,80],[16,40],[32,64],[16,32]}. throughput=batch/s. thrB>thrA (đánh đổi).

## 4. Layout: T1 ĐỀ intro+legend+intuition+given+Cụm1(throughput A calc2); T2 ĐỀ Cụm2(figThr+calc2 throughput B)+Cụm3(latency B note)+Cụm4(chọn note); T3 ĐÁP ÁN 4 keylist. calc2 cụm1,2.

## 5. data-q: given `batchA,tA,batchB,tB,tAs,tBs`; ĐÁP ÁN `thrA,thrB`.

## 6. Sơ đồ:
| id | viewBox | Đ/T | dạy | bất biến |
|---|---|---|---|---|
| figThr | 250×120 80×38mm | ĐỘNG | cột throughput A (lam) vs B (cam), nhãn latency (tím) | B throughput cao, latency cao |

## 7-9. `.legend/.qset/.qtag/.figcap/.calc2/.keylist` additive. `drawThr` ĐỘNG→generate().

## 10. Nghiệm thu đạt: tràn 0px×5 · de-key 0 lệch · ảnh 2 trang ĐỀ · console sạch.

## 11. Bất biến: throughput=batch/thời-gian; batch lớn → throughput↑ latency↑; chat→A (latency thấp), lô→B (throughput).
