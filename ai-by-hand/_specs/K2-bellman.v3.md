# SPEC v3 — K2 · Phương trình Bellman (bản HIỂU RÕ, A4 dọc)

> **v3 = v(n−1) + LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File: `K4/K2-bellman-hieu-ro.html`. KHÔNG ghi đè canonical. Template mẫu H4/I5.

## 0. Khác biệt: 2 trang→**3 (2 ĐỀ+1 ĐÁP ÁN)**; 1 hình→**2** (figBell, figContract); câu hỏi thẻ vai trò; ĐÁP ÁN gọn badge ✓.

## 1. Định vị: `V(s)=r+γV(s')`, `Q(s,a)=r+γmaxQ'`; gói tương lai vào 1 bước; γ<1 co→hội tụ. Phiếu: γ∈{.9,.5}.

## 2. Mã màu: `CS='#0e7490'(s,V(s)), CR='#b45309'(r,V/Q), CSP='#7c5cff'(s',V(s'))`. Legend: s&V(s) lam · r&kết quả cam · s'&V(s') tím.

## 3. Trung thực: r=randInt(1-3), vNext∈{8,10,12}, maxQ=vNext−randInt(1-3). Giá trị 1 bước (minh họa đệ quy vô hạn).

## 4. Layout: T1 ĐỀ intro+legend+intuition+given+Cụm1(figBell+calc2 V); T2 ĐỀ Cụm2(Q calc2)+Cụm3(figContract+Dự đoán)+Cụm4(note thuật toán); T3 ĐÁP ÁN 4 keylist. calc2 cụm1,2. Parity ĐỀ{0..4}, key badge ✓.

## 5. data-q: given `gamma,r,vNext,maxQ`; ĐÁP ÁN `V,Q`.

## 6. Sơ đồ:
| id | viewBox | Đ/T | dạy | bất biến |
|---|---|---|---|---|
| figBell | 260×110 86×36mm | ĐỘNG | s(lam)→r→s'(tím), V(s') nhân γ ngược về (cam) | 1 bước đệ quy |
| figContract | 260×110 82×35mm | TĨNH | V₀..V₄ co dần về V* (lam) | mỗi vòng gần V* hơn |

## 7-9. `.legend/.qset/.qtag/.figcap/.calc2/.keylist` additive. `drawBell` ĐỘNG→generate(); `drawContract` TĨNH.

## 10. Nghiệm thu đạt: tràn 0px×5 · de-key 0 lệch · ảnh 2 trang ĐỀ · console sạch.

## 11. Bất biến: V(s') gói tương lai; Q theo (s,a) & dùng max; γ<1 co→hội tụ duy nhất; thuật toán = giải xấp xỉ.
