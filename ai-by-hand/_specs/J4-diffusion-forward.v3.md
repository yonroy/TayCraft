# SPEC v3 — J4 · Diffusion Forward (bản HIỂU RÕ, A4 dọc)

> **v3 = v(n−1) + LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File HTML: `K3/J4-diffusion-forward-hieu-ro.html`.
> Engine số giữ nguyên; KHÔNG ghi đè bản canonical `J4-diffusion-forward.html`. Bám **TEMPLATE HIỂU-RÕ mới** (mẫu `H4`/`I5`).

## 0. Khác biệt: 2 trang→**4 (3 ĐỀ+1 ĐÁP ÁN)**; 1 hình→**3** (figTri, figMix, figSeq); câu hỏi thẻ vai trò; ĐÁP ÁN gọn badge ✓.

## 1. Định vị bài
Forward diffusion: `xₜ = √ᾱ·x₀ + √(1−ᾱ)·ε`, nhảy thẳng tới bước t nhờ ᾱₜ=∏αᵢ. (√ᾱ)²+(√(1−ᾱ))²=1. Phiếu: 1 pixel, ᾱ = bình phương số Pythagore (0.64/0.36).

## 2. Mã màu (hằng JS)
```js
var CX='#0e7490', CW='#b45309', CN='#7c5cff', GRY='#5b6776';
```
- **x₀ (ảnh gốc) = lam** · **hệ số trộn &amp; xₜ = cam** · **nhiễu ε = tím**. Legend: `x₀ lam · hệ số&xₜ cam · ε tím`.
- Thẻ vai trò: Quan sát=lam · Tính=cam · Dự đoán=tím · Vì sao=xám đậm.

## 3. Ghi chú trung thực
- ᾱ ∈ {0.64,0.36} → căn tròn (Pythagore 0.8/0.6). x₀∈[1,3], ε∈{1,−1,2}. 1 pixel (thực tế cả ảnh).
- figSeq dùng vị trí chấm nhiễu **tất định** (i*37 mod) không `Math.random` để đo tràn ổn định.

## 4. Layout 4 trang
| Trang | Nội dung |
|---|---|
| 1 ĐỀ | intro+formula+legend · intuition · Bước 0 (x₀,ᾱ,1−ᾱ,ε) · **Cụm 1 hệ số**: figTri (tam giác vuông huyền 1) + calc2 (√ᾱ,√(1−ᾱ)) + Tính/Vì sao |
| 2 ĐỀ | **Cụm 2 trộn**: figMix (2 đóng góp → xₜ "?") + calc2 (xₜ) + Quan sát/Vì sao |
| 3 ĐỀ | **Cụm 3 ᾱ→0**: figSeq (rõ→pha→nhiễu) + Dự đoán · **Cụm 4 nhảy thẳng**: note + Vì sao/Dự đoán |
| 4 ĐÁP ÁN | 4 khối keylist (badge ✓) · Rút ra → J5 khử nhiễu |

**`.calc2`** cụm 1,2. **Parity:** ĐỀ `.b`={0..4}; ĐÁP ÁN badge ✓ → 0 lệch.

## 5. `data-q` & engine số
- Given (`.gv`): `x0, abar, oneMinus, eps`. ĐÁP ÁN: `sqA, sq1A, xt`.
- Sinh: `pick([{0.64,0.8,0.6},{0.36,0.6,0.8}])`; xt=sqA·x0+sq1A·eps. `WB.fmtTrim`.

## 6. Sơ đồ (viewBox · Đ/T · dạy gì · bất biến)
| id | viewBox | Đ/T | dạy gì | bất biến |
|---|---|---|---|---|
| figTri | `0 0 220 140` 66×42mm | ĐỘNG | tam giác vuông: cạnh √ᾱ (cam), √(1−ᾱ) (tím), huyền 1 | huyền luôn 1 |
| figMix | `0 0 260 120` 82×38mm | ĐỘNG | cột √ᾱ·x₀ (lam) + √(1−ᾱ)·ε (tím) = xₜ "?" (cam) | xₜ ẩn "?" |
| figSeq | `0 0 260 110` 86×36mm | ĐỘNG | 3 khung rõ→pha→nhiễu, mật độ chấm theo √(1−ᾱ) | khung cuối ~nhiễu thuần |

## 7-8. Khối chữ & CSS
`.legend · .qset/.qtag · .figcap · .calc2(cụm1,2) · .keylist`. CSS additive như I5.

## 9. Helper SVG
`el, txt, ctxt`. `drawTri, drawMix, drawSeq` đều ĐỘNG → `generate()`.

## 10. Nghiệm thu (đã đạt)
- check.mjs --runs 5 → tràn 0px ×5 ✓ · check-de-key → 0 lệch ✓ · soát ảnh 3 trang ĐỀ ✓ · console sạch ✓
- 🎲: ᾱ,x₀,ε đổi → figTri hình dạng & figMix cột & figSeq mật độ chấm cập nhật; xₜ "?" luôn trống ✓

## 11. Bất biến nội dung
- (√ᾱ)²+(√(1−ᾱ))²=1 (bảo toàn phương sai); ᾱ→0 → xₜ≈nhiễu thuần; nhảy thẳng bằng ᾱₜ → huấn luyện nhanh.
