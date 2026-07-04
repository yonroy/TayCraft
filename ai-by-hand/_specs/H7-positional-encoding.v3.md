# SPEC v3 — H7 · Positional Encoding (bản HIỂU RÕ, A4 dọc)

> **v3 = v(n−1) + LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File HTML: `K3/H7-positional-encoding-hieu-ro.html`.
> Engine số giữ nguyên (`wb-random.js`, `data-q` + `WB.setAll`); KHÔNG ghi đè bản canonical `H7-positional-encoding.html`.
> Bám **TEMPLATE HIỂU-RÕ mới** (mẫu chuẩn `H4`): *đề giàu hình + chùm câu hỏi*, đáp án **gọn**.

## 0. Khác biệt template mới vs bản trước
| | giảng-giải v1 (H7 cũ) | **TEMPLATE MỚI (bản này)** |
|---|---|---|
| Hình | 1 SVG vài sóng sin ở bước 4 | **mỗi thành phần 1 sơ đồ NGAY TRÊN ĐỀ** (hình-để-điền) |
| Trọng tâm ĐỀ | bước có ô trống + lời dẫn | **chùm câu hỏi gắn thẻ vai trò** `Quan sát/Tính/Dự đoán/Vì sao` |
| ĐÁP ÁN | bung số | **GỌN**: đáp số + 1 dòng cốt lõi (badge ✓ → check-de-key bỏ qua) |
| Số trang | 2 | **4 (3 ĐỀ + 1 ĐÁP ÁN)** |
| Số sơ đồ | 1 | **4** (figHi, figLo, figVec, figWaves) — 4/4 ở ĐỀ |

## 1. Định vị bài
Attention **không có thứ tự** → cộng "dấu vị trí" vào embedding bằng **sóng sin/cos nhiều tần số**: `PE(pos,2i)=sin(pos/10000^(2i/d))`, `PE(pos,2i+1)=cos(...)`. Mỗi vị trí có mã **duy nhất** & so sánh được khoảng cách. Phiếu dùng **d=4, 2 tần số** (chiều 0,1 cao; chiều 2,3 thấp).

## 2. Mã màu NHẤT QUÁN (hằng JS)
```js
var CHI='#0e7490', CLO='#7c5cff', CRES='#b45309', GRY='#5b6776';
var SIN={1:0.84,2:0.91,3:0.14}, COS={1:0.54,2:-0.42,3:-0.99};
```
- **chiều 0,1 (tần số cao) = lam (#0e7490)** · **chiều 2,3 (tần số thấp) = tím (#7c5cff)** · **PE / z (kết quả) = cam (#b45309)** · trục/cấu trúc = xám.
- Legend cuối `.intro` trang 1: `chiều 0,1 tần số cao (lam) · chiều 2,3 tần số thấp (tím) · PE/z (cam)`.
- Thẻ vai trò: Quan sát = lam · Tính = cam · Dự đoán = tím · Vì sao = xám đậm (#475569).

## 3. Ghi chú trung thực (biến đơn giản hóa thành điểm dạy)
- **Bảng sin/cos cho-sẵn** tại θ ∈ {1,2,3} rad (static). Góc nhỏ (chiều thấp): quy tắc `sin θ≈θ, cos θ≈1.00` — nêu ở note Bước 0.
- Bộ chia tần số d=4: chiều 0,1 → góc = pos (÷1); chiều 2,3 → góc = pos÷100 = pos·0.01. `10000^(2i/d)`: i=0→1, i=1→100.
- **figLo phóng đại góc** (+0.18 rad) để nhìn thấy kim nhích; con số thật vẫn ≈0.01–0.03 (ô "?", không ghi số → không mâu thuẫn). Nêu "minh hoạ" trong figcap.
- cos có thể **âm** (pos=2,3) — dạy luôn rằng cos∈[−1,1].

## 4. Layout 4 trang
| Trang | Mặt | Nội dung |
|---|---|---|
| 1 | ĐỀ | wb-head · title · namebar · `.intro`+formula+**legend** · `.intuition` · **Bước 0 Cho sẵn** (pos, e `.gv` + bảng sin/cos) · **Cụm 1 Tần số cao**: `figHi` (đồng hồ kim θ=pos) + `.calc2` (PE₀,PE₁ tra bảng) + Quan sát/Vì sao |
| 2 | ĐỀ | **Cụm 2 Tần số thấp**: `figLo` (kim gần ngang) + `.calc2` (θ nhỏ → PE₂,PE₃) + Dự đoán/Vì sao · **Cụm 3 Lắp vectơ**: `figVec` (e+PE=z) + `.calc2` (PE vector, z=e+PE) + Vì sao |
| 3 | ĐỀ | **Cụm 4 Nhiều tần số**: `figWaves` (sóng nhanh lam + chậm tím, vạch pos) + `.note` (vị trí tương đối/phép quay) + Quan sát/Vì sao/Dự đoán tóm tắt |
| 4 | ĐÁP ÁN | 4 khối `.keylist` (badge ✓) · `.intro` viền cam **Rút ra** → H8 RoPE |

**Khối `.calc2` "✍️ TỰ TÍNH"** ở cụm 1 (tra sin/cos), cụm 2 (góc nhỏ), cụm 3 (lắp PE + cộng e). Cụm 4 conceptual.
**Parity (cửa B7):** ĐỀ numbered `.b` = {0,1,2,3,4}; ĐÁP ÁN dùng **badge icon ✓** → key{} ⊆ ĐỀ → **0 lệch**.

## 5. `data-q` & engine số
- Given (`.gv`): `pos` · `e0..e3` (embedding). Also `poslo` (=pos·0.01, hiện ở calc2 cụm 2).
- ĐÁP ÁN (lộ số): `pe0,pe1,pe2,pe3` (cụm 1,2) · **bản sao** `pe0b..pe3b` (lắp vectơ cụm 3) · `z0..z3` (=e+PE).
- Sinh số: `pos = pick([1,2,3])`; `pe0=SIN[pos], pe1=COS[pos]`; `pe2=round(0.01·pos)`, `pe3=1.00`; `e_i=randInt(0,2)`; `z_i=e_i+pe_i`. Định dạng `WB.fmt2`.
- **Lưu ý parity data-q**: dùng `pe0b..pe3b` (khác `pe0..pe3`) để lắp lại vectơ ở cụm 3 mà không trùng khóa cụm 1,2 — mọi khóa vẫn có ô/đáp trên phiếu.

## 6. Đặc tả từng sơ đồ (viewBox · ĐỘNG/TĨNH · dạy gì · bất biến)
| id | viewBox / kích thước | Đ/T | Dạy gì | Bất biến khi 🎲 |
|---|---|---|---|---|
| **figHi** | `0 0 158 150` · 46×44mm | ĐỘNG | đồng hồ đơn vị, kim ở θ=pos (rad); chiếu ngang="cos=?", dọc="sin=?"; cung góc θ | kim đúng góc pos; hai hình chiếu để "?"; kim quay nhiều khi pos tăng |
| **figLo** | `0 0 158 150` · 46×44mm | ĐỘNG | cùng đồng hồ, kim ở góc **rất nhỏ** (phóng đại) → gần ngang; sin≈0, cos≈1 (để "?") | kim luôn gần trục ngang; nhích rất ít giữa các pos |
| **figVec** | `0 0 210 132` · 62×40mm | ĐỘNG | 3 hàng 4 ô: **e** (cho sẵn, xám) `+` **PE** (?, lam×2 + tím×2) `=` **z** (?, cam) | e hiện số given; PE & z hàng "?"; màu PE theo tần số |
| **figWaves** | `0 0 340 120` · 150×42mm | TĨNH* | sóng nhanh (lam, freq 0.14) + chậm (tím, freq 0.03) theo pos; **vạch dọc pos** + 2 chấm giao | vạch pos di chuyển theo pos; 2 tần số cố định (*mark động*) |

> Quy tắc vàng: hình để-điền chỉ vẽ **cấu trúc/dữ liệu cho-sẵn**, **giấu kết quả** (ô "?": cos/sin/PE/z). figWaves minh hoạ "vân tay nhiều tần số".

## 7. Khối chữ mới
- `.legend` (tần số cao/thấp/kết quả).
- `.qset` với `.qtag` (`.qt-see/.qt-calc/.qt-pred/.qt-why`).
- `.figcap` "Nhìn hình: …".
- `.calc2` "✍️ TỰ TÍNH" (cụm 1,2,3).
- `.note` vị trí tương đối (cụm 4).
- `.extbl` bảng sin/cos · `.keylist` đáp án gọn.

## 8. CSS thêm (additive)
`.extbl/.extbl td(.h)` · `.legend/.cqq/.ckk/.cvv` · `.figwrap/.figcap` · `.qset/.qtag/.qt-*` · `.calc2/.ttl/.blk/.sub` · `.keylist/.lab/.mono` · siết `.step/.intro/.intuition/.note`. **Không sửa class cũ wb.css.**

## 9. Helper SVG (đầu `<script>`)
`el, line, dln(nét đứt), txt, ctxt, rct, arrow` + `drawClock(id,theta,col)` (dùng lại cho figHi/figLo), `drawVec`, `drawWaves`. Tất cả ĐỘNG → gọi trong `generate()` sau `WB.setAll`; `WB.wire(generate); generate();`.

## 10. Nghiệm thu (đã đạt)
- `node tools/check.mjs K3/H7-positional-encoding-hieu-ro.html --runs 5` → **tràn 0px ×5 cả 4 trang ✓**
- `node tools/check-de-key.mjs K3/H7-positional-encoding-hieu-ro.html` → **0 lệch (ĐỀ{0..4} key{}) ✓**
- Soát ảnh Edge (4 trang): 2 đồng hồ + figVec + figWaves hiện đủ, nhãn cos/sin không cắt, console JS sạch ✓
- 🎲: pos đổi → kim figHi quay, figLo nhích ít, figVec (e) + PE/z + figWaves-mark cập nhật; ô "?" luôn trống ✓

## 11. Bất biến nội dung (luôn đúng)
- PE₀=sin(pos), PE₁=cos(pos) đổi rõ theo pos; PE₂≈pos·0.01 (bé), PE₃≈1.00 gần như cố định.
- z = e + PE theo từng tọa độ; mỗi pos cho PE **duy nhất** → phân biệt thứ tự.
- Chiều tần số cao đổi nhanh (vị trí gần), thấp đổi chậm (thang dài).
