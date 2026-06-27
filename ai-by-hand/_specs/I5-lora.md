# SPEC — I5 · LoRA — cập nhật hạng thấp (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `I5-lora` · English *LoRA* · ~13 phút.
> Tiền đề: 02 (nhân ma trận), B6 (hạng/PCA), C9 (đếm tham số).

## 1. Định vị
Tinh chỉnh mô hình lớn mà **không sửa W gốc**: học thêm `ΔW = B·A` **hạng thấp** (ít tham số) rồi cộng vào. Fine-tune rẻ.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Fine-tune cả tỉ tham số rất tốn. LoRA giả định cập nhật cần thiết là **hạng thấp** → chỉ học hai ma trận
  nhỏ B, A (đóng băng W). Giảm tham số huấn luyện hàng trăm lần, lưu nhiều "adapter" cho nhiều việc.
- `.formula`:
  ```
  W' = W + ΔW,  ΔW = B·A   (B: d×r, A: r×d, r ≪ d)
  Tham số học: 2·d·r  (thay vì d²)
  ```

## 3. Trực giác (`.intuition`)
> Thay vì viết lại cả cuốn sách (W), LoRA dán một **tờ ghi chú mỏng** (B·A hạng r) lên trên. Vì cú "điều chỉnh" thường đơn giản
> (hạng thấp), tờ ghi chú nhỏ là đủ — và gỡ ra/đổi tờ khác dễ dàng.

## 4. Các bước
- **⓪ Cho sẵn** · pill `d=4, r=1`: B = (1, 0, 2, 1)ᵀ (4×1), A = (1, 0, 1, 0) (1×4); W gốc đóng băng. (`.cell.given`)
- **① Một phần tử ΔW** — `ΔW[i][j] = B[i]·A[j]`: `ΔW[0][0]=1·1=__ (1) ; ΔW[2][0]=2·1=__ (2) ; ΔW[0][1]=1·0=__` → 0. `.why`: ΔW là tích ngoài B·A → mọi hàng là bội của A → **hạng 1**.
- **② Đếm tham số** — LoRA: `2·d·r = 2·4·1 = __ (8)`; full: `d² = 16`. `.hint`: tỉ lệ 8/16; với d lớn (vd 4096) tỉ lệ giảm cực mạnh.
- **③ Áp dụng** — `W' = W + ΔW`; lúc suy luận **gộp** vào W (không thêm chi phí). `.why`: W gốc nguyên vẹn → đổi adapter khác là đổi việc khác, không phá mô hình nền.
- **④ Vì sao hạng thấp đủ** · pill `r ≪ d` — `.note`: nghiên cứu cho thấy cập nhật fine-tune nằm trong không gian **chiều thấp** → r nhỏ (4–64) đủ. Tiết kiệm bộ nhớ huấn luyện & lưu trữ. SVG: W lớn + (B cột)×(A hàng) mỏng.

## 5. Tự kiểm tra (`.quiz`)
1. LoRA học gì, giữ gì? → `.qa` **Học B, A hạng thấp; giữ (đóng băng) W gốc.**
2. Vì sao tiết kiệm tham số? → `.qa` **2·d·r ≪ d² khi r nhỏ.**

## 6. Rút ra
> **Rút ra.** LoRA = W + B·A hạng thấp, đóng băng W → fine-tune rẻ, adapter gọn. Bài tiếp (I6): nén mô hình bằng quantization int8.

## 7. `data-q` & số mẫu
- Sinh B (d×1), A (1×d) nguyên nhỏ; tính vài phần tử ΔW & đếm tham số.
- Khóa: `B`, `A`; `dw00, dw20, dw01`; `loraP`, `fullP`.

## Phụ lục — số mẫu (d=4, r=1)
| | KQ |
|---|---|
| ΔW[0][0] | 1 |
| ΔW[2][0] | 2 |
| tham số LoRA / full | 8 / 16 |
