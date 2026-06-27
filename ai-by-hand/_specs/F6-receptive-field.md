# SPEC — F6 · Receptive field (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `F6-receptive-field` · English *Receptive field* · ~12 phút.
> Tiền đề: F2 (kích thước conv), F5 (pooling).

## 1. Định vị
**Vùng ảnh gốc** mà một nơ-ron sâu "nhìn thấy". Chồng nhiều conv nhỏ → tầm nhìn lớn dần mà ít tham số.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Để nhận diện vật lớn, nơ-ron phải "thấy" đủ rộng. Receptive field cho biết kiến trúc đã nhìn đủ ngữ cảnh
  chưa. Mẹo VGG: nhiều conv 3×3 thay một conv lớn → cùng tầm nhìn, **ít tham số hơn, phi tuyến nhiều hơn**.
- `.formula`:
  ```
  RF₁ = K      RF_l = RF_{l−1} + (K_l − 1)·∏(stride trước đó)    (stride 1: RF cộng K−1 mỗi lớp)
  ```

## 3. Trực giác (`.intuition`)
> Mỗi lớp conv cho nơ-ron "ghé mắt" rộng thêm. Nơ-ron lớp 2 nhìn 3×3 đầu ra lớp 1, mà **mỗi** ô đó lại tóm 3×3 của ảnh → tổng cộng
> nó **gián tiếp** thấy một vùng to hơn. Càng sâu, tầm nhìn càng rộng.

## 4. Các bước
- **⓪ Cho sẵn** · pill `conv 3×3, stride 1`: chồng 3 lớp conv 3×3 không pad. (`.cell.given`)
- **① Sau lớp 1** — `RF = K = __` → 3 (nhìn 3×3 ảnh gốc). `.why`: một nơ-ron lớp 1 chỉ thấy đúng cửa sổ kernel.
- **② Sau lớp 2** — `RF = 3 + (3−1)·1 = __` → 5. `.hint`: mỗi lớp stride-1 cộng thêm K−1 = 2 vào tầm nhìn.
- **③ Sau lớp 3** — `RF = 5 + (3−1)·1 = __` → 7 → ba conv 3×3 nhìn **7×7**. `.why`: bằng tầm nhìn một conv 7×7 nhưng dùng 3·9=27 trọng số thay vì 49.
- **④ Stride/pooling nở nhanh** · pill `nhân jump` — `.note`: lớp stride-2 hay pooling **nhân đôi "bước nhảy"** → RF nở theo cấp số nhân, giúp mạng sâu thấy
  cả ảnh. SVG: 3 lưới chồng, vùng 7×7 tô màu ở ảnh gốc.

## 5. Tự kiểm tra (`.quiz`)
1. Hai conv 3×3 nối tiếp có receptive field bao nhiêu? → `.qa` **5×5.**
2. Vì sao chuộng nhiều conv 3×3 hơn một conv lớn? → `.qa` **Cùng tầm nhìn, ít tham số hơn & nhiều phi tuyến hơn.**

## 6. Rút ra
> **Rút ra.** RF lớn dần khi chồng lớp (stride/pool nở nhanh); 3×3 xếp chồng = tầm nhìn lớn, rẻ. Bài tiếp (F7): conv 1×1 trộn kênh.

## 7. `data-q` & số mẫu
- Sinh K và số lớp; tính RF lũy tiến.
- Khóa: `K`, `nlayer`; `rf1, rf2, rf3`.

## Phụ lục — số mẫu (3×3, stride 1)
| lớp | RF |
|---|---|
| 1 | 3 |
| 2 | 5 |
| 3 | 7 |
