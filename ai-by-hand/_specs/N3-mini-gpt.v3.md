# SPEC v3 — N3 · Mini-GPT sinh token (bản HIỂU RÕ, A4 dọc)

> **v3 = LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File: `K4/N3-mini-gpt-hieu-ro.html`. KHÔNG ghi đè canonical. Template H4/I5.

## 0. 2→**3 trang**; 1→**1 hình** (figGPT); thẻ vai trò; ĐÁP ÁN badge ✓.

## 1. Định vị: token → Embed+PE → (attn causal → FFN) → logits → softmax → argmax = token kế. Phiếu 2 token, từ điển 3.

## 2. Mã màu: `CTOK='#0e7490'(token vào), CBLK='#7c5cff'(khối attn+FFN), COUT='#b45309'(logits & token kế)`. Legend: token lam · khối tím · logits&kế cam.

## 3. Trung thực: điểm attn ∈ {[0,1],[1,0]} (đã ÷√d); z = hoán vị {0,1,2}. eˣ tra bảng {0,1,2}. next=argmax(z)+1.

## 4. Layout: T1 ĐỀ intro+legend+intuition+given(att,z,eˣ)+Cụm1(figGPT+calc2 α); T2 ĐỀ Cụm2(FFN note)+Cụm3(softmax logits calc2)+Cụm4(argmax calc2); T3 ĐÁP ÁN 4 keylist. calc2 cụm1,3,4.

## 5. data-q: given `a1,a2,z1,z2,z3`; ĐÁP ÁN `ea1,ea2,sumA,al1,al2,p1,p2,p3,next`.

## 6. Sơ đồ:
| id | viewBox | Đ/T | dạy | bất biến |
|---|---|---|---|---|
| figGPT | 250×120 82×39mm | ĐỘNG | t₁,t₂ (lam) → khối attn+FFN (tím) → logits → token kế (cam) | argmax ra token kế |

## 7-9. `.legend/.qset/.qtag/.figcap/.calc2/.keylist/.extbl` additive. `drawGPT` ĐỘNG→generate().

## 10. Nghiệm thu đạt: tràn 0px×5 · de-key 0 lệch · console sạch.

## 11. Bất biến: mask causal chỉ nhìn quá khứ; attention trộn token, FFN từng vị trí; softmax logits → argmax = token kế; lặp = sinh câu.
