# SPEC — G4 · LSTM — một ô nhớ (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `22-lstm-mot-o-nho` · English *LSTM cell* · ~14 phút.
> Tiền đề: 21 (RNN), G5 (GRU), C2/C3 (σ, tanh). Dùng bảng σ/tanh. **Đã có phiếu** — spec để nâng cấp/tái tạo.

## 1. Định vị
**Long Short-Term Memory**: thêm **ô nhớ c** và **ba cổng** (quên, vào, ra) để giữ thông tin lâu, chống vanishing của RNN thường.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** RNN trơn quên nhanh (gradient teo). LSTM cho **đường ô nhớ c gần như tuyến tính** (cổng quên ≈ 1 → giữ nguyên)
  → gradient chảy xa không teo, nhớ phụ thuộc dài hạn. Thống trị NLP/seq trước Transformer.
- `.formula`:
  ```
  f, i, o = σ(...)   (cổng quên / vào / ra)      c̃ = tanh(...)   (ứng viên)
  cₜ = f⊙cₜ₋₁ + i⊙c̃      hₜ = o⊙tanh(cₜ)
  ```

## 3. Trực giác (`.intuition`)
> Ô nhớ c như **băng ghi nhớ chạy thẳng**. Cổng **quên f** quyết bôi bao nhiêu băng cũ; cổng **vào i** quyết ghi thêm bao nhiêu cái mới;
> cổng **ra o** quyết đọc ra bao nhiêu cho trạng thái h. f≈1, i≈0 → giữ trí nhớ nguyên vẹn qua nhiều bước.

## 4. Các bước
- **⓪ Cho sẵn + bảng σ/tanh** · pill `1 ô, scalar`: đã tính cổng f=0.7, i=0.6, o=0.8; ứng viên c̃=0.5; ô nhớ cũ c_prev=0.4. Bảng: `tanh(0.58)=0.52`. (`.cell.given`)
- **① Cập nhật ô nhớ** — `cₜ = f·c_prev + i·c̃ = 0.7·0.4 + 0.6·0.5 = 0.28 + 0.30 = __` → 0.58. `.why`: trộn "giữ băng cũ" (f) với "ghi cái mới" (i) — cộng chứ không ghi đè → trí nhớ tích lũy.
- **② Trạng thái ẩn** — `hₜ = o·tanh(cₜ) = 0.8·tanh(0.58) = 0.8·0.52 = __` → 0.42. `.hint`: cổng ra lọc xem **đọc** bao nhiêu ô nhớ ra ngoài.
- **③ Giữ trí nhớ dài** — nếu f≈1, i≈0: `cₜ ≈ c_prev` → ô nhớ **không đổi** qua nhiều bước. `.why`: đường c gần như cộng/đồng nhất → gradient không teo (khác RNN thường) → nhớ xa.
- **④ So với GRU** · pill `3 cổng + ô nhớ` — `.note`: LSTM tách **c (nhớ)** và **h (đầu ra)**, 3 cổng; GRU gộp lại, 2 cổng → gọn hơn (Bài G5). SVG: ô LSTM với băng c chạy ngang + 3 cổng.

## 5. Tự kiểm tra (`.quiz`)
1. Cổng quên f ≈ 1 nghĩa là gì? → `.qa` **Giữ gần như nguyên ô nhớ cũ → nhớ lâu.**
2. Vì sao LSTM chống vanishing? → `.qa` **Đường ô nhớ c gần tuyến tính → gradient chảy xa không teo.**

## 6. Rút ra
> **Rút ra.** LSTM = ô nhớ c + 3 cổng; f≈1 giữ trí nhớ dài, chống vanishing. Bài tiếp (23): bộ tối ưu mạnh — Adam một bước.

## 7. `data-q` & số mẫu
- Cho f, i, o, c̃, c_prev rơi mốc bảng (tanh(cₜ) tra được); tính cₜ, hₜ.
- Khóa: `f, i, o, ctil, cprev`; `c`, `tanhc`, `h`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| cₜ | 0.58 |
| hₜ | 0.42 |
