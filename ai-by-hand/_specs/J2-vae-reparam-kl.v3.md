# SPEC v3 — J2 · VAE Reparam + KL (bản HIỂU RÕ, A4 dọc)

> **v3 = v(n−1) + LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File HTML: `K3/J2-vae-reparam-kl-hieu-ro.html`.
> Engine số giữ nguyên; KHÔNG ghi đè bản canonical `J2-vae-reparam-kl.html`. Bám **TEMPLATE HIỂU-RÕ mới** (mẫu `H4`/`I5`).

## 0. Khác biệt: 2 trang→**4 (3 ĐỀ+1 ĐÁP ÁN)**; 1 hình→**3** (figFlow, figLatent, figBeta); câu hỏi thẻ vai trò; ĐÁP ÁN gọn badge ✓.

## 1. Định vị bài
VAE: reparam `z = μ + σ·ε` (khả vi) + KL `½Σ(μ²+σ²−1−lnσ²)` kéo ẩn về N(0,1). Phiếu: 2 chiều, **σ=1** → lnσ²=0 → KL mỗi chiều = ½μ².

## 2. Mã màu (hằng JS)
```js
var CM='#0e7490', CZ='#b45309', CE='#7c5cff', GRY='#5b6776';
```
- **μ,σ (encoder) = lam** · **z (mã lấy mẫu) = cam** · **ε &amp; vùng N(0,1) = tím**. Legend: `μ,σ lam · z cam · ε&N(0,1) tím`.
- Thẻ vai trò: Quan sát=lam · Tính=cam · Dự đoán=tím · Vì sao=xám đậm.

## 3. Ghi chú trung thực
- σ=1 cố định → lnσ²=0, KL rút gọn ½μ² (dễ tính tay). μ=randInt(-1,2) → có chiều μ=0 (KL=0) để dạy. ε∈{±0.5,±1}.
- KL đầy đủ có σ²−1−lnσ²; nêu rõ đơn giản hóa σ=1.

## 4. Layout 4 trang
| Trang | Nội dung |
|---|---|
| 1 ĐỀ | intro+formula+legend · intuition · Bước 0 (μ,σ,ε) · **Cụm 1 reparam**: figFlow (μσ⊕ε→z, gradient) + calc2 (z₁,z₂) + Vì sao/Quan sát |
| 2 ĐỀ | **Cụm 2 KL từng chiều**: figLatent (N(0,1)+μ+KL) + calc2 (½μ²) + Quan sát/Vì sao · **Cụm 3 tổng KL**: calc2 (cộng) + Vì sao |
| 3 ĐỀ | **Cụm 4 đánh đổi**: figBeta (thanh cân bằng) + Dự đoán×2/Vì sao |
| 4 ĐÁP ÁN | 4 khối keylist (badge ✓) · Rút ra → J3 GAN |

**`.calc2`** cụm 1,2,3. Cụm 4 conceptual. **Parity:** ĐỀ `.b`={0..4}; ĐÁP ÁN badge ✓ → 0 lệch.

## 5. `data-q` & engine số
- Given (`.gv`): `mu1,mu2,s1,s2,e1,e2`. ĐÁP ÁN: `z1,z2,kl1,kl2,kl`.
- Sinh: `mu=randInt(-1,2)`, σ=1, ε=pick([0.5,-0.5,1,-1]); z=μ+ε; kl_i=0.5μ². `WB.fmtTrim`.

## 6. Sơ đồ (viewBox · Đ/T · dạy gì · bất biến)
| id | viewBox | Đ/T | dạy gì | bất biến |
|---|---|---|---|---|
| figFlow | `0 0 280 120` 94×40mm | TĨNH | μσ(lam)⊕ε(tím)→z(cam)→loss; gradient qua μσ không qua ε | luồng cố định |
| figLatent | `0 0 220 150` 66×45mm | ĐỘNG | vòng N(0,1) tím, điểm μ (lam) lệch, KL kéo về gốc | μ=0 → không mũi tên KL |
| figBeta | `0 0 280 120` 94×40mm | TĨNH | thanh: KL mạnh (mờ) ↔ yếu (lỗ chỗ), cân bằng giữa | điểm cân bằng giữa |

## 7-8. Khối chữ & CSS
`.legend · .qset/.qtag · .figcap · .calc2(cụm1-3) · .keylist`. CSS additive như I5.

## 9. Helper SVG
`el, txt, ctxt, box`. `drawLatent` ĐỘNG → `generate()`; `drawFlow, drawBeta` TĨNH → gọi 1 lần.

## 10. Nghiệm thu (đã đạt)
- check.mjs --runs 5 → tràn 0px ×5 ✓ · check-de-key → 0 lệch ✓ · soát ảnh 3 trang ĐỀ ✓ · console sạch ✓
- 🎲: μ,ε đổi → figLatent điểm μ & mũi tên KL cập nhật (μ=0 ẩn mũi tên) ✓

## 11. Bất biến nội dung
- Reparam làm z khả vi theo μ,σ (ε ngoài gradient); KL=0 khi (μ,σ)=(0,1), phạt ½μ² khi lệch; loss=tái tạo+KL; β cân bằng nét↔liền mạch.
