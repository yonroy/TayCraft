# SPEC v3 — I3 · Perplexity (bản HIỂU RÕ, A4 dọc)

> **v3 = v(n−1) + LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File HTML: `K3/I3-perplexity-hieu-ro.html`.
> Engine số giữ nguyên; KHÔNG ghi đè bản canonical `I3-perplexity.html`. Bám **TEMPLATE HIỂU-RÕ mới** (mẫu `H4`).

## 0. Khác biệt: 2 trang→**4 (3 ĐỀ+1 ĐÁP ÁN)**; 1 hình→**4** (figSurprise, figAvg, figPPL, figScale) đều trên ĐỀ; câu hỏi thẻ vai trò; ĐÁP ÁN gọn badge ✓.

## 1. Định vị bài
PPL = exp(cross-entropy trung bình) = "số token đều khả năng" mô hình phân vân; thấp = tốt. Phiếu: **3 token, p∈{0.5,0.25}**, bảng ln & eˣ.

## 2. Mã màu (hằng JS)
```js
var NL={0.5:0.69, 0.25:1.39};  // −ln p
var CP='#0e7490', CS='#b45309', CPP='#7c5cff', GRY='#5b6776';
```
- **p token đúng = lam** · **độ bất ngờ −ln p = cam** · **PPL = tím** · cấu trúc = xám. Legend: `p đúng (lam) · −ln p (cam) · PPL (tím)`.
- Thẻ vai trò: Quan sát=lam · Tính=cam · Dự đoán=tím · Vì sao=xám đậm.

## 3. Ghi chú trung thực
- p mỗi token ∈ {0.5, 0.25} → −ln ∈ {0.69, 1.39}. CE = trung bình → ∈ {0.69, 0.92, 1.16, 1.39} (theo số token p=0.25); PPL=e^CE ∈ {2.00, 2.51, 3.19, 4.00}.
- Bảng ln: ln0.5=−0.69, ln0.25=−1.39. Bảng eˣ: e^{0.69/0.92/1.16/1.39} = 2.00/2.51/3.19/4.00.
- figScale dùng **thang tuyến tính minh hoạ** (frac=(PPL−1)/12) — chỉ để định vị "gần trái = tốt", không phải trục log chuẩn.

## 4. Layout 4 trang
| Trang | Nội dung |
|---|---|
| 1 ĐỀ | intro+formula+legend · intuition · Bước 0 (p `.gv` + bảng ln,eˣ) · **Cụm 1 Độ bất ngờ**: figSurprise + calc2 (−ln p) + Quan sát/Vì sao |
| 2 ĐỀ | **Cụm 2 CE trung bình**: figAvg (bars + đường CE) + calc2 + Quan sát · **Cụm 3 PPL**: figPPL (CE→e^→PPL + xúc xắc) + calc2 (e^CE) + Quan sát |
| 3 ĐỀ | **Cụm 4 Đọc PPL**: figScale (1→|V|, dấu PPL) + note (1 hoàn hảo, |V| đoán mò, cùng tập kiểm) + Dự đoán/Vì sao/tóm tắt |
| 4 ĐÁP ÁN | 4 khối keylist (badge ✓) · Rút ra → I5 LoRA |

**`.calc2`** cụm 1,2,3. Cụm 4 conceptual. **Parity:** ĐỀ `.b`={0..4}; ĐÁP ÁN badge ✓ → 0 lệch.

## 5. `data-q` & engine số
- Given (`.gv`): `p1,p2,p3`. ĐÁP ÁN: `nl1..nl3` · `ce` · `ppl` · `pplr` (PPL 1 chữ số).
- Sinh: `p_i=pick([0.5,0.25])`; `nl_i=NL[p_i]`; `ce=avg`; `ppl=round(exp(ce),2)`. `WB.fmt2`.

## 6. Sơ đồ (viewBox · Đ/T · dạy gì · bất biến)
| id | viewBox | Đ/T | dạy gì | bất biến |
|---|---|---|---|---|
| figSurprise | `0 0 240 106` 72×32mm | ĐỘNG | 3 thanh −ln p (cam), "?"; p ghi dưới | p thấp → thanh cao; giá trị "?" |
| figAvg | `0 0 240 108` 72×33mm | ĐỘNG | 3 thanh mờ + đường ngang CE (cam đứt) "CE=?" | CE giữa min-max −ln p |
| figPPL | `0 0 250 96` 74×28mm | TĨNH | CE →[e^]→ PPL (tím) + xúc xắc "~PPL mặt" | cấu trúc cố định |
| figScale | `0 0 400 96` 150×36mm | ĐỘNG | thang 1(hoàn hảo)→|V|(đoán mò), dấu PPL | dấu PPL gần trái khi thấp |

## 7-8. Khối chữ & CSS
`.legend · .qset/.qtag · .figcap · .calc2(cụm1,2,3) · .extbl(ln,eˣ) · .keylist`. CSS additive như các bài H (không sửa wb.css).

## 9. Helper SVG
`el, line, dln, txt, ctxt, rct`. `drawSurprise/drawAvg/drawScale` ĐỘNG → `generate()`; `drawPPL` TĨNH → gọi 1 lần.

## 10. Nghiệm thu (đã đạt)
- check.mjs --runs 5 → tràn 0px ×5 ✓ · check-de-key → 0 lệch ✓ · soát ảnh 4 trang ✓ · console sạch ✓
- 🎲: p đổi → −ln, CE, PPL, figScale cập nhật; ô "?" luôn trống ✓

## 11. Bất biến nội dung
- −ln p: p=1→0, p→0→∞ (độ bất ngờ). CE = trung bình. PPL=e^CE.
- PPL thấp = tốt (1 hoàn hảo, |V| đoán mò); chỉ so trên cùng tập kiểm.
