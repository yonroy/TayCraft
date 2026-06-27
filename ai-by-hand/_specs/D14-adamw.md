# SPEC — D14 · AdamW (weight decay) (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `D14-adamw` · English *AdamW* · ~14 phút.
> Tiền đề: D11 (momentum), D12 (RMSProp), 23 (Adam), E3 (weight decay).

## 1. Định vị
**Adam** = Momentum (mô-men 1) + RMSProp (mô-men 2) + hiệu chỉnh thiên lệch. **AdamW** tách **weight decay** ra khỏi gradient. Bộ tối ưu mặc định của Transformer.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Adam gộp hai ý hay (đà + thích nghi) nên ổn định, ít cần chỉnh η. AdamW sửa lỗi của Adam khi cộng L2 vào
  gradient (làm decay phụ thuộc adaptive scale) bằng cách **trừ thẳng λw** — chuẩn cho huấn luyện mô hình lớn.
- `.formula`:
  ```
  m ← β₁m + (1−β₁)g     v ← β₂v + (1−β₂)g²     m̂ = m/(1−β₁ᵗ)   v̂ = v/(1−β₂ᵗ)
  w ← w − η·m̂/(√v̂ + ε) − η·λ·w   (weight decay tách rời)
  ```

## 3. Trực giác (`.intuition`)
> Adam lái xe vừa **giữ đà** (m, hướng trung bình) vừa **tự chỉnh ga từng bánh** (v, độ rung). Hiệu chỉnh thiên lệch bù việc m, v
> khởi tạo 0 (bước đầu bị "kéo về 0"). AdamW: việc "co trọng số về 0" (decay) làm **riêng**, không trộn vào gradient.

## 4. Các bước
- **⓪ Cho sẵn** · pill `β₁=0.9, β₂=0.999, η=0.1`: w₀ = 1.0; gradient bước 1 g = 2; m₀=v₀=0; λ = 0.01. (`.cell.given`)
- **① Mô-men 1 & 2 (chưa hiệu chỉnh)** — `m₁ = 0.1·2 = __ (0.2) ; v₁ = 0.001·2² = __` → 0.004. `.why`: m là đà gradient, v là độ rung — y hệt
  momentum & RMSProp gộp lại.
- **② Hiệu chỉnh thiên lệch (t=1)** — `m̂ = 0.2/(1−0.9) = __ (2) ; v̂ = 0.004/(1−0.999) = __` → 4. `.hint`: chia (1−βᵗ) "thổi phồng" lại giá trị bị
  kéo về 0 ở các bước đầu.
- **③ Bước Adam** — `√v̂ = 2`; `Δ = η·m̂/√v̂ = 0.1·2/2 = __` → 0.1. `.why`: bước đầu của Adam ≈ η theo **dấu** gradient (m̂/√v̂ ≈ ±1) — bất kể độ lớn g.
- **④ Weight decay tách rời** · pill `−η·λ·w` — `w₁ = w₀ − Δ − η·λ·w₀ = 1.0 − 0.1 − 0.1·0.01·1.0 = __` → 0.899. `.note`: phần `−η·λ·w` co trọng số về 0
  **độc lập** với adaptive scale (điểm khác Adam thường). SVG: sơ đồ m, v → bước; nhánh decay riêng.

## 5. Tự kiểm tra (`.quiz`)
1. Adam gộp hai kỹ thuật nào? → `.qa` **Momentum (m) + RMSProp (v).**
2. AdamW khác Adam ở đâu? → `.qa` **Weight decay trừ thẳng (−ηλw), tách khỏi gradient.**

## 6. Rút ra
> **Rút ra.** AdamW = đà + thích nghi + hiệu chỉnh thiên lệch + decay tách rời; mặc định cho mô hình lớn. Hết Phần D (tối ưu). Sang
> Phần E — Bài tiếp: khởi tạo trọng số (Xavier/He).

## 7. `data-q` & số mẫu
- Sinh w₀, g, λ; β cố định; tính m,v,m̂,v̂,bước,decay cho t=1 (số đẹp).
- Khóa: `w0, g, lam, eta`; `m1,v1`, `mh,vh`, `delta`, `w1`.

## Phụ lục — số mẫu (t=1)
| | KQ |
|---|---|
| m₁, v₁ | 0.2, 0.004 |
| m̂, v̂ | 2, 4 |
| Δ Adam | 0.1 |
| w₁ (kèm decay) | 0.899 |
