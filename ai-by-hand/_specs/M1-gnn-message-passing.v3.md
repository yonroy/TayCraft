# SPEC v3 — M1 · GNN message passing (bản HIỂU RÕ, A4 dọc)

> **v3 = LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File: `K4/M1-gnn-message-passing-hieu-ro.html`. KHÔNG ghi đè canonical. Template H4/I5.

## 0. 2→**3 trang**; 1→**2 hình** (figGraph, figHops); thẻ vai trò; ĐÁP ÁN badge ✓.

## 1. Định vị: `h_v' = Update(h_v, Aggregate({h_u:u∈N(v)}))`; 1 lớp = 1 vòng lan tin; k lớp = bán kính k. Phiếu A + 2 hàng xóm, mean.

## 2. Mã màu: `CAGG='#0e7490'(tin gom agg), CA='#b45309'(nút A), CN='#7c5cff'(hàng xóm B,C)`. Legend: A cam · hàng xóm tím · agg lam.

## 3. Trung thực: A,B,C = randInt(0,2) 2D; agg=mean(B,C); h_A'=h_A+agg. Số nhỏ (nửa số lẻ .5). figHops minh họa k-hop (không số).

## 4. Layout: T1 ĐỀ intro+legend+intuition+given+Cụm1(figGraph+calc2 agg); T2 ĐỀ Cụm2(cập nhật calc2)+Cụm3(figHops+Dự đoán)+Cụm4(hoán vị note); T3 ĐÁP ÁN 4 keylist. calc2 cụm1,2.

## 5. data-q: given `ax,ay,bx,by,cx,cy`; ĐÁP ÁN `aggx,aggy,hx,hy`.

## 6. Sơ đồ:
| id | viewBox | Đ/T | dạy | bất biến |
|---|---|---|---|---|
| figGraph | 250×130 76×42mm | ĐỘNG | A (cam) nhận mũi tên (lam) từ B,C (tím) | tin đổ về A |
| figHops | 260×110 86×36mm | TĨNH | vòng đồng tâm quanh A: lớp1 bk1, lớp2 bk2 | mỗi lớp +1 bán kính |

## 7-9. `.legend/.qset/.qtag/.figcap/.calc2/.keylist` additive. `drawGraph` ĐỘNG→generate(); `drawHops` TĨNH.

## 10. Nghiệm thu đạt: tràn 0px×5 · de-key 0 lệch · ảnh 2 trang ĐỀ · console sạch.

## 11. Bất biến: agg=mean hàng xóm (bất biến hoán vị); h_A' trộn bản thân+hàng xóm; k lớp → bán kính k; quá sâu → over-smoothing.
