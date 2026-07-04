# SPEC v3 — I8 · Greedy Decode (bản HIỂU RÕ, A4 dọc)

> **v3 = v(n−1) + LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File HTML: `K3/I8-greedy-decode-hieu-ro.html`.
> Engine số giữ nguyên; KHÔNG ghi đè bản canonical `I8-greedy-decode.html`. Bám **TEMPLATE HIỂU-RÕ mới** (mẫu `H4`/`I5`).

## 0. Khác biệt: 2 trang→**3 (2 ĐỀ+1 ĐÁP ÁN)**; 1 hình→**2** (figSteps, figChain); câu hỏi thẻ vai trò; ĐÁP ÁN gọn badge ✓. (Bài đơn giản → 2 ĐỀ.)

## 1. Định vị bài
Greedy decode: mỗi bước `tokenₜ = argmax(logitsₜ)`, nối vào, lặp tới &lt;eos&gt;. Tất định, dễ lặp. Phiếu: từ điển {A,B,C}, 3 bước.

## 2. Mã màu (hằng JS)
```js
var CL='#0e7490', CT='#b45309', CR='#7c5cff', GRY='#5b6776';
```
- **logits = lam** · **token chọn (argmax) = cam** · **hồi quy (nối lại) = tím**. Legend: `logits lam · argmax cam · hồi quy tím`.
- Thẻ vai trò: Quan sát=lam · Tính=cam · Dự đoán=tím · Vì sao=xám đậm.

## 3. Ghi chú trung thực
- Mỗi bước 3 giá trị phân biệt lấy từ {0,1,2,3} (`pickDistinct` rồi sort giảm), winner random → argmax luôn duy nhất (không hòa). Logits bước sau **độc lập** với token bước trước trong phiếu (đơn giản hóa; thực tế phụ thuộc) — nêu rõ ở qset/note.
- Chuỗi = 3 token, không có &lt;eos&gt; thực (minh họa dừng bằng lời).

## 4. Layout 3 trang
| Trang | Nội dung |
|---|---|
| 1 ĐỀ | intro+formula+legend · intuition · Bước 0 (9 logits `.gv`) · **Cụm 1 argmax**: figSteps (3 cụm cột, argmax "?") + calc2 (argmax 3 bước) + Quan sát/Vì sao |
| 2 ĐỀ | **Cụm 2 tự hồi quy**: figChain (3 ô token "?" + mũi tên tím) + calc2 (ghép chuỗi) + Quan sát/Vì sao · **Cụm 3 tất định**: note + Dự đoán/Vì sao/tóm tắt |
| 3 ĐÁP ÁN | 3 khối keylist (badge ✓) · Rút ra → I9 repetition penalty |

**`.calc2`** cụm 1,2. Cụm 3 conceptual. **Parity:** ĐỀ `.b`={0..3}; ĐÁP ÁN badge ✓ → 0 lệch.

## 5. `data-q` & engine số
- Given (`.gv`): `l11..l13, l21..l23, l31..l33` (9 logits). ĐÁP ÁN: `t1,t2,t3` (token argmax), `seq` (chuỗi).
- Sinh: mỗi bước `step()` = `pickDistinct([0,1,2,3],3)` sort giảm, gán winner random. `t=letters[win]`.

## 6. Sơ đồ (viewBox · Đ/T · dạy gì · bất biến)
| id | viewBox | Đ/T | dạy gì | bất biến |
|---|---|---|---|---|
| figSteps | `0 0 280 130` 94×42mm | ĐỘNG | 3 cụm 3 cột logits (lam), cột cao nhất "?" = argmax (cam) | mỗi cụm đúng 1 cột cao nhất |
| figChain | `0 0 260 120` 86×40mm | TĨNH | 3 ô token "?" nối, mũi tên tím hồi quy | token ẩn "?", cấu trúc cố định |

## 7-8. Khối chữ & CSS
`.legend · .qset/.qtag · .figcap · .calc2(cụm1,2) · .keylist`. CSS additive như I5.

## 9. Helper SVG
`el, txt, ctxt`. `drawSteps` ĐỘNG → `generate()`; `drawChain` TĨNH → gọi 1 lần.

## 10. Nghiệm thu (đã đạt)
- check.mjs --runs 5 → tràn 0px ×5 ✓ · check-de-key → 0 lệch ✓ · soát ảnh trang 1,2 ✓ · console sạch ✓
- 🎲: logits đổi → figSteps cột & argmax "?" chuyển đúng; figChain ô "?" luôn trống ✓

## 11. Bất biến nội dung
- argmax(softmax) = argmax(logit) (softmax đơn điệu); greedy tất định (cùng vào → cùng ra); dễ lặp/thiển cận vs beam.
