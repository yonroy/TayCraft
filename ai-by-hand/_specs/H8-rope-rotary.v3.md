# SPEC v3 — H8 · RoPE Rotary Embedding (bản HIỂU RÕ, A4 dọc)

> **v3 = v(n−1) + LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File HTML: `K3/H8-rope-rotary-hieu-ro.html`.
> Engine số giữ nguyên (`wb-random.js`, `data-q` + `WB.setAll`); KHÔNG ghi đè bản canonical `H8-rope-rotary.html`.
> Bám **TEMPLATE HIỂU-RÕ mới** (mẫu chuẩn `H4`): *đề giàu hình + chùm câu hỏi*, đáp án **gọn**.

## 0. Khác biệt template mới vs bản trước
| | giảng-giải v1 (H8 cũ) | **TEMPLATE MỚI (bản này)** |
|---|---|---|
| Hình | 1 SVG quay ở bước 4 | **mỗi thành phần 1 sơ đồ NGAY TRÊN ĐỀ** |
| Trọng tâm ĐỀ | bước có ô trống + lời dẫn | **chùm câu hỏi gắn thẻ vai trò** |
| ĐÁP ÁN | bung số | **GỌN** (badge ✓ → check-de-key bỏ qua) |
| Số trang | 2 | **4 (3 ĐỀ + 1 ĐÁP ÁN)** |
| Số sơ đồ | 1 | **4** (figRot, figLen, figRel, figPairs) — 4/4 ở ĐỀ |

## 1. Định vị bài
RoPE nhúng vị trí bằng **quay** từng cặp chiều của Q, K một góc θ = pos·ωₖ: `(x₁,x₂)→(x₁cosθ−x₂sinθ, x₁sinθ+x₂cosθ)`. Điểm Q·K chỉ phụ thuộc **hiệu vị trí (m−n)** → khái quát tốt chuỗi dài (LLaMA, GPT-NeoX). Phiếu dùng **1 cặp chiều, góc θ tra bảng**.

## 2. Mã màu NHẤT QUÁN (hằng JS)
```js
var CX='#0e7490', CXP='#b45309', C2='#7c5cff', GRY='#5b6776';
var TAB={30:[0.87,0.50], 60:[0.50,0.87], 90:[0.00,1.00]};   // [cos,sin]
```
- **x trước quay = lam (#0e7490)** · **x' sau quay = cam (#b45309)** · **token khác (so tương đối) = tím (#7c5cff)** · trục/cấu trúc = xám.
- Legend cuối `.intro` trang 1: `x trước quay (lam) · x' sau quay (cam) · token khác (tím)`.
- Thẻ vai trò: Quan sát = lam · Tính = cam · Dự đoán = tím · Vì sao = xám đậm (#475569).

## 3. Ghi chú trung thực (biến đơn giản hóa thành điểm dạy)
- **Cho thẳng góc θ** (không tính pos·ωₖ) để tập trung vào phép quay; cos/sin **tra bảng** (θ ∈ {30,60,90}°).
- Chỉ quay **1 cặp chiều** (2D) cho tính tay; cụm 4 mở rộng thành nhiều cặp (minh hoạ).
- **figRot & figLen hiện cả x'** (hướng x' xác định bởi θ đã cho — không phải đáp số bị lộ); **tọa độ số của x' vẫn ẩn** (ô "?").
- figRel & figPairs là **minh hoạ định tính** (góc cố định 45°, tần số nhanh/chậm) — không phải số của bài.

## 4. Layout 4 trang
| Trang | Mặt | Nội dung |
|---|---|---|
| 1 | ĐỀ | wb-head · title · namebar · `.intro`+formula+**legend** · `.intuition` · **Bước 0 Cho sẵn** (x, θ `.gv` + bảng cos/sin) · **Cụm 1 Công thức quay**: `figRot` (x→x' + cung θ) + `.calc2` (x₁',x₂') + Quan sát/Vì sao |
| 2 | ĐỀ | **Cụm 2 Giữ độ dài**: `figLen` (đường tròn, x & x' cùng bán kính) + `.calc2` (‖x‖²) + Quan sát/Vì sao · **Cụm 3 Tương đối**: `figRel` (câu gốc vs dịch cả cụm, Δ không đổi) + Dự đoán/Vì sao |
| 3 | ĐỀ | **Cụm 4 Nhiều tần số**: `figPairs` (cặp chiều quay góc riêng, áp lên Q&K) + `.note` + Quan sát/Vì sao/Dự đoán tóm tắt |
| 4 | ĐÁP ÁN | 4 khối `.keylist` (badge ✓) · `.intro` viền cam **Rút ra** → H9 padding mask |

**Khối `.calc2` "✍️ TỰ TÍNH"** ở cụm 1 (công thức quay) & cụm 2 (‖x‖²). Cụm 3, 4 conceptual.
**Parity (cửa B7):** ĐỀ numbered `.b` = {0,1,2,3,4}; ĐÁP ÁN dùng **badge icon ✓** → key{} ⊆ ĐỀ → **0 lệch**.

## 5. `data-q` & engine số
- Given (`.gv`): `x1,x2` · `theta` (độ) · `cosv,sinv` (tra bảng, hiện trong calc2 cụm 1).
- ĐÁP ÁN (lộ số): `xp1,xp2` (sau quay) · `nrm` (=‖x‖²) · `nrm2` (=‖x'‖², bằng nrm).
- Sinh số: `th=pick([30,60,90])`; `[c,sn]=TAB[th]`; `x_i=randInt(1,3)`; `xp1=x1·c−x2·sn`, `xp2=x1·sn+x2·c`; `nrm=x1²+x2²`. Định dạng `WB.fmt2` (xp có thể âm → hiện dấu "−").

## 6. Đặc tả từng sơ đồ (viewBox · ĐỘNG/TĨNH · dạy gì · bất biến)
| id | viewBox / kích thước | Đ/T | Dạy gì | Bất biến khi 🎲 |
|---|---|---|---|---|
| **figRot** | `0 0 172 150` · 50×44mm | ĐỘNG | x (lam) quay góc θ thành x' (cam); cung góc θ giữa hai mũi tên; nhãn "x'=?" | x' luôn lệch x đúng θ; tọa độ số ẩn; góc arc = θ |
| **figLen** | `0 0 152 148` · 44×43mm | ĐỘNG | đường tròn bán kính ‖x‖; x & x' là hai bán kính bằng nhau | x, x' luôn nằm trên cùng đường tròn (cùng độ dài) |
| **figRel** | `0 0 240 128` · 72×38mm | TĨNH | 2 panel: câu gốc vs dịch cả cụm +k; q,k quay thêm cùng góc → **Δ giữ nguyên** | Δ=45° ở cả hai panel (minh hoạ) |
| **figPairs** | `0 0 360 120` · 156×40mm | TĨNH | vectơ chia cặp chiều, mỗi cặp quay góc riêng (cặp 0,1 nhanh; 2,3 chậm); áp lên **cả Q và K** | 2 hàng Q,K; cặp nhanh/chậm cố định |

> Quy tắc vàng: hình để-điền vẽ **cơ chế + cấu trúc**, giấu **tọa độ số** x' (ô "?"). Việc "Tính" ở `.calc2`.

## 7. Khối chữ mới
- `.legend` · `.qset`+`.qtag` · `.figcap` "Nhìn hình: …" · `.calc2` "✍️ TỰ TÍNH" (cụm 1,2) · `.note` (cụm 4) · `.extbl` bảng cos/sin · `.keylist` đáp án gọn.

## 8. CSS thêm (additive)
`.extbl` · `.legend/.cqq/.ckk/.cvv` · `.figwrap/.figcap` · `.qset/.qtag/.qt-*` · `.calc2/.ttl/.blk/.sub` · `.keylist/.lab/.mono` · siết `.step/.intro/.intuition/.note`. **Không sửa class cũ wb.css.**

## 9. Helper SVG (đầu `<script>`)
`el, line, dln, txt, ctxt, rct, arrow` + `arcBetween(ox,oy,r,a1,a2,col)` (cung nội suy theo góc — dùng cho figRot, figRel, figPairs). `drawRot/drawLen` ĐỘNG → gọi trong `generate()`; `drawRel/drawPairs` TĨNH → gọi 1 lần sau `WB.wire(generate); generate();`.

## 10. Nghiệm thu (đã đạt)
- `node tools/check.mjs K3/H8-rope-rotary-hieu-ro.html --runs 5` → **tràn 0px ×5 cả 4 trang ✓**
- `node tools/check-de-key.mjs K3/H8-rope-rotary-hieu-ro.html` → **0 lệch (ĐỀ{0..4} key{}) ✓**
- Soát ảnh Edge (4 trang): figRot cung θ rõ, figLen đường tròn qua x&x', figRel 2 panel Δ, figPairs Q/K; console JS sạch ✓
- 🎲: θ/x đổi → figRot quay, figLen bán kính đổi, xp/nrm cập nhật; ô "?" luôn trống ✓

## 11. Bất biến nội dung (luôn đúng)
- ‖x'‖ = ‖x‖ (quay bảo toàn độ dài) → nrm2 = nrm.
- x' lệch x đúng góc θ; θ=90° → hoán vị & đổi dấu ((3,1)→(−1,3)).
- Góc lệch giữa hai token = (m−n)·ω → điểm Q·K chỉ phụ thuộc khoảng cách.
