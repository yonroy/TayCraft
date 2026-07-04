# SPEC v3 — K1 · Return &amp; Chiết khấu (bản HIỂU RÕ, A4 dọc)

> **v3 = v(n−1) + LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File: `K4/K1-return-discount-hieu-ro.html`. KHÔNG ghi đè canonical `K4/K1-return-discount.html`. Template mẫu H4/I5.

## 0. Khác biệt: 2 trang→**3 (2 ĐỀ+1 ĐÁP ÁN)**; 1 hình→**2** (figDisc, figCmp); câu hỏi thẻ vai trò; ĐÁP ÁN gọn badge ✓.

## 1. Định vị: `Gₜ=Σγᵏrₜ₊ₖ`; γ định tầm nhìn, giữ tổng hữu hạn. Phiếu: 3 bước, γ∈{0.5,0.9}.

## 2. Mã màu: `CR='#0e7490'(r), CG='#b45309'(γᵏrₖ,G), CGAM='#7c5cff'(γ)`. Legend: r lam · γᵏrₖ&G cam · γ tím. Thẻ: Quan sát lam·Tính cam·Dự đoán tím·Vì sao xám.

## 3. Trung thực: r=randInt (r₃≥1); γ∈{0.5,0.9} → γ² tra sẵn. Chuỗi hữu hạn 3 bước (minh họa vô hạn).

## 4. Layout: T1 ĐỀ intro+legend+intuition+given+Cụm1(figDisc+calc2 γᵏrₖ); T2 ĐỀ Cụm2(G calc2)+Cụm3(figCmp+calc2 G')+Cụm4(vì sao note); T3 ĐÁP ÁN 4 keylist badge ✓ + Rút ra→K2. calc2 cụm1,2,3. Parity ĐỀ{0..4}, key badge ✓ → 0 lệch.

## 5. data-q: given `gamma,r1,r2,r3,g2v,gamma2,g2b`; ĐÁP ÁN `d1,d2,d3,G,G2`. Sinh: r=randInt(0-3,r₃1-3), gamma pick([.5,.9]).

## 6. Sơ đồ:
| id | viewBox | Đ/T | dạy | bất biến |
|---|---|---|---|---|
| figDisc | 260×120 82×38mm | ĐỘNG | cột r thô (mờ) vs sau γᵏ (cam) thấp dần | cột xa thấp hơn |
| figCmp | 260×120 82×38mm | ĐỘNG | 2 γ: nhỏ (lam) tụt nhanh vs lớn (cam) giữ cao | γ lớn giữ thưởng xa |

## 7-9. `.legend/.qset/.qtag/.figcap/.calc2/.keylist` additive. `drawDisc,drawCmp` ĐỘNG→generate().

## 10. Nghiệm thu đạt: tràn 0px×5 · de-key 0 lệch · ảnh 2 trang ĐỀ · console sạch.

## 11. Bất biến: γᵏ giảm dần; G hữu hạn có trọng số; γ lớn → G lớn (coi trọng thưởng xa); γ→0 thiển cận.
