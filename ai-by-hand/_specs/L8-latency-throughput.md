# SPEC — L8 · Độ trễ & thông lượng (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `L8-latency-throughput` · English *Latency & throughput* · ~11 phút.
> Tiền đề: L7 (FLOPs).

## 1. Định vị
Hai thước đo tốc độ triển khai: **độ trễ** (latency — thời gian một yêu cầu) và **thông lượng** (throughput — số yêu cầu/giây). Thường đánh đổi.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Người dùng cảm nhận **độ trễ** (chờ bao lâu); hệ thống quan tâm **thông lượng** (phục vụ bao nhiêu/giây = chi phí).
  Gom batch lớn tăng thông lượng nhưng tăng độ trễ từng yêu cầu — kỹ sư phải cân theo nhu cầu (chat cần latency thấp; xử lý lô cần throughput cao).
- `.formula`:
  ```
  throughput = batch / thời_gian_xử_lý      latency ≈ thời gian để một yêu cầu xong
  ```

## 3. Trực giác (`.intuition`)
> **Độ trễ** = "tôi chờ bao lâu cho **món của tôi**". **Thông lượng** = "bếp ra **bao nhiêu món/giờ**". Nấu theo mẻ lớn (batch) → tổng món/giờ
> tăng (throughput ↑) nhưng mỗi người chờ lâu hơn (latency ↑). Đánh đổi kinh điển.

## 4. Các bước
- **⓪ Cho sẵn** · pill `2 cấu hình`: A — batch 1, xử lý 5 ms/yêu cầu. B — batch 32, xử lý 80 ms/mẻ. (`.cell.given`)
- **① Thông lượng A** — `1 / 0.005 s = __` → 200 yêu cầu/giây. `.why`: xử lý từng cái → độ trễ thấp (5 ms) nhưng phí cố định mỗi lần.
- **② Thông lượng B** — `32 / 0.08 s = __` → 400 yêu cầu/giây. `.hint`: gom mẻ chia sẻ chi phí → throughput cao hơn.
- **③ Độ trễ B** — một yêu cầu phải **chờ đủ mẻ** + 80 ms xử lý → latency **cao hơn** A. `.why`: batch lớn = throughput ↑ nhưng latency ↑ → đánh đổi.
- **④ Chọn theo nhu cầu** · pill `chat vs lô` — `.note`: chat trực tuyến → ưu tiên **latency thấp** (batch nhỏ); xử lý hàng loạt ban đêm → ưu tiên **throughput** (batch lớn). KV cache (H10), quantization (I6) cải thiện cả hai. SVG: hai cột throughput + ghi chú latency.

## 5. Tự kiểm tra (`.quiz`)
1. Tăng batch ảnh hưởng latency & throughput ra sao? → `.qa` **Throughput ↑ nhưng latency ↑ (đánh đổi).**
2. Chat trực tuyến nên ưu tiên gì? → `.qa` **Độ trễ thấp (latency).**

## 6. Rút ra
> **Rút ra.** throughput = batch/thời gian; batch lớn tăng throughput nhưng tăng latency → chọn theo nhu cầu. **Hết Phần L.** Tiếp Phần M — Bài tiếp (M1): GNN message passing.

## 7. `data-q` & số mẫu
- Sinh batch & thời gian xử lý; tính throughput hai cấu hình.
- Khóa: `batchA, tA, batchB, tB`; `thrA, thrB`.

## Phụ lục — số mẫu
| | throughput |
|---|---|
| A (batch 1) | 200/s (latency 5 ms) |
| B (batch 32) | 400/s (latency cao hơn) |
