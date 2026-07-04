# SPEC v3 — J6 · Noise Schedule (bản HIỂU RÕ, A4 dọc)

> **v3 = v(n−1) + LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File HTML: `K3/J6-noise-schedule-hieu-ro.html`.
> Engine số giữ nguyên; KHÔNG ghi đè bản canonical `J6-noise-schedule.html`. Bám **TEMPLATE HIỂU-RÕ mới** (mẫu `H4`/`I5`).

## 0. Khác biệt: 2 trang→**4 (3 ĐỀ+1 ĐÁP ÁN)**; 1 hình→**3** (figKeep, figCumul, figCurve); câu hỏi thẻ vai trò; ĐÁP ÁN gọn badge ✓.

## 1. Định vị bài
Lịch nhiễu: `αₜ=1−βₜ`, `ᾱₜ=∏αᵢ` (phần ảnh gốc còn lại). ᾱ cho phép nhảy thẳng (J4). Phiếu: 2 bước, β nhỏ.

## 2. Mã màu (hằng JS)
```js
var CA='#0e7490', CAB='#b45309', CB='#7c5cff', GRY='#5b6776';
```
- **αₜ (phần giữ) = lam** · **ᾱₜ (tích lũy) = cam** · **βₜ (liều nhiễu) = tím**. Legend: `α lam · ᾱ cam · β tím`.
- Thẻ vai trò: Quan sát=lam · Tính=cam · Dự đoán=tím · Vì sao=xám đậm.

## 3. Ghi chú trung thực
- β₁∈{0.1,0.2}, β₂∈{0.2,0.3}; α=1−β; ᾱ₂=α₁·α₂. 2 bước (thực tế hàng trăm–nghìn). figCurve minh họa linear vs cosine tổng quát (không theo số phiếu).

## 4. Layout 4 trang
| Trang | Nội dung |
|---|---|
| 1 ĐỀ | intro+formula+legend · intuition · Bước 0 (β₁,β₂) · **Cụm 1 α**: figKeep (thanh α+β mỗi bước) + calc2 (α₁,α₂) + Quan sát/Vì sao |
| 2 ĐỀ | **Cụm 2 ᾱ**: figCumul (cột ᾱ "?") + calc2 (ᾱ₁,ᾱ₂) + Quan sát · **Cụm 3 ý nghĩa**: calc2 (√ᾱ₂) + Dự đoán/Vì sao |
| 3 ĐỀ | **Cụm 4 kiểu lịch**: figCurve (linear vs cosine) + note + Quan sát/Dự đoán |
| 4 ĐÁP ÁN | 4 khối keylist (badge ✓) · Rút ra → J7 DDPM vs DDIM |

**`.calc2`** cụm 1,2,3. **Parity:** ĐỀ `.b`={0..4}; ĐÁP ÁN badge ✓ → 0 lệch.

## 5. `data-q` & engine số
- Given (`.gv`): `b1,b2`. ĐÁP ÁN: `a1,a2,abar1,abar2`.
- Sinh: b1=pick([0.1,0.2]), b2=pick([0.2,0.3]); a=1−b; abar2=a1·a2. `WB.fmtTrim`.

## 6. Sơ đồ (viewBox · Đ/T · dạy gì · bất biến)
| id | viewBox | Đ/T | dạy gì | bất biến |
|---|---|---|---|---|
| figKeep | `0 0 260 120` 82×38mm | ĐỘNG | thanh đơn vị mỗi bước = α (lam) + β (tím) | α+β=1 |
| figCumul | `0 0 260 120` 82×38mm | ĐỘNG | cột ᾱ₁, ᾱ₂ (cam) "?", vạch 1.0 | ᾱ₂ < ᾱ₁ |
| figCurve | `0 0 260 150` 80×46mm | TĨNH | đường ᾱ giảm: linear (lam) vs cosine (cam) | cosine giữ cao ở đầu |

## 7-8. Khối chữ & CSS
`.legend · .qset/.qtag · .figcap · .calc2(cụm1-3) · .keylist`. CSS additive như I5.

## 9. Helper SVG
`el, txt, ctxt`. `drawKeep, drawCumul` ĐỘNG → `generate()`; `drawCurve` TĨNH → gọi 1 lần.

## 10. Nghiệm thu (đã đạt)
- check.mjs --runs 5 → tràn 0px ×5 ✓ · check-de-key → 0 lệch ✓ · soát ảnh 3 trang ĐỀ ✓ · console sạch ✓
- 🎲: β đổi → figKeep tỉ lệ α/β & figCumul cột ᾱ cập nhật; "?" luôn trống ✓

## 11. Bất biến nội dung
- α=1−β, α+β=1; ᾱ=∏α luôn giảm; √ᾱ=phần ảnh gốc; ᾱ→0 → nhiễu thuần; cosine giữ ảnh lâu hơn linear.
