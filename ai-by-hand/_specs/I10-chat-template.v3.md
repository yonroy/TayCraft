# SPEC v3 — I10 · Chat Template (bản HIỂU RÕ, A4 dọc)

> **v3 = v(n−1) + LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File HTML: `K3/I10-chat-template-hieu-ro.html`.
> Engine số giữ nguyên; KHÔNG ghi đè bản canonical `I10-chat-template.html`. Bám **TEMPLATE HIỂU-RÕ mới** (mẫu `H4`/`I5`).

## 0. Khác biệt: 2 trang→**3 (2 ĐỀ+1 ĐÁP ÁN)**; 1 hình→**3** (figMsg, figFlat, figCount); câu hỏi thẻ vai trò; ĐÁP ÁN gọn badge ✓. (Bài chủ yếu cấu trúc → 2 ĐỀ.)

## 1. Định vị bài
Chat template gói mỗi tin nhắn bằng token đặc biệt: `<|im_start|>role …nội dung… <|im_end|>`, kết bằng `<|im_start|>assistant` (mở). m tin nhắn → start=m+1, end=m, tổng=2m+1 mốc. Phải khớp định dạng huấn luyện.

## 2. Mã màu (hằng JS)
```js
var CC='#0e7490', CROLE='#b45309', CSP='#7c5cff', GRY='#5b6776';
```
- **nội dung tin nhắn = lam** · **nhãn vai (role) = cam** · **token đặc biệt (mốc) = tím**. Legend: `nội dung lam · vai cam · mốc tím`.
- Thẻ vai trò: Quan sát=lam · Tính=cam · Dự đoán=tím · Vì sao=xám đậm.

## 3. Ghi chú trung thực
- Chỉ số học duy nhất = đếm token đặc biệt (Cụm 3); phần còn lại là quan sát cấu trúc (đúng bản chất chat template). `m=pick([2,3,4])` đổi khi 🎲.
- Nội dung tin nhắn ("…") coi như 1 token minh họa; thực tế nhiều token.

## 4. Layout 3 trang
| Trang | Nội dung |
|---|---|
| 1 ĐỀ | intro+formula+legend · intuition · Bước 0 (given) · **Cụm 1 giải phẫu**: figMsg (start/vai/nội dung/end) + Quan sát/Vì sao · **Cụm 2 phẳng hóa**: figFlat (chuỗi + mở assistant) + Quan sát/Dự đoán |
| 2 ĐỀ | **Cụm 3 đếm**: figCount (m tin nhắn + mở) + calc2 (m+1, m, 2m+1) + Vì sao×2 · **Cụm 4 vì sao đúng template**: note + Dự đoán×2 |
| 3 ĐÁP ÁN | 4 khối keylist (badge ✓) · Rút ra → Hết Phần I, sang J2 |

**`.calc2`** chỉ cụm 3. **Parity:** ĐỀ `.b`={0..4}; ĐÁP ÁN badge ✓ → 0 lệch.

## 5. `data-q` & engine số
- Given (`.gv`/inline): `m`. ĐÁP ÁN: `nStart`(m+1), `nEnd`(m), `nSpecial`(2m+1).
- Sinh: `m=pick([2,3,4])`.

## 6. Sơ đồ (viewBox · Đ/T · dạy gì · bất biến)
| id | viewBox | Đ/T | dạy gì | bất biến |
|---|---|---|---|---|
| figMsg | `0 0 300 92` 96×28mm | TĨNH | 1 tin nhắn = start(tím)+vai(cam)+nội dung(lam)+end(tím) | đúng 2 mốc/tin nhắn |
| figFlat | `0 0 320 110` 104×34mm | TĨNH | 2 tin nhắn → chuỗi phẳng + start assistant mở (khung nét đứt) | kết mở không end |
| figCount | `0 0 300 120` 96×40mm | ĐỘNG | m tin nhắn (S…E) + 1 start assistant, tổng 2m+1 | start = end + 1 |

## 7-8. Khối chữ & CSS
`.legend · .qset/.qtag · .figcap · .calc2(cụm3) · .keylist · .tk` (token đặc biệt tô tím). CSS additive như I5.

## 9. Helper SVG
`el, txt, ctxt, tokbox`. `drawCount` ĐỘNG → `generate()`; `drawMsg, drawFlat` TĨNH → gọi 1 lần.

## 10. Nghiệm thu (đã đạt)
- check.mjs --runs 5 → tràn 0px ×5 ✓ · check-de-key → 0 lệch ✓ · soát ảnh trang 1,2 ✓ · console sạch ✓
- 🎲: m đổi (2/3/4) → figCount số S/E & tổng cập nhật ✓

## 11. Bất biến nội dung
- Mỗi tin nhắn 2 mốc; start = end + 1 (lượt assistant mở); tổng = 2m+1; token đặc biệt ăn ngân sách ngữ cảnh; sai template → lệch phân phối.
