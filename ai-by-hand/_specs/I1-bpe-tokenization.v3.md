# SPEC v3 — I1 · BPE Tokenization (bản HIỂU RÕ, A4 dọc)

> **v3 = v(n−1) + LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File HTML: `K3/I1-bpe-tokenization-hieu-ro.html`.
> Engine số giữ nguyên (`wb-random.js`, `data-q` + `WB.setAll`); KHÔNG ghi đè bản canonical `I1-bpe-tokenization.html`.
> Bám **TEMPLATE HIỂU-RÕ mới** (mẫu chuẩn `H4`). **Mở đầu Phần I (LLM).**

## 0. Khác biệt template mới vs bản trước
| | giảng-giải v1 (I1 cũ) | **TEMPLATE MỚI (bản này)** |
|---|---|---|
| Hình | 1 SVG cây gộp ở bước 4 | **mỗi thành phần 1 sơ đồ NGAY TRÊN ĐỀ** |
| Trọng tâm ĐỀ | bước có ô trống | **chùm câu hỏi gắn thẻ vai trò** |
| ĐÁP ÁN | bung số | **GỌN** (badge ✓) |
| Số trang | 2 | **4 (3 ĐỀ + 1 ĐÁP ÁN)** |
| Số sơ đồ | 1 | **4** (figWords, figMerge, figUpdate, figTree) — 4/4 ở ĐỀ |

## 1. Định vị bài
BPE học từ điển **con-từ**: lặp **đếm cặp liền kề → gộp cặp tần số cao nhất** thành token mới → cập nhật → lặp tới đủ K token. Phổ biến thành 1 token, hiếm ghép từ mảnh (không OOV). Kho mẫu: `low`×f, `lower`×f, `new`×f.

## 2. Mã màu NHẤT QUÁN (hằng JS)
```js
var CX='#0e7490', CC='#b45309', CN='#7c5cff', GRY='#5b6776';
```
- **ký tự / token = lam (#0e7490)** · **cặp gộp & tần số = cam (#b45309)** · **token mới = tím (#7c5cff)** · dây/cấu trúc = xám.
- Legend cuối `.intro` trang 1: `ký tự/token (lam) · cặp gộp & tần số (cam) · token mới (tím)`.
- Thẻ vai trò: Quan sát = lam · Tính = cam · Dự đoán = tím · Vì sao = xám đậm (#475569).

## 3. Ghi chú trung thực (biến đơn giản hóa thành điểm dạy)
- **Bài đếm rời rạc** (không vectơ). Số động = **tần số 3 từ**; cấu trúc từ (low/lower/new) cố định để mạch gộp (l,o)→"lo"→"low" luôn đúng.
- Ràng buộc: `flow∈[4,6], flwr∈[2,3], fnew=min(randInt(3,6), flow+flwr−1)` → (l,o)=(o,w)=flow+flwr **luôn cao nhất** > (n,e)=(e,w)=fnew. Đảm bảo câu chuyện gộp cố định.
- Hòa (l,o)=(o,w) → **quy ước chọn cặp trước** (điểm dạy về tie-break).

## 4. Layout 4 trang
| Trang | Mặt | Nội dung |
|---|---|---|
| 1 | ĐỀ | intro+formula+**legend** · intuition · **Bước 0 Cho sẵn** (3 từ + tần số `.gv`) · **Cụm 1 Đếm cặp**: `figWords` + `.calc2` (5 tần số cặp) + Quan sát/Vì sao |
| 2 | ĐỀ | **Cụm 2 Gộp**: `figMerge` ((l,o)→"lo") + Quan sát(tie)/Vì sao · **Cụm 3 Cập nhật & lặp**: `figUpdate` ("lo"+"w"→"low") + `.calc2` ((lo,w)) + Dự đoán/Vì sao |
| 3 | ĐỀ | **Cụm 4 Con-từ**: `figTree` (cây l,o,w→lo→low; lowest=low+est) + `.note` (dừng K token, không OOV) + Quan sát/Vì sao/Dự đoán tóm tắt |
| 4 | ĐÁP ÁN | 4 khối `.keylist` (badge ✓) · `.intro` viền cam **Rút ra** → I2 sampling |

**`.calc2`** ở cụm 1 (đếm cặp) & cụm 3 (vòng 2). Cụm 2, 4 conceptual.
**Parity (cửa B7):** ĐỀ `.b`={0,1,2,3,4}; ĐÁP ÁN badge ✓ → key{}⊆ĐỀ → **0 lệch**.

## 5. `data-q` & engine số
- Given (`.gv`): `flow, flwr, fnew` (tần số 3 từ).
- ĐÁP ÁN: `clo,cow` (=flow+flwr) · `cne,cew` (=fnew) · `cwe` (=flwr) · `clow` (=flow+flwr, vòng 2).
- Sinh: xem §3. `clo=flow+flwr`. Tất cả số nguyên.

## 6. Đặc tả từng sơ đồ (viewBox · ĐỘNG/TĨNH · dạy gì · bất biến)
| id | viewBox / kích thước | Đ/T | Dạy gì | Bất biến khi 🎲 |
|---|---|---|---|---|
| **figWords** | `0 0 300 118` · 88×35mm | ĐỘNG | 3 từ = dãy ô ký tự (lam) + "×tần số" (cam) + cung cặp liền kề | 3 từ cố định; tần số hiện hành |
| **figMerge** | `0 0 260 96` · 76×28mm | TĨNH | 2 ô (l,o) cam → 1 ô "lo" tím (dán) | cấu trúc cố định |
| **figUpdate** | `0 0 300 100` · 88×30mm | TĨNH | "lo"+"w" → "low" (vòng 2) | cố định |
| **figTree** | `0 0 320 150` · 96×45mm | TĨNH | cây gộp l,o,w→lo→low; nhánh "lowest"=low+est (từ lạ tách mảnh) | cố định |

> Chỉ figWords ĐỘNG (theo tần số). Việc "Tính" (đếm) ở `.calc2`; sơ đồ để "?" ở các tần số cặp.

## 7. Khối chữ mới
`.legend` · `.qset`+`.qtag` · `.figcap` · `.calc2` (cụm 1,3) · `.note` (cân bằng K) · `.keylist`.

## 8. CSS thêm (additive)
`.legend/.cqq/.ckk/.cvv` · `.figwrap/.figcap` · `.qset/.qtag/.qt-*` · `.calc2/.ttl/.blk/.sub` · `.keylist/.lab/.mono` · siết `.step/.intro/.intuition/.note`. **Không sửa class cũ wb.css.**

## 9. Helper SVG
`el, line, txt, ctxt, rct` + `chbox(x,y,ch,c)` (ô ký tự). `drawWords` ĐỘNG → trong `generate()`; `drawMerge/drawUpdate/drawTree` TĨNH → gọi 1 lần sau `WB.wire(generate); generate();`.

## 10. Nghiệm thu (đã đạt)
- `check.mjs --runs 5` → **tràn 0px ×5 cả 4 trang ✓**
- `check-de-key.mjs` → **0 lệch (ĐỀ{0..4} key{}) ✓**
- Soát ảnh Edge: figWords cung cặp, figMerge/figUpdate dán, figTree cây; console JS sạch ✓
- 🎲: tần số đổi → tần số cặp cập nhật; (l,o) luôn cao nhất → mạch gộp giữ nguyên ✓

## 11. Bất biến nội dung (luôn đúng)
- (l,o) = (o,w) = flow+flwr **luôn là cặp cao nhất** → gộp "lo" rồi "low".
- Token "low" phổ biến → 1 đơn vị; "lowest" (lạ) → "low"+"est" (không OOV).
