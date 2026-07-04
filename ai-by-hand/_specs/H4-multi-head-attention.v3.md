# SPEC v3 — H4 · Multi-Head Attention (bản HIỂU RÕ, A4 dọc)

> **v3 = v(n−1) + LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File HTML: `K3/H4-multi-head-attention-hieu-ro.html`.
> Engine số giữ nguyên (`wb-random.js`, `data-q` + `WB.setAll`); KHÔNG ghi đè bản canonical `H4-multi-head-attention.html`.
> Đây cũng là **bản mẫu cho TEMPLATE HIỂU-RÕ mới** (xem §0): *đề giàu hình + chùm câu hỏi dẫn dắt*, đáp án **gọn**.

## 0. Khác biệt template mới vs các bản trước (QUAN TRỌNG)
| | giảng-giải v1 / hiểu-rõ H1–H3 cũ | **TEMPLATE MỚI (bản này)** |
|---|---|---|
| Hình nằm ở đâu | hầu hết sơ đồ "soi" đẩy sang **ĐÁP ÁN** | **mỗi thành phần có 1 sơ đồ NGAY TRÊN ĐỀ** (kiểu "hình-để-điền": cho dữ liệu, giấu kết quả) |
| Trọng tâm ĐỀ | các bước có ô trống + lời dẫn | **chùm câu hỏi gắn thẻ vai trò**: `Quan sát` · `Tính` · `Dự đoán` · `Vì sao` |
| ĐÁP ÁN | bung trọn số học từng bước | **GỌN**: đáp số + 1 dòng cốt lõi mỗi câu (badge icon ✓ → check-de-key bỏ qua) |
| Mục tiêu | đọc lời giải mẫu | **người học tự khám phá** qua hình + câu hỏi |

| | hiểu-rõ H1 (tham chiếu cũ) | H4 (template mới) |
|---|---|---|
| Số trang | 5 (2 ĐỀ + 3 ĐÁP ÁN) | **4 (3 ĐỀ + 1 ĐÁP ÁN)** |
| Số sơ đồ | 6 | **5** (split, heads, concat, mix-Wₒ, pipeline) |
| Sơ đồ ở ĐỀ | 2/6 | **5/5** |

## 1. Định vị bài
Chia chiều d thành h **đầu (head)** chạy attention **song song**, mỗi đầu một kiểu quan hệ trên một không gian con; **ghép** (concat) rồi **trộn** bằng Wₒ thành đầu ra thống nhất. Phiếu dùng **d=4, h=2 đầu, dₖ=2** để tính tay.

## 2. Mã màu NHẤT QUÁN (hằng JS)
```js
var CH1='#0e7490', CH2='#7c5cff', CWO='#b45309', GRY='#5b6776';
```
- **head₁ = lam (#0e7490)** · **head₂ = tím (#7c5cff)** · **Wₒ = cam (#b45309)** · cấu trúc/x = xám.
- Legend cuối `.intro` trang 1: `head₁ (lam) · head₂ (tím) · Wₒ trộn (cam)`.
- Thẻ vai trò câu hỏi: Quan sát = lam · Tính = cam · Dự đoán = tím · Vì sao = xám đậm (#475569).

## 3. Ghi chú trung thực (biến đơn giản hóa thành điểm dạy)
- **Cho sẵn kết quả mỗi đầu** (head₁, head₂) thay vì chạy attention đầy đủ trong từng đầu — để phiếu gọn, tập trung vào *concat + Wₒ* (phần riêng của multi-head; attention 1 đầu đã học ở H1–H3).
- **Wₒ là ma trận 4×2 cho-sẵn, cố định** (không random) — trong thực tế Wₒ là d×d học được; ở đây chọn 4×2 với toàn số 0/1 để **tính tay bằng phép cộng** và **thấy rõ đường trộn chéo đầu**. Đầu ra 2 chiều (gọn) — nêu rõ trên phiếu.
- head₁, head₂ là cặp lồi (cộng = 1) cho số đẹp; **đổi khi 🎲**.

## 4. Layout 4 trang
| Trang | Mặt | Nội dung |
|---|---|---|
| 1 | ĐỀ | wb-head · title · namebar · `.intro`+formula+**legend** · `.intuition` · **Bước 0 Cho sẵn** (head₁,head₂ `.gv`) · **Cụm 1 Chia đầu**: `figSplit` + chùm câu hỏi (Quan sát/Dự đoán/Vì sao) |
| 2 | ĐỀ | **Cụm 2 Song song**: `figHeads` + 3 câu · **Cụm 3 Ghép**: `figConcat` + câu Tính concat + Quan sát |
| 3 | ĐỀ | **Cụm 4 Trộn Wₒ**: bảng `.wo` + `figMix` + 2 câu Tính (o₁,o₂ bung số) + Quan sát + Vì sao · **Cụm 5 Toàn cảnh**: `figPipe` + 2 câu tổng hợp |
| 4 | ĐÁP ÁN | 5 khối `.keylist` (badge ✓) tương ứng 5 cụm — mỗi câu 1 dòng đáp số + cốt lõi · `.intro` viền cam **Rút ra** → H5 cross-attention |

**Khối `.calc2` "✍️ TỰ TÍNH"** ở cụm 3 (ghép concat: điền z) và cụm 4 (trộn Wₒ: o₁,o₂ cộng dồn từng bước); ô trống sau mỗi `=`.
**Parity (cửa B7):** ĐỀ numbered `.b` = {0,1,2,3,4,5}; ĐÁP ÁN dùng **badge icon ✓** (không số) → `check-de-key` thấy key{} ⊆ ĐỀ → **0 lệch**. Mọi đáp số ở ĐÁP ÁN có câu hỏi/ô trống tương ứng ở ĐỀ.

## 5. `data-q` & engine số
- Given: `h1a,h1b` (head₁) · `h2a,h2b` (head₂) — class `.gv`.
- Concat (ĐÁP ÁN): `c1=h1a, c2=h1b, c3=h2a, c4=h2b` (chỉ là sắp lại — không phép tính).
- Đầu ra: `o1 = z1+z2+z4 = h1a+h1b+h2b` · `o2 = z1+z3+z4 = h1a+h2a+h2b`.
- Pool head: `[[.7,.3],[.3,.7],[.2,.8],[.8,.2],[.4,.6],[.6,.4],[.9,.1],[.1,.9]]`, `pickDistinct 2`.
- Định dạng `WB.fmt2` (2 chữ số thập phân).

## 6. Đặc tả từng sơ đồ (viewBox · ĐỘNG/TĨNH · dạy gì · bất biến)
| id | viewBox / kích thước | Đ/T | Dạy gì | Bất biến khi 🎲 |
|---|---|---|---|---|
| **figSplit** | `0 0 210 116` · 64×35mm | TĨNH | vectơ d=4 (cột xám) cắt dọc → lát 1 lam (2 ô) + lát 2 tím (2 ô), mỗi đầu dₖ=2 | luôn 4 ô → 2+2; màu lam trên/tím dưới |
| **figHeads** | `0 0 232 118` · 72×36mm | ĐỘNG | 2 panel song song; thanh α khác hình (đầu1 dồn trái, đầu2 dồn phải); in `kết quả (head)` | mỗi panel hiện đúng head₁/head₂ hiện hành; 2 phân bố α luôn khác nhau |
| **figConcat** | `0 0 232 104` · 70×32mm | ĐỘNG | head₁(lam)+head₂(tím) nối → 4 ô đích **để trống "?"** (hình-để-điền); ô nguồn lộ số given | 4 ô đích trống; màu đích = lam,lam,tím,tím |
| **figMix** | `0 0 236 138` · 70×41mm | ĐỘNG | 4 ô z (lam,lam,tím,tím) → 2 ô ra cam **để trống**; đường = số 1 trong Wₒ; o₁←z1,z2,z4 · o₂←z1,z3,z4 | ô ra luôn trống; o₁ và o₂ đều nhận ≥1 đường lam VÀ ≥1 đường tím (trộn chéo đầu) |
| **figPipe** | `0 0 520 78` · 166×25mm | TĨNH | toàn cảnh: x → attn1/attn2 (song song) → concat → ·Wₒ → out | chuỗi 6 hộp, 2 nhánh song song |

> Quy tắc vàng giữ nguyên: hình **để-điền** trên ĐỀ chỉ vẽ **dữ liệu cho-sẵn / cấu trúc**, **giấu kết quả** (ô "?"). Không hình nào lộ o₁,o₂ ở ĐỀ.

## 7. Khối chữ mới
- `.legend` (mã màu head₁/head₂/Wₒ).
- `.qset` — danh sách câu hỏi, mỗi `<li>` mở bằng `.qtag` (`.qt-see/.qt-calc/.qt-pred/.qt-why`).
- `.figcap` "Nhìn hình: …" cho mỗi sơ đồ.
- `.wo` — bảng ma trận Wₒ 4×2 inline.
- `.keylist` — danh sách đáp án gọn (`.lab` nhãn + `.mono` đáp số).

## 8. CSS thêm (additive, trong `<style>` nội bộ)
`.legend/.ch1/.ch2/.cwo` · `.figwrap/.figcap` · `.qset/.qset>li/.qtag/.qt-see/.qt-calc/.qt-pred/.qt-why` · `.wo/.wo td` · `.keylist/.keylist .lab/.mono` · `.sub` · siết `.step/.intro/.intuition/.quiz/.note`. **Không sửa class cũ wb.css.**

## 9. Helper SVG (đầu `<script>`)
`el, line, txt, ctxt, rct(+rx,sw), arrow` (bộ chuẩn skill) + `box()` cục bộ trong `drawPipe/drawSplit`. Mọi `drawXxx` gọi trong `generate()` (ĐỘNG redraw) sau `WB.setAll`; `WB.wire(generate); generate();`.

## 10. Nghiệm thu (đã đạt)
- `node tools/check.mjs K3/H4-multi-head-attention-hieu-ro.html --runs 5` → **tràn 0px ×5 cả 4 trang ✓**
- `node tools/check-de-key.mjs K3/H4-multi-head-attention-hieu-ro.html` → **0 lệch (ĐỀ{0..5} key{}) ✓**
- Soát ảnh Edge: 5 sơ đồ hiện, figcap không cắt, đường trộn figMix rõ, ĐÁP ÁN gọn 5 cụm ✓
- 🎲: head₁/head₂ đổi → figHeads/figConcat/figMix + concat + o₁,o₂ cập nhật khớp ✓

## 11. Bất biến nội dung (luôn đúng)
- dₖ = d/h = 2; concat luôn 4 chiều = d.
- o₁, o₂ mỗi cái là tổng các z **xuyên cả hai đầu** (Wₒ trộn chéo) → minh hoạ "các đầu nói chuyện".
- head₁ ≠ head₂ (pickDistinct) → hai góc nhìn khác nhau.
