# SPEC v3 — H10 · KV Cache (bản HIỂU RÕ, A4 dọc)

> **v3 = v(n−1) + LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File HTML: `K3/H10-kv-cache-hieu-ro.html`.
> Engine số giữ nguyên (`wb-random.js`, `data-q` + `WB.setAll`); KHÔNG ghi đè bản canonical `H10-kv-cache.html`.
> Bám **TEMPLATE HIỂU-RÕ mới** (mẫu chuẩn `H4`). Bố cục 5 cụm như H1.

## 0. Khác biệt template mới vs bản trước
| | giảng-giải v1 (H10 cũ) | **TEMPLATE MỚI (bản này)** |
|---|---|---|
| Hình | 1 SVG cache ở bước 4 | **mỗi thành phần 1 sơ đồ NGAY TRÊN ĐỀ** |
| Trọng tâm ĐỀ | bước có ô trống | **chùm câu hỏi gắn thẻ vai trò** |
| ĐÁP ÁN | bung số | **GỌN** (badge ✓) |
| Số trang | 2 | **4 (3 ĐỀ + 1 ĐÁP ÁN)** |
| Số sơ đồ | 1 | **5** (figCache, figScore, figBars, figMix, figSave) — 5/5 ở ĐỀ |

## 1. Định vị bài
Sinh token tuần tự: **lưu K,V** token cũ (cache), token mới chỉ tính K,V của chính nó rồi ghép: `K=[K_cache;kₜ]`, `V=[V_cache;vₜ]`; `out=softmax(qₜ·Kᵀ/√dₖ)·V`. Hạ O(n²)→O(n) mỗi bước. Phiếu: **cache 2 token + 1 token mới, dₖ=4**.

## 2. Mã màu NHẤT QUÁN (hằng JS)
```js
var EXP={0:1,1:2.72,2:7.39};
var CQ='#0e7490', CK='#b45309', CV='#7c5cff', GRY='#5b6776';
```
- **q = lam** · **K = cam** · **V = tím** · ô **cache = xám (#eef1f5)** (lấy lại). Legend nêu cả 4.
- Thẻ vai trò: Quan sát = lam · Tính = cam · Dự đoán = tím · Vì sao = xám đậm (#475569).

## 3. Ghi chú trung thực
- q₃=(2,0), k₁=(1,0), k₂=(0,1) **cố định**; chỉ **k₃=(m,0)** (m∈{1,2}) và v₁,v₂,v₃ đổi khi 🎲 → điểm sau ÷√dₖ = (1,0,m) rơi mốc bảng eˣ.
- α = eˣ/Σ (fmt2); với m=2: Σ=11.11, α≈(0.24,0.09,0.67).
- Cache framing: k₁,k₂,v₁,v₂ "đã có" — điểm dạy là **tái dùng**, không phải cách tính K,V (đã học H1).
- figMix: v là 3 đỉnh 0..2; hiếm khi trùng → tam giác suy biến (chấp nhận, không lỗi).

## 4. Layout 4 trang (5 cụm)
| Trang | Mặt | Nội dung |
|---|---|---|
| 1 | ĐỀ | intro+formula+**legend** · intuition · **Bước 0** (cache k,v + token mới `.gv` + bảng eˣ) · **Cụm 1 Tái dùng cache**: `figCache` + Quan sát/Vì sao |
| 2 | ĐỀ | **Cụm 2 Điểm q₃·K**: `figScore` + `.calc2` (÷2, 3 dòng, ghi cache/mới) + Quan sát · **Cụm 3 Softmax**: `figBars` + `.calc2` (eˣ,Σ,α) + Quan sát |
| 3 | ĐỀ | **Cụm 4 Trộn V**: `figMix` (tam giác v₁v₂v₃, out ẩn) + `.calc2` (out₁,out₂) + Vì sao · **Cụm 5 Tiết kiệm**: `figSave` (O(n²) vs O(n)) + Quan sát/Dự đoán tóm tắt |
| 4 | ĐÁP ÁN | 5 khối `.keylist` (badge ✓) · `.intro` viền cam **Rút ra** → H11 FFN |

**`.calc2`** ở cụm 2,3,4. Cụm 1,5 conceptual.
**Parity (cửa B7):** ĐỀ `.b`={0,1,2,3,4,5}; ĐÁP ÁN badge ✓ → key{}⊆ĐỀ → **0 lệch**.

## 5. `data-q` & engine số
- Given (`.gv`): `k3x,k3y` (=m,0) · `v11,v12,v21,v22,v31,v32`.
- ĐÁP ÁN: `sc1,sc2,sc3` (điểm ÷2 = 1,0,m) · `Z` · `a1,a2,a3` · `o1,o2`.
- Sinh: `m=pick([1,2])`; `e=[2.72,1,EXP[m]]`; `Z=Σe`; `a_i=e_i/Σ`; `v*=randInt(0,2)`; `out=Σ a_i·v_i`. `WB.fmt2`.

## 6. Đặc tả từng sơ đồ (viewBox · ĐỘNG/TĨNH · dạy gì · bất biến)
| id | viewBox / kích thước | Đ/T | Dạy gì | Bất biến khi 🎲 |
|---|---|---|---|---|
| **figCache** | `0 0 300 108` · 88×32mm | TĨNH | 2 ô cache (xám, "lấy lại") + 1 ô mới (cam, "tính mới") ⊕ → "K,V đầy đủ" | 2 xám + 1 cam; cấu trúc cố định |
| **figScore** | `0 0 250 104` · 74×31mm | TĨNH | q₃ (lam) → 3 khóa (k₁,k₂ xám cache; k₃ cam mới) → 3 ô "điểm=?" | 3 ô điểm "?"; k₃ nổi cam |
| **figBars** | `0 0 240 100` · 72×30mm | TĨNH | 3 khung eˣ "?" + dải α "?" (Σ=1) | tất cả để "?" |
| **figMix** | `0 0 160 138` · 48×41mm | ĐỘNG | tam giác v₁v₂v₃ (tím) + out ẩn "?" (vòng nét đứt ở trọng tâm) | out luôn ẩn; 3 đỉnh = v hiện hành |
| **figSave** | `0 0 360 110` · 150×38mm | TĨNH | trái: bậc thang tăng (không cache O(n²)); phải: cột phẳng (có cache O(n)) | so sánh cố định |

> figScore/figBars TĨNH (chỉ khung "?"); chỉ figMix ĐỘNG theo v. Việc "Tính" ở `.calc2`.

## 7. Khối chữ mới
`.legend` (thêm ô cache xám) · `.qset`+`.qtag` · `.figcap` · `.calc2` (cụm 2,3,4) · `.extbl` eˣ · `.keylist`.

## 8. CSS thêm (additive)
Như H1/H9: `.extbl` · `.legend/.cqq/.ckk/.cvv` · `.figwrap/.figcap` · `.qset/.qtag/.qt-*` · `.calc2/.ttl/.blk/.sub` · `.keylist/.lab/.mono`. **Không sửa class cũ wb.css.**

## 9. Helper SVG
`el, line, txt, ctxt, rct, arrow`. `drawMix` ĐỘNG → trong `generate()`; `drawCache/drawScore/drawBars/drawSave` TĨNH → gọi 1 lần sau `WB.wire(generate); generate();`.

## 10. Nghiệm thu (đã đạt)
- `check.mjs --runs 5` → **tràn 0px ×5 cả 4 trang ✓**
- `check-de-key.mjs` → **0 lệch (ĐỀ{0..5} key{}) ✓**
- Soát ảnh Edge: 5 sơ đồ hiện, tam giác V + out ẩn, figSave 2 cột; console JS sạch ✓
- 🎲: m/v đổi → điểm₃, α, out, figMix cập nhật; ô "?" luôn trống ✓

## 11. Bất biến nội dung
- out (có cache) = out (tính lại) → cache đổi **tốc độ**, không đổi kết quả.
- điểm = (1,0,m); α cộng = 1; out nằm trong bao lồi {v₁,v₂,v₃}.
- Không cache O(n²)/bước, có cache O(n)/bước — đổi bộ nhớ lấy tốc độ.
