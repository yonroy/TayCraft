# SPEC v3 — H2 · Self-Attention (bản HIỂU RÕ, A4 dọc)

> **v3 = TEMPLATE MỚI "hình-trên-đề + chùm câu hỏi".** File: `K3/H2-self-attention-hieu-ro.html`.
> Engine số giữ nguyên. KHÔNG ghi đè canonical `H2-self-attention.html`. Bám mẫu `_specs/H4-multi-head-attention.v3.md`.

## 0. Khác đời đầu
Đời đầu 5 trang, sơ đồ "soi" (ma trận heatmap, đồ thị tự-chú-ý, trộn V) đặt ở ĐÁP ÁN, bung trọn số. **v3: 4 trang**, mỗi thành phần 1 sơ đồ **để-điền trên ĐỀ** + chùm câu hỏi thẻ vai trò; **ĐÁP ÁN gọn** (`.keylist`).

## 1. Định vị
Self-attention 2 token: một X → Q,K,V; điểm Q·Kᵀ (2×2) → ÷√dₖ → softmax **theo từng hàng** → α (mỗi hàng Σ=1) → trộn V → out₁,out₂. Điểm nhấn: **ma trận chú ý vuông [n×n]** + **một X đóng ba vai**.

## 2. Mã màu
`CQ='#0e7490'(Q), CK='#b45309'(K), CV='#7c5cff'(V)`. Legend trang 1. Thẻ: Quan sát lam · Tính cam · Dự đoán tím · Vì sao xám.

## 3. Ghi chú trung thực
Cho sẵn ma trận điểm thô Q·Kᵀ + V (thực tế sinh từ X qua Wq/Wₖ/Wᵥ). √dₖ=2 hằng số tỉ lệ. Điểm thô đối xứng (đường chéo cao) cho trực quan "tự khớp mạnh".

## 4. Layout 4 trang
| Trang | Mặt | Nội dung |
|---|---|---|
| 1 | ĐỀ | intro+formula+legend · intuition · **Cụm 1** "Self": `figRoles` + qset · Bước 0 cho sẵn (ma trận điểm thô + v `.gv` + bảng eˣ) |
| 2 | ĐỀ | **Cụm 2** ÷√dₖ: `figScale` (raw 2×2 → "?" 2×2) + qset · **Cụm 3** softmax hàng: `figMatrix` (lưới 2×2 "?", Σ hàng=1) + qset |
| 3 | ĐỀ | **Cụm 4** trộn V: `figBlend` (v₁v₂ + out "?") + qset · **Cụm 5** toàn cảnh: **shape tracker** (HTML `.shape`) + qset |
| 4 | ĐÁP ÁN | 5 khối `.keylist` badge ✓ + `.intro` cam Rút ra → H3 |

**Khối `.calc2` "✍️ TỰ TÍNH"** ở cụm 2–4: ÷2 từng ô · softmax từng hàng (tra eˣ→Σ→α) · trộn V theo 4 thành phần out₁ₓ/out₁ᵧ/out₂ₓ/out₂ᵧ; ô trống sau mỗi `=`. qset giữ Quan sát/Vì sao.
**Parity:** ĐỀ `.b`={0,1,2,3,4,5}; ĐÁP ÁN badge ✓ → 0 lệch.

## 5. `data-q`
given `sr11,sr12,sr21,sr22` (điểm thô) · `v11,v12,v21,v22`; `sc11..sc22` (÷2); `e11..e22,Z1,Z2`; `a11,a12,a21,a22` (α hàng); `o1x,o1y,o2x,o2y` (out). Engine: sd1,sd2∈{1,2}, so∈{0,1} → thô = 2×scaled.

## 6. Sơ đồ
| id | viewBox | Đ/T | dạy gì | giấu |
|---|---|---|---|---|
| figRoles | 0 0 200 120 | TĨNH | X → Q(lam)/K(cam)/V(tím) qua 3 Wq/Wₖ/Wᵥ | — |
| figScale | 0 0 230 96 | ĐỘNG | ma trận thô (given) **÷2** → 4 ô "?" | điểm đã chia (đáp cụm 2) |
| figMatrix | 0 0 200 132 | TĨNH | lưới chú ý 2×2 đọc theo **hàng**, ô "?" , Σ hàng=1 | α (đáp cụm 3) |
| figBlend | 0 0 150 134 | ĐỘNG | v₁,v₂ + đoạn; **out₁,out₂ = ?** | vị trí out (đáp cụm 4) |
| shape (HTML) | — | TĨNH | X[2×d]→Q/K/V→điểm[2×2]→α[2×2]→out[2×d] | — |

## 7. Nghiệm thu (đã đạt)
tràn 0px ×5 cả 4 trang ✓ · de-key 0 lệch ✓ · soát ảnh 4 SVG + shape + ĐÁP ÁN gọn ✓.

## 8. Bất biến khi 🎲
Ma trận điểm/α luôn [2×2] vuông; mỗi hàng α cộng = 1; figMatrix/figScale/figBlend luôn để ô "?"; out₁≠out₂ (khác hàng α).
