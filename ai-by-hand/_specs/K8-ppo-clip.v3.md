# SPEC v3 — K8 · PPO clip (bản HIỂU RÕ, A4 dọc)

> **v3 = LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File: `K4/K8-ppo-clip-hieu-ro.html`. KHÔNG ghi đè canonical. Template H4/I5.

## 0. 2→**3 trang (2 ĐỀ+1 ĐÁP ÁN)**; 1→**1 hình** (figClip); thẻ vai trò; ĐÁP ÁN badge ✓.

## 1. Định vị: `L=min(r·A, clip(r,1±ε)·A)`; chặn bước xa chính sách cũ. Phiếu ε=0.2, r>1+ε, A>0.

## 2. Mã màu: `CUN='#0e7490'(r·A chưa cắt), CCL='#b45309'(clip·A,L), CSAFE='#7c5cff'(vùng [1±ε])`. Legend: chưa cắt lam · đã cắt cam · vùng an toàn tím.

## 3. Trung thực: ratio∈{1.3,1.4} luôn >1+ε=1.2 → cắt về 1.2 (dạy cắt trần). A∈{2,3}>0. A<0 chỉ nhắc bằng lời (đối xứng).

## 4. Layout: T1 ĐỀ intro+legend+intuition+given+Cụm1(r·A calc2)+Cụm2(clip calc2); T2 ĐỀ Cụm3(figClip+calc2 min)+Cụm4(proximal note); T3 ĐÁP ÁN 4 keylist. calc2 cụm1,2,3.

## 5. data-q: given `eps,ratio,A,lo,hi,clipped`; ĐÁP ÁN `unclipped,clippedA,L`.

## 6. Sơ đồ:
| id | viewBox | Đ/T | dạy | bất biến |
|---|---|---|---|---|
| figClip | 250×120 82×40mm | ĐỘNG | L(r) dốc trong [1±ε] (tím) rồi phẳng; điểm r (cam) trên phần phẳng | phẳng ngoài 1+ε |

## 7-9. `.legend/.qset/.qtag/.figcap/.calc2/.keylist` additive. `drawClip` ĐỘNG→generate().

## 10. Nghiệm thu đạt: tràn 0px×5 · de-key 0 lệch · ảnh 2 trang ĐỀ · console sạch.

## 11. Bất biến: r>1+ε → cắt về 1+ε; L=min chọn bản đã cắt → phẳng (không thưởng thêm); giữ chính sách gần cũ → ổn định.
