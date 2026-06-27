# SPEC — F4 · Nhiều bộ lọc → nhiều feature map (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `F4-nhieu-bo-loc` · English *Multiple filters* · ~12 phút.
> Tiền đề: F3 (conv đa kênh).

## 1. Định vị
Một lớp conv có **nhiều filter**, mỗi filter dò một mẫu riêng → tạo **một feature map riêng**. Số filter = số kênh ra.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Một filter chỉ bắt **một loại** đặc trưng (cạnh dọc, đốm màu…). Để mô tả ảnh phong phú cần **nhiều** filter
  song song. Đây là lý do feature map "dày" lên qua các lớp (3 → 64 → 128…).
- `.formula`:
  ```
  Cin kênh vào, F filter → Cout = F kênh ra
  Mỗi filter: khối (K×K×Cin) → một feature map (H'×W')
  ```

## 3. Trực giác (`.intuition`)
> Như một **bộ thám tử**, mỗi người chuyên một dấu vết (cạnh ngang, góc, màu đỏ…). Cùng quét một ảnh, mỗi thám tử nộp **một bản đồ
> "thấy ở đâu"**. Xếp các bản đồ lại → khối đặc trưng nhiều kênh cho lớp sau.

## 4. Các bước
- **⓪ Cho sẵn** · pill `2 filter`: cùng patch (1 kênh) P=[[1,2],[0,1]]; filter A=[[1,0],[0,1]] (chéo), filter B=[[0,1],[1,0]] (chéo ngược); b=0. (`.cell.given`)
- **① Feature map từ filter A** — `1·1+2·0+0·0+1·1 = __` → 2. `.why`: A dò mẫu "đường chéo chính".
- **② Feature map từ filter B** — `1·0+2·1+0·1+1·0 = __` → 2. `.hint`: cùng patch nhưng kernel khác → **đặc trưng khác**.
- **③ Xếp chồng đầu ra** — đầu ra tại vị trí này = vectơ `(__, __)` theo kênh → (2, 2) (độ sâu = số filter). `.why`: mỗi filter cho một lát; chồng lại → khối Cout kênh.
- **④ Độ dày tăng dần** · pill `Cin → Cout` — `.note`: lớp tiếp theo coi Cout kênh này là "ảnh nhiều kênh" mới (F3 lặp lại). CNN sâu: ảnh thu nhỏ về
  không gian nhưng **dày lên về kênh** (đặc trưng trừu tượng dần). SVG: 1 ảnh → F kernel → F feature map xếp chồng.

## 5. Tự kiểm tra (`.quiz`)
1. Số feature map đầu ra của một lớp conv = ? → `.qa` **Số filter (= Cout).**
2. Vì sao cần nhiều filter? → `.qa` **Mỗi filter bắt một loại đặc trưng → mô tả ảnh phong phú.**

## 6. Rút ra
> **Rút ra.** F filter → F feature map (Cout = F); CNN dày lên về kênh qua các lớp. Bài tiếp (F5): thu nhỏ không gian bằng pooling.

## 7. `data-q` & số mẫu
- Sinh patch + 2–3 kernel khác nhau; tính feature map mỗi filter tại một vị trí.
- Khóa: patch, kernel A/B; `outA, outB`.

## Phụ lục — số mẫu
| filter | giá trị |
|---|---|
| A (chéo) | 2 |
| B (chéo ngược) | 2 |
| đầu ra (2 kênh) | (2, 2) |
