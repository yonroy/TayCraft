# SPEC — I3 · Perplexity (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `I3-perplexity` · English *Perplexity* · ~12 phút.
> Tiền đề: 17 (cross-entropy), A18 (exp/log). Dùng bảng ln/eˣ.

## 1. Định vị
Thước đo mô hình ngôn ngữ: **mức "bối rối"** trung bình khi đoán token kế. PPL thấp = mô hình tự tin & đúng.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Perplexity = exp của cross-entropy trung bình → "số lựa chọn hiệu dụng" mô hình phân vân giữa. Là chỉ số
  chuẩn để **so sánh** mô hình ngôn ngữ: PPL 10 nghĩa là mỗi bước như đoán giữa ~10 token đều khả năng.
- `.formula`:
  ```
  PPL = exp( −(1/N) Σ ln p(tokenₜ) ) = exp(cross-entropy trung bình)
  ```

## 3. Trực giác (`.intuition`)
> Nếu mô hình **chắc chắn đúng** (p=1 cho token thật) → bối rối = 1 (không phân vân). Nếu đoán mò giữa V token đều nhau → PPL ≈ V.
> PPL = "số mặt xúc xắc đều" tương đương với độ bất định của mô hình.

## 4. Các bước
- **⓪ Cho sẵn + bảng ln/eˣ** · pill `3 token`: xác suất mô hình gán cho token đúng p = (0.5, 0.25, 0.5). Bảng: ln0.5=−0.69, ln0.25=−1.39; e^0.92=2.51. (`.cell.given`)
- **① −ln từng token** — `−ln0.5=0.69 ; −ln0.25=1.39 ; −ln0.5=0.69`. `.why`: −ln p là "độ bất ngờ" mỗi token (cross-entropy từng bước).
- **② Trung bình (cross-entropy)** — `(0.69+1.39+0.69)/3 = __` → 0.92. `.hint`: đây chính là CE trung bình trên chuỗi.
- **③ Perplexity** — `PPL = e^0.92 = __` → 2.51. `.why`: mũ hóa CE → "số token đều khả năng" tương đương ≈ 2.5.
- **④ Đọc PPL** · pill `thấp = tốt` — `.note`: PPL = 1 (hoàn hảo), càng cao càng tệ; PPL = |V| nghĩa là đoán mò hoàn toàn. So sánh mô hình trên **cùng** tập kiểm. SVG: cột −ln p từng token + đường trung bình.

## 5. Tự kiểm tra (`.quiz`)
1. PPL = 1 nghĩa là gì? → `.qa` **Mô hình hoàn hảo — luôn gán p=1 cho token đúng.**
2. PPL liên hệ cross-entropy ra sao? → `.qa` **PPL = exp(cross-entropy trung bình).**

## 6. Rút ra
> **Rút ra.** PPL = exp(CE trung bình) = số lựa chọn hiệu dụng; thấp là tốt. Bài tiếp (I5): tinh chỉnh rẻ bằng LoRA.

## 7. `data-q` & số mẫu
- Chọn p token rơi mốc bảng ln; CE trung bình rơi mốc eˣ.
- Khóa: `p1..p3`; `nl1..nl3`, `ce`, `ppl`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| CE trung bình | 0.92 |
| PPL | e^0.92 ≈ 2.51 |
