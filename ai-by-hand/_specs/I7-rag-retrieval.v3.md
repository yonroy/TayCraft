# SPEC v3 — I7 · RAG Retrieval (cosine) (bản HIỂU RÕ, A4 dọc)

> **v3 = v(n−1) + LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File HTML: `K3/I7-rag-retrieval-hieu-ro.html`.
> Engine số giữ nguyên; KHÔNG ghi đè bản canonical `I7-rag-retrieval.html`. Bám **TEMPLATE HIỂU-RÕ mới** (mẫu `H4`/`I5`).

## 0. Khác biệt: 2 trang→**4 (3 ĐỀ+1 ĐÁP ÁN)**; 1 hình→**3** (figAngle, figCos, figPipe); câu hỏi thẻ vai trò; ĐÁP ÁN gọn badge ✓.

## 1. Định vị bài
RAG: nhúng câu hỏi q → cosine với kho tài liệu → lấy top-k đoạn gần nhất cho LLM đọc. `cos = (q·dᵢ)/(‖q‖·‖dᵢ‖)`. Phiếu: q + 3 tài liệu 2D, **mọi ‖·‖=5** (bộ ba Pythagore) → mẫu = 25.

## 2. Mã màu (hằng JS)
```js
var CQ='#0e7490', CD='#b45309', CSEL='#7c5cff', GRY='#5b6776';
```
- **q (câu hỏi) = lam** · **tài liệu dᵢ = cam** · **đoạn được chọn = tím**. Legend: `q lam · dᵢ cam · chọn tím`.
- Thẻ vai trò: Quan sát=lam · Tính=cam · Dự đoán=tím · Vì sao=xám đậm.

## 3. Ghi chú trung thực
- Mọi vectơ lấy từ `VS` (8 bộ ‖·‖=5) → mẫu cosine = 5·5 = 25 luôn (tính nhẩm). Đây là đơn giản hóa để bỏ khai căn.
- `pickDistinct(VS,4)` → q + 3 doc phân biệt; cosine = dot/25. Winner = argmax cosine (đổi khi 🎲).
- Vectơ 2D minh họa; thực tế nhúng d chiều cao.

## 4. Layout 4 trang
| Trang | Nội dung |
|---|---|
| 1 ĐỀ | intro+formula+legend · intuition · Bước 0 (q, d₁,d₂,d₃ `.gv`) · **Cụm 1 dot**: figAngle (q lam + 3 doc cam) + calc2 (3 dot) + Quan sát/Vì sao |
| 2 ĐỀ | **Cụm 2 cosine**: figCos (3 cột "?") + calc2 (÷25) + Quan sát · **Cụm 3 top-1**: calc2 (max→chọn) + Dự đoán/Vì sao |
| 3 ĐỀ | **Cụm 4 pipeline**: figPipe (nhúng→tra→top-k→LLM) + note + Vì sao/Dự đoán/Quan sát |
| 4 ĐÁP ÁN | 4 khối keylist (badge ✓) · Rút ra → I8 greedy decode |

**`.calc2`** cụm 1,2,3. Cụm 4 conceptual. **Parity:** ĐỀ `.b`={0..4}; ĐÁP ÁN badge ✓ → 0 lệch.

## 5. `data-q` & engine số
- Given (`.gv`): `q1,q2, d11,d12,d21,d22,d31,d32`. ĐÁP ÁN: `dot1..dot3, cos1..cos3, best`(='d'+n).
- Sinh: `pickDistinct(VS,4)`; dot=x·x+y·y; cos=round(dot/25,2). `WB.fmtInt` cho số nguyên có dấu −.

## 6. Sơ đồ (viewBox · Đ/T · dạy gì · bất biến)
| id | viewBox | Đ/T | dạy gì | bất biến |
|---|---|---|---|---|
| figAngle | `0 0 210 170` 64×52mm | ĐỘNG | q (lam) + 3 doc (cam), góc nhỏ = giống; KHÔNG lộ winner | mọi ‖·‖=5; winner không highlight |
| figCos | `0 0 240 120` 80×40mm | ĐỘNG | 3 cột cosine đỉnh "?", vạch 1.0 | cột cao nhất = chọn (ẩn) |
| figPipe | `0 0 380 92` 150×36mm | TĨNH | q→nhúng→cosine kho→top-k→LLM; chia retrieval/sinh | thứ tự cố định |

## 7-8. Khối chữ & CSS
`.legend · .qset/.qtag · .figcap · .calc2(cụm1-3) · .keylist`. CSS additive như I5.

## 9. Helper SVG
`el, txt, ctxt, rct`. `drawAngle, drawCos` ĐỘNG → `generate()`; `drawPipe` TĨNH → gọi 1 lần.

## 10. Nghiệm thu (đã đạt)
- check.mjs --runs 5 → tràn 0px ×5 ✓ · check-de-key → 0 lệch ✓ · soát ảnh trang 1,2 ✓ · console sạch ✓
- 🎲: q, d đổi → figAngle mũi tên & figCos cột cập nhật; ô "?" luôn trống ✓

## 11. Bất biến nội dung
- cos ∈ [−1,1]; cos=1 cùng hướng, =0 vuông góc; chọn top-k cosine cao nhất.
- RAG khắc phục bịa & kiến thức cũ bằng đưa căn cứ vào ngữ cảnh; retrieval (tra) tách khỏi generation (sinh).
