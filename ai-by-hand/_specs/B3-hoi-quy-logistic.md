# SPEC — B3 · Hồi quy logistic 1 bước (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `B3-hoi-quy-logistic` · English *Logistic regression* · ~13 phút.
> Tiền đề: B2, A18 (exp/log), A17 (Bernoulli). Dùng bảng tra σ.

## 1. Định vị
Biến điểm tuyến tính thành **xác suất** qua sigmoid, rồi đo sai bằng **BCE**. Là bộ phân loại nhị phân — và đúng một nơ-ron có σ.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Phân loại "có/không" cần đầu ra trong [0,1]. Sigmoid ép điểm thô z về xác suất; BCE phạt khi xác
  suất lệch nhãn. Đây là viên gạch của mọi bộ phân loại và của nơ-ron đầu ra nhị phân.
- `.formula`:
  ```
  z = w·x + b      p = σ(z) = 1/(1+e^−z)      BCE = −[y·ln p + (1−y)·ln(1−p)]
  gradient:  ∂L/∂z = p − y
  ```

## 3. Trực giác (`.intuition`)
> Sigmoid là **cái nén** hình chữ S: điểm rất âm → ~0, rất dương → ~1, quanh 0 → ~0.5 (lưỡng lự). p là "độ tin" mô hình
> nghĩ mẫu thuộc lớp 1.

## 4. Các bước
- **⓪ Cho sẵn + bảng σ** · pill `tra cứu`: w = 0.5, x = 2, b = 0, nhãn y = 1. Bảng: `σ(0)=0.5, σ(1)=0.73, σ(2)=0.88, σ(−1)=0.27`. (`.cell.given`)
- **① Điểm tuyến tính z** — `z = 0.5·2 + 0 = __` → 1. `.why`: phần tuyến tính y hệt B2; sigmoid chỉ thêm "ép về xác suất".
- **② Xác suất p** — tra bảng: `p = σ(1) = __` → 0.73. `.hint`: σ luôn trong (0,1), không bao giờ chạm 0/1.
- **③ BCE loss** — `y=1 → L = −ln p = −ln(0.73) = __` → 0.31. `.why`: nhãn 1 nên chỉ còn −ln p; p càng gần 1 loss càng nhỏ.
- **④ Gradient & cập nhật** · pill `p − y` — `∂L/∂z = p − y = 0.73 − 1 = __ (−0.27)`; `∂L/∂w = (p−y)·x = __` → −0.54.
  `.note`: dạng `p − y` cực gọn — lý do người ta ghép sigmoid với BCE (giống softmax + CE, Bài D9).

## 5. Tự kiểm tra (`.quiz`)
1. Đầu ra sigmoid nằm trong khoảng nào? → `.qa` **(0, 1) — một xác suất.**
2. Vì sao gradient ra gọn `p − y`? → `.qa` **Sigmoid + BCE triệt tiêu phần phức tạp khi lấy đạo hàm.**

## 6. Rút ra
> **Rút ra.** Logistic = tuyến tính → sigmoid → BCE, gradient gọn `p − y`. Đây là một nơ-ron phân loại hoàn chỉnh. Bài tiếp
> (B4): một bộ phân loại **không cần học tham số** — k-NN.

## 7. `data-q` & số mẫu
- Chọn z rơi đúng mốc trong bảng σ (vd z ∈ {−1,0,1,2}); w, x, b sao cho z đẹp; nhãn y ∈ {0,1}.
- Khóa: `w,x,b,y`; `z`, `p`, `bce`, `dz`, `dw`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| z | 1 |
| p = σ(1) | 0.73 |
| BCE | 0.31 |
| p − y | −0.27 |
