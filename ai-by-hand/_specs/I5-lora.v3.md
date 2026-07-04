# SPEC v3 — I5 · LoRA (bản HIỂU RÕ, A4 dọc)

> **v3 = v(n−1) + LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File HTML: `K3/I5-lora-hieu-ro.html`.
> Engine số giữ nguyên; KHÔNG ghi đè bản canonical `I5-lora.html`. Bám **TEMPLATE HIỂU-RÕ mới** (mẫu `H4`).

## 0. Khác biệt: 2 trang→**4 (3 ĐỀ+1 ĐÁP ÁN)**; 1 hình→**4** (figOuter, figCount, figApply, figRank) đều trên ĐỀ; câu hỏi thẻ vai trò; ĐÁP ÁN gọn badge ✓.

## 1. Định vị bài
LoRA: đóng băng W, học `ΔW = B·A` **hạng thấp** (B: d×r, A: r×d) rồi cộng vào → fine-tune rẻ (2·d·r ≪ d²), adapter tháo lắp. Phiếu: **d=4, r=1**.

## 2. Mã màu (hằng JS)
```js
var CB='#0e7490', CA='#7c5cff', CDW='#b45309', GRY='#5b6776';
```
- **B (cột) = lam** · **A (hàng) = tím** · **ΔW = B·A = cam** · W/cấu trúc = tím nhạt/xám. Legend: `B cột (lam) · A hàng (tím) · ΔW=B·A (cam)`.
- Thẻ vai trò: Quan sát=lam · Tính=cam · Dự đoán=tím · Vì sao=xám đậm.

## 3. Ghi chú trung thực
- d=4, r=1 cố định → tham số LoRA=8, full=16 (bất biến). Chỉ **B, A đổi** khi 🎲.
- Guard: `A[0]≠0` và `B[2]≠0` để ΔW[2][0] & ΔW[0][0] khác 0 (câu hỏi có ý nghĩa); ΔW[0][1] cố ý có thể =0 (dạy: A[j]=0 → cả cột 0).
- W gốc không hiện số (đóng băng, chỉ minh hoạ khối).

## 4. Layout 4 trang
| Trang | Nội dung |
|---|---|
| 1 ĐỀ | intro+formula+legend · intuition · Bước 0 (B,A `.gv`) · **Cụm 1 ΔW=B·A**: figOuter (cột B × hàng A → lưới ΔW "?") + calc2 (3 phần tử) + Quan sát/Vì sao |
| 2 ĐỀ | **Cụm 2 Đếm tham số**: figCount (8 ô vs 16 ô) + calc2 (2·d·r, d²) + Dự đoán · **Cụm 3 Áp dụng**: figApply (W đóng băng + ΔW = W') + Vì sao/Quan sát |
| 3 ĐỀ | **Cụm 4 Hạng thấp**: figRank (W lớn vs B·A mỏng) + note + Quan sát/Vì sao/tóm tắt |
| 4 ĐÁP ÁN | 4 khối keylist (badge ✓) · Rút ra → I6 quantization |

**`.calc2`** cụm 1,2. Cụm 3,4 conceptual. **Parity:** ĐỀ `.b`={0..4}; ĐÁP ÁN badge ✓ → 0 lệch.

## 5. `data-q` & engine số
- Given (`.gv`): `b0..b3, a0..a3`. ĐÁP ÁN: `dw00`(=B0·A0), `dw20`(=B2·A0), `dw01`(=B0·A1), `loraP`(=8), `fullP`(=16).
- Sinh: `B,A = randInt(0,2)` ×4 + guard A0,B2. Số nguyên.

## 6. Sơ đồ (viewBox · Đ/T · dạy gì · bất biến)
| id | viewBox | Đ/T | dạy gì | bất biến |
|---|---|---|---|---|
| figOuter | `0 0 240 150` 70×44mm | ĐỘNG | cột B (lam) × hàng A (tím) → lưới ΔW 4×4 (cam), 3 ô hỏi "?" | mọi hàng = bội A (hạng 1); ô hỏi để "?" |
| figCount | `0 0 240 100` 72×30mm | TĨNH | 8 ô (LoRA) vs 16 ô (full) | 8<16 |
| figApply | `0 0 260 108` 78×32mm | TĨNH | W (đóng băng) + ΔW mỏng = W' | cấu trúc cố định |
| figRank | `0 0 360 130` 140×47mm | TĨNH | W lớn (d×d) vs B·A mỏng (d×r+r×d) | B·A ≪ W |

## 7-8. Khối chữ & CSS
`.legend · .qset/.qtag · .figcap · .calc2(cụm1,2) · .keylist`. CSS additive như bài H (không sửa wb.css).

## 9. Helper SVG
`el, txt, ctxt, rct`. `drawOuter` ĐỘNG → `generate()`; `drawCount/drawApply/drawRank` TĨNH → gọi 1 lần.

## 10. Nghiệm thu (đã đạt)
- check.mjs --runs 5 → tràn 0px ×5 ✓ · check-de-key → 0 lệch ✓ · soát ảnh 4 trang ✓ · console sạch ✓
- 🎲: B,A đổi → ΔW phần tử cập nhật (figOuter số B,A đổi); ô "?" luôn trống ✓

## 11. Bất biến nội dung
- ΔW = B·A luôn hạng 1 (mọi hàng tỉ lệ A); A[j]=0 → cột j = 0.
- Tham số LoRA (2·d·r) ≪ full (d²) khi r≪d; W gốc đóng băng → adapter tháo lắp, gộp không tốn thêm.
