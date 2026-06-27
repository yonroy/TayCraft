# SPEC — J2 · VAE — reparam + KL (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `J2-vae-reparam-kl` · English *VAE reparam + KL* · ~14 phút.
> Tiền đề: 24 (autoencoder/VAE), D4 (KL), A18 (log). Mở đầu Phần J (sinh, K3).

## 1. Định vị
Hai mẹo cốt lõi của VAE: **reparameterization** (z = μ + σ·ε) để lan gradient qua biến ngẫu nhiên, và **KL** ép không gian ẩn về chuẩn N(0,1).

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** VAE muốn **lấy mẫu** z nhưng "lấy mẫu" chặn gradient. Reparam tách ngẫu nhiên ra ε để z **khả vi** theo μ,σ.
  KL kéo phân phối ẩn về N(0,1) → vùng ẩn liền mạch, lấy mẫu sinh ảnh mới được.
- `.formula`:
  ```
  z = μ + σ·ε,  ε ~ N(0,1)        KL = ½ Σ (μ² + σ² − 1 − ln σ²)
  ```

## 3. Trực giác (`.intuition`)
> **Reparam:** thay vì "bốc z ngẫu nhiên" (không đạo hàm được), ta bốc ε cố định rồi **dịch & co** bằng μ, σ → gradient chảy qua μ,σ
> như thường. **KL:** "phạt" nếu mã ẩn lệch khỏi N(0,1) → giữ vùng ẩn gọn, không rỗng chỗ.

## 4. Các bước
- **⓪ Cho sẵn** · pill `2 chiều ẩn`: encoder cho μ = (1, 0), σ = (1, 1); nhiễu ε = (0.5, −0.5). (`.cell.given`)
- **① Reparam z** — `z = μ + σ·ε = (1 + 1·0.5, 0 + 1·(−0.5)) = (__, __)` → (1.5, −0.5). `.why`: ngẫu nhiên nằm ở ε; z là **hàm khả vi** của μ, σ → backprop được.
- **② KL từng chiều** — `½(μ²+σ²−1−ln σ²)`: chiều 1 `½(1+1−1−0)=__ (0.5)`; chiều 2 `½(0+1−1−0)=__` → 0. (σ=1 → ln σ²=0). `.hint`: σ=1, μ=0 cho KL=0 (đúng N(0,1)).
- **③ Tổng KL** — `0.5 + 0 = __` → 0.5. `.why`: chiều 1 có μ=1 ≠ 0 nên bị phạt; loss VAE = tái tạo + KL.
- **④ Đánh đổi** · pill `tái tạo ↔ KL` — `.note`: KL quá mạnh → ẩn về chuẩn nhưng tái tạo mờ (posterior collapse); quá yếu → vùng ẩn lỗ chỗ, sinh kém. Cân bằng (β-VAE chỉnh trọng số KL). SVG: μ,σ → ⊕ε → z; vùng ẩn N(0,1).

## 5. Tự kiểm tra (`.quiz`)
1. Reparam giải quyết vấn đề gì? → `.qa` **Cho gradient chảy qua bước lấy mẫu (z khả vi theo μ,σ).**
2. KL ép phân phối ẩn về đâu? → `.qa` **Chuẩn N(0,1).**

## 6. Rút ra
> **Rút ra.** VAE = reparam (z=μ+σε, khả vi) + KL (ẩn về N(0,1)); loss = tái tạo + KL. Bài tiếp (J3): mô hình sinh đối kháng — GAN.

## 7. `data-q` & số mẫu
- Sinh μ, σ (σ rơi mốc ln đẹp, vd σ=1), ε nhỏ; tính z & KL.
- Khóa: `mu1,mu2,s1,s2,e1,e2`; `z1,z2`; `kl1,kl2,kl`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| z | (1.5, −0.5) |
| KL | 0.5 |
