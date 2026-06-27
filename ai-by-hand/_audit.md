# Báo cáo ĐỒNG BỘ phiếu canvas

Tổng: **148** file · canvas **119** · dọc-cũ **29** · không rõ **0**

> 🔻 **29 phiếu DỌC cũ (wb.css)** — chưa chuyển canvas (ứng viên đồng bộ chính):
> K1/01-tich-vo-huong.html, K1/02-nhan-ma-tran.html, K1/03-lop-tuyen-tinh.html, K1/04-ham-kich-hoat.html, K1/05-mot-no-ron.html, K1/06-mot-lop-no-ron.html, K1/07-lop-an.html, K1/08-sau-rong.html, K1/09-softmax.html, K1/A1-vecto-cong-tru.html, K1/A2-do-dai-chuan.html, K1/A4-cosine-similarity.html, K2/10-gradient.html, K2/12-backpropagation.html, K2/16-cnn-tich-chap.html, K2/17-cross-entropy.html, K2/20-layernorm.html, K2/21-rnn-mot-buoc.html, K2/22-lstm-mot-o-nho.html, K2/23-adam-mot-buoc.html, K3/11-self-attention.html, K3/13-khoi-transformer.html, K3/14-khoi-gpt-mask.html, K3/15-cross-attention.html, K3/18-multi-head-attention.html, K3/19-embedding-vitri.html, K3/24-autoencoder-vae.html, K3/25-diffusion-khu-nhieu.html, K3/26-mixture-of-experts.html

> 🟠 **5 phiếu canvas nhúng CSS nội bộ** (không link wb-canvas.css) — nên dùng stylesheet chung:
> 02-nhan-ma-tran-canvas.html, 11-self-attention-canvas.html, 12-backpropagation-canvas.html, 13-transformer-canvas.html, 27-transformer-toan-bo-canvas.html

> ⚠️ **10 bản canvas FLAT** (ngoài K*/) — nghi trùng bản canonical trong thư mục con:
> 01-tich-vo-huong-canvas.html, 02-nhan-ma-tran-canvas.html, 03-lop-tuyen-tinh-canvas.html, 04-ham-kich-hoat-canvas.html, 05-mot-no-ron-canvas.html, 11-self-attention-canvas.html, 12-backpropagation-canvas.html, 13-transformer-canvas.html, 27-transformer-toan-bo-canvas.html, A1-vecto-cong-tru-canvas.html

## [A+B] Lỗi & cảnh báo theo file
5/119 file có lỗi/cảnh báo.

### 02-nhan-ma-tran-canvas.html
- ⚠️ canvas nhưng KHÔNG link wb-canvas.css (CSS nhúng nội bộ — nên dùng stylesheet chung)

### 11-self-attention-canvas.html
- ⚠️ canvas nhưng KHÔNG link wb-canvas.css (CSS nhúng nội bộ — nên dùng stylesheet chung)
- ⚠️ thiếu .rutra ("Rút ra") ở trang ĐÁP ÁN

### 12-backpropagation-canvas.html
- ⚠️ canvas nhưng KHÔNG link wb-canvas.css (CSS nhúng nội bộ — nên dùng stylesheet chung)

### 13-transformer-canvas.html
- ⚠️ canvas nhưng KHÔNG link wb-canvas.css (CSS nhúng nội bộ — nên dùng stylesheet chung)
- ⚠️ thiếu .rutra ("Rút ra") ở trang ĐÁP ÁN

### 27-transformer-toan-bo-canvas.html
- ⚠️ canvas nhưng KHÔNG link wb-canvas.css (CSS nhúng nội bộ — nên dùng stylesheet chung)
- ⚠️ thiếu .rutra ("Rút ra") ở trang ĐÁP ÁN

## [B] Ma trận khối giảng giải (đồng đều?)
| khối | số file có | tỉ lệ |
|---|---|---|
| scaf | 115 | 97% |
| intuition | 64 | 54% |
| why | 13 | 11% |
| hint | 116 | 97% |
| quiz | 110 | 92% |
| rutra | 116 | 97% |

Phiếu THIẾU `.rutra` (gold-standard có): 11-self-attention-canvas.html, 13-transformer-canvas.html, 27-transformer-toan-bo-canvas.html

## [C] Style-block drift — selector nên HOIST vào wb-canvas.css
(selector tự định nghĩa lại trong inline `<style>` ở ≥3 file → trùng lặp, dễ lệch giá trị)

| selector | số file |
|---|---|
| `.schema svg` | 115 |
| `.expr` | 61 |
| `.dtbl` | 57 |
| `.dtbl td` | 57 |
| `.dtbl th` | 56 |
| `.dtbl td.blank` | 50 |
| `.key .dtbl td.blank` | 50 |
| `.ublk` | 49 |
| `.key .ublk` | 49 |
| `.m` | 29 |
| `.cell` | 24 |
| `.ub` | 23 |
| `.key .ub` | 23 |
| `.big` | 23 |
| `.dtbl td.lab` | 18 |
| `.etbl` | 17 |
| `.etbl td` | 17 |
| `.etbl td.h` | 17 |
| `.schema` | 10 |
| `.lntab` | 7 |
| `.m .cell` | 7 |
| `.dtbl tr.sumr td` | 6 |
| `.crow` | 6 |
| `.clab` | 6 |
| `:root` | 5 |
| `*` | 5 |
| `body` | 5 |
| `.sheet` | 5 |
| `.ttl` | 5 |
| `.ttl h1` | 5 |

## [D] Bố cục / cỡ ô / màu lệch

**Override `--cw` / `--ch` / `.schema width` theo file:**

| file | --cw | --ch | schema width |
|---|---|---|---|
| 01-tich-vo-huong-canvas.html | 16mm | – | 64mm |
| 02-nhan-ma-tran-canvas.html | – | – | 74mm |
| 03-lop-tuyen-tinh-canvas.html | – | – | 72mm |
| 04-ham-kich-hoat-canvas.html | 14mm | – | 66mm |
| 05-mot-no-ron-canvas.html | – | – | 70mm |
| 11-self-attention-canvas.html | – | – | 62mm |
| 12-backpropagation-canvas.html | – | – | 54mm |
| 13-transformer-canvas.html | – | – | 60mm |
| 27-transformer-toan-bo-canvas.html | – | – | 50mm |
| A1-vecto-cong-tru-canvas.html | 9.5mm | – | 62mm |
| K1/A14-gradient-nhieu-bien.html | 10mm | 8mm | – |
| K1/A5-phep-chieu.html | 10mm,18mm | – | – |
| K1/A6-ma-tran-chuyen-vi.html | 11mm | – | – |
| K1/A8-ma-tran-nhan-vecto.html | 11mm,13mm | – | – |
| K2/F3-conv-nhieu-kenh.html | 9mm | 7mm | – |
| K2/F4-nhieu-bo-loc.html | 9mm | 7mm | – |
| K2/F5-pooling.html | 10mm | 8mm | – |
| K2/F7-conv-1x1.html | 10mm | 8mm | – |
| K2/F8-transposed-conv.html | 9mm | 7.5mm | – |
| K2/F9-residual.html | 10mm | 8mm | – |
| K2/G5-gru.html | 11mm | 8mm | – |
| K3/H1-scaled-dot-product-attention.html | 9mm | 8mm | – |
| K3/H10-kv-cache.html | 9mm,11mm | 8mm | – |
| K3/H11-ffn.html | 10mm | 8mm | – |
| K3/H7-positional-encoding.html | 13mm | 8mm | – |
| K3/H8-rope-rotary.html | 15mm,11mm | 8mm | – |
| K3/H9-padding-mask.html | 11mm | 8mm | – |
| K3/I5-lora.html | 10mm | 8mm | – |
| K3/J2-vae-reparam-kl.html | 13mm | 8mm | – |
| K3/J4-diffusion-forward.html | 13mm | 8mm | – |
| K3/J7-ddpm-ddim.html | 12mm | 8mm | – |
| K4/K3-q-learning.html | 12mm | 9mm | – |
| K4/K4-sarsa.html | 12mm | 9mm | – |
| K4/L3-cosine-eval.html | 12mm,18mm | 9mm | – |
| K4/M1-gnn-message-passing.html | 11mm | 8mm | – |
| K4/M3-triplet-loss.html | 11mm | 8mm | – |
| K4/M4-clip.html | 12mm | 9mm | – |
| K4/N1-mlp-capstone.html | 9mm,12mm,13mm | 7.5mm | – |
| K4/N2-mini-cnn.html | 8mm,11mm | 7.5mm | – |
| K4/N3-mini-gpt.html | 9mm,11mm,12mm | 7.5mm | – |

**Hex màu NGOÀI bảng canon (gộp toàn bộ, sắp theo tần suất):**

| hex | số lần | (kiểm: có nên thêm vào canon hay sửa về accent/accent2?) |
|---|---|---|
| `#d5c49a` | 85 | |
| `#e2d5b5` | 61 | |
| `#bbb` | 34 | |
| `#0a6` | 23 | |
| `#ccc` | 19 | |
| `#fafafa` | 18 | |
| `#999` | 15 | |
| `#eef6fa` | 14 | |
| `#eee` | 13 | |
| `#d6f5d6` | 13 | |
| `#777` | 9 | |
| `#c00` | 9 | |
| `#888` | 8 | |
| `#cfe3ec` | 8 | |
| `#333` | 7 | |
| `#ffe0e0` | 6 | |
| `#aaa` | 5 | |
| `#0e6a86` | 4 | |
| `#93c5fd` | 4 | |
| `#f0ece2` | 4 | |
| `#e5e5e5` | 4 | |
| `#b00` | 4 | |
| `#7a5a00` | 3 | |
| `#f2efe6` | 2 | |
| `#dceff5` | 2 | |
| `#fcd34d` | 2 | |
| `#e5e7eb` | 2 | |
| `#ef4444` | 2 | |
| `#f3efe6` | 2 | |
| `#111` | 2 | |
| `#8a6d00` | 2 | |
| `#e0d8c4` | 2 | |
| `#f4f0e6` | 2 | |
| `#9ad8a0` | 2 | |
| `#222` | 1 | |
| `#7a5b1e` | 1 | |
| `#5b3ed6` | 1 | |
| `#84c4d6` | 1 | |
| `#dff3e4` | 1 | |
| `#9cd3ad` | 1 | |
| `#fbe1ee` | 1 | |
| `#f0eee8` | 1 | |
| `#f9f3e8` | 1 | |
| `#e0dbd0` | 1 | |
| `#faf8f2` | 1 | |
| `#f0f9ff` | 1 | |
| `#666` | 1 | |
| `#dfe7ea` | 1 | |
| `#444` | 1 | |
| `#cfe6f0` | 1 | |
| `#e3a7a7` | 1 | |
| `#cbb` | 1 | |