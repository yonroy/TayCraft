# SPEC — G5 · GRU 1 ô (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `G5-gru` · English *GRU* · ~13 phút.
> Tiền đề: 21 (RNN), 22 (LSTM), C2/C3 (σ, tanh). Dùng bảng σ/tanh.

## 1. Định vị
**Gated Recurrent Unit**: RNN có **cổng** quyết định giữ bao nhiêu trí nhớ cũ và thêm bao nhiêu cái mới. Gọn hơn LSTM, chống vanishing.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** RNN thường quên nhanh (vanishing). GRU dùng **cổng cập nhật z** để **giữ nguyên** trạng thái cũ qua nhiều bước
  (đường gradient ~1) → nhớ lâu hơn, ít tham số hơn LSTM. Cốt lõi của nhiều mô hình chuỗi trước Transformer.
- `.formula`:
  ```
  z = σ(...)   (cổng cập nhật)    r = σ(...)   (cổng đặt lại)
  h̃ = tanh(W·x + U·(r⊙h_prev))    h = (1 − z)⊙h_prev + z⊙h̃
  ```

## 3. Trực giác (`.intuition`)
> Hai **núm vặn**: cổng đặt lại r quyết định "quên bao nhiêu quá khứ khi tính ý mới"; cổng cập nhật z quyết định "thay trạng thái cũ
> bằng ý mới bao nhiêu". z≈0 → **giữ nguyên** trí nhớ (nhớ lâu); z≈1 → **thay mới** hoàn toàn.

## 4. Các bước
- **⓪ Cho sẵn** · pill `1 ô, scalar`: trạng thái cũ h_prev = 0.2; đã tính (qua σ/tanh): z = 0.7, r = 0.4, ứng viên h̃ = 0.5. (`.cell.given`)
- **① Ý nghĩa từng cổng** — z = 0.7 → thay 70% bằng cái mới; r = 0.4 → chỉ dùng 40% quá khứ khi tạo h̃. `.why`: cổng là **xác suất mềm** (σ ∈ (0,1)) điều tiết luồng thông tin.
- **② Trạng thái mới** — `h = (1−z)·h_prev + z·h̃ = 0.3·0.2 + 0.7·0.5 = 0.06 + 0.35 = __` → 0.41. `.hint`: trộn **lồi** giữa cũ và mới theo z.
- **③ Trường hợp z → 0** — `nếu z=0: h = 1·h_prev + 0 = __` → 0.2 (giữ nguyên). `.why`: z nhỏ tạo **đường tắt trí nhớ** (giống residual) → gradient không teo → nhớ lâu.
- **④ So với LSTM** · pill `gọn hơn` — `.note`: GRU gộp cell & hidden, chỉ 2 cổng (LSTM 3 cổng + ô nhớ riêng) → ít tham số, train nhanh, hiệu năng tương đương
  nhiều bài. SVG: sơ đồ h_prev, x → cổng z,r → h.

## 5. Tự kiểm tra (`.quiz`)
1. Cổng cập nhật z ≈ 0 nghĩa là gì? → `.qa` **Giữ gần như nguyên trạng thái cũ (nhớ lâu).**
2. GRU khác LSTM ở đâu? → `.qa` **Ít cổng hơn (2 vs 3), không tách ô nhớ riêng → gọn hơn.**

## 6. Rút ra
> **Rút ra.** GRU = trộn lồi cũ/mới theo cổng z; z nhỏ giữ trí nhớ (chống vanishing), gọn hơn LSTM. Bài tiếp (G6): đọc chuỗi **hai chiều**
> — Bi-RNN.

## 7. `data-q` & số mẫu
- Cho z, r, h̃, h_prev rơi mốc bảng σ/tanh; tính h.
- Khóa: `hprev, z, r, htil`; `h`, `hKeep` (khi z=0).

## Phụ lục — số mẫu
| | KQ |
|---|---|
| h (z=0.7) | 0.41 |
| h (z=0) | 0.2 (giữ nguyên) |
