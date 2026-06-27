# SPEC — F2 · Kích thước đầu ra (stride, padding) (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `F2-kich-thuoc-dau-ra` · English *Conv output size* · ~12 phút.
> Tiền đề: 16 (một bộ lọc conv). Mở đầu Phần F (CNN).

## 1. Định vị
Tính **kích thước bản đồ đặc trưng** sau một lớp conv theo kernel K, padding P, stride S. Kỹ năng "đọc kiến trúc CNN".

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Thiết kế CNN phải biết mỗi lớp **thu nhỏ ảnh** bao nhiêu để khớp lớp sau và lớp fully-connected cuối. Sai
  một ô là vỡ cả mạng. Công thức này lặp ở mọi lớp conv/pool.
- `.formula`:
  ```
  out = ⌊ (W − K + 2P) / S ⌋ + 1      ("same" padding: P = (K−1)/2 giữ nguyên kích thước khi S=1)
  ```

## 3. Trực giác (`.intuition`)
> Cửa sổ kernel **trượt** trên ảnh: padding **viền thêm 0** quanh mép (giữ thông tin biên, không co quá nhanh); stride là **bước
> nhảy** mỗi lần trượt (bước to → ra nhỏ). Đếm số vị trí đặt được cửa sổ = kích thước đầu ra.

## 4. Các bước
- **⓪ Cho sẵn** · pill `W=5, K=3`: ảnh 5×5, kernel 3×3. (`.cell.given`)
- **① Không pad, stride 1** — `(5 − 3 + 0)/1 + 1 = __` → 3 → ra **3×3**. `.why`: cửa sổ 3 đặt được 3 vị trí trên hàng 5 → mất viền ngoài.
- **② Same padding (P=1), stride 1** — `(5 − 3 + 2)/1 + 1 = __` → 5 → ra **5×5** (giữ nguyên). `.hint`: P=(K−1)/2=1 đắp lại đúng phần biên bị mất.
- **③ Stride 2 (P=1)** — `(5 − 3 + 2)/2 + 1 = 4/2 + 1 = __` → 3 → ra **3×3**. `.why`: bước nhảy 2 lấy mẫu thưa → **giảm kích thước ~½** (downsample).
- **④ Vì sao quan trọng** · pill `khớp chiều` — `.note`: chồng nhiều lớp stride-2 để thu nhỏ dần (224→112→56…); phải tính đúng để nối feature map
  với lớp sau. SVG: cửa sổ trượt trên lưới 5×5 với/không padding.

## 5. Tự kiểm tra (`.quiz`)
1. "Same padding" làm gì? → `.qa` **Giữ kích thước đầu ra = đầu vào (khi S=1).**
2. Tăng stride ảnh hưởng kích thước ra sao? → `.qa` **Giảm (lấy mẫu thưa → downsample).**

## 6. Rút ra
> **Rút ra.** out = ⌊(W−K+2P)/S⌋+1; padding giữ biên, stride thu nhỏ. Bài tiếp (F3): conv trên ảnh **nhiều kênh** (RGB).

## 7. `data-q` & số mẫu
- Sinh W, K, P, S sao cho phép chia chẵn (số nguyên đẹp); tính out cho vài tổ hợp.
- Khóa: `W, K`; `out00`, `outSame`, `outStride2`.

## Phụ lục — số mẫu (W=5, K=3)
| P, S | out |
|---|---|
| 0, 1 | 3 |
| 1, 1 | 5 |
| 1, 2 | 3 |
