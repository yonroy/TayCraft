# SPEC — F7 · Conv 1×1 (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `F7-conv-1x1` · English *1×1 conv* · ~11 phút.
> Tiền đề: F3 (conv đa kênh), 03 (lớp tuyến tính).

## 1. Định vị
Conv kernel **1×1**: không trộn không gian, chỉ **trộn kênh** tại mỗi pixel. = một lớp tuyến tính áp cho từng pixel → đổi số kênh.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** 1×1 conv là cách **giảm/tăng số kênh** rẻ tiền (bottleneck trong ResNet, Inception) và **trộn thông tin
  giữa các kênh**. Nó cho mạng "nén đặc trưng" trước các conv đắt → tiết kiệm tính toán lớn.
- `.formula`:
  ```
  out_k(pixel) = Σ_c W[k,c]·X_c(pixel) + b_k      (Cin → Cout, không nhìn lân cận)
  ```

## 3. Trực giác (`.intuition`)
> Tại **mỗi pixel**, có Cin con số (một cho mỗi kênh). Conv 1×1 = một **lớp fully-connected nhỏ** trộn Cin số đó thành Cout số mới.
> Không nhìn hàng xóm, chỉ "phối lại màu/đặc trưng" theo chiều sâu.

## 4. Các bước
- **⓪ Cho sẵn** · pill `Cin=3 → Cout=2`: một pixel có 3 kênh x = (2, 4, 6); hai filter 1×1: w₁ = (1, 0, 1), w₂ = (0, 1, 0); b = 0. (`.cell.given`)
- **① Kênh ra 1** — `w₁·x = 1·2 + 0·4 + 1·6 = __` → 8. `.why`: đúng một tích vô hướng qua chiều kênh — không đụng pixel lân cận.
- **② Kênh ra 2** — `w₂·x = 0·2 + 1·4 + 0·6 = __` → 4. `.hint`: mỗi filter 1×1 = một "công thức trộn kênh".
- **③ Đầu ra pixel** — `(__, __)` → (8, 4): từ 3 kênh xuống **2 kênh**. `.why`: 1×1 đổi độ sâu Cin→Cout mà giữ nguyên kích thước không gian.
- **④ Bottleneck** · pill `nén rồi xử lý` — `.note`: ResNet dùng 1×1 **hạ kênh** (vd 256→64) → conv 3×3 trên 64 (rẻ) → 1×1 **nâng lại** 256. Giảm tính toán
  nhiều lần. SVG: cột 3 kênh → ô trộn → cột 2 kênh tại một pixel.

## 5. Tự kiểm tra (`.quiz`)
1. Conv 1×1 trộn theo chiều nào? → `.qa` **Chiều kênh (không trộn không gian).**
2. Công dụng chính của 1×1 conv? → `.qa` **Đổi số kênh (giảm/tăng) & trộn kênh — bottleneck rẻ.**

## 6. Rút ra
> **Rút ra.** Conv 1×1 = lớp tuyến tính theo kênh tại mỗi pixel; đổi độ sâu, trộn kênh, làm bottleneck. Bài tiếp (F8): phóng to ảnh —
> transposed conv.

## 7. `data-q` & số mẫu
- Sinh vectơ kênh x (Cin) + vài filter 1×1; tính từng kênh ra.
- Khóa: `x1..x3`, filter; `o1, o2`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| kênh ra 1 | 8 |
| kênh ra 2 | 4 |
| pixel ra | (8, 4) |
