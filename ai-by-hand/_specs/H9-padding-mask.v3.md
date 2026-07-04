# SPEC v3 — H9 · Padding Mask (bản HIỂU RÕ, A4 dọc)

> **v3 = v(n−1) + LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File HTML: `K3/H9-padding-mask-hieu-ro.html`.
> Engine số giữ nguyên (`wb-random.js`, `data-q` + `WB.setAll`); KHÔNG ghi đè bản canonical `H9-padding-mask.html`.
> Bám **TEMPLATE HIỂU-RÕ mới** (mẫu chuẩn `H4`): *đề giàu hình + chùm câu hỏi*, đáp án **gọn**.

## 0. Khác biệt template mới vs bản trước
| | giảng-giải v1 (H9 cũ) | **TEMPLATE MỚI (bản này)** |
|---|---|---|
| Hình | 1 SVG ma trận che ở bước 4 | **mỗi thành phần 1 sơ đồ NGAY TRÊN ĐỀ** |
| Trọng tâm ĐỀ | bước có ô trống | **chùm câu hỏi gắn thẻ vai trò** |
| ĐÁP ÁN | bung số | **GỌN** (badge ✓ → check-de-key bỏ qua) |
| Số trang | 2 | **4 (3 ĐỀ + 1 ĐÁP ÁN)** |
| Số sơ đồ | 1 | **4** (figMask, figEx, figAlpha, figTri) — 4/4 ở ĐỀ |

## 1. Định vị bài
Gom câu khác độ dài vào batch → **đệm (pad)**. Mask đặt điểm attention ô PAD về **−∞** để softmax cho **0** → token thật không "nghe" ô rác. Cùng cơ chế **causal mask** (che tương lai, tam giác trên). Phiếu dùng **4 vị trí (3 thật + 1 PAD)**, bảng eˣ.

## 2. Mã màu NHẤT QUÁN (hằng JS)
```js
var EXP={0:1,1:2.72,2:7.39}, AMAP={0:0.09,1:0.24,2:0.67};
var CR='#0e7490', CP='#b45309', CA='#7c5cff', GRY='#5b6776';
```
- **token thật = lam (#0e7490)** · **ô PAD / bị che = cam (#b45309)** · **α trọng số = tím (#7c5cff)** · cấu trúc/che = xám.
- Legend cuối `.intro` trang 1: `token thật (lam) · ô PAD/bị che (cam) · α (tím)`.
- Thẻ vai trò: Quan sát = lam · Tính = cam · Dự đoán = tím · Vì sao = xám đậm (#475569).

## 3. Ghi chú trung thực (biến đơn giản hóa thành điểm dạy)
- Điểm 3 token thật là **hoán vị của {2,1,0}** → eˣ ∈ {7.39,2.72,1}, **Σ = 11.11 luôn**, α ∈ {0.67,0.24,0.09} (đổi vị trí khi 🎲). Số đẹp, ổn định.
- PAD: điểm = **−∞** (biểu tượng, không phải số) → e^−∞=0. Nêu rõ "đặt 0 thì e⁰=1 vẫn nhận chú ý" (vì sao phải −∞).
- figTri là **causal 4×4 tĩnh** (minh hoạ họ hàng) — không phụ thuộc số bài.

## 4. Layout 4 trang
| Trang | Mặt | Nội dung |
|---|---|---|
| 1 | ĐỀ | wb-head · title · namebar · `.intro`+formula+**legend** · `.intuition` · **Bước 0 Cho sẵn** (s1,s2,s3 `.gv` + bảng eˣ) · **Cụm 1 Áp mask**: `figMask` (4 ô, PAD gạch → −∞) + Quan sát/Vì sao |
| 2 | ĐỀ | **Cụm 2 Mũ hóa**: `figEx` (thanh eˣ, PAD=0) + `.calc2` (e^t, e^−∞=0) + Quan sát/Vì sao · **Cụm 3 Softmax**: `figAlpha` (α "?", PAD=0) + `.calc2` (Σ, α, α_PAD) + Quan sát/Vì sao |
| 3 | ĐỀ | **Cụm 4 Causal mask**: `figTri` (ma trận 4×4, tam giác trên −∞) + `.note` + Quan sát/Vì sao/Dự đoán tóm tắt |
| 4 | ĐÁP ÁN | 4 khối `.keylist` (badge ✓) · `.intro` viền cam **Rút ra** → H10 KV cache |

**Khối `.calc2` "✍️ TỰ TÍNH"** ở cụm 2 (mũ hóa) & cụm 3 (softmax). Cụm 1 (mask) & 4 (causal) conceptual.
**Parity (cửa B7):** ĐỀ numbered `.b` = {0,1,2,3,4}; ĐÁP ÁN dùng **badge icon ✓** → key{} ⊆ ĐỀ → **0 lệch**.

## 5. `data-q` & engine số
- Given (`.gv`): `s1,s2,s3` (điểm 3 token thật).
- ĐÁP ÁN (lộ số): `epad` (=0) · `Z` (=Σ=11.11) · `a1,a2,a3` (α) · `apad` (=0).
- Sinh số: `s=pickDistinct([2,1,0],3)`; `e=EXP[s]`; `Z=Σe`; `a=AMAP[s]`. eˣ trung gian **không** có data-q (blank tự điền, như H1). Định dạng `WB.fmt2`.

## 6. Đặc tả từng sơ đồ (viewBox · ĐỘNG/TĨNH · dạy gì · bất biến)
| id | viewBox / kích thước | Đ/T | Dạy gì | Bất biến khi 🎲 |
|---|---|---|---|---|
| **figMask** | `0 0 300 96` · 88×29mm | ĐỘNG | hàng 4 ô: 3 thật (lam, hiện điểm) "giữ nguyên" + PAD (cam) gạch ngang → "−∞" "bị mask" | chỉ ô PAD gạch; 3 ô thật hiện điểm hiện hành |
| **figEx** | `0 0 240 100` · 72×30mm | ĐỘNG | 4 thanh eˣ: 3 thật "?" cao theo eˣ, PAD tụt về 0 | thanh PAD ≈0; 3 thanh thật để "?"; chiều cao ∝ eˣ |
| **figAlpha** | `0 0 240 100` · 72×30mm | ĐỘNG | phân bố α: 3 khung "?" (nét đứt) + PAD=0; ghi "cộng=1" | α 3 ô luôn "?"; PAD=0 |
| **figTri** | `0 0 300 176` · 88×52mm | TĨNH | ma trận 4×4 query×key; ô j≤i = ✓ (lam, nhìn được), j>i = −∞ (xám, tương lai) + chú giải | tam giác dưới ✓, trên −∞ |

> Quy tắc vàng: figEx & figAlpha **giấu số** (eˣ, α là ô "?"); figMask hiện điểm given + hành động mask; việc "Tính" nằm ở `.calc2`.

## 7. Khối chữ mới
- `.legend` · `.qset`+`.qtag` · `.figcap` "Nhìn hình: …" · `.calc2` "✍️ TỰ TÍNH" (cụm 2,3) · `.note` causal (cụm 4) · `.extbl` bảng eˣ · `.keylist` đáp án gọn.

## 8. CSS thêm (additive)
`.extbl` · `.legend/.cqq/.ckk/.cvv` · `.figwrap/.figcap` · `.qset/.qtag/.qt-*` · `.calc2/.ttl/.blk/.sub` · `.keylist/.lab/.mono` · siết `.step/.intro/.intuition/.note`. **Không sửa class cũ wb.css.**

## 9. Helper SVG (đầu `<script>`)
`el, line, txt, ctxt, rct`. `drawMask/drawEx/drawAlpha` ĐỘNG → gọi trong `generate()`; `drawTri` TĨNH → gọi 1 lần sau `WB.wire(generate); generate();`.

## 10. Nghiệm thu (đã đạt)
- `node tools/check.mjs K3/H9-padding-mask-hieu-ro.html --runs 5` → **tràn 0px ×5 cả 4 trang ✓**
- `node tools/check-de-key.mjs K3/H9-padding-mask-hieu-ro.html` → **0 lệch (ĐỀ{0..4} key{}) ✓**
- Soát ảnh Edge (4 trang): figMask gạch PAD, figEx/figAlpha "?", figTri tam giác + chú giải; console JS sạch ✓
- 🎲: hoán vị điểm đổi → figMask/figEx + Σ,α cập nhật; PAD luôn 0; ô "?" luôn trống ✓

## 11. Bất biến nội dung (luôn đúng)
- e^−∞ = 0 → PAD biến mất khỏi Σ; α_PAD = 0; α (3 thật) cộng = 1.
- Σ = 11.11 (hoán vị {2,1,0}); α luôn là hoán vị {0.67,0.24,0.09}.
- Causal & padding cùng dùng −∞→0, khác ở **chọn ô che** (đệm vs tương lai).
