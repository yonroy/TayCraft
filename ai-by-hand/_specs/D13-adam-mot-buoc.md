# SPEC — D13 · Adam — một bước cập nhật (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `23-adam-mot-buoc` · English *Adam* · ~13 phút.
> Tiền đề: D11 (momentum), D12 (RMSProp). **Đã có phiếu** — spec để nâng cấp/tái tạo. (AdamW: Bài D14.)

## 1. Định vị
**Adam** = Momentum (mô-men 1: đà) + RMSProp (mô-men 2: thích nghi) + **hiệu chỉnh thiên lệch**. Bộ tối ưu "mặc định" được dùng nhiều nhất.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Adam gộp hai ý hay: nhớ hướng (m) và tự chỉnh học suất từng tham số (v). Ổn định, ít phải dò η, hợp mọi loại
  mạng. Hiểu một bước Adam là hiểu vì sao nó "vừa nhanh vừa êm".
- `.formula`:
  ```
  m ← β₁m + (1−β₁)g     v ← β₂v + (1−β₂)g²
  m̂ = m/(1−β₁ᵗ)   v̂ = v/(1−β₂ᵗ)      w ← w − η·m̂/(√v̂ + ε)
  ```

## 3. Trực giác (`.intuition`)
> Adam lái xe vừa **giữ đà** (m — hướng trung bình gần đây) vừa **tự chỉnh ga riêng từng bánh** (v — độ rung). Hiệu chỉnh thiên lệch bù
> việc m, v khởi tạo 0 nên bị "kéo về 0" ở các bước đầu.

## 4. Các bước
- **⓪ Cho sẵn** · pill `β₁=0.9, β₂=0.999, η=0.1`: w₀ = 1.0; gradient bước 1 g = 2; m₀ = v₀ = 0; ε bỏ qua; t = 1. (`.cell.given`)
- **① Hai mô-men (chưa hiệu chỉnh)** — `m₁ = 0.9·0 + 0.1·2 = __ (0.2) ; v₁ = 0.999·0 + 0.001·2² = __` → 0.004. `.why`: m là đà gradient (momentum), v là độ rung (RMSProp) — gộp hai kỹ thuật.
- **② Hiệu chỉnh thiên lệch (t=1)** — `m̂ = 0.2/(1−0.9) = __ (2) ; v̂ = 0.004/(1−0.999) = __` → 4. `.hint`: chia (1−βᵗ) "thổi phồng" lại giá trị bị kéo về 0 ở bước đầu.
- **③ Bước cập nhật** — `√v̂ = 2`; `w₁ = w₀ − η·m̂/√v̂ = 1.0 − 0.1·2/2 = 1.0 − 0.1 = __` → 0.9. `.why`: m̂/√v̂ ≈ ±1 ở bước đầu → bước đầu của Adam ≈ η theo **dấu** gradient, không phụ thuộc độ lớn g.
- **④ Vì sao mạnh** · pill `đà + thích nghi` — `.note`: hướng nhất quán → m lớn → đi nhanh; chiều gradient lớn → v lớn → tự giảm bước. AdamW (Bài D14) thêm weight decay tách rời.
  SVG: nhánh m và v hợp thành bước.

## 5. Tự kiểm tra (`.quiz`)
1. Adam gộp hai bộ tối ưu nào? → `.qa` **Momentum (m) + RMSProp (v).**
2. Hiệu chỉnh thiên lệch để làm gì? → `.qa` **Bù việc m, v khởi tạo 0 bị kéo nhỏ ở các bước đầu.**

## 6. Rút ra
> **Rút ra.** Adam = đà + thích nghi + hiệu chỉnh thiên lệch; bước đầu ≈ η theo dấu gradient. Đây là chốt mạch tối ưu của K2. (Tiếp: K3 —
> attention & Transformer.)

## 7. `data-q` & số mẫu
- Sinh w₀, g, η; β cố định; tính m, v, m̂, v̂, bước cho t=1 (số đẹp).
- Khóa: `w0, g, eta`; `m1, v1`, `mh, vh`, `w1`.

## Phụ lục — số mẫu (t=1)
| | KQ |
|---|---|
| m₁, v₁ | 0.2, 0.004 |
| m̂, v̂ | 2, 4 |
| w₁ | 0.9 |
