# SPEC — E6 · BatchNorm — chuẩn hóa theo batch (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `E6-batchnorm` · English *BatchNorm* · ~13 phút.
> Tiền đề: A19 (z-score), A16 (μ, σ), E1 (ổn định tín hiệu).

## 1. Định vị
Chuẩn hóa kích hoạt **theo từng đặc trưng trên cả batch** về μ=0, σ=1, rồi cho mạng tự co/dịch bằng γ, β. Ổn định & tăng tốc huấn luyện.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Phân phối đầu vào mỗi lớp **trôi** khi lớp trước cập nhật (internal covariate shift) → khó học. BatchNorm
  "neo" lại phân phối mỗi bước → dùng η lớn hơn, hội tụ nhanh, lại có chút regularization từ nhiễu batch.
- `.formula`:
  ```
  μ_B, σ²_B trên batch      x̂ = (x − μ_B)/√(σ²_B + ε)      y = γ·x̂ + β   (γ, β học được)
  ```

## 3. Trực giác (`.intuition`)
> Trước mỗi lớp, **căn chỉnh lại thước đo**: kéo kích hoạt về trung bình 0, độ trải 1 (như z-score, Bài A19) **theo batch**. Sau đó
> cho mạng quyền **co lại/dịch đi** (γ, β) nếu phân phối khác có lợi hơn.

## 4. Các bước
- **⓪ Cho sẵn** · pill `batch 4 · 1 đặc trưng`: x = (1, 1, 7, 7); γ = 2, β = 1; ε bỏ qua. (`.cell.given`)
- **① Trung bình & phương sai batch** — `μ = (1+1+7+7)/4 = __ (4) ; σ² = ((−3)²+(−3)²+3²+3²)/4 = 36/4 = __ (9) → σ = __` → 3. `.why`: thống kê **trên batch**, không phải trên một mẫu.
- **② Chuẩn hóa x̂** — `x̂ = (x−4)/3`: `(−1, −1, 1, 1)` (điền). `.hint`: mọi giá trị giờ có μ=0, σ=1 → "cùng thước".
- **③ Co & dịch (γ, β)** — `y = 2·x̂ + 1`: `(−1, −1, 3, 3)` (điền). `.why`: γ, β **học được** → mạng tự chọn lại phân phối nếu cần (kể cả khôi phục x gốc).
- **④ Train vs inference** · pill `running stats` — `.note`: lúc train dùng μ, σ của batch; lúc **suy luận** dùng **μ, σ trung bình chạy** đã lưu (vì
  không có batch). LayerNorm (Bài 20) chuẩn hóa theo **đặc trưng trong một mẫu** — hợp Transformer/RNN. SVG: phân phối lệch → chuẩn hóa → co dịch.

## 5. Tự kiểm tra (`.quiz`)
1. BatchNorm tính μ, σ theo chiều nào? → `.qa` **Theo batch (cho mỗi đặc trưng), không theo một mẫu.**
2. γ, β để làm gì? → `.qa` **Cho mạng học lại độ co & dịch phân phối sau chuẩn hóa.**

## 6. Rút ra
> **Rút ra.** BatchNorm = z-score theo batch + γ,β học được; ổn định & tăng tốc train. Phụ thuộc batch → LayerNorm (Bài 20) thay thế
> cho seq. Bài tiếp (E8): lịch học suất (step/cosine).

## 7. `data-q` & số mẫu
- Sinh batch sao cho σ nguyên (vd cặp đối xứng); γ, β nguyên nhỏ.
- Khóa: `x1..x4, gamma, beta`; `mu, var, sigma`; `xh1..xh4`, `y1..y4`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| μ, σ | 4, 3 |
| x̂ | (−1, −1, 1, 1) |
| y = γx̂+β | (−1, −1, 3, 3) |
