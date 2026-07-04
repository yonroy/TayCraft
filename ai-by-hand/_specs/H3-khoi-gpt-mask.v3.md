# SPEC v3 — H3 · Khối GPT, Masked Attention (bản HIỂU RÕ, A4 dọc)

> **v3 = TEMPLATE MỚI "hình-trên-đề + chùm câu hỏi".** File: `K3/H3-khoi-gpt-mask-hieu-ro.html`.
> Engine số giữ nguyên. KHÔNG ghi đè canonical `H3-khoi-gpt-mask.html`. Bám mẫu `_specs/H4-multi-head-attention.v3.md`.

## 0. Khác đời đầu
Đời đầu 4 trang (2 ĐỀ + 2 ĐÁP ÁN), sơ đồ cơ chế −∞ + ma trận tam giác đặt ở ĐÁP ÁN, bung số. **v3: 4 trang (3 ĐỀ + 1 ĐÁP ÁN)**, mỗi thành phần 1 sơ đồ **để-điền trên ĐỀ** + chùm câu hỏi; **ĐÁP ÁN gọn**.

## 1. Định vị
Causal mask: điểm[i][j] += (j>i ? −∞ : 0) → token chỉ chú ý j≤i. 3 token; điểm thô (đã ÷√dₖ) cho-sẵn dạng tam giác. Điểm nhấn: **ma trận α TAM GIÁC DƯỚI** + cơ chế **−∞ → e⁻∞=0** (mask khóa, không xóa ô).

## 2. Mã màu
`CQ='#0e7490'` (ô được nhìn, lam) · `CM='#9aa3ad'` (−∞ bị che, xám). Thẻ câu hỏi: Quan sát lam · Tính cam · Dự đoán tím · Vì sao xám #475569.

## 3. Ghi chú trung thực
Cho sẵn điểm thô đã ÷√dₖ (số nguyên 0/1/2 khớp bảng eˣ) để tính tay. Hàng t₁ chỉ 1 ô → α=(1,0,0) (nêu sẵn, không bắt tính).

## 4. Layout 4 trang
| Trang | Mặt | Nội dung |
|---|---|---|
| 1 | ĐỀ | intro+formula+legend · intuition · **Cụm 1** che sách: `figCover` + qset · Bước 0 cho sẵn (ma trận thô tam giác + bảng eˣ) |
| 2 | ĐỀ | **Cụm 2** mask & softmax t₂: `figMech` (3 tầng điểm/eˣ/α, cột t₃ xám, **tầng α "?"**) + qset · **Cụm 3** hàng t₃: `figRow3` (eˣ bars + α "?") + qset |
| 3 | ĐỀ | **Cụm 4** ma trận tam giác: `figTri` (nửa trên −∞ given, nửa dưới "?") + qset · **Cụm 5** toàn cảnh: shape tracker `.shape` + qset |
| 4 | ĐÁP ÁN | 5 khối `.keylist` badge ✓ + `.intro` cam Rút ra → H4 |

**Khối `.calc2` "✍️ TỰ TÍNH"** ở cụm 2 (hàng t₂: điểm-sau-mask · tra eˣ · e⁻∞=0 · Σ · α₂) và cụm 3 (hàng t₃: tra eˣ · Σ₃ · α₃); ô trống sau mỗi `=`. figMech/figRow3 để eˣ & α = "?" (chỉ e⁻∞=0 cho sẵn).
**Parity:** ĐỀ `.b`={0,1,2,3,4,5}; ĐÁP ÁN badge ✓ → 0 lệch.

## 5. `data-q`
given `g21,g22` (hàng t₂) · `g31,g32,g33` (hàng t₃); `e21,e22,Z2`; `e31,e32,e33,Z3`; `a21,a22,a23(=0)`; `a31,a32,a33`; `pad`(=−∞). Engine: g_ ∈{0,1,2}; ép g22≠g21 cho α không 50/50.

## 6. Sơ đồ
| id | viewBox | Đ/T | dạy gì | giấu |
|---|---|---|---|---|
| figCover | 0 0 230 86 | TĨNH | 3 token, đứng t₂, **che t₃** (nét đứt xám) | — |
| figMech | 0 0 230 120 | ĐỘNG | hàng t₂ 3 tầng: điểm(−∞)→eˣ(0)→**α "?"**; cột t₃ xám | α₂ (đáp cụm 2) |
| figRow3 | 0 0 220 92 | ĐỘNG | t₃ 3 cột eˣ (bars given) → **α "?"** | α₃ (đáp cụm 3) |
| figTri | 0 0 220 150 | TĨNH | ma trận 3×3: nửa trên −∞ (given), nửa dưới **"?"**; Σ hàng=1 | α (đáp cụm 4) |
| shape (HTML) | — | TĨNH | điểm[n×n] + mask tam giác → α tam giác dưới → out[n×d] | — |

## 7. Nghiệm thu (đã đạt)
tràn 0px ×5 cả 4 trang ✓ · de-key 0 lệch ✓ · soát ảnh figCover/figMech/figRow3/figTri + shape + ĐÁP ÁN gọn ✓.

## 8. Bất biến khi 🎲
Nửa trên (j>i) luôn −∞ xám; nửa dưới luôn để "?"; e⁻∞=0 → cột tương lai α=0; mỗi hàng Σ=1; hàng dưới nhiều ô mở hơn hàng trên.
