# SPEC v3 — H11 · FFN trong Transformer (bản HIỂU RÕ, A4 dọc)

> **v3 = v(n−1) + LỚP TRỰC QUAN + ĐỔI TRIẾT LÝ ĐỀ.** File HTML: `K3/H11-ffn-hieu-ro.html`.
> Engine số giữ nguyên (`wb-random.js`, `data-q` + `WB.setAll`); KHÔNG ghi đè bản canonical `H11-ffn.html`.
> Bám **TEMPLATE HIỂU-RÕ mới** (mẫu chuẩn `H4`).

## 0. Khác biệt template mới vs bản trước
| | giảng-giải v1 (H11 cũ) | **TEMPLATE MỚI (bản này)** |
|---|---|---|
| Hình | 1 SVG pipeline ở bước 4 | **mỗi thành phần 1 sơ đồ NGAY TRÊN ĐỀ** |
| Trọng tâm ĐỀ | bước có ô trống | **chùm câu hỏi gắn thẻ vai trò** |
| ĐÁP ÁN | bung số | **GỌN** (badge ✓) |
| Số trang | 2 | **4 (3 ĐỀ + 1 ĐÁP ÁN)** |
| Số sơ đồ | 1 | **4** (figExpand, figReLU, figCompress, figPipe) — 4/4 ở ĐỀ |

## 1. Định vị bài
FFN = mạng 2 lớp áp **độc lập từng token**: `FFN(x)=W₂·ReLU(W₁x+b₁)+b₂` (giãn d→4d→d). Attention trộn **giữa** token; FFN xử lý **trong** token, giữ phần lớn tham số. Phiếu dùng **d=2 → ẩn 4 → d=2, b=0**.

## 2. Mã màu NHẤT QUÁN (hằng JS)
```js
var CX='#0e7490', CH='#b45309', CR='#7c5cff', GRY='#5b6776';
```
- **x vào/ra (chiều d) = lam (#0e7490)** · **lớp ẩn giãn 4× = cam (#b45309)** · **ReLU = tím (#7c5cff)** · dây/cấu trúc = xám.
- Legend cuối `.intro` trang 1: `x vào/ra (lam) · lớp ẩn 4× (cam) · ReLU (tím)`.
- Thẻ vai trò: Quan sát = lam · Tính = cam · Dự đoán = tím · Vì sao = xám đậm (#475569).

## 3. Ghi chú trung thực (biến đơn giản hóa thành điểm dạy)
- **W₁, W₂ cho-sẵn dạng cộng/trừ** để tính tay: W₁ → (x₁, x₂, x₁+x₂, x₁−x₂); W₂ → hàng tổng & hàng xen dấu (+−+−); b=0. Điểm dạy là **trình tự giãn→ReLU→nén**, không phải W cụ thể.
- Nút ẩn **x₁−x₂** có thể **âm** → ReLU cắt về 0 (dạy phi tuyến & thưa). x₁,x₂ ∈ {0..3} nên khi x₁<x₂ mới có số 0.
- Hệ số giãn ở đây 2× (2→4) cho tính tay; thực tế thường **4×** (nêu trong note).

## 4. Layout 4 trang
| Trang | Mặt | Nội dung |
|---|---|---|
| 1 | ĐỀ | intro+formula+**legend** · intuition · **Bước 0 Cho sẵn** (x `.gv` + mô tả W₁,W₂) · **Cụm 1 Giãn rộng**: `figExpand` (2→4) + `.calc2` (h_pre) + Quan sát/Vì sao |
| 2 | ĐỀ | **Cụm 2 ReLU**: `figReLU` (đồ thị max(0,·)) + `.calc2` (h) + Quan sát/Vì sao · **Cụm 3 Nén lại**: `figCompress` (4→2) + `.calc2` (out) + Quan sát/Vì sao |
| 3 | ĐỀ | **Cụm 4 Toàn cảnh**: `figPipe` (x→giãn→ReLU→nén) + `.note` (vị trí độc lập, 4×, ⅔ tham số) + Quan sát/Vì sao/Dự đoán tóm tắt |
| 4 | ĐÁP ÁN | 4 khối `.keylist` (badge ✓) · `.intro` viền cam **Rút ra** → Phần I (I1 tokenization/BPE) |

**`.calc2`** ở cụm 1 (giãn), 2 (ReLU), 3 (nén). Cụm 4 conceptual.
**Parity (cửa B7):** ĐỀ `.b`={0,1,2,3,4}; ĐÁP ÁN badge ✓ → key{}⊆ĐỀ → **0 lệch**.

## 5. `data-q` & engine số
- Given (`.gv`): `x1,x2`.
- ĐÁP ÁN: `hp1..hp4` (h_pre) · `h1..h4` (ReLU) · `o1,o2` (out).
- Sinh: `x1,x2=randInt(0,3)`; `hp=[x1,x2,x1+x2,x1−x2]`; `h=max(0,hp)`; `o1=Σh`, `o2=h1−h2+h3−h4`. Số âm dùng **`WB.fmtInt`** (dấu "−"), số dương `String`.

## 6. Đặc tả từng sơ đồ (viewBox · ĐỘNG/TĨNH · dạy gì · bất biến)
| id | viewBox / kích thước | Đ/T | Dạy gì | Bất biến khi 🎲 |
|---|---|---|---|---|
| **figExpand** | `0 0 260 128` · 78×38mm | TĨNH | 2 nút vào (lam) → 4 nút ẩn (cam) nhãn tổ hợp (x₁,x₂,x₁+x₂,x₁−x₂), giá trị "?" | 2→4; nhãn tổ hợp cố định; giá trị "?" |
| **figReLU** | `0 0 200 118` · 60×35mm | TĨNH | đồ thị ReLU: nhánh âm = 0, nhánh dương = đường chéo; khúc gấp tại 0 | hình hàm cố định (minh hoạ) |
| **figCompress** | `0 0 260 128` · 78×38mm | TĨNH | 4 nút ẩn (cam) → 2 nút ra (lam): ra₁=tổng, ra₂=xen dấu; giá trị "?" | 4→2; nhãn tổng/xen dấu cố định |
| **figPipe** | `0 0 520 96` · 166×31mm | TĨNH | x(d=2)→giãn W₁(4)→ReLU→nén W₂(d=2); ghi "áp độc lập từng token" | 4 hộp nối; thứ tự cố định |

> Cả 4 sơ đồ **TĨNH** (cấu trúc mạng cố định; giá trị nút để "?"). Việc "Tính" nằm ở 3 khối `.calc2`.

## 7. Khối chữ mới
`.legend` · `.qset`+`.qtag` · `.figcap` · `.calc2` (cụm 1,2,3) · `.note` (vị trí độc lập) · `.keylist`.

## 8. CSS thêm (additive)
`.legend/.cqq/.ckk/.cvv` · `.figwrap/.figcap` · `.qset/.qtag/.qt-*` · `.calc2/.ttl/.blk/.sub` · `.keylist/.lab/.mono` · siết `.step/.intro/.intuition/.note`. **Không sửa class cũ wb.css.**

## 9. Helper SVG
`el, line, txt, ctxt, rct` + `node(cx,cy,r,fill,stroke)` (nút mạng). Tất cả sơ đồ TĨNH → gọi 1 lần sau `WB.wire(generate); generate();` (`generate` chỉ cập nhật số qua `data-q`, không vẽ lại — sơ đồ không phụ thuộc số).

## 10. Nghiệm thu (đã đạt)
- `check.mjs --runs 5` → **tràn 0px ×5 cả 4 trang ✓**
- `check-de-key.mjs` → **0 lệch (ĐỀ{0..4} key{}) ✓**
- Soát ảnh Edge: figExpand/figReLU/figCompress/figPipe hiện; `fmtInt` cho dấu "−" đúng; console JS sạch ✓
- 🎲: x đổi → h_pre, h, out cập nhật (ô "?" trên sơ đồ giữ cấu trúc) ✓

## 11. Bất biến nội dung (luôn đúng)
- h_pre₄ = x₁−x₂ có thể âm → ReLU cho ≥1 số 0 khi x₁<x₂.
- out luôn 2 chiều (= d ban đầu) để cộng residual (H6).
- ReLU là mắt xích phi tuyến — bỏ đi thì 2 lớp W gộp thành 1 (mất năng lực).
