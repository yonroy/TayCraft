# SPEC — J1 · Autoencoder / VAE (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `24-autoencoder-vae` · English *Autoencoder / VAE* · ~13 phút.
> Tiền đề: 07 (MLP), D1 (MSE), J2 (reparam+KL). **Đã có phiếu** — spec để nâng cấp/tái tạo.

## 1. Định vị
**Autoencoder**: nén x xuống mã ẩn nhỏ (bottleneck) rồi tái tạo x̂. **VAE** thêm phân phối + KL để **sinh** dữ liệu mới.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Ép dữ liệu qua "cổ chai" nhỏ buộc mạng giữ lại **đặc trưng quan trọng nhất** → học biểu diễn nén, khử nhiễu.
  VAE biến cổ chai thành **phân phối** → lấy mẫu sinh ảnh/dữ liệu mới (nền của mô hình sinh).
- `.formula`:
  ```
  AE:  z = Enc(x),  x̂ = Dec(z),  loss = ‖x − x̂‖²
  VAE: Enc → μ, σ;  z = μ + σ·ε;  loss = tái tạo + KL(N(μ,σ) ‖ N(0,1))
  ```

## 3. Trực giác (`.intuition`)
> Như **tóm tắt rồi viết lại**: encoder nén bài thành vài ý (z), decoder dựng lại bài từ ý đó. Cổ chai càng hẹp, càng buộc giữ ý
> **cốt lõi**. VAE: ý được mô tả bằng "khoảng" (μ, σ) thay vì điểm → vùng ẩn liền mạch để **bịa ra** bài mới.

## 4. Các bước
- **⓪ Cho sẵn** · pill `4 → 2 → 4`: x = (2, 1, 3, 0); encoder cho z = (1, 2) (bottleneck 2); decoder tái tạo x̂ = (2, 1, 2, 0). (`.cell.given`)
- **① Nén (encoder)** — x 4 chiều → z **2 chiều**. `.why`: cổ chai 2 < 4 → buộc bỏ thông tin dư, giữ đặc trưng chính.
- **② Tái tạo (decoder)** — z → x̂ = (2, 1, 2, 0). `.hint`: x̂ ≈ x nhưng có sai ở chiều 3 (3 → 2).
- **③ Loss tái tạo** — `‖x − x̂‖² = (0)²+(0)²+(3−2)²+(0)² = __` → 1. `.why`: sai số đo mất mát khi nén; tối thiểu nó để mã ẩn giữ được nhiều thông tin nhất.
- **④ VAE để sinh** · pill `μ, σ, KL` — `.note`: AE thường tái tạo nhưng vùng ẩn **lỗ chỗ** → lấy mẫu sinh ra rác. VAE thêm KL ép ẩn về N(0,1) (Bài J2) → lấy z ~ N(0,1) rồi decode ra mẫu mới. SVG: x → cổ chai z → x̂.

## 5. Tự kiểm tra (`.quiz`)
1. Cổ chai (bottleneck) buộc mạng làm gì? → `.qa` **Giữ lại đặc trưng quan trọng nhất (nén thông tin).**
2. VAE thêm gì so với AE để sinh được? → `.qa` **Phân phối (μ,σ) + KL → vùng ẩn liền mạch để lấy mẫu.**

## 6. Rút ra
> **Rút ra.** AE = nén↔tái tạo qua cổ chai; VAE thêm μ,σ + KL để sinh. Bài tiếp (25): một hướng sinh khác — diffusion khử nhiễu.

## 7. `data-q` & số mẫu
- Sinh x nguyên nhỏ + x̂ lệch một chiều; tính MSE/SSE.
- Khóa: `x1..x4`, `z1,z2`, `xh1..xh4`; `recon`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| z (bottleneck) | (1, 2) |
| loss tái tạo | 1 |
