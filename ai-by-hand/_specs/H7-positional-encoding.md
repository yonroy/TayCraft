# SPEC — H7 · Positional Encoding sin/cos (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `H7-positional-encoding` · English *Positional Encoding* · ~13 phút.
> Tiền đề: 19 (embedding), H1 (attention). Dùng bảng sin/cos.

## 1. Định vị
Attention **không có thứ tự** sẵn → phải **bơm vị trí** vào embedding bằng các sóng sin/cos nhiều tần số.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Với attention, "mèo đuổi chuột" và "chuột đuổi mèo" trông như nhau nếu không có vị trí. PE thêm "dấu vị
  trí" để mô hình phân biệt thứ tự — bằng sóng nhiều tần số nên mọi vị trí có mã **duy nhất** và **so sánh được**.
- `.formula`:
  ```
  PE(pos, 2i)   = sin( pos / 10000^(2i/d) )
  PE(pos, 2i+1) = cos( pos / 10000^(2i/d) )
  ```

## 3. Trực giác (`.intuition`)
> Như **kim đồng hồ nhiều tốc độ**: chiều chẵn dùng sin, chiều lẻ dùng cos; chiều đầu quay nhanh (phân biệt vị trí gần), chiều
> sau quay chậm (phân biệt vị trí xa). Bộ góc kim tạo "vân tay" riêng cho từng vị trí.

## 4. Các bước
- **⓪ Cho sẵn + bảng sin/cos** · pill `d=4`: tính PE cho vị trí pos=1. Tần số: i=0 → góc = pos·1 (rad); i=1 → góc = pos·0.01.
  Bảng (≈): sin(1)=0.84, cos(1)=0.54, sin(0.01)=0.01, cos(0.01)=1.00. (`.cell.given`)
- **① Chiều 0,1 (tần số cao)** — `PE(1,0)=sin(1)= __ (0.84) ; PE(1,1)=cos(1)= __` → 0.54. `.why`: chiều tần số cao đổi nhanh giữa các vị trí kề → phân biệt vị trí gần.
- **② Chiều 2,3 (tần số thấp)** — `PE(1,2)=sin(0.01)= __ (0.01) ; PE(1,3)=cos(0.01)= __` → 1.00. `.hint`: chiều tần số thấp gần như đứng yên → mã hóa vị trí trên thang dài.
- **③ Vectơ PE** — `PE(1) = (0.84, 0.54, 0.01, 1.00)`; cộng vào embedding token. `.why`: mỗi vị trí có một vectơ **duy nhất**; vị trí gần → PE gần (mô hình suy ra khoảng cách).
- **④ Vì sao sin/cos** · pill `tương đối` — `.note`: nhờ công thức cộng góc, PE(pos+k) là **phép quay tuyến tính** của PE(pos) → mô hình học được vị trí **tương đối**. Học/cố định đều dùng được. SVG: vài sóng sin tần số khác nhau theo pos.

## 5. Tự kiểm tra (`.quiz`)
1. Vì sao attention cần positional encoding? → `.qa` **Attention không có thứ tự sẵn — phải bơm vị trí vào.**
2. Chiều tần số cao vs thấp khác gì? → `.qa` **Cao: đổi nhanh (vị trí gần); thấp: đổi chậm (thang dài).**

## 6. Rút ra
> **Rút ra.** PE = sóng sin/cos nhiều tần số cộng vào embedding → mã vị trí duy nhất, suy ra được khoảng cách tương đối. Bài tiếp
> (H8): RoPE — nhúng vị trí bằng phép **quay** trực tiếp lên Q, K.

## 7. `data-q` & số mẫu
- Cho bảng sin/cos cố định tại các góc tính từ pos; chọn pos nhỏ.
- Khóa: `pos`; `pe0, pe1, pe2, pe3`.

## Phụ lục — số mẫu (pos=1, d=4)
| chiều | PE |
|---|---|
| 0 (sin 1) | 0.84 |
| 1 (cos 1) | 0.54 |
| 2 (sin .01) | 0.01 |
| 3 (cos .01) | 1.00 |
