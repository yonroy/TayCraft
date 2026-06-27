# SPEC — D1 · MSE / MAE (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `D1-mse-mae` · English *MSE / MAE* · ~12 phút.
> Tiền đề: B1/B2 (hồi quy). Mở đầu Phần D (loss & tối ưu, K2).

## 1. Định vị
Hai hàm mất mát cho **hồi quy**: MSE (bình phương) và MAE (trị tuyệt đối). Loss là "thước chấm điểm" để mạng học.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Mạng học bằng cách **giảm loss**. Chọn loss = chọn cách phạt sai. MSE phạt mạnh sai lớn (nhạy ngoại lệ),
  MAE phạt đều (bền với ngoại lệ). Hiểu khác biệt để chọn đúng cho bài toán.
- `.formula`:
  ```
  MSE = (1/m) Σ (ŷ − y)²      MAE = (1/m) Σ |ŷ − y|
  ```

## 3. Trực giác (`.intuition`)
> MSE như **phạt theo bình phương khoảng cách**: lệch gấp đôi thì phạt gấp bốn → rất ghét sai lớn. MAE phạt **tuyến tính**: lệch
> gấp đôi phạt gấp đôi → công bằng với ngoại lệ hơn.

## 4. Các bước
- **⓪ Cho sẵn** · pill `3 mẫu`: y = (2, 4, 6), dự đoán ŷ = (3, 4, 4). (`.cell.given`)
- **① Sai số từng mẫu** — `ŷ − y = (1, 0, −2)`. `.why`: loss đều bắt đầu từ phần dư (sai số) mỗi mẫu.
- **② MSE** — `(1² + 0² + (−2)²)/3 = (1+0+4)/3 = __` → 1.67. `.hint`: bình phương bỏ dấu & phóng đại sai lớn (mẫu thứ 3 đóng góp 4/5 loss).
- **③ MAE** — `(|1| + |0| + |−2|)/3 = 3/3 = __` → 1. `.why`: MAE coi sai 2 chỉ "gấp đôi" sai 1 → ngoại lệ ít lấn át.
- **④ Đạo hàm (vì sao chọn MSE để học)** · pill `gradient` — `∂MSE/∂ŷᵢ = (2/m)(ŷᵢ−y)` (trơn, tỉ lệ sai số); `∂MAE/∂ŷᵢ = ±1/m` (hằng,
  gãy tại 0). `.note`: MSE cho gradient **mượt** dễ tối ưu; MAE bền ngoại lệ nhưng gradient không đổi độ lớn. SVG: hai đường loss theo sai số.

## 5. Tự kiểm tra (`.quiz`)
1. Loss nào nhạy ngoại lệ hơn? → `.qa` **MSE (bình phương phạt mạnh sai lớn).**
2. Vì sao MSE tiện cho gradient descent? → `.qa` **Gradient trơn, tỉ lệ với sai số (không gãy như MAE).**

## 6. Rút ra
> **Rút ra.** MSE phạt bình phương (nhạy ngoại lệ, gradient mượt); MAE phạt tuyến tính (bền hơn). Bài tiếp (D2): loss cho **phân
> loại nhị phân** — Binary Cross-Entropy.

## 7. `data-q` & số mẫu
- Sinh y, ŷ nguyên nhỏ; sai số nhỏ để bình phương đẹp.
- Khóa: `y1..y3, p1..p3`; `e1..e3`; `mse`, `mae`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| sai số | (1, 0, −2) |
| MSE | 1.67 |
| MAE | 1 |
