# SPEC — I1 · Tokenization / BPE (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `I1-bpe-tokenization` · English *BPE* · ~13 phút.
> Tiền đề: A20 (one-hot/nhãn rời rạc). Mở đầu Phần I (LLM, K3).

## 1. Định vị
**Byte Pair Encoding**: gộp dần **cặp ký tự hay đi cùng** thành token mới → từ điển con-từ cân bằng giữa ký tự và từ.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** LLM không đọc chữ thô; nó đọc **token**. Từ điển toàn từ thì quá lớn & gặp từ lạ; toàn ký tự thì chuỗi
  quá dài. BPE học từ điển con-từ: từ phổ biến thành một token, từ hiếm tách thành mảnh → xử lý mọi văn bản.
- `.formula`:
  ```
  Lặp: đếm mọi cặp liền kề → gộp cặp tần số cao nhất thành 1 token → cập nhật → lặp tới đủ K token
  ```

## 3. Trực giác (`.intuition`)
> Bắt đầu từ **chữ cái**, BPE liên tục "dán" hai mảnh hay đứng cạnh nhau thành một mảnh lớn hơn. Cặp xuất hiện nhiều nhất được
> dán trước → các âm tiết/từ phổ biến dần thành một token, từ hiếm vẫn ghép được từ mảnh.

## 4. Các bước
- **⓪ Cho sẵn** · pill `kho nhỏ`: các "từ" (đã tách ký tự, kèm tần số): `l o w` ×5, `l o w e r` ×2, `n e w` ×6. (`.cell.given`)
- **① Đếm cặp liền kề** — `(l,o): 5+2 = __ (7) ; (o,w): 5+2 = __ (7) ; (n,e): __ (6) ; (e,w): __ (6) ; (w,e): __` → 2. `.why`: tần số cặp = tổng tần số các từ chứa cặp đó.
- **② Gộp cặp cao nhất** — cao nhất = (l,o) hoặc (o,w) = 7 → gộp `(l,o) → "lo"`. `.hint`: hòa thì chọn theo quy ước (vd cặp xuất hiện trước).
- **③ Cập nhật & lặp** — giờ `low` = `lo w`; đếm lại: `(lo,w): __` → 7 → gộp tiếp `(lo,w) → "low"`. `.why`: sau vài vòng, "low" thành **một token** vì nó phổ biến.
- **④ Cân bằng độ dài/từ điển** · pill `con-từ` — `.note`: dừng khi đạt K token. Token "low" gặp lại chỉ tốn 1 đơn vị; từ lạ như "lowest" tách `low` + `est`. SVG: cây gộp ký tự → con-từ.

## 5. Tự kiểm tra (`.quiz`)
1. BPE gộp cặp theo tiêu chí gì? → `.qa` **Tần số xuất hiện cao nhất.**
2. Vì sao không dùng từ điển toàn từ? → `.qa` **Quá lớn & không xử lý được từ lạ (OOV).**

## 6. Rút ra
> **Rút ra.** BPE = lặp gộp cặp tần số cao → từ điển con-từ; phổ biến thành 1 token, hiếm ghép từ mảnh. Bài tiếp (I2): từ logits ra
> token bằng softmax + lấy mẫu.

## 7. `data-q` & số mẫu
- Sinh vài từ + tần số nhỏ; đếm cặp; chọn max; mô phỏng 1–2 vòng gộp.
- Khóa: tần số từ; `clo, cow, cne, cew`; cặp gộp; đếm sau vòng 1.

## Phụ lục — số mẫu
| cặp | tần số |
|---|---|
| (l,o) | 7 |
| (o,w) | 7 |
| (n,e) | 6 |
| → gộp | "lo", rồi "low" |
