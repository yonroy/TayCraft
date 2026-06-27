# SPEC — G6 · Bi-directional RNN (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `G6-birnn` · English *Bi-RNN* · ~11 phút.
> Tiền đề: 21 (RNN), G3 (trải thời gian).

## 1. Định vị
Chạy **hai RNN**: một xuôi (trái→phải), một ngược (phải→trái); **ghép** hai trạng thái tại mỗi bước → mỗi từ thấy **cả ngữ cảnh hai phía**.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Nghĩa một từ phụ thuộc **cả trước lẫn sau** ("con **ba ba**" vs "số **ba**"). RNN một chiều chỉ thấy quá khứ.
  Bi-RNN cho mỗi vị trí ngữ cảnh đầy đủ → mạnh cho gán nhãn chuỗi, NER, hiểu câu (không dùng được khi phải sinh tuần tự).
- `.formula`:
  ```
  h→ₜ = RNN_xuôi(xₜ, h→ₜ₋₁)      h←ₜ = RNN_ngược(xₜ, h←ₜ₊₁)      hₜ = [h→ₜ ; h←ₜ]
  ```

## 3. Trực giác (`.intuition`)
> Một người **đọc xuôi**, một người **đọc ngược**; tại mỗi từ, gộp ghi chú của cả hai → hiểu từ đó trong **toàn cảnh câu**, không chỉ
> phần đã đọc.

## 4. Các bước
- **⓪ Cho sẵn** · pill `tại 1 vị trí`: trạng thái xuôi h→ = (1, 2); trạng thái ngược h← = (3, 1). (`.cell.given`)
- **① Ghép hai chiều** — `h = [h→ ; h←] = (__, __, __, __)` → (1, 2, 3, 1). `.why`: nối nối tiếp → vectơ chứa cả ngữ cảnh trái và phải; kích thước **gấp đôi**.
- **② Dự đoán dùng cả hai** — lớp ra nhận vectơ ghép → quyết định dựa trên toàn cảnh. `.hint`: nhiều khi dùng **tổng/trung bình** thay vì ghép nếu muốn giữ kích thước.
- **③ Khi nào KHÔNG dùng được** — sinh văn bản tuần tự (language model) **không** có "tương lai" → Bi-RNN bất khả. `.why`: chiều ngược cần thấy toàn chuỗi trước → chỉ hợp
  bài **đã có cả câu** (phân loại/gán nhãn).
- **④ Kích thước** · pill `gấp đôi` — `.note`: hidden ghép → chiều gấp đôi → lớp sau & tham số tăng theo. SVG: hai dãy RNN ngược chiều, ghép cột tại mỗi bước.

## 5. Tự kiểm tra (`.quiz`)
1. Bi-RNN cho mỗi vị trí thấy gì? → `.qa` **Ngữ cảnh cả hai phía (trước và sau).**
2. Vì sao không dùng Bi-RNN để sinh văn bản? → `.qa` **Sinh tuần tự không có "tương lai" để đọc ngược.**

## 6. Rút ra
> **Rút ra.** Bi-RNN = RNN xuôi + ngược, ghép trạng thái → ngữ cảnh hai chiều (hợp hiểu, không hợp sinh). Bài tiếp (G7): nối encoder→decoder
> cho dịch máy — seq2seq.

## 7. `data-q` & số mẫu
- Sinh h→, h← nguyên nhỏ; ghép.
- Khóa: `hf1,hf2,hb1,hb2`; vectơ ghép `c1..c4`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| h→, h← | (1,2), (3,1) |
| ghép | (1, 2, 3, 1) |
