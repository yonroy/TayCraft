# SPEC — E8 · Learning rate schedule (step / cosine) (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `E8-learning-rate-schedule` · English *LR schedule* · ~11 phút.
> Tiền đề: D6/D10 (gradient descent, η). Dùng bảng cos.

## 1. Định vị
Giảm **học suất η theo thời gian**: bước to lúc đầu (đi nhanh), nhỏ dần về sau (tinh chỉnh). Step decay & cosine là hai lịch phổ biến.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** η cố định: lớn thì cuối train dao động quanh đáy, nhỏ thì đầu train ì. Lịch học suất cho **cả hai cái lợi**:
  khám phá nhanh lúc đầu, hội tụ mịn lúc cuối. Gần như mọi mô hình lớn đều dùng warmup + cosine decay.
- `.formula`:
  ```
  Step:    ηₜ = η₀·γ^⌊t/k⌋                 (vd γ=0.5 mỗi k epoch)
  Cosine:  ηₜ = η₀·½(1 + cos(π·t/T))        (giảm mượt về 0 tại t=T)
  ```

## 3. Trực giác (`.intuition`)
> Như **hạ cánh máy bay**: ban đầu bay nhanh (η lớn) tới gần sân bay, rồi **giảm tốc dần** để đáp êm (η nhỏ). Đáp với tốc độ cao →
> nảy (dao động); bò chậm từ đầu → tốn thời gian.

## 4. Các bước
- **⓪ Cho sẵn + bảng cos** · pill `η₀=0.1`: step (γ=0.5, k=10 epoch); cosine (T=10). Bảng: `cos0=1, cos(π/2)=0, cosπ=−1, cos(π/3)=0.5`. (`.cell.given`)
- **① Step decay tại epoch 10 & 20** — `η₁₀ = 0.1·0.5^1 = __ (0.05) ; η₂₀ = 0.1·0.5^2 = __` → 0.025. `.why`: cứ k epoch, cắt η một nửa → bước nhỏ dần theo bậc thang.
- **② Cosine tại t=0, T/2, T** — `t=0: 0.1·½(1+1) = __ (0.1) ; t=5: 0.1·½(1+0) = __ (0.05) ; t=10: 0.1·½(1−1) = __` → 0. `.hint`: cosine giảm **mượt** từ η₀ về 0.
- **③ So sánh hình** — step "giật bậc thang", cosine "trượt êm". `.why`: cosine không có cú sốc đổi η → thường mượt hơn; step đơn giản, dễ hiểu.
- **④ Warmup** · pill `tăng rồi giảm` — `.note`: nhiều mô hình lớn **tăng η từ 0** vài bước đầu (warmup) rồi mới cosine decay → tránh sốc lúc trọng số
  còn ngẫu nhiên. SVG: hai đường η(t) — bậc thang vs cosine.

## 5. Tự kiểm tra (`.quiz`)
1. Vì sao giảm η về cuối train? → `.qa` **Để tinh chỉnh quanh đáy, tránh dao động.**
2. Cosine khác step ở điểm nào? → `.qa` **Giảm mượt liên tục, không nhảy bậc.**

## 6. Rút ra
> **Rút ra.** Lịch η = to lúc đầu, nhỏ về sau (step/cosine, + warmup). Bài tiếp (E9): chặn gradient quá lớn — gradient clipping.

## 7. `data-q` & số mẫu
- Sinh η₀, γ, k, T; chọn t rơi mốc bảng cos; tính η theo hai lịch.
- Khóa: `eta0, gamma, k, T`; `stepE10, stepE20`; `cos0, cosHalf, cosEnd`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| step η@10, η@20 | 0.05, 0.025 |
| cosine η@0,5,10 | 0.1, 0.05, 0 |
