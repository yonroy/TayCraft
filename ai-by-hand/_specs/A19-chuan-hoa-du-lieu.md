# SPEC — A19 · Chuẩn hóa dữ liệu: min-max & z-score (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `A19-chuan-hoa-du-lieu` · English *Normalization* · ~12 phút.
> Tiền đề: A2 (chuẩn), A16 (kỳ vọng, phương sai).

## 1. Định vị
Đưa các đặc trưng về **cùng thang đo**: min-max ép vào [0, 1]; z-score canh quanh 0, độ lệch 1. Giúp huấn luyện ổn định,
tránh đặc trưng giá trị lớn lấn át.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Nếu một đặc trưng đo bằng nghìn còn đặc trưng khác bằng phần trăm, gradient sẽ **méo** theo cái lớn.
  Chuẩn hóa đặt mọi đặc trưng lên cùng thước → mạng học cân bằng, hội tụ nhanh. (Cũng là ý của BatchNorm/LayerNorm sau này.)
- `.formula`:
  ```
  min-max:  x' = (x − min) / (max − min) ∈ [0, 1]
  z-score:  x̂ = (x − μ) / σ        (μ = trung bình, σ = độ lệch chuẩn)
  ```

## 3. Trực giác (`.intuition`)
> **Min-max** giống "chấm điểm theo thang 0→1": nhỏ nhất = 0, lớn nhất = 1, còn lại nằm giữa. **Z-score** giống "lệch bao
> nhiêu **độ lệch chuẩn** so với trung bình": 0 = đúng trung bình, +1 = trên một σ, −1 = dưới một σ.

## 4. Các bước
- **⓪ Cho sẵn** · pill `4 số`: dữ liệu = {2, 4, 6, 8}. (`.cell.given`)
- **① Min-max** — `min = 2, max = 8, range = __ (6)`; với x = 4: `(4 − 2)/6 = __` → 0.33; x = 8 → 1; x = 2 → 0.
  `.why`: trừ min để gốc về 0, chia range để trần về 1 → mọi giá trị gói gọn trong [0, 1].
- **② Trung bình & độ lệch chuẩn** — `μ = (2+4+6+8)/4 = __ (5)`; `σ = √(Σ(x−μ)²/n) = √((9+1+1+9)/4) = √5 ≈ __` → 2.24.
  `.hint`: tính phương sai trước (A16), rồi lấy căn ra σ.
- **③ Z-score** — với x = 8: `(8 − 5)/2.24 ≈ __` → +1.34; với x = 2 → −1.34. `.why`: z **không thứ nguyên** → so sánh được
  giữa các đặc trưng khác đơn vị; dấu cho biết trên/dưới trung bình.
- **④ So sánh hai cách** · pill `[0,1] vs quanh 0` — SVG/`.note`: min-max bám hai đầu mút (nhạy ngoại lệ); z-score bám
  trung bình & độ trải (giữ phân phối). Chọn theo bài toán.

## 5. Tự kiểm tra (`.quiz`)
1. Sau min-max, giá trị **nhỏ nhất** và **lớn nhất** thành bao nhiêu? → `.qa` **0 và 1.**
2. Z-score = 0 nghĩa là gì? → `.qa` **Giá trị đúng bằng trung bình μ.**

## 6. Rút ra
> **Rút ra.** Chuẩn hóa đưa đặc trưng về cùng thang để mạng học công bằng; min-max gói vào [0,1], z-score canh quanh 0/σ.
> Bài tiếp (A20): **one-hot** — biến nhãn rời rạc thành vectơ 0/1 để đưa vào mô hình.

## 7. `data-q` & số động
- Sinh tập 4 số nguyên nhỏ (cách đều cho σ đẹp, vd cấp số cộng; nếu muốn σ nguyên chọn 2 điểm `{a, a+4}` → σ = 2, z = ±1).
- Khóa: `d1..d4`, `mn,mx,range`; `mm4` (min-max của một giá trị); `mu, varD, sigma`; `z` của vài giá trị (fmt2).

## Phụ lục — số mẫu
| | Kết quả |
|---|---|
| range | 6 |
| min-max(4) | 0.33 |
| μ | 5 |
| σ | √5 ≈ 2.24 |
| z(8) | ≈ +1.34 |
