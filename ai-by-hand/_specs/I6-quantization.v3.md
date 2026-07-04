# SPEC v3 — I6 · Quantization int8 (bản HIỂU RÕ, A4 dọc)

> **v3 = v(n−1) + LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File HTML: `K3/I6-quantization-hieu-ro.html`.
> Engine số giữ nguyên; KHÔNG ghi đè bản canonical `I6-quantization.html`. Bám **TEMPLATE HIỂU-RÕ mới** (mẫu `H4`/`I5`).

## 0. Khác biệt: 2 trang→**4 (3 ĐỀ+1 ĐÁP ÁN)**; 1 hình→**5** (figScale, figAxis, figBars, figMem, figPipe); câu hỏi thẻ vai trò; ĐÁP ÁN gọn badge ✓.

## 1. Định vị bài
Nén trọng số float32 → int8: `scale = absmax/127`, `q = round(x/scale) ∈ [−127,127]`, `x̂ = q·scale`. Giảm 4× bộ nhớ, sai số ≤ ½ nấc. Phiếu: 4 trọng số, absmax=12.7, scale=0.1.

## 2. Mã màu (hằng JS)
```js
var CX='#0e7490', CN='#b45309', CS='#7c5cff', GRY='#5b6776';
```
- **x (float gốc) = lam** · **nấc / q / x̂ = cam** · **dải &amp; scale = tím**. Legend: `x (float) lam · nấc/q/x̂ cam · dải&scale tím`.
- Thẻ vai trò: Quan sát=lam · Tính=cam · Dự đoán=tím · Vì sao=xám đậm.

## 3. Ghi chú trung thực
- x₂ = −12.7 (= −absmax) & x₃ = 3.14 **cố định** → scale=0.1, q₂=−127, err(x₃)=0.04 bất biến (số đẹp, dạy đầu-mút & sai-số). Chỉ x₁, x₄ đổi khi 🎲.
- x₁ ∈ {5,6,9,−4,−8}, x₄ ∈ {10,7,4,−10,−6} → đều là bội của 0.1 → x̂=x (khe hở 0) → dạy "chỉ x₃ lệch".
- scale KHÔNG hiện ở ĐỀ (là đáp cụm 1); cụm 2,3 tham chiếu "scale (từ Bước 1)".

## 4. Layout 4 trang
| Trang | Nội dung |
|---|---|
| 1 ĐỀ | intro+formula+legend · intuition · Bước 0 (x, absmax `.gv`) · **Cụm 1 scale**: figScale (dải chia nấc) + calc2 (absmax/127) + Vì sao/Dự đoán |
| 2 ĐỀ | **Cụm 2 lượng tử hóa**: figAxis (x rơi vào nấc "?") + calc2 (q₁..q₄) + Quan sát/Vì sao · **Cụm 3 giải lượng tử**: figBars (x vs x̂) + calc2 (x̂₃, sai số) + Quan sát/Dự đoán |
| 3 ĐỀ | **Cụm 4 dung lượng**: figMem (4 byte vs 1 byte) + calc2 (GB) + Vì sao/Dự đoán · **Cụm 5 pipeline**: figPipe + Vì sao |
| 4 ĐÁP ÁN | 4 khối keylist (badge ✓) · Rút ra → I7 RAG |

**`.calc2`** cụm 1,2,3,4. **Parity:** ĐỀ `.b`={0..5}; ĐÁP ÁN badge ✓ → 0 lệch.

## 5. `data-q` & engine số
- Given (`.gv`): `x1..x4, absmax`. ĐÁP ÁN: `scale`(=0.1), `q1..q4`, `dq3`(=3.1), `err`(=0.04).
- Sinh: `x1=pick([5,6,9,-4,-8])`, `x4=pick([10,7,4,-10,-6])`; q=round(x/0.1); dq=round(q·0.1). `WB.fmtInt` cho q (dấu −).

## 6. Sơ đồ (viewBox · Đ/T · dạy gì · bất biến)
| id | viewBox | Đ/T | dạy gì | bất biến |
|---|---|---|---|---|
| figScale | `0 0 300 96` 96×31mm | TĨNH | dải [−12.7,12.7] (tím) chia nấc (cam), 1 nấc = scale "?" | 127 nấc/bên; đối xứng |
| figAxis | `0 0 260 120` 86×40mm | ĐỘNG | 4 chấm x (lam) rơi xuống ô nấc "?" (cam) | x cho sẵn, nấc để "?" |
| figBars | `0 0 260 120` 82×38mm | ĐỘNG | cặp cột x (lam) vs x̂ (cam), khe hở = sai số | x₃ khe hở rõ nhất |
| figMem | `0 0 260 110` 80×34mm | TĨNH | 4 ô byte float32 vs 1 ô int8 | tỉ lệ 4:1 |
| figPipe | `0 0 380 70` 150×28mm | TĨNH | x→scale→q→lưu→x̂ | chỉ round mất thông tin |

## 7-8. Khối chữ & CSS
`.legend · .qset/.qtag · .figcap · .calc2(cụm1-4) · .keylist`. CSS additive như I5 (không sửa wb.css).

## 9. Helper SVG
`el, txt, ctxt, rct`. `drawAxis, drawBars` ĐỘNG → `generate()`; `drawScale, drawMem, drawPipe` TĨNH → gọi 1 lần.

## 10. Nghiệm thu (đã đạt)
- check.mjs --runs 5 → tràn 0px ×5 ✓ · check-de-key → 0 lệch ✓ · soát ảnh trang 1 ✓ · console sạch ✓
- 🎲: x₁,x₄ đổi → figAxis chấm & figBars cột cập nhật; ô "?" luôn trống ✓

## 11. Bất biến nội dung
- scale = absmax/127; q ∈ [−127,127]; x̂ = q·scale ≈ x; sai số ≤ ½·scale.
- Chỉ bước round làm mất thông tin; int8 giảm 4× bộ nhớ. Outlier → per-channel/nhóm.
