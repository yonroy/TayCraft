# SPEC v3 — J1 · Autoencoder / VAE (bản HIỂU RÕ, A4 dọc)

> **v3 = v(n−1) + LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File HTML: `K3/J1-autoencoder-vae-hieu-ro.html`.
> Engine số giữ nguyên; KHÔNG ghi đè bản canonical `J1-autoencoder-vae.html`. Bám **TEMPLATE HIỂU-RÕ mới** (mẫu `H4`/`I5`).

## 0. Khác biệt: 2 trang→**4 (3 ĐỀ+1 ĐÁP ÁN)**; 1 hình→**3** (figFunnel, figErr, figReparam); câu hỏi thẻ vai trò; ĐÁP ÁN gọn badge ✓.

## 1. Định vị bài
AE: `z = W_enc·x` (4→2 cổ chai), `x̂ = W_dec·z`, `ℒ = mean((x−x̂)²)`. VAE: `z = μ + σ⊙ε` (reparam) → lấy mẫu sinh mẫu mới. Phiếu: x 4D, We 2×4, Wd 4×2, σ=(1,1), ε∈{±1}.

## 2. Mã màu (hằng JS)
```js
var CX='#0e7490', CW='#b45309', CZ='#7c5cff', GRY='#5b6776';
```
- **x (đầu vào) = lam** · **W & x̂ (dựng lại) = cam** · **z (cổ chai/mã ẩn) = tím**. Legend: `x lam · W&x̂ cam · z tím`.
- Thẻ vai trò: Quan sát=lam · Tính=cam · Dự đoán=tím · Vì sao=xám đậm.

## 3. Ghi chú trung thực
- We, Wd ∈ {−1,0,1} thưa; x ∈ [−2,2]\{0} → z, x̂ số nhỏ tính tay được. σ=(1,1) cố định (đơn giản hóa) → z_VAE = z + ε.
- Reparam là điểm dạy chính (Bài D7 backprop qua ngẫu nhiên). KL chỉ nhắc bằng lời (không tính số) — chi tiết ở J2.

## 4. Layout 4 trang
| Trang | Nội dung |
|---|---|
| 1 ĐỀ | intro+formula+legend · intuition · Bước 0 (x, We, Wd) · **Cụm 1 mã hóa**: figFunnel (4→2→4, z & x̂ "?") + calc2 (z₀,z₁) + Vì sao/Quan sát |
| 2 ĐỀ | **Cụm 2 giải mã**: calc2 (x̂₀..x̂₃) + Vì sao · **Cụm 3 loss**: figErr (x vs x̂) + calc2 (e, ℒ) + Vì sao |
| 3 ĐỀ | **Cụm 4 VAE reparam** (badge V): figReparam (μ+σ+ε→z_VAE "?") + calc2 (z_VAE) + Dự đoán/Vì sao/tóm tắt |
| 4 ĐÁP ÁN | 4 khối keylist (badge ✓) · Rút ra → J2 reparam+KL |

**`.calc2`** cụm 1,2,3,4. **Parity:** ĐỀ `.b`={0,1,2,3,V}; ĐÁP ÁN badge ✓ → 0 lệch.

## 5. `data-q` & engine số
- Given (`.gv`): `x0..x3, we00..we13, wd00..wd31, sg0,sg1,ep0,ep1`. ĐÁP ÁN: `z0,z1, xh0..xh3, e0..e3, mse, zv0,zv1`.
- Sinh: `x=randIntNZ(-2,2)×4`; We/Wd=randInt(-1,1); z=We·x; x̂=Wd·z; e=x−x̂; mse=Σe²/4; ε=pick([1,-1]).

## 6. Sơ đồ (viewBox · Đ/T · dạy gì · bất biến)
| id | viewBox | Đ/T | dạy gì | bất biến |
|---|---|---|---|---|
| figFunnel | `0 0 280 130` 94×44mm | ĐỘNG | 4 nút x (lam) → 2 nút z "?" (tím) → 4 nút x̂ "?" (cam) | cổ chai 2 < 4; z,x̂ ẩn "?" |
| figErr | `0 0 260 120` 82×38mm | ĐỘNG | cặp cột x (lam) vs x̂ (cam), khe hở = sai số | không in nhãn số trên cột |
| figReparam | `0 0 260 130` 86×43mm | ĐỘNG | μ=z (tím) + vùng σ + ε → z_VAE "?" (cam) | z_VAE ẩn "?"; đổi ε → điểm khác |

## 7-8. Khối chữ & CSS
`.legend · .qset/.qtag · .figcap · .calc2(cụm1-4) · .keylist`. CSS additive như I5.

## 9. Helper SVG
`el, txt, ctxt`. `drawFunnel, drawErr` ĐỘNG → `generate()`; `drawReparam` TĨNH → gọi 1 lần.

## 10. Nghiệm thu (đã đạt)
- check.mjs --runs 5 → tràn 0px ×5 ✓ · check-de-key → 0 lệch ✓ · soát ảnh 3 trang ĐỀ ✓ · console sạch ✓
- 🎲: x, We, Wd, ε đổi → figFunnel nút x & figErr cột cập nhật; z/x̂/z_VAE "?" luôn trống ✓

## 11. Bất biến nội dung
- Cổ chai 2<4 → nén, ℒ≥0; reparam tách ε ngoài gradient → backprop qua μ,σ; VAE lấy mẫu z ⇒ sinh mẫu mới (khác AE).
