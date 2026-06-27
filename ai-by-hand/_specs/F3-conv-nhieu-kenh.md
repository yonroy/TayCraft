# SPEC — F3 · Conv nhiều kênh (RGB) (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `F3-conv-nhieu-kenh` · English *Multi-channel conv* · ~13 phút.
> Tiền đề: 16 (một bộ lọc), 01 (tích vô hướng).

## 1. Định vị
Ảnh thật có **nhiều kênh** (R, G, B). Một bộ lọc có **chiều sâu khớp số kênh**; conv = nhân-cộng trên **mọi kênh** rồi cộng lại + bias.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Đặc trưng thật (màu, kết cấu) nằm **xuyên kênh**. Một filter phải nhìn cả 3 kênh cùng lúc → mỗi filter là
  một khối 3D. Hiểu điều này là hiểu vì sao "số kênh đầu vào" quyết định độ dày kernel.
- `.formula`:
  ```
  out(i,j) = Σ_c Σ_{u,v} K_c(u,v)·X_c(i+u, j+v) + b      (c chạy qua các kênh)
  ```

## 3. Trực giác (`.intuition`)
> Filter như một **chồng 3 tấm kính** (một tấm cho mỗi kênh). Áp lên cùng vị trí: mỗi tấm chấm điểm kênh của nó (tích vô hướng cục
> bộ), rồi **cộng cả ba** thành **một số** ở bản đồ đặc trưng. 3 kênh vào → **1** kênh ra cho mỗi filter.

## 4. Các bước
- **⓪ Cho sẵn** · pill `3 kênh, kernel 2×2`: patch R=[[1,2],[0,1]], G=[[2,0],[1,1]], B=[[0,1],[2,0]]; kernel K_R=K_G=K_B=[[1,0],[0,1]] (đường chéo), b=0. (`.cell.given`)
- **① Conv kênh R** — `1·1 + 2·0 + 0·0 + 1·1 = __` → 2. `.why`: chỉ là tích vô hướng giữa kernel và patch của kênh đó (Bài 01).
- **② Conv kênh G & B** — `G: 2·1+0+0+1·1 = __ (3) ; B: 0·1+0+0+0·1 = __` → 0. `.hint`: làm độc lập từng kênh trước khi cộng.
- **③ Cộng các kênh + bias** — `out = 2 + 3 + 0 + b = __` → 5. `.why`: gộp bằng chứng từ mọi kênh thành **một** giá trị → một điểm trên feature map.
- **④ Độ sâu filter** · pill `Cin quyết định` — `.note`: filter luôn có **chiều sâu = số kênh vào** (ở đây 3); nhiều filter → nhiều kênh ra (Bài F4).
  Tham số một filter = K·K·Cin + 1 (Bài F10). SVG: 3 lát kênh + 3 kernel → 1 ô ra.

## 5. Tự kiểm tra (`.quiz`)
1. Một filter conv trên ảnh RGB có độ sâu bao nhiêu? → `.qa` **3 (bằng số kênh vào).**
2. 3 kênh vào, 1 filter → mấy kênh ra? → `.qa` **1 (cộng các kênh thành một feature map).**

## 6. Rút ra
> **Rút ra.** Conv đa kênh = conv từng kênh rồi cộng + bias; độ sâu filter = số kênh vào, mỗi filter ra 1 kênh. Bài tiếp (F4): nhiều
> filter → nhiều feature map.

## 7. `data-q` & số mẫu
- Sinh patch 3 kênh & kernel nhỏ; tính conv mỗi kênh rồi cộng.
- Khóa: patch & kernel; `convR, convG, convB`, `out`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| conv R, G, B | 2, 3, 0 |
| out (cộng) | 5 |
