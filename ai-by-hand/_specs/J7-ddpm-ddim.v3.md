# SPEC v3 — J7 · DDPM vs DDIM (bản HIỂU RÕ, A4 dọc)

> **v3 = v(n−1) + LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File HTML: `K3/J7-ddpm-ddim-hieu-ro.html`.
> Engine số giữ nguyên; KHÔNG ghi đè bản canonical `J7-ddpm-ddim.html`. Bám **TEMPLATE HIỂU-RÕ mới** (mẫu `H4`/`I5`).

## 0. Khác biệt: 2 trang→**4 (3 ĐỀ+1 ĐÁP ÁN)**; 1 hình→**3** (figInvert, figBranch, figPaths); câu hỏi thẻ vai trò; ĐÁP ÁN gọn badge ✓.

## 1. Định vị bài
Hai cách lấy mẫu ngược: đoán εθ → x̂₀ → lùi bước. DDPM `+σₜ·z` (ngẫu nhiên, nhiều bước, đa dạng); DDIM bỏ σₜ·z (tất định, bỏ bước, nhanh). Phiếu: 1 pixel, ᾱ Pythagore.

## 2. Mã màu (hằng JS)
```js
var CDDIM='#0e7490', CDDPM='#b45309', CZ='#7c5cff', GRY='#5b6776';
```
- **DDIM (tất định) = lam** · **DDPM (ngẫu nhiên) = cam** · **nhiễu z bơm thêm = tím**. Legend: `DDIM lam · DDPM cam · z tím`.
- Thẻ vai trò: Quan sát=lam · Tính=cam · Dự đoán=tím · Vì sao=xám đậm.

## 3. Ghi chú trung thực
- x̂₀ chỉ tính số 1 lần (bước chung); phần DDIM/DDPM là **so sánh khái niệm** (không tính σₜ·z bằng số vì z ngẫu nhiên). ᾱ Pythagore như J4/J5.
- Cụm gộp 2+3 (ngã ba) đánh số `.b`=2; không có `.b`=3 → de-key ĐỀ{0,1,2,4} OK.

## 4. Layout 4 trang
| Trang | Nội dung |
|---|---|
| 1 ĐỀ | intro+formula+legend · intuition · Bước 0 (xₜ,εθ,ᾱ,√ᾱ,√(1−ᾱ)) · **Cụm 1 x̂₀**: figInvert (bước chung) + calc2 (x̂₀) + Vì sao/Quan sát |
| 2 ĐỀ | **Cụm 2 ngã ba** (gộp DDIM+DDPM): figBranch (x̂₀ rẽ 2 nhánh, DDPM +σz) + Quan sát/Vì sao×2 |
| 3 ĐỀ | **Cụm 4 đánh đổi**: figPaths (2 đường nhiễu→ảnh) + note + Dự đoán×2/Vì sao |
| 4 ĐÁP ÁN | 3 khối keylist (badge ✓) · Rút ra → Hết K3, sang K4/K1 |

**`.calc2`** chỉ cụm 1. Cụm 2,4 conceptual. **Parity:** ĐỀ `.b`={0,1,2,4}; ĐÁP ÁN badge ✓ → 0 lệch.

## 5. `data-q` & engine số
- Given (`.gv`): `xt, eps, abar, sqA, sq1A`. ĐÁP ÁN: `x0hat`.
- Sinh: pair Pythagore; xt=sqA·x0+sq1A·eps; x0hat=(xt−sq1A·eps)/sqA (=x0). `WB.fmtTrim`.

## 6. Sơ đồ (viewBox · Đ/T · dạy gì · bất biến)
| id | viewBox | Đ/T | dạy gì | bất biến |
|---|---|---|---|---|
| figInvert | `0 0 300 96` 98×31mm | TĨNH | xₜ(cam) − √(1−ᾱ)εθ(tím) ÷√ᾱ → x̂₀ "?"(lam), bước chung | đảo forward |
| figBranch | `0 0 300 140` 98×48mm | TĨNH | x̂₀ rẽ: DDIM (lam, không z) / DDPM (cam, +σₜz tím) | DDPM có +z, DDIM không |
| figPaths | `0 0 260 140` 82×44mm | TĨNH | 2 đường nhiễu→ảnh: DDIM trơn ít bước, DDPM gợn nhiều bước | DDIM trơn, DDPM gợn |

## 7-8. Khối chữ & CSS
`.legend · .qset/.qtag · .figcap · .calc2(cụm1) · .keylist`. CSS additive như I5.

## 9. Helper SVG
`el, txt, ctxt, box`. Cả 3 hình TĨNH → gọi 1 lần sau `generate()`.

## 10. Nghiệm thu (đã đạt)
- check.mjs --runs 5 → tràn 0px ×5 ✓ · check-de-key → 0 lệch (info abar) ✓ · soát ảnh 3 trang ĐỀ ✓ · console sạch ✓
- 🎲: ᾱ,x₀,ε đổi → calc2 x̂₀ & keylist cập nhật ✓

## 11. Bất biến nội dung
- Bước chung: đoán ε → x̂₀; DDPM +σₜz (ngẫu nhiên, chậm, đa dạng); DDIM tất định (nhanh, tái lập, bỏ bước); đánh đổi tốc độ↔đa dạng.
