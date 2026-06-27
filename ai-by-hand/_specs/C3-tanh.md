# SPEC — C3 · Tanh + đạo hàm (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `C3-tanh` · English *Tanh* · ~11 phút.
> Tiền đề: C2 (sigmoid). Dùng bảng tra tanh.

## 1. Định vị
Kích hoạt hình S **đối xứng quanh 0**, ra (−1, 1). Đạo hàm `1 − tanh²`. Hay dùng trong RNN/LSTM (Bài 21, 22).

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Khác sigmoid (tâm 0.5), tanh **canh quanh 0** nên trung bình kích hoạt gần 0 → tín hiệu cân bằng hơn,
  hội tụ nhanh hơn. Là kích hoạt chủ lực trong cổng/trạng thái của LSTM, GRU.
- `.formula`:
  ```
  tanh(z) = (e^z − e^−z)/(e^z + e^−z)      tanh'(z) = 1 − tanh²(z)      tanh ∈ (−1, 1)
  ```

## 3. Trực giác (`.intuition`)
> Giống sigmoid nhưng **đặt giữa ở 0**: âm → kéo về −1, dương → kéo về +1. Nhờ đối xứng, đầu ra "có hướng" (âm/dương) chứ không
> chỉ "mạnh/yếu" như sigmoid.

## 4. Các bước
- **⓪ Cho sẵn + bảng tanh** · pill `tra cứu`: z = 1. Bảng: `tanh(0)=0, tanh(0.5)=0.46, tanh(1)=0.76, tanh(2)=0.96, tanh(−1)=−0.76`. (`.cell.given`)
- **① Giá trị tanh(1)** — `tanh(1) = __` → 0.76. `.why`: ra trong (−1,1), dấu giữ nguyên dấu z → giữ "hướng" tín hiệu.
- **② Đạo hàm** — `tanh'(1) = 1 − 0.76² = 1 − 0.578 = __` → 0.42. `.hint`: dùng chính giá trị tanh, không cần đạo hàm lại.
- **③ Đỉnh đạo hàm** — `tại z=0: 1 − 0² = __` → 1 (lớn nhất); `tại z=2: 1 − 0.96² = __` → 0.078 (đã teo).
  `.why`: đỉnh đạo hàm tanh = 1 (gấp 4 lần sigmoid) → gradient mạnh hơn quanh 0, nhưng vẫn **bão hòa** ở hai biên.
- **④ Hình & so sánh** · pill `vs sigmoid` — SVG: tanh(z) và σ(z) chồng nhau. `.note`: tanh = phiên bản kéo giãn của sigmoid:
  `tanh(z) = 2σ(2z) − 1`. Cả hai vẫn bão hòa → mạng sâu chuộng ReLU (Bài 04).

## 5. Tự kiểm tra (`.quiz`)
1. Miền giá trị của tanh? → `.qa` **(−1, 1).**
2. Đạo hàm tanh lớn nhất bằng? → `.qa` **1 (tại z = 0).**

## 6. Rút ra
> **Rút ra.** tanh = S đối xứng quanh 0, đạo hàm 1 − tanh², đỉnh 1. Mạnh hơn sigmoid quanh 0 nhưng vẫn bão hòa. Bài tiếp (C9):
> đếm tổng tham số một mạng.

## 7. `data-q` & số mẫu
- Chọn z rơi mốc bảng tanh; tính đạo hàm từ giá trị tra.
- Khóa: `z`, `th`, `dth`, `dth0`, `dth2`.

## Phụ lục — số mẫu
| z | tanh | tanh' |
|---|---|---|
| 0 | 0 | 1 |
| 1 | 0.76 | 0.42 |
| 2 | 0.96 | 0.078 |
