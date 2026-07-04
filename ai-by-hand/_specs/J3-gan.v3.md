# SPEC v3 — J3 · GAN một bước (bản HIỂU RÕ, A4 dọc)

> **v3 = v(n−1) + LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File HTML: `K3/J3-gan-hieu-ro.html`.
> Engine số giữ nguyên; KHÔNG ghi đè bản canonical `J3-gan.html`. Bám **TEMPLATE HIỂU-RÕ mới** (mẫu `H4`/`I5`).

## 0. Khác biệt: 2 trang→**4 (3 ĐỀ+1 ĐÁP ÁN)**; 1 hình→**3** (figGame, figTug, figEquil); câu hỏi thẻ vai trò; ĐÁP ÁN gọn badge ✓.

## 1. Định vị bài
GAN: `L_D = −[lnD(thật)+ln(1−D(giả))]`, `L_G = −lnD(giả)`; D↔G kéo ngược D(giả), cân bằng ở 0.5. Phiếu: D(thật)∈{0.9,0.8}, D(giả)∈{0.2,0.1}, bảng ln cho sẵn.

## 2. Mã màu (hằng JS)
```js
var CD='#0e7490', CR='#b45309', CG='#7c5cff', GRY='#5b6776';
var LN={0.9:-0.11, 0.8:-0.22, 0.2:-1.61, 0.1:-2.30};
```
- **D (phân biệt) = lam** · **ảnh thật = cam** · **G &amp; ảnh giả = tím**. Legend: `D lam · thật cam · G&giả tím`.
- Thẻ vai trò: Quan sát=lam · Tính=cam · Dự đoán=tím · Vì sao=xám đậm.

## 3. Ghi chú trung thực
- Loss viết dạng **min −log** (tương đương max log của canonical) cho quen với "giảm loss". ln tra bảng {0.9,0.8,0.2,0.1}.
- 1−D(giả) ∈ {0.8,0.9} luôn có trong bảng. GAN 1 bước tĩnh (không lặp huấn luyện thật).

## 4. Layout 4 trang
| Trang | Nội dung |
|---|---|
| 1 ĐỀ | intro+formula+legend · intuition · Bước 0 (D(thật),D(giả),1−D(giả), bảng ln) · **Cụm 1 L_D**: figGame (G→giả,thật→D) + calc2 (L_D) + Quan sát/Vì sao |
| 2 ĐỀ | **Cụm 2 L_G**: calc2 (−lnD(giả)) + Quan sát/Vì sao · **Cụm 3 kéo ngược**: figTug (D(giả) 0↔1) + Quan sát |
| 3 ĐỀ | **Cụm 4 cân bằng**: figEquil (đồng hồ D→0.5) + note + Dự đoán×2/Vì sao |
| 4 ĐÁP ÁN | 4 khối keylist (badge ✓) · Rút ra → J4 diffusion |

**`.calc2`** cụm 1,2. Cụm 3,4 conceptual. **Parity:** ĐỀ `.b`={0..4}; ĐÁP ÁN badge ✓ → 0 lệch.

## 5. `data-q` & engine số
- Given (`.gv`): `dReal, dFake, oneMinusFake`; bảng ln tĩnh. ĐÁP ÁN: `lnReal, lnOneMinusFake, lnFake, lossD, lossG`.
- Sinh: `dReal=pick([0.9,0.8])`, `dFake=pick([0.2,0.1])`; lossD=−(lnReal+lnOMF); lossG=−lnFake.

## 6. Sơ đồ (viewBox · Đ/T · dạy gì · bất biến)
| id | viewBox | Đ/T | dạy gì | bất biến |
|---|---|---|---|---|
| figGame | `0 0 280 130` 94×44mm | TĨNH | G(tím)→ảnh giả, ảnh thật(cam)→D(lam)→D(·) | luồng cố định |
| figTug | `0 0 280 120` 94×40mm | TĨNH | thanh D(giả) 0↔1, D kéo↓ G kéo↑ | ngược hướng |
| figEquil | `0 0 280 110` 90×35mm | TĨNH | đồng hồ D(·), kim ở 0.5 cân bằng | 0.5 giữa |

## 7-8. Khối chữ & CSS
`.legend · .qset/.qtag · .figcap · .calc2(cụm1,2) · .keylist · .extbl` (bảng ln). CSS additive như I5.

## 9. Helper SVG
`el, txt, ctxt, box`. Cả 3 hình TĨNH → gọi 1 lần sau `generate()` (số đổi ở calc2/keylist, hình cấu trúc bất biến).

## 10. Nghiệm thu (đã đạt)
- check.mjs --runs 5 → tràn 0px ×5 ✓ · check-de-key → 0 lệch ✓ · soát ảnh 3 trang ĐỀ ✓ · console sạch ✓
- 🎲: D(thật),D(giả) đổi → calc2 L_D,L_G & keylist cập nhật ✓

## 11. Bất biến nội dung
- L_D nhỏ khi D(thật)→1,D(giả)→0; L_G lớn khi D(giả) nhỏ; D↕G kéo ngược D(giả); cân bằng D(·)≈0.5; D quá mạnh → gradient G bão hòa.
