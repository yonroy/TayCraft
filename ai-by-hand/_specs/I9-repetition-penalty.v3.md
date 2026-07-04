# SPEC v3 — I9 · Repetition Penalty (bản HIỂU RÕ, A4 dọc)

> **v3 = v(n−1) + LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File HTML: `K3/I9-repetition-penalty-hieu-ro.html`.
> Engine số giữ nguyên; KHÔNG ghi đè bản canonical `I9-repetition-penalty.html`. Bám **TEMPLATE HIỂU-RÕ mới** (mẫu `H4`/`I5`).

## 0. Khác biệt: 2 trang→**4 (3 ĐỀ+1 ĐÁP ÁN)**; 1 hình→**3** (figLogit, figProb, figDrop); câu hỏi thẻ vai trò; ĐÁP ÁN gọn badge ✓.

## 1. Định vị bài
Repetition penalty: token đã dùng → hạ logit 1 → softmax lại → xác suất token đó giảm → bớt lặp. logit bias ±∞ để cấm/ép. Phiếu: 3 token A/B/C, phạt −1, bảng eˣ cho sẵn.

## 2. Mã màu (hằng JS)
```js
var CZ='#0e7490', CP='#b45309', CU='#7c5cff', GRY='#5b6776';
var EXP={0:1, 1:2.72, 2:7.39};
```
- **logit gốc z = lam** · **sau phạt z' = cam** · **token đã dùng = tím**. Legend: `z gốc lam · z' sau phạt cam · token đã dùng tím`.
- Thẻ vai trò: Quan sát=lam · Tính=cam · Dự đoán=tím · Vì sao=xám đậm.

## 3. Ghi chú trung thực
- Token đã dùng luôn có logit lớn nhất (=2); hai token kia ∈ {0,1}. Phạt −1 → z'[used]=1. `pNo` (không phạt) cho sẵn ở ĐỀ để đối chiếu.
- eˣ dùng **bảng tra** {0:1, 1:2.72, 2:7.39} (bỏ tính lũy thừa). `used` đổi khi 🎲 (A/B/C).

## 4. Layout 4 trang
| Trang | Nội dung |
|---|---|
| 1 ĐỀ | intro+formula+legend · intuition · Bước 0 (z, used, bảng eˣ, pNo) · **Cụm 1 áp phạt**: figLogit (gốc vs sau phạt) + calc2 (z') + Quan sát/Vì sao |
| 2 ĐỀ | **Cụm 2 softmax**: figProb (3 cột p "?") + calc2 (e, Σ, p) + Quan sát |
| 3 ĐỀ | **Cụm 3 so sánh**: figDrop (p(used) trước vs sau) + calc2 (giảm) + Dự đoán · **Cụm 4 logit bias**: note + Vì sao/tóm tắt |
| 4 ĐÁP ÁN | 4 khối keylist (badge ✓) · Rút ra → I10 chat template |

**`.calc2`** cụm 1,2,3. Cụm 4 conceptual. **Parity:** ĐỀ `.b`={0..4}; ĐÁP ÁN badge ✓ → 0 lệch. (z1,z2,z3 chỉ hiện ở Bước 0 — de-key báo info, OK.)

## 5. `data-q` & engine số
- Given (`.gv`): `z1,z2,z3, used`; context `pNo`. ĐÁP ÁN: `zp1..zp3, ep1..ep3, Zp, p1..p3, pNo2, pPen`.
- Sinh: `ui=pick([0,1,2])`; z[ui]=2, others=pick([[0,1],[1,0]]); zp[ui]=1; softmax qua EXP; pNo=e0[ui]/Z0.

## 6. Sơ đồ (viewBox · Đ/T · dạy gì · bất biến)
| id | viewBox | Đ/T | dạy gì | bất biến |
|---|---|---|---|---|
| figLogit | `0 0 240 150` 78×46mm | ĐỘNG | cặp cột z (lam) vs z' (cam) mỗi token; used tụt 1 bậc | chỉ used giảm; 2 token giữ nguyên |
| figProb | `0 0 240 120` 80×40mm | ĐỘNG | 3 cột p sau phạt "?", vạch 1.0 | Σp=1 |
| figDrop | `0 0 240 110` 72×34mm | ĐỘNG | p(used) không phạt (lam, số) vs có phạt (cam "?"), mũi tên xuống | pPen < pNo |

## 7-8. Khối chữ & CSS
`.legend · .qset/.qtag · .figcap · .calc2(cụm1-3) · .keylist · .extbl` (bảng eˣ). CSS additive như I5.

## 9. Helper SVG
`el, txt, ctxt`. `drawLogit, drawProb, drawDrop` đều ĐỘNG → `generate()`.

## 10. Nghiệm thu (đã đạt)
- check.mjs --runs 5 → tràn 0px ×5 ✓ · check-de-key → 0 lệch (info z1-3) ✓ · soát ảnh trang 1,2 ✓ · console sạch ✓
- 🎲: used đổi (A/B/C) → figLogit token tím & figProb/figDrop cột cập nhật; ô "?" luôn trống ✓

## 11. Bất biến nội dung
- Penalty tác động ở logit (trước softmax); token đã dùng giảm xác suất; bias=−∞ → eˣ=0 → p=0 (cấm); phạt mạnh hơn → giảm tiếp.
