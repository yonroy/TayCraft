# SPEC — G1 · Embedding & Positional (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `19-embedding-vitri` · English *Embedding & Positional* · ~12 phút.
> Tiền đề: A20 (one-hot), H7 (positional). **Đã có phiếu** — spec để nâng cấp/tái tạo.

## 1. Định vị
Biến **token id** thành **vectơ học được** (tra bảng embedding), rồi **cộng vị trí** (PE) để mô hình biết cả "từ gì" và "ở đâu".

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Mô hình cần số thực, không phải id rời rạc. Embedding là **bảng tra** gán mỗi token một vectơ ngữ nghĩa (học
  trong huấn luyện); cộng PE thêm thứ tự. Đây là **cửa vào** của mọi Transformer.
- `.formula`:
  ```
  one-hot(id) · E = hàng id của bảng E        đầu vào = Embedding(token) + PE(pos)
  ```

## 3. Trực giác (`.intuition`)
> Bảng embedding là **từ điển vectơ**: mỗi token một dòng. "Tra" = nhân one-hot với bảng = lấy đúng dòng. Token nghĩa gần nhau → vectơ
> gần nhau. PE thêm "dấu vị trí" để phân biệt thứ tự.

## 4. Các bước
- **⓪ Cho sẵn** · pill `vocab 3, d=2`: bảng E = [[0.2,0.1],[0.5,0.3],[0.4,0.9]] (token 0,1,2); câu: token id = 2 ở vị trí pos=1; PE(1) = (0.1, 0.0). (`.cell.given`)
- **① Tra embedding** — `Embedding(2) = hàng 2 của E = (__, __)` → (0.4, 0.9). `.why`: tra bảng = nhân one-hot(2)·E = lấy dòng 2; rẻ và học được.
- **② Cộng vị trí** — `đầu vào = (0.4,0.9) + PE(1) = (0.4+0.1, 0.9+0.0) = (__, __)` → (0.5, 0.9). `.hint`: cùng token ở vị trí khác → đầu vào khác (nhờ PE).
- **③ Vì sao cộng (không nối)** — cộng giữ nguyên chiều d → khối sau không phình. `.why`: PE và embedding cùng chiều → cộng là cách rẻ để hợp nhất "nghĩa" và "vị trí".
- **④ Embedding học được** · pill `huấn luyện` — `.note`: bảng E là **tham số** (cập nhật bằng backprop); thường **chia sẻ** với lớp đầu ra (tie weights). Token gần nghĩa → vectơ gần (đo bằng cosine, A4). SVG: id → tra dòng → ⊕ PE.

## 5. Tự kiểm tra (`.quiz`)
1. "Tra embedding" tương đương phép gì? → `.qa` **Nhân one-hot với bảng E (lấy đúng dòng id).**
2. Vì sao cộng PE thay vì nối? → `.qa` **Giữ nguyên chiều d → khối sau không phình; hợp nhất nghĩa + vị trí.**

## 6. Rút ra
> **Rút ra.** Embedding = bảng tra vectơ học được; + PE cho thứ tự → đầu vào Transformer. Bài tiếp (24): nén & sinh bằng autoencoder/VAE.

## 7. `data-q` & số mẫu
- Sinh bảng E nhỏ (bội 0.1), chọn token id & pos; tra + cộng PE.
- Khóa: bảng E, `id`, `pos`; `emb1,emb2`, `in1,in2`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| Embedding(2) | (0.4, 0.9) |
| + PE(1) | (0.5, 0.9) |
