# SPEC v3 — J5 · Diffusion khử nhiễu (bản HIỂU RÕ, A4 dọc)

> **v3 = v(n−1) + LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File HTML: `K3/J5-diffusion-khu-nhieu-hieu-ro.html`.
> Engine số giữ nguyên; KHÔNG ghi đè bản canonical `J5-diffusion-khu-nhieu.html`. Bám **TEMPLATE HIỂU-RÕ mới** (mẫu `H4`/`I5`).

## 0. Khác biệt: 2 trang→**4 (3 ĐỀ+1 ĐÁP ÁN)**; 1 hình→**4** (figInvert, figPlane, figSteps + thước nhiễu trong figPlane); câu hỏi thẻ vai trò; ĐÁP ÁN gọn badge ✓.

## 1. Định vị bài
Một bước reverse (DDIM): `x̂₀ = (xₜ − √(1−ᾱₜ)·ε)/√ᾱₜ`, `x_{t−1} = √ᾱ_{t−1}·x̂₀ + √(1−ᾱ_{t−1})·ε`. Ảnh = vectơ 2D. Lịch nhiễu cố định: 0.80/0.60 (t) → 0.96/0.28 (t−1).

## 2. Mã màu (hằng JS)
```js
var CCLEAN='#0e7490', CNOISY='#b45309', CEPS='#7c5cff', GRY='#5b6776';
```
- **x̂₀ (ảnh sạch) = lam** · **xₜ, x_{t−1} (ảnh nhiễu) = cam** · **nhiễu ε = tím**. Legend: `x̂₀ lam · xₜ,x_{t−1} cam · ε tím`.
- Thẻ vai trò: Quan sát=lam · Tính=cam · Dự đoán=tím · Vì sao=xám đậm.

## 3. Ghi chú trung thực
- x̂₀ chọn nguyên [0,2], ε nguyên [−1,1] (guard ≠0,0). xₜ = 0.8·x̂₀+0.6·ε (forward). Hệ số lịch nhiễu cố định (bất biến) → chỉ x̂₀,ε đổi.
- Lịch DDIM đơn giản; thực tế nhiều bước & lịch cosine/linear (J6).

## 4. Layout 4 trang
| Trang | Nội dung |
|---|---|
| 1 ĐỀ | intro+formula+legend · intuition · Bước 0 (xₜ,ε,lịch nhiễu) · **Cụm 1 x̂₀**: figInvert (xₜ−nhiễu ÷√ᾱ) + calc2 (2 cột) + Vì sao/Quan sát |
| 2 ĐỀ | **Cụm 2 trộn lại**: calc2 (x_{t−1}) + Quan sát/Vì sao · **Cụm 3 kiểm tra**: figPlane (mặt phẳng + thước nhiễu) + calc2 (hệ số nhiễu) + Vì sao |
| 3 ĐỀ | **Cụm 4 lùi từng bước**: figSteps (chuỗi nhiễu→rõ) + note + Dự đoán/Vì sao/tóm tắt |
| 4 ĐÁP ÁN | 4 khối keylist (badge ✓) · Rút ra → J6 lịch nhiễu |

**`.calc2`** cụm 1,2,3. **Parity:** ĐỀ `.b`={0..4}; ĐÁP ÁN badge ✓ → 0 lệch.

## 5. `data-q` & engine số
- Given (`.gv`): `xt1,xt2,e1,e2`; lịch nhiễu hằng số trong `.exptab`. ĐÁP ÁN: `xh1,xh2,xp1,xp2,nz1,nz2`.
- Sinh: xh=randInt(0,2)×2; eps=randInt(-1,1)×2 (guard); xt=0.8xh+0.6eps; xp=0.96xh+0.28eps.

## 6. Sơ đồ (viewBox · Đ/T · dạy gì · bất biến)
| id | viewBox | Đ/T | dạy gì | bất biến |
|---|---|---|---|---|
| figInvert | `0 0 300 96` 98×31mm | TĨNH | xₜ(cam) − √(1−ᾱ)ε(tím) ÷√ᾱ → x̂₀ "?"(lam) | đảo forward |
| figPlane | `0 0 260 130` 82×41mm | ĐỘNG | mặt phẳng: xₜ→x_{t−1}→x̂₀; thước nhiễu .60→.28 | x_{t−1} gần x̂₀ hơn xₜ |
| figSteps | `0 0 300 100` 98×33mm | TĨNH | chuỗi 5 khung nhiễu→rõ | mật độ chấm giảm dần |

## 7-8. Khối chữ & CSS
`.legend · .qset/.qtag · .figcap · .calc2(cụm1-3) · .keylist · .exptab` (lịch nhiễu). CSS additive như I5.

## 9. Helper SVG
`el, txt, ctxt, box`. `drawPlane` ĐỘNG → `generate()`; `drawInvert, drawSteps` TĨNH → gọi 1 lần.

## 10. Nghiệm thu (đã đạt)
- check.mjs --runs 5 → tràn 0px ×5 ✓ · check-de-key → 0 lệch ✓ · soát ảnh 3 trang ĐỀ ✓ · console sạch ✓
- 🎲: x̂₀,ε đổi → figPlane điểm & mũi tên cập nhật; x̂₀/x_{t−1} "?" ở calc2 luôn trống ✓

## 11. Bất biến nội dung
- x̂₀ = đảo forward; x_{t−1} gần x̂₀ hơn xₜ; hệ số nhiễu giảm; chất lượng phụ thuộc εθ; nhiều bước nhỏ ổn định hơn một bước lớn.
