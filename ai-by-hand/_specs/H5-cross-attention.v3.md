# SPEC v3 — H5 · Cross-Attention (bản HIỂU RÕ, A4 dọc)

> **v3 = v(n−1) + LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File HTML: `K3/H5-cross-attention-hieu-ro.html`.
> Engine số giữ nguyên (`wb-random.js`, `data-q` + `WB.setAll`); KHÔNG ghi đè bản canonical `H5-cross-attention.html`.
> Bám **TEMPLATE HIỂU-RÕ mới** (mẫu chuẩn `H4`): *đề giàu hình + chùm câu hỏi dẫn dắt*, đáp án **gọn**.

## 0. Khác biệt template mới vs bản trước
| | giảng-giải v1 (H5 cũ) | **TEMPLATE MỚI (bản này)** |
|---|---|---|
| Hình nằm ở đâu | 1 SVG ở bước 4 (self vs cross) | **mỗi thành phần 1 sơ đồ NGAY TRÊN ĐỀ** (kiểu "hình-để-điền") |
| Trọng tâm ĐỀ | các bước có ô trống + lời dẫn | **chùm câu hỏi gắn thẻ vai trò**: `Quan sát` · `Tính` · `Dự đoán` · `Vì sao` |
| ĐÁP ÁN | bung trọn số học | **GỌN**: đáp số + 1 dòng cốt lõi mỗi cụm (badge icon ✓ → check-de-key bỏ qua) |
| Số trang | 2 | **4 (3 ĐỀ + 1 ĐÁP ÁN)** |
| Số sơ đồ | 1 | **5** (figSeq, figAngle, figBars, figBlend, figPipe) — 5/5 ở ĐỀ |

## 1. Định vị bài
Attention **chéo giữa hai chuỗi**: **Q từ decoder** (bên đang viết), **K = V từ encoder** (câu nguồn). out = softmax(Q·Kᵀ/√dₖ)·V. Cách decoder "nhìn lại" câu nguồn ở mỗi bước sinh → thay nút thắt "một vectơ c" của seq2seq (G7); nền dịch máy & đa phương thức. Phiếu dùng **1 query đích, 2 token nguồn, dₖ=4 (√dₖ=2)**.

## 2. Mã màu NHẤT QUÁN (hằng JS)
```js
var EXP = {0:1, 1:2.72, 2:7.39};
var CQ='#0e7490', CK='#b45309', CV='#7c5cff', GRY='#5b6776';
```
- **Q = lam (#0e7490, decoder)** · **K = cam (#b45309, encoder)** · **V = tím (#7c5cff, encoder)** · cấu trúc/xám.
- Legend cuối `.intro` trang 1: `Q truy vấn — decoder (lam) · K khóa — encoder (cam) · V giá trị — encoder (tím)`.
- Thẻ vai trò: Quan sát = lam · Tính = cam · Dự đoán = tím · Vì sao = xám đậm (#475569).

## 3. Ghi chú trung thực (biến đơn giản hóa thành điểm dạy)
- **K, V nguồn cho-sẵn cố định** (k₁=(1,0), k₂=(0,1)); chỉ q (decoder) và v₁,v₂ đổi khi 🎲 — giữ số đẹp, điểm rơi mốc bảng eˣ.
- **√dₖ = 2 là hằng số tỉ lệ** (vectơ 2 chiều nhưng dₖ ghi = 4) — nêu rõ ở note Bước 0; đủ để thấy vai trò chia tỉ lệ.
- Điểm sau ÷√dₖ luôn ∈ {0,1,2} → tra thẳng bảng eˣ (e⁰=1, e¹=2.72, e²=7.39).
- Toán học **giống hệt H1** (scaled dot-product); điểm dạy RIÊNG của H5 = **nguồn Q vs K,V khác chuỗi** (cụm 1 & cụm 5).

## 4. Layout 4 trang
| Trang | Mặt | Nội dung |
|---|---|---|
| 1 | ĐỀ | wb-head · title · namebar · `.intro`+formula+**legend** · `.intuition` · **Bước 0 Cho sẵn** (q,v `.gv` + bảng eˣ) · **Cụm 1 Hai chuỗi**: `figSeq` + chùm câu hỏi (Quan sát/Dự đoán/Vì sao) |
| 2 | ĐỀ | **Cụm 2 Điểm căn chỉnh**: `figAngle` + `.calc2` (q·K rồi ÷√dₖ) + Quan sát/Vì sao · **Cụm 3 Softmax**: `figBars` + `.calc2` (eˣ,Σ,α) + Quan sát/Vì sao |
| 3 | ĐỀ | **Cụm 4 Trộn V**: `figBlend` + `.calc2` (out₁,out₂) + Dự đoán/Vì sao · **Cụm 5 Self vs Cross**: `figPipe` + `.note` so sánh + Quan sát/Vì sao |
| 4 | ĐÁP ÁN | 5 khối `.keylist` (badge ✓) tương ứng 5 cụm — mỗi câu 1 dòng đáp số + cốt lõi · `.intro` viền cam **Rút ra** → H6 khối Transformer |

**Khối `.calc2` "✍️ TỰ TÍNH"** ở cụm 2 (q·K + ÷2), cụm 3 (softmax eˣ/Σ/α), cụm 4 (trộn V) — ô trống sau mỗi `=`. Cụm 1 & 5 không có số học (conceptual).
**Parity (cửa B7):** ĐỀ numbered `.b` = {0,1,2,3,4,5}; ĐÁP ÁN dùng **badge icon ✓** → `check-de-key` thấy key{} ⊆ ĐỀ → **0 lệch**. Mọi đáp số ở ĐÁP ÁN có câu hỏi/ô trống tương ứng ở ĐỀ.

## 5. `data-q` & engine số
- Given (`.gv`): `q1,q2` (query decoder) · `v11,v12,v21,v22` (V nguồn). k₁,k₂ in cứng.
- ĐÁP ÁN (lộ số): `s1,s2` (q·K), `sc1,sc2` (điểm ÷√d), `Z` (Σ), `a1,a2` (α), `o1,o2` (out).
- Sinh số: `a=pick([1,2])`, `dom=pick([0,1])`; `q = dom? [0,2a]:[2a,0]` → điểm ∈ {0,1,2}. `v1,v2 = randInt(0,3)` mỗi tọa độ.
- α₁ = e^điểm₁/Σ (fmt2), α₂ = 1−α₁. out = α₁v₁ + α₂v₂. Định dạng `WB.fmt2`.

## 6. Đặc tả từng sơ đồ (viewBox · ĐỘNG/TĨNH · dạy gì · bất biến)
| id | viewBox / kích thước | Đ/T | Dạy gì | Bất biến khi 🎲 |
|---|---|---|---|---|
| **figSeq** | `0 0 250 132` · 76×40mm | TĨNH | token đích Q (lam, trên) phát 2 mũi tên chú ý xuống 2 token nguồn (mỗi token có ô k cam + ô v tím); trọng số mũi tên = "α?" | luôn 1 Q + 2 nguồn; α để "?"; cấu trúc không lộ số |
| **figAngle** | `0 0 180 150` · 52×43mm | ĐỘNG | q (lam) vs k₁,k₂ (cam) là mũi tên; góc nhỏ ⇒ điểm cao; k₁⊥k₂ (90°) | k₁ trục ngang, k₂ trục dọc; q đúng hướng dom; nhãn "q gần k₁/k₂" khớp dom |
| **figBars** | `0 0 210 112` · 68×38mm | ĐỘNG | tầng eˣ (độ dài tương đối, KHÔNG ghi số, "?") + tầng α **để trống** (khung nét đứt) | tầng α luôn trống; độ dài eˣ tỉ lệ e1,e2 hiện hành |
| **figBlend** | `0 0 150 134` · 46×44mm | ĐỘNG | v₁,v₂ (tím) là 2 điểm + đoạn nối; out = điểm **ẩn "?"** giữa đoạn | out luôn ẩn (vòng nét đứt + "out = ?"); v₁,v₂ đúng tọa độ given |
| **figPipe** | `0 0 540 80` · 166×25mm | TĨNH | toàn cảnh 4 bước: ①Q·Kᵀ (Q đích·K nguồn) → ②÷√dₖ → ③softmax(α) → ④·V (ngữ cảnh nguồn) | 4 hộp nối mũi tên; nhãn nhấn "Q đích · K nguồn" ở bước 1 |

> Quy tắc vàng: hình **để-điền** trên ĐỀ chỉ vẽ **dữ liệu cho-sẵn / cấu trúc**, **giấu kết quả** (ô "?"). Không hình nào lộ α, out ở ĐỀ.

## 7. Khối chữ mới
- `.legend` (mã màu Q/K/V — decoder/encoder).
- `.qset` — mỗi `<li>` mở bằng `.qtag` (`.qt-see/.qt-calc/.qt-pred/.qt-why`).
- `.figcap` "Nhìn hình: …" cho mỗi sơ đồ.
- `.calc2` "✍️ TỰ TÍNH" (cụm 2,3,4).
- `.note` so sánh self vs cross (cụm 5).
- `.keylist` — đáp án gọn (`.lab` nhãn + `.mono` đáp số).
- `.extbl` — bảng eˣ inline ở Bước 0.

## 8. CSS thêm (additive, trong `<style>` nội bộ)
`.extbl/.extbl td(.h)` · `.legend/.cqq/.ckk/.cvv` · `.figwrap/.figcap` · `.qset/.qset>li/.qtag/.qt-see/.qt-calc/.qt-pred/.qt-why` · `.calc2/.ttl/.blk/.sub` · `.keylist/.lab/.mono` · siết `.step/.intro/.intuition/.note`. **Không sửa class cũ wb.css.**

## 9. Helper SVG (đầu `<script>`)
`el, line, txt, ctxt, rct(+rx,sw), arrow` (bộ chuẩn skill). `drawAngle/drawBars/drawBlend` ĐỘNG → gọi trong `generate()` sau `WB.setAll`; `drawSeq/drawPipe` TĨNH → gọi 1 lần sau `WB.wire(generate); generate();`.

## 10. Nghiệm thu (đã đạt)
- `node tools/check.mjs K3/H5-cross-attention-hieu-ro.html --runs 5` → **tràn 0px ×5 cả 4 trang ✓**
- `node tools/check-de-key.mjs K3/H5-cross-attention-hieu-ro.html` → **0 lệch (ĐỀ{0..5} key{}) ✓**
- Soát ảnh Edge (4 trang): 5 sơ đồ hiện, figcap không cắt, console JS sạch ✓ (đã rút gọn caption figSeq cho khỏi tràn viewBox).
- 🎲: q/v đổi → figAngle/figBars/figBlend + s,α,out cập nhật khớp; ô "?" ở ĐỀ luôn trống ✓

## 11. Bất biến nội dung (luôn đúng)
- α₁ + α₂ = 1; out nằm TRÊN đoạn v₁v₂ (trung bình có trọng số, không ra ngoài).
- Điểm sau ÷√dₖ ∈ {0,1,2} → luôn tra được bảng eˣ.
- Điểm KHÁC self-attention duy nhất: **nguồn** Q (decoder) vs K,V (encoder) — 4 bước tính giống hệt H1.
