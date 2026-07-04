# SPEC v3 — H6 · Khối Transformer (bản HIỂU RÕ, A4 dọc)

> **v3 = v(n−1) + LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File HTML: `K3/H6-khoi-transformer-hieu-ro.html`.
> Engine số giữ nguyên (`wb-random.js`, `data-q` + `WB.setAll`); KHÔNG ghi đè bản canonical `H6-khoi-transformer.html`.
> Bám **TEMPLATE HIỂU-RÕ mới** (mẫu chuẩn `H4`): *đề giàu hình + chùm câu hỏi*, đáp án **gọn**.

## 0. Khác biệt template mới vs bản trước
| | giảng-giải v1 (H6 cũ) | **TEMPLATE MỚI (bản này)** |
|---|---|---|
| Hình | 1 SVG pipeline ở bước 4 | **mỗi thành phần 1 sơ đồ NGAY TRÊN ĐỀ** (hình-để-điền) |
| Trọng tâm ĐỀ | bước có ô trống + lời dẫn | **chùm câu hỏi gắn thẻ vai trò** `Quan sát/Tính/Dự đoán/Vì sao` |
| ĐÁP ÁN | bung số từng bước | **GỌN**: đáp số + 1 dòng cốt lõi (badge ✓ → check-de-key bỏ qua) |
| Số trang | 2 | **4 (3 ĐỀ + 1 ĐÁP ÁN)** |
| Số sơ đồ | 1 | **4** (figAttn, figFFN, figGrad, figBlock) — 4/4 ở ĐỀ |

## 1. Định vị bài
Một khối Transformer = **attention + FFN**, mỗi cái bọc bởi **LayerNorm + residual (kết nối tắt)** theo khuôn pre-norm:
`a = x + Attention(LN(x))` rồi `out = a + FFN(LN(a))`. Chồng N khối thành mô hình. Điểm dạy: **cách RÁP khối** (residual + LN), không phải nội dung attention/FFN. Phiếu dùng **1 token, vectơ 2 chiều, số nguyên nhỏ**.

## 2. Mã màu NHẤT QUÁN (hằng JS)
```js
var CX='#0e7490', CATT='#b45309', CFFN='#7c5cff', GRY='#5b6776';
```
- **x / residual = lam (#0e7490, đường thẳng, luồng xuôi)** · **Attention = cam (#b45309, nhánh trộn)** · **FFN = tím (#7c5cff, nhánh xử lý)** · LN/cấu trúc = xám.
- Legend cuối `.intro` trang 1: `x/residual (lam) · Attention (cam) · FFN (tím)`.
- Thẻ vai trò: Quan sát = lam · Tính = cam · Dự đoán = tím · Vì sao = xám đậm (#475569).

## 3. Ghi chú trung thực (biến đơn giản hóa thành điểm dạy)
- **Kết quả bên trong Attention(LN(x)) và FFN(LN(a)) cho-sẵn** (đã học ở H1–H3, H11) — để phiếu tập trung vào residual + LN (phần RIÊNG của "khối").
- **LN không tính số** ở đây (chuẩn hóa cho vectơ 2 chiều nhỏ sẽ tầm thường) — chỉ nêu vai trò; con số residual là phép **cộng nguyên** để tính tay chắc tay.
- figGrad là **minh hoạ định tính** (nhân 0.5 mỗi tầng vs giữ nguyên) — không phải số của bài; nói rõ "ví dụ minh hoạ".

## 4. Layout 4 trang
| Trang | Mặt | Nội dung |
|---|---|---|
| 1 | ĐỀ | wb-head · title · namebar · `.intro`+formula+**legend** · `.intuition` · **Bước 0 Cho sẵn** (x, Attn, FFN `.gv`) · **Cụm 1 Attention+residual**: `figAttn` + `.calc2` (a=x+Attn) + Quan sát/Vì sao |
| 2 | ĐỀ | **Cụm 2 FFN+residual**: `figFFN` + `.calc2` (out=a+FFN) + Quan sát/Dự đoán · **Cụm 3 LN & residual**: `figGrad` + 2 câu Vì sao |
| 3 | ĐỀ | **Cụm 4 Toàn cảnh + xếp chồng**: `figBlock` (khối đầy đủ có cung residual) + `.note` (đầu ra → đầu vào khối kế; encoder/decoder khác mask & cross) + 3 câu (Quan sát/Vì sao/Dự đoán tóm tắt) |
| 4 | ĐÁP ÁN | 4 khối `.keylist` (badge ✓) · `.intro` viền cam **Rút ra** → H7 positional encoding |

**Khối `.calc2` "✍️ TỰ TÍNH"** ở cụm 1 (a = x + Attn) & cụm 2 (out = a + FFN, a lấy từ Bước 1). Cụm 3 & 4 conceptual (không số).
**Parity (cửa B7):** ĐỀ numbered `.b` = {0,1,2,3,4}; ĐÁP ÁN dùng **badge icon ✓** → key{} ⊆ ĐỀ → **0 lệch**.

## 5. `data-q` & engine số
- Given (`.gv`): `x1,x2` · `at1,at2` (Attention) · `ff1,ff2` (FFN).
- ĐÁP ÁN (lộ số): `a1,a2` (= x + Attn) · `o1,o2` (= a + FFN).
- Sinh số: mỗi tọa độ `WB.randInt(0,3)`; `a = x + at` (từng tọa độ); `o = a + ff`. Phép cộng nguyên → không cần fmt thập phân.

## 6. Đặc tả từng sơ đồ (viewBox · ĐỘNG/TĨNH · dạy gì · bất biến)
| id | viewBox / kích thước | Đ/T | Dạy gì | Bất biến khi 🎲 |
|---|---|---|---|---|
| **figAttn** | `0 0 270 116` · 80×34mm | ĐỘNG | x → nhánh (LN→Attention, cam) + đường thẳng residual (lam) → ⊕ → **a="?"**; hàm dùng-lại `drawResid` | ô ra "?" luôn trống; đường residual đậm lam; nhánh trên hiện đúng (at1,at2) |
| **figFFN** | `0 0 270 116` · 80×34mm | ĐỘNG | **cùng khuôn** figAttn, thay Attention→FFN (tím), input=a → **out="?"** | cùng cấu trúc; nhãn "a", "FFN"; ô ra trống |
| **figGrad** | `0 0 220 118` · 66×35mm | TĨNH | gradient qua 3 tầng: trái không-residual (cột teo 1→½→¼, cam) vs phải có-residual (cột giữ nguyên, lam) + cung "+1" | minh hoạ định tính, không đổi khi 🎲 |
| **figBlock** | `0 0 560 120` · 172×37mm | TĨNH | khối đầy đủ: x→LN→Attention→⊕(+x)→LN→FFN→⊕(+a)→out; 2 **cung residual nét đứt** (lam) ôm từng nhánh; "↻ ×N khối" | 8 nút + 2 cung; thứ tự cố định |

> `drawResid(id, inLab, inVal, subLab, subColor, subVal, outLab)` là helper dùng lại cho cả figAttn & figFFN — minh hoạ "hai nửa cùng khuôn".
> Quy tắc vàng: hình để-điền chỉ vẽ dữ liệu cho-sẵn + cấu trúc, **giấu a, out** (ô "?").

## 7. Khối chữ mới
- `.legend` (x/residual · Attention · FFN).
- `.qset` với `.qtag` (`.qt-see/.qt-calc/.qt-pred/.qt-why`).
- `.figcap` "Nhìn hình: …".
- `.calc2` "✍️ TỰ TÍNH" (cụm 1,2).
- `.note` xếp chồng N khối (cụm 4).
- `.keylist` đáp án gọn.

## 8. CSS thêm (additive)
`.legend/.cqq/.ckk/.cvv` · `.figwrap/.figcap` · `.qset/.qtag/.qt-*` · `.calc2/.ttl/.blk/.sub` · `.keylist/.lab/.mono` · siết `.step/.intro/.intuition/.note`. **Không sửa class cũ wb.css.**

## 9. Helper SVG (đầu `<script>`)
`el, line, txt, ctxt, rct(+rx,sw), arrow` (bộ chuẩn) + `plus(cx,cy,r)` (nút ⊕) + `drawResid` (dùng lại). `drawResid` ĐỘNG → gọi trong `generate()`; `drawGrad/drawBlock` TĨNH → gọi 1 lần sau `WB.wire(generate); generate();`.

## 10. Nghiệm thu (đã đạt)
- `node tools/check.mjs K3/H6-khoi-transformer-hieu-ro.html --runs 5` → **tràn 0px ×5 cả 4 trang ✓**
- `node tools/check-de-key.mjs K3/H6-khoi-transformer-hieu-ro.html` → **0 lệch (ĐỀ{0..4} key{}) ✓**
- Soát ảnh Edge (4 trang): figAttn/figFFN/figGrad/figBlock hiện đủ, cung residual rõ, console JS sạch ✓
- 🎲: x/Attn/FFN đổi → figAttn/figFFN + a, out cập nhật khớp; ô "?" ở ĐỀ luôn trống ✓

## 11. Bất biến nội dung (luôn đúng)
- a = x + Attention (từng tọa độ); out = a + FFN → residual = phép cộng lại chính mình.
- Hai nhánh **cùng khuôn** (LN → biến đổi → ⊕), khác duy nhất ở khối biến đổi (Attention vs FFN) & đầu vào (x vs a).
- FFN = 0 → out = a (residual giữ nguyên) → khối học "phần thêm".
