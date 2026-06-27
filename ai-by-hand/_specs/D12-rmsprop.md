# SPEC — D12 · RMSProp (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `D12-rmsprop` · English *RMSProp* · ~12 phút.
> Tiền đề: D10/D11 (SGD/Momentum).

## 1. Định vị
**Học suất thích nghi theo từng tham số**: chia gradient cho căn trung bình bình phương gradient gần đây. Tham số dốc nhiều → bước nhỏ lại.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Một η chung không hợp khi các chiều có độ dốc rất khác nhau. RMSProp **tự co** bước ở chiều gradient lớn,
  **nới** bước ở chiều gradient nhỏ → đi cân bằng trong thung lũng méo. Là tiền thân của Adam.
- `.formula`:
  ```
  s ← ρ·s + (1−ρ)·g²      w ← w − η·g / (√s + ε)      (ρ ≈ 0.9)
  ```

## 3. Trực giác (`.intuition`)
> Mỗi tham số có **"bộ nhớ độ rung"** s: nếu nó liên tục bị đẩy mạnh (g² lớn) → chia cho căn s lớn → **bước ngắn lại** cho đỡ vọt;
> nếu yên ắng → bước được nới rộng. Như tự chỉnh ga riêng cho từng bánh xe.

## 4. Các bước
- **⓪ Cho sẵn** · pill `ρ=0.9, η=0.1`: w₀ = 1.0; gradient g = 2 (giữ nguyên vài bước); s₀ = 0; ε bỏ qua. (`.cell.given`)
- **① Cập nhật bộ nhớ s** — `s₁ = 0.9·0 + 0.1·2² = 0.1·4 = __` → 0.4. `.why`: s tích lũy **bình phương** gradient → đo "độ rung" gần đây của tham số.
- **② Bước có chuẩn hóa** — `√s₁ = √0.4 ≈ 0.63`; `w₁ = 1.0 − 0.1·2/0.63 = 1.0 − 0.316 = __` → 0.68. `.hint`: chia cho √s biến bước thành "số
  bước chuẩn hóa", không phụ thuộc độ lớn tuyệt đối của g.
- **③ Bước 2** — `s₂ = 0.9·0.4 + 0.1·4 = __ (0.76) ; w₂ = 0.68 − 0.1·2/√0.76 = 0.68 − 0.229 = __` → 0.45. `.why`: s lớn dần → bước **tự ngắn lại** dù g không đổi.
- **④ So với SGD** · pill `thích nghi` — `.note`: SGD đi đều η·g; RMSProp đi η·g/√s → chiều gradient lớn bị **giảm tốc**, chiều nhỏ được **tăng tốc**.
  Adam (Bài 23/D14) = RMSProp + Momentum. SVG: quỹ đạo cân bằng hơn trong thung lũng méo.

## 5. Tự kiểm tra (`.quiz`)
1. RMSProp chia gradient cho cái gì? → `.qa` **Căn trung bình bình phương gradient gần đây (√s).**
2. Tham số có gradient lớn liên tục thì bước ra sao? → `.qa` **Ngắn lại (chia cho √s lớn).**

## 6. Rút ra
> **Rút ra.** RMSProp = học suất thích nghi từng tham số qua s. Ghép với momentum thành **Adam** — Bài tiếp (D14/23): AdamW thêm
> weight decay tách rời.

## 7. `data-q` & số mẫu
- Sinh w₀, η, ρ, gradient (giữ ~ổn định để thấy s tăng); tính 2 bước.
- Khóa: `w0`, `eta`, `rho`, `g`; `s1, w1`, `s2, w2`.

## Phụ lục — số mẫu
| bước | s | w |
|---|---|---|
| 1 | 0.4 | 0.68 |
| 2 | 0.76 | 0.45 |
