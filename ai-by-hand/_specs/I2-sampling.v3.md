# SPEC v3 — I2 · Sampling (bản HIỂU RÕ, A4 dọc)

> **v3 = v(n−1) + LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File HTML: `K3/I2-sampling-hieu-ro.html`.
> Engine số giữ nguyên (`wb-random.js`, `data-q` + `WB.setAll`); KHÔNG ghi đè bản canonical `I2-sampling.html`.
> Bám **TEMPLATE HIỂU-RÕ mới** (mẫu chuẩn `H4`).

## 0. Khác biệt template mới vs bản trước
| | giảng-giải v1 (I2 cũ) | **TEMPLATE MỚI (bản này)** |
|---|---|---|
| Hình | 1 SVG cột p ở bước 4 | **mỗi thành phần 1 sơ đồ NGAY TRÊN ĐỀ** |
| Trọng tâm ĐỀ | bước có ô trống | **chùm câu hỏi gắn thẻ vai trò** |
| ĐÁP ÁN | bung số | **GỌN** (badge ✓) |
| Số trang | 2 | **4 (3 ĐỀ + 1 ĐÁP ÁN)** |
| Số sơ đồ | 1 | **4** (figBars, figTemp, figGreedy, figTopp) — 4/4 ở ĐỀ |

## 1. Định vị bài
Softmax đổi logits → xác suất; các núm **nhiệt độ T**, **top-k**, **top-p** điều khiển độ ngẫu nhiên khi chọn token. `p=softmax(z/T)`. Phiếu: **3 token, T∈{1,2}**, bảng eˣ (gồm e^0.5=1.65).

## 2. Mã màu NHẤT QUÁN (hằng JS)
```js
var EXP1={0:1,1:2.72,2:7.39}, EXP2={0:1,1:1.65,2:2.72};  // EXP2 = e^(z/2)
var P1={0:0.09,1:0.24,2:0.67}, P2={0:0.19,1:0.31,2:0.51};
var CZ='#0e7490', CP='#b45309', CT='#7c5cff', GRY='#5b6776';
```
- **logits z = lam (#0e7490)** · **xác suất p = cam (#b45309)** · **T=2 (phẳng) = tím (#7c5cff)** · cấu trúc = xám.
- Legend cuối `.intro` trang 1: `logits z (lam) · xác suất p (cam) · T=2 phẳng (tím)`.
- Thẻ vai trò: Quan sát = lam · Tính = cam · Dự đoán = tím · Vì sao = xám đậm (#475569).

## 3. Ghi chú trung thực (biến đơn giản hóa thành điểm dạy)
- z = **hoán vị của {2,1,0}** → T=1: Σ=11.11, p∈{0.67,0.24,0.09}; T=2: z/2∈{1,0.5,0}, Σ=5.37, p∈{0.51,0.31,0.19}. Số ổn định, chỉ đổi vị trí token.
- top-p=0.9 với p(T=1): 0.67+0.24=0.91≥0.9 → **luôn giữ 2 token**, bỏ token p=0.09 (đuôi).
- Bảng eˣ có **e^0.5=1.65** để tính T=2.

## 4. Layout 4 trang
| Trang | Mặt | Nội dung |
|---|---|---|
| 1 | ĐỀ | intro+formula+**legend** · intuition · **Bước 0** (z `.gv` + bảng eˣ) · **Cụm 1 Softmax T=1**: `figBars` (eˣ + p"?") + `.calc2` + Quan sát/Vì sao |
| 2 | ĐỀ | **Cụm 2 Nhiệt độ T=2**: `figTemp` (T=1 nhọn vs T=2 phẳng) + `.calc2` (z/2, eˣ, p) + Quan sát/Dự đoán · **Cụm 3 Greedy/top-k**: `figGreedy` (khoanh cột cao nhất) + Quan sát/Vì sao |
| 3 | ĐỀ | **Cụm 4 top-p**: `figTopp` (cột giảm dần, cộng dồn ≥0.9, đuôi xám) + `.calc2` (cộng dồn) + Vì sao/Dự đoán tóm tắt |
| 4 | ĐÁP ÁN | 4 khối `.keylist` (badge ✓) · `.intro` viền cam **Rút ra** → I3 perplexity |

**`.calc2`** ở cụm 1 (softmax T=1), cụm 2 (T=2), cụm 4 (cộng dồn top-p). Cụm 3 conceptual.
**Parity (cửa B7):** ĐỀ `.b`={0,1,2,3,4}; ĐÁP ÁN badge ✓ → key{}⊆ĐỀ → **0 lệch**.

## 5. `data-q` & engine số
- Given (`.gv`): `z1,z2,z3`.
- ĐÁP ÁN: `Z`(=11.11), `Z2`(=5.37) · `p1,p2,p3` (T=1) · `pt1,pt2,pt3` (T=2) · `amax` (token greedy) · `cum2`(=0.91).
- Sinh: `z=pickDistinct([2,1,0],3)`; `p_i=P1[z_i]`, `pt_i=P2[z_i]`; `amax=z.indexOf(2)+1`. `WB.fmt2`.

## 6. Đặc tả từng sơ đồ (viewBox · ĐỘNG/TĨNH · dạy gì · bất biến)
| id | viewBox / kích thước | Đ/T | Dạy gì | Bất biến khi 🎲 |
|---|---|---|---|---|
| **figBars** | `0 0 230 104` · 70×32mm | ĐỘNG | 3 thanh eˣ (cao theo z) + khung p "?" | p để "?"; chiều cao eˣ ∝ EXP1[z] |
| **figTemp** | `0 0 250 108` · 74×32mm | ĐỘNG | 2 nhóm cột: T=1 (cam, nhọn) vs T=2 (tím, phẳng) — cột theo p thật, KHÔNG ghi số | T=1 luôn nhọn hơn T=2; nhóm theo z hiện hành |
| **figGreedy** | `0 0 230 100` · 68×30mm | ĐỘNG | 3 cột p, cột cao nhất (cam) được **khoanh "chọn"** | cột argmax (z=2) luôn được khoanh |
| **figTopp** | `0 0 250 118` · 74×35mm | TĨNH | 3 cột p giảm dần (0.67,0.24,0.09), nhãn cộng dồn Σ; cột cuối **xám "bỏ"** | giữ 2 đầu, bỏ đuôi (top-p=0.9) |

> figBars/figTemp/figGreedy ĐỘNG theo z; figTopp TĨNH (p sắp giảm cố định). Số p ẩn ("?"); việc "Tính" ở `.calc2`.

## 7. Khối chữ mới
`.legend` · `.qset`+`.qtag` · `.figcap` · `.calc2` (cụm 1,2,4) · `.extbl` eˣ (có e^0.5) · `.keylist`.

## 8. CSS thêm (additive)
`.extbl` · `.legend/.cqq/.ckk/.cvv` · `.figwrap/.figcap` · `.qset/.qtag/.qt-*` · `.calc2/.ttl/.blk/.sub` · `.keylist/.lab/.mono`. **Không sửa class cũ wb.css.**

## 9. Helper SVG
`el, txt, ctxt, rct`. `drawBars/drawTemp/drawGreedy` ĐỘNG → trong `generate()`; `drawTopp` TĨNH → gọi 1 lần sau `WB.wire(generate); generate();`.

## 10. Nghiệm thu (đã đạt)
- `check.mjs --runs 5` → **tràn 0px ×5 cả 4 trang ✓**
- `check-de-key.mjs` → **0 lệch (ĐỀ{0..4} key{}) ✓**
- Soát ảnh Edge: figBars eˣ+p?, figTemp 2 nhóm nhọn/phẳng, figGreedy khoanh, figTopp cộng dồn+bỏ đuôi; console JS sạch ✓
- 🎲: z hoán vị → p, p(T=2), argmax, figTemp/figGreedy cập nhật; ô "?" luôn trống ✓

## 11. Bất biến nội dung (luôn đúng)
- p(T=1) nhọn hơn p(T=2) (token mạnh 0.67→0.51) → T lớn phẳng hơn.
- Greedy = argmax = token z=2.
- top-p=0.9 → giữ 2 token đầu (Σ=0.91), bỏ đuôi p=0.09.
