# SPEC — H8 · RoPE — Rotary embedding (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `H8-rope-rotary` · English *RoPE* · ~13 phút.
> Tiền đề: H7 (positional), nhân ma trận quay (02), A6. Dùng bảng sin/cos.

## 1. Định vị
**Rotary Position Embedding**: nhúng vị trí bằng cách **quay** từng cặp chiều của Q, K một góc tỉ lệ vị trí. Mã vị trí **tương đối** tự nhiên.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** RoPE làm điểm attention Q·K chỉ phụ thuộc **hiệu vị trí** (m−n), không phụ thuộc vị trí tuyệt đối → khái
  quát tốt cho chuỗi dài. Là chuẩn của LLaMA, GPT-NeoX và nhiều LLM hiện đại.
- `.formula`:
  ```
  RoPE: (x₁, x₂) →ᵣₒₜ (x₁cosθ − x₂sinθ,  x₁sinθ + x₂cosθ),  θ = pos · ωₖ
  ```

## 3. Trực giác (`.intuition`)
> Thay vì **cộng** dấu vị trí (như H7), RoPE **xoay** vectơ Q, K một góc theo vị trí. Hai token cách nhau k vị trí → vectơ lệch
> nhau một góc cố định → điểm tương đồng chỉ phụ thuộc **khoảng cách**, không phụ thuộc đứng ở đâu.

## 4. Các bước
- **⓪ Cho sẵn + bảng** · pill `1 cặp chiều`: vectơ x=(3, 1) tại vị trí pos cho góc θ=90°. Bảng: cos90°=0, sin90°=1. (`.cell.given`)
- **① Áp công thức quay** — `x₁' = x₁cosθ − x₂sinθ = 3·0 − 1·1 = __ (−1) ; x₂' = x₁sinθ + x₂cosθ = 3·1 + 1·0 = __` → 3.
  `.why`: đúng phép nhân ma trận quay (Bài 02): cột R cho biết trục đi đâu.
- **② Vectơ sau quay** — `x' = (−1, 3)` (cùng độ dài, đổi hướng 90°). `.hint`: quay **giữ nguyên độ dài** ‖x'‖ = ‖x‖ = √10.
- **③ Vì sao "tương đối"** — điểm `q'·k'` của hai token = hàm của góc lệch `θ_m − θ_n = (m−n)·ω` → chỉ phụ thuộc **m−n**. `.why`: nhờ quay,
  thông tin vị trí vào thẳng tích vô hướng dưới dạng **hiệu vị trí**.
- **④ Nhiều tần số** · pill `mỗi cặp chiều` — `.note`: chia vectơ thành các cặp, mỗi cặp quay với tần số ωₖ riêng (như H7 nhiều tần số). Áp **lên Q và K** trước khi tính điểm. SVG: vectơ x quay thành x' kèm cung góc.

## 5. Tự kiểm tra (`.quiz`)
1. RoPE nhúng vị trí bằng phép gì? → `.qa` **Phép quay (rotation) lên các cặp chiều của Q, K.**
2. Điểm attention RoPE phụ thuộc vị trí kiểu nào? → `.qa` **Tương đối — chỉ hiệu vị trí (m−n).**

## 6. Rút ra
> **Rút ra.** RoPE = quay Q,K theo vị trí → điểm chỉ phụ thuộc khoảng cách; quay giữ độ dài. Bài tiếp (H9): chặn token không hợp lệ
> bằng padding mask.

## 7. `data-q` & số mẫu
- Cho x (2 chiều) + góc θ rơi mốc bảng (0°,30°,90°); tính x'.
- Khóa: `x1, x2`, `theta`; `xp1, xp2`.

## Phụ lục — số mẫu (θ=90°)
| | KQ |
|---|---|
| x | (3, 1) |
| x' | (−1, 3) |
| ‖·‖ | √10 (giữ nguyên) |
