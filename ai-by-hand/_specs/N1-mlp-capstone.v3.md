# SPEC v3 — N1 · MLP capstone một vòng (bản HIỂU RÕ, A4 dọc)

> **v3 = LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File: `K4/N1-mlp-capstone-hieu-ro.html`. KHÔNG ghi đè canonical. Template H4/I5.

## 0. 2→**4 trang (3 ĐỀ+1 ĐÁP ÁN)**; 1→**2 hình** (figNet, figLoop); thẻ vai trò; ĐÁP ÁN badge ✓.

## 1. Định vị: trọn 1 vòng huấn luyện 2→2→1: forward (ReLU) → loss MSE → backward (δ, ∂W, ReLU'=0 nhánh tắt) → update. η=0.1.

## 2. Mã màu: `CX='#0e7490'(x vào/xuôi), CH='#7c5cff'(h ẩn), CO='#b45309'(o ra/gradient ngược)`. Legend: x lam · h tím · o&gradient cam.

## 3. Trung thực: W₁=[[1,1],[0,−1]], b₁=(0,1) cố định → z₂=−x₂+1<0 (x₂≥2) → nơ-ron ẩn 2 luôn TẮT (dạy ReLU'=0). x,W₂,b₂,t đổi khi 🎲.

## 4. Layout: T1 ĐỀ intro+legend+intuition+given(x,W,z,t)+Cụm1(figNet+calc2 h); T2 ĐỀ Cụm2(o,L calc2)+Cụm3(backward δ,∂W calc2); T3 ĐỀ Cụm4(update calc2)+Cụm5(figLoop vòng); T4 ĐÁP ÁN 4 keylist. calc2 cụm1,2,3,4.

## 5. data-q: given `x1,x2,w2a,w2b,b2,t,z1,z2`; ĐÁP ÁN `h1,h2,o,L,d2,gw2a,d1a,gw1a,gw1b,w2aNew,w2bNew,b2New`.

## 6. Sơ đồ:
| id | viewBox | Đ/T | dạy | bất biến |
|---|---|---|---|---|
| figNet | 250×120 80×38mm | ĐỘNG | 2-2-1: x(lam)→h(tím, h₂ tắt xám)→o(cam), δ₂ ngược | h₂ luôn tắt |
| figLoop | 380×70 150×28mm | TĨNH | Forward→Loss→Backward→Update, vòng quay lại | 4 pha lặp |

## 7-9. `.legend/.qset/.qtag/.figcap/.calc2/.keylist` additive. `drawNet` ĐỘNG→generate(); `drawLoop` TĨNH.

## 10. Nghiệm thu đạt: tràn 0px×5 · de-key 0 lệch (info x1,x2) · soát ảnh 3 trang ĐỀ · console sạch. (Sửa typo ReLR'→ReLU'.)

## 11. Bất biến: nơ-ron ẩn 2 tắt (z₂<0); ∂W₂ cột h₂=0; ∂W₁ hàng 2=(0,0) (ReLU'=0); update W←W−η∂W → L giảm; 4 pha lặp = huấn luyện.
