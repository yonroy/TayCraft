# SPEC — L7 · FLOPs — đếm phép tính một lớp (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `L7-flops` · English *FLOPs* · ~11 phút.
> Tiền đề: 02 (nhân ma trận), C9 (đếm tham số), F10.

## 1. Định vị
Đếm số **phép cộng-nhân** (FLOPs) một lớp cần — thước đo chi phí tính toán, tách bạch với **số tham số** (bộ nhớ).

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Tham số = bộ nhớ; FLOPs = **tốc độ/điện**. Hai thứ khác nhau (conv ít tham số nhưng nhiều FLOPs). Ước lượng FLOPs
  giúp dự đoán độ trễ, chọn kiến trúc vừa phần cứng, so chi phí mô hình.
- `.formula`:
  ```
  Lớp tuyến tính (in → out): MAC = in·out      FLOPs ≈ 2·in·out   (mỗi MAC = 1 nhân + 1 cộng)
  Nhân ma trận (m×k)(k×n): FLOPs ≈ 2·m·k·n
  ```

## 3. Trực giác (`.intuition`)
> Mỗi đầu ra là một **tích vô hướng** dài `in` → `in` phép nhân + `in` phép cộng. Có `out` đầu ra → nhân lên. Một "MAC" (nhân-rồi-cộng)
> tính là 2 FLOPs. Cứ thế cộng qua các lớp ra tổng chi phí.

## 4. Các bước
- **⓪ Cho sẵn** · pill `lớp 4 → 8`: đầu vào 4 chiều, đầu ra 8 nơ-ron, một mẫu. (`.cell.given`)
- **① Số MAC** — `MAC = in·out = 4·8 = __` → 32. `.why`: mỗi trong 8 nơ-ron làm một tích vô hướng dài 4 → 8×4 phép nhân-cộng.
- **② FLOPs** — `2·MAC = 2·32 = __` → 64 (+8 cho cộng bias). `.hint`: nhân 2 vì mỗi MAC = 1 nhân + 1 cộng.
- **③ Theo batch** — batch 16 mẫu: `64·16 = __` → 1024 FLOPs. `.why`: FLOPs nhân tuyến tính theo số mẫu; tham số **không đổi** theo batch.
- **④ Tham số ≠ FLOPs** · pill `bộ nhớ vs tốc độ` — `.note`: conv chia sẻ trọng số → **ít tham số** nhưng trượt khắp ảnh → **nhiều FLOPs**. Tối ưu triển khai phải nhìn cả hai. SVG: lớp 4→8 với 32 dây (MAC).

## 5. Tự kiểm tra (`.quiz`)
1. Vì sao FLOPs ≈ 2·in·out? → `.qa` **Mỗi MAC = 1 nhân + 1 cộng = 2 phép.**
2. Tham số và FLOPs khác nhau thế nào? → `.qa` **Tham số = bộ nhớ (không đổi theo batch); FLOPs = tốc độ (nhân theo batch).**

## 6. Rút ra
> **Rút ra.** FLOPs ≈ 2·in·out mỗi lớp, ×batch; khác số tham số. Bài tiếp (L8): từ FLOPs sang thời gian thực — độ trễ & thông lượng.

## 7. `data-q` & số mẫu
- Sinh in, out, batch nhỏ; tính MAC, FLOPs, theo batch.
- Khóa: `in, out, batch`; `mac, flops, flopsBatch`.

## Phụ lục — số mẫu (4→8)
| | KQ |
|---|---|
| MAC | 32 |
| FLOPs/mẫu | 64 |
| ×batch 16 | 1024 |
