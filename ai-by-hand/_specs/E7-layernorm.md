# SPEC — E7 · LayerNorm / RMSNorm (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `20-layernorm` · English *LayerNorm / RMSNorm* · ~13 phút.
> Tiền đề: A19 (z-score), E6 (BatchNorm). **Đã có phiếu** — spec để nâng cấp/tái tạo.

## 1. Định vị
Chuẩn hóa kích hoạt **trong một mẫu, qua các đặc trưng** (không phụ thuộc batch). Trụ cột ổn định của Transformer/RNN. RMSNorm là biến thể gọn.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** BatchNorm cần batch lớn & cố định → kẹt với chuỗi độ dài thay đổi (NLP). LayerNorm chuẩn hóa **mỗi token tự thân**
  → hoạt động với batch=1, độ dài bất kỳ. Mọi Transformer đều dùng nó để train ổn định, sâu.
- `.formula`:
  ```
  μ, σ trên các ĐẶC TRƯNG của một mẫu      x̂ = (x − μ)/√(σ²+ε)      y = γ·x̂ + β
  RMSNorm:  y = γ·x / √(mean(x²)+ε)   (bỏ trừ trung bình)
  ```

## 3. Trực giác (`.intuition`)
> Với **từng token**, đặt lại thước: kéo vectơ đặc trưng về trung bình 0, độ trải 1, rồi cho γ, β chỉnh lại. Khác BatchNorm (so các mẫu
> với nhau), LayerNorm **chỉ nhìn bên trong một mẫu** → không lệ thuộc bạn cùng batch.

## 4. Các bước
- **⓪ Cho sẵn** · pill `d=2 đặc trưng`: một mẫu x = (2, 4); γ = (1, 1), β = (0, 0); ε bỏ qua. (`.cell.given`)
- **① Trung bình & độ lệch (qua đặc trưng)** — `μ = (2+4)/2 = __ (3) ; σ² = ((2−3)²+(4−3)²)/2 = __ (1) → σ = __` → 1. `.why`: thống kê **trên 2 đặc trưng của chính mẫu này**, không liên quan mẫu khác.
- **② Chuẩn hóa** — `x̂ = (x−3)/1 = (__, __)` → (−1, 1). `.hint`: chọn d=2 → x̂ luôn ra ±1 (mẹo tính tay).
- **③ Co & dịch** — `y = γ·x̂ + β = 1·(−1,1) + 0 = (__, __)` → (−1, 1). `.why`: γ, β học được cho mạng quyền chỉnh lại phân phối sau chuẩn hóa.
- **④ RMSNorm** · pill `gọn hơn` — `mean(x²) = (4+16)/2 = 10 → √10 ≈ 3.16`; `y = x/3.16 = (0.63, 1.27)`. `.note`: RMSNorm **bỏ bước trừ μ** (chỉ chia RMS) → rẻ hơn, dùng trong
  LLaMA. SVG: vectơ đặc trưng lệch → chuẩn hóa → co dịch.

## 5. Tự kiểm tra (`.quiz`)
1. LayerNorm tính μ, σ theo chiều nào? → `.qa` **Qua các đặc trưng của MỘT mẫu (không theo batch).**
2. RMSNorm khác LayerNorm ở đâu? → `.qa` **Bỏ trừ trung bình, chỉ chia RMS → gọn hơn.**

## 6. Rút ra
> **Rút ra.** LayerNorm chuẩn hóa trong một mẫu → hợp seq/Transformer, batch-độc-lập; RMSNorm gọn hơn. Bài tiếp (21): xử lý chuỗi tuần
> tự — RNN một bước.

## 7. `data-q` & số mẫu
- Sinh mẫu d=2 (để x̂ ra ±1) hoặc d=4 với σ chọn đẹp; γ, β nguyên nhỏ.
- Khóa: `x1, x2, g1, g2, b1, b2`; `mu, var, sigma`; `xh1, xh2`, `y1, y2`; `rms`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| μ, σ | 3, 1 |
| x̂ | (−1, 1) |
| y | (−1, 1) |
