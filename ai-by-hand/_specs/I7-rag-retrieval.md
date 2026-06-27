# SPEC — I7 · Embedding similarity / RAG retrieval (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `I7-rag-retrieval` · English *RAG retrieval* · ~12 phút.
> Tiền đề: A4 (cosine), 01 (tích vô hướng), A2 (chuẩn).

## 1. Định vị
**Retrieval-Augmented Generation**: nhúng câu hỏi & tài liệu thành vectơ, lấy tài liệu **giống nhất** (cosine) để đưa vào ngữ cảnh LLM.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** LLM không nhớ hết mọi tài liệu & dễ "bịa". RAG **tra cứu** đoạn liên quan theo độ giống ngữ nghĩa rồi cho
  LLM đọc → trả lời có căn cứ, cập nhật được kiến thức mới mà không cần huấn luyện lại.
- `.formula`:
  ```
  cos(q, dᵢ) = (q·dᵢ) / (‖q‖·‖dᵢ‖)      → chọn tài liệu có cosine lớn nhất (top-k)
  ```

## 3. Trực giác (`.intuition`)
> Câu hỏi và mỗi tài liệu là một **mũi tên ngữ nghĩa**. Tài liệu nào **cùng hướng** câu hỏi nhất (cosine cao) thì liên quan nhất →
> lấy nó đưa cho LLM. Như tìm sách trên kệ theo "chủ đề" chứ không theo từ khóa khớp chính xác.

## 4. Các bước
- **⓪ Cho sẵn** · pill `q + 3 tài liệu`: q = (3, 4); d₁=(4, 3), d₂=(0, 5), d₃=(−3, 4). (mọi ‖·‖ = 5). (`.cell.given`)
- **① Tích vô hướng** — `q·d₁ = __ (24) ; q·d₂ = __ (20) ; q·d₃ = __` → 7. `.why`: tử số cosine — "mức cùng chiều" thô.
- **② Chuẩn hóa (÷25)** — mọi ‖·‖=5 → mẫu = 25: `cos = (24/25, 20/25, 7/25) = (__, __, __)` → (0.96, 0.80, 0.28). `.hint`: chọn vectơ ‖·‖=5 để mẫu chung 25, tính nhẩm.
- **③ Chọn top-1** — cosine lớn nhất = `0.96 → tài liệu __` → d₁. `.why`: d₁ liên quan nhất → đưa vào ngữ cảnh LLM (có thể lấy top-k).
- **④ Đường ống RAG** · pill `tra → đọc → trả lời` — `.note`: nhúng câu hỏi → tìm top-k đoạn gần nhất trong kho vectơ → dán vào prompt → LLM trả lời **dựa trên** đoạn đó. SVG: q và 3 d trên mặt phẳng, đánh dấu góc nhỏ nhất.

## 5. Tự kiểm tra (`.quiz`)
1. RAG chọn tài liệu theo gì? → `.qa` **Cosine similarity cao nhất với câu hỏi (top-k).**
2. RAG giúp khắc phục điều gì của LLM? → `.qa` **Bịa đặt / kiến thức cũ — đưa căn cứ thật vào ngữ cảnh.**

## 6. Rút ra
> **Rút ra.** RAG = nhúng + cosine + lấy top-k đoạn liên quan cho LLM đọc → trả lời có căn cứ. Bài tiếp (I8): sinh trọn một chuỗi bằng greedy decode.

## 7. `data-q` & số mẫu
- Chọn q & tài liệu đều ‖·‖=5 (mẫu chung 25) để cosine đẹp; tránh trùng hướng.
- Khóa: `q, d1, d2, d3`; `dot1..dot3`, `cos1..cos3`, `best`.

## Phụ lục — số mẫu
| | cos |
|---|---|
| d₁ | 0.96 ← chọn |
| d₂ | 0.80 |
| d₃ | 0.28 |
