# SPEC — I6 · Quantization int8 (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `I6-quantization` · English *Quantization* · ~12 phút.
> Tiền đề: A19 (thang đo), C9 (cỡ mô hình).

## 1. Định vị
Nén trọng số từ float32 xuống **số nguyên 8-bit**: chọn một **hệ số tỉ lệ**, làm tròn về [−127, 127], khi dùng thì nhân lại. Giảm 4× bộ nhớ.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Mô hình tỉ tham số không vừa bộ nhớ/tốc độ. int8 giảm 4× dung lượng, tăng tốc, chỉ mất chút độ chính xác.
  Là cách chạy LLM lớn trên phần cứng nhỏ.
- `.formula`:
  ```
  scale = absmax(x) / 127      q = round(x / scale)  ∈ [−127, 127]      x̂ = q · scale  (giải lượng tử)
  ```

## 3. Trực giác (`.intuition`)
> Như **đổi đơn vị đo**: tìm giá trị lớn nhất (absmax), chia thang đó thành 255 nấc nguyên. Mỗi số float "rơi" vào nấc gần nhất
> (làm tròn). Khi dùng, nhân nấc với độ-lớn-một-nấc (scale) để về xấp xỉ giá trị gốc.

## 4. Các bước
- **⓪ Cho sẵn** · pill `4 trọng số`: x = (5, −12.7, 3.14, 10). (`.cell.given`)
- **① Hệ số tỉ lệ** — `absmax = 12.7 → scale = 12.7/127 = __` → 0.1. `.why`: chọn theo giá trị lớn nhất để dùng hết dải [−127,127], không tràn.
- **② Lượng tử hóa (q)** — `q = round(x/0.1) = (50, −127, __ , 100)` → 31 (3.14/0.1=31.4→31). `.hint`: q là **số nguyên 8-bit** — phần lưu thực tế.
- **③ Giải lượng tử (x̂)** — `x̂ = q·0.1 = (5, −12.7, __ , 10)` → 3.1. `.why`: x̂ ≈ x; sai số chỉ ở chỗ làm tròn (3.14 → 3.1).
- **④ Sai số & dung lượng** · pill `4× nhỏ hơn` — `sai số 3.14: |3.14 − 3.1| = __` → 0.04 (≤ nửa nấc). `.note`: int8 = 1 byte vs float32 = 4 byte → giảm 4×. Trọng số có outlier lớn → scale lớn → mất chính xác (cần per-channel / nhóm). SVG: trục số chia nấc, các x rơi vào nấc.

## 5. Tự kiểm tra (`.quiz`)
1. scale chọn theo gì? → `.qa` **absmax / 127 (giá trị lớn nhất chia mức nguyên).**
2. Sai số lượng tử lớn nhất cỡ bao nhiêu? → `.qa` **Nửa nấc (½·scale) — do làm tròn.**

## 6. Rút ra
> **Rút ra.** int8 = scale + làm tròn + nhân lại; giảm 4× bộ nhớ, mất ít chính xác. Bài tiếp (I7): truy hồi tài liệu bằng cosine (RAG).

## 7. `data-q` & số mẫu
- Sinh trọng số sao cho absmax = 12.7 (scale 0.1) để số đẹp; một giá trị lẻ minh họa sai số.
- Khóa: `x1..x4`; `scale`, `q1..q4`, `dq1..dq4`, `err`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| scale | 0.1 |
| q | (50, −127, 31, 100) |
| x̂ | (5, −12.7, 3.1, 10) |
| sai số 3.14 | 0.04 |
