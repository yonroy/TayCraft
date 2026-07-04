# SPEC v3 — H1 · Scaled Dot-Product Attention (bản HIỂU RÕ, A4 dọc)

> **v3 = TEMPLATE MỚI "hình-trên-đề + chùm câu hỏi".** File: `K3/H1-scaled-dot-product-attention-hieu-ro.html`.
> Engine số giữ nguyên (`wb-random.js`, `data-q`+`WB.setAll`). KHÔNG ghi đè bản canonical `H1-scaled-dot-product-attention.html`.
> Bám bản mẫu chuẩn `_specs/H4-multi-head-attention.v3.md` (§0 mô tả triết lý template).

## 0. Khác bản hiểu-rõ đời đầu
| | đời đầu (5 trang) | **v3 template mới (4 trang)** |
|---|---|---|
| Hình | 4/6 sơ đồ ở ĐÁP ÁN | **5/5 sơ đồ TRÊN ĐỀ** (kiểu để-điền, giấu kết quả) |
| ĐỀ | bước có ô trống | **chùm câu hỏi** thẻ `Quan sát`/`Tính`/`Dự đoán`/`Vì sao` |
| ĐÁP ÁN | bung trọn số học | **gọn** (`.keylist`: đáp số + 1 dòng cốt lõi/câu, badge ✓) |

## 1. Định vị
Attention một query: điểm Q·Kᵀ → ÷√dₖ → softmax (α, Σ=1) → trộn V → O. q=2D, k₁=(1,0), k₂=(0,1), dₖ=4 (√dₖ=2), bảng eˣ {0:1,1:2.72,2:7.39}.

## 2. Mã màu
`var CQ='#0e7490', CK='#b45309', CV='#7c5cff';` — Q lam · K cam · V tím. Legend cuối `.intro` trang 1. Thẻ câu hỏi: Quan sát=lam, Tính=cam, Dự đoán=tím, Vì sao=xám #475569.

## 3. Ghi chú trung thực
- Vectơ 2D cho dễ tính tay; √dₖ=2 là **hằng số tỉ lệ** (thực tế √số-chiều-khóa).
- k₁,k₂ trực chuẩn cố định để q·k = thành phần của q (góc trực quan).

## 4. Layout 4 trang
| Trang | Mặt | Nội dung |
|---|---|---|
| 1 | ĐỀ | intro+formula+legend · intuition · Bước 0 cho sẵn (q,v `.gv`, bảng eˣ) · **Cụm 1** Q·Kᵀ: `figAngle` + qset |
| 2 | ĐỀ | **Cụm 2** ÷√dₖ: `figSat` (minh hoạ) + qset · **Cụm 3** softmax: `figBars` (eˣ + α "?") + qset |
| 3 | ĐỀ | **Cụm 4** trộn V: `figBlend` (v₁v₂ + O "?") + qset · **Cụm 5** toàn cảnh: `figPipe` + qset tổng hợp |
| 4 | ĐÁP ÁN | 5 khối `.keylist` badge ✓ + `.intro` cam Rút ra → H2 |

**Khối `.calc2` "✍️ TỰ TÍNH"** ở cụm 1–4: bày trọn phép tính (Q·K · ÷2 · tra eˣ→Σ→α · trộn V), ô trống sau mỗi `=`; figBars để eˣ = "?" (người học tự tra). qset chỉ giữ Quan sát/Dự đoán/Vì sao.
**Parity:** ĐỀ `.b`={0,1,2,3,4,5}; ĐÁP ÁN badge ✓ → check-de-key 0 lệch.

## 5. `data-q`
given `q1,q2,v11,v12,v21,v22`; `s1,s2` (Q·K); `sc1,sc2` (÷2); `e1,e2,Z`; `a1,a2` (α); `o1,o2` (O). Engine: a∈{1,2}, dom∈{0,1} → q=(2a,0)/(0,2a); v ngẫu nhiên 0..3.

## 6. Sơ đồ (viewBox · Đ/T · giấu gì)
| id | viewBox | Đ/T | dạy gì | giấu |
|---|---|---|---|---|
| figAngle | 0 0 180 150 | ĐỘNG | q,k₁,k₂ + góc 90°; cùng hướng⇒điểm cao | (chỉ vẽ vectơ given — không giấu) |
| figSat | 0 0 188 104 | TĨNH | **ví dụ minh hoạ**: điểm to→đông cứng vs chia nhỏ→mềm | dùng số ví dụ (6,0)/(3,0), KHÔNG phải số bài |
| figBars | 0 0 210 112 | ĐỘNG | tầng eˣ (giãn) + **tầng α để trống "?"** | α (đáp cụm 3) |
| figBlend | 0 0 150 134 | ĐỘNG | v₁,v₂ + đoạn; **O = ? (vòng nét đứt giữa đoạn)** | vị trí O (đáp cụm 4) |
| figPipe | 0 0 540 80 | TĨNH | 4 hộp ①Q·Kᵀ→②÷√dₖ→③softmax→④·V | — |

## 7. Nghiệm thu (đã đạt)
check.mjs --runs 5 → tràn 0px ×5 cả 4 trang ✓ · check-de-key → 0 lệch ✓ · soát ảnh 5 sơ đồ + ĐÁP ÁN gọn ✓.

## 8. Bất biến khi 🎲
figSat cố định (minh hoạ); figBars/figBlend luôn để α/O trống; q·k₂=0 khi q∥k₁; O luôn trong đoạn v₁v₂.
