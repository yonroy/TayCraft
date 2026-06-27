# SPEC — L3 · Cosine similarity (đo embedding) (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `L3-cosine-eval` · English *Cosine eval* · ~11 phút.
> Tiền đề: A4 (cosine), I7 (retrieval).

## 1. Định vị
Dùng cosine để **đánh giá** chất lượng embedding: cặp **giống nghĩa** phải có cosine cao, cặp **khác nghĩa** phải thấp.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Embedding tốt = "gần nghĩa thì gần vectơ". Để kiểm, ta đo cosine trên các cặp đã biết (giống/khác) và xem có
  **tách bạch** không. Đây là cách chấm điểm mô hình embedding cho tìm kiếm, gợi ý, RAG.
- `.formula`:
  ```
  cos(a, b) = (a·b)/(‖a‖‖b‖)      tốt: cos(giống) cao, cos(khác) thấp → khoảng cách lớn
  ```

## 3. Trực giác (`.intuition`)
> Embedding tốt **tách** cặp giống khỏi cặp khác trên thang cosine: giống ≈ 0.9, khác ≈ 0.1. Khoảng cách giữa hai nhóm càng rộng → mô
> hình càng phân biệt rõ → truy hồi càng chính xác.

## 4. Các bước
- **⓪ Cho sẵn** · pill `3 embedding ‖·‖=5`: a=(3,4), b=(4,3) (cùng nghĩa), c=(−4,3) (khác nghĩa). (`.cell.given`)
- **① Cặp giống (a,b)** — `a·b = 24 → cos = 24/25 = __` → 0.96. `.why`: cùng nghĩa → gần cùng hướng → cosine cao.
- **② Cặp khác (a,c)** — `a·c = 3·(−4)+4·3 = 0 → cos = 0/25 = __` → 0. `.hint`: vuông góc → "không liên quan".
- **③ Đọc kết quả** — `cos(giống)=0.96 ≫ cos(khác)=0 → tách tốt`. `.why`: chênh lệch lớn ⇒ embedding phân biệt được nghĩa → dùng tốt cho retrieval/gợi ý.
- **④ Ngưỡng & chỉ số** · pill `tách bạch` — `.note`: chọn ngưỡng cosine để quyết "giống/khác"; chấm bằng AUC (L2) trên tập cặp. Embedding kém → hai nhóm cosine chồng lấn. SVG: 3 vectơ + cung góc giống nhỏ, khác 90°.

## 5. Tự kiểm tra (`.quiz`)
1. Embedding tốt thể hiện thế nào trên cosine? → `.qa` **Cặp giống nghĩa cosine cao, cặp khác thấp (tách bạch).**
2. cos = 0 giữa hai embedding nghĩa là gì? → `.qa` **Không liên quan (vuông góc về hướng).**

## 6. Rút ra
> **Rút ra.** Đánh giá embedding = cosine cặp giống cao vs cặp khác thấp; tách càng rõ càng tốt. Bài tiếp (L4): chấm văn bản sinh bằng BLEU.

## 7. `data-q` & số mẫu
- Chọn embedding ‖·‖=5; cặp giống (góc nhỏ) & khác (vuông góc).
- Khóa: `a, b, c`; `cosSame, cosDiff`.

## Phụ lục — số mẫu
| cặp | cos |
|---|---|
| giống (a,b) | 0.96 |
| khác (a,c) | 0 |
