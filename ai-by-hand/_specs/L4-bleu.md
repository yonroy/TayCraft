# SPEC — L4 · BLEU — n-gram (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `L4-bleu` · English *BLEU* · ~12 phút.
> Tiền đề: A18 (exp), I1 (token). Dùng bảng eˣ.

## 1. Định vị
Chấm văn bản máy dịch/sinh bằng **độ trùng n-gram** với câu tham chiếu, kèm **phạt câu quá ngắn** (brevity penalty).

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Không thể chấm tay hàng triệu câu dịch. BLEU tự động đo "câu máy trùng bao nhiêu cụm với câu người" → so sánh
  mô hình dịch/sinh. Không hoàn hảo (bỏ qua ngữ nghĩa/diễn đạt khác) nhưng nhanh & chuẩn ngành.
- `.formula`:
  ```
  pₙ = (số n-gram trùng) / (số n-gram câu máy)      BP = min(1, exp(1 − ref/cand))
  BLEU = BP · exp( (1/N) Σ ln pₙ )
  ```

## 3. Trực giác (`.intuition`)
> Đếm xem các **cụm từ** (1-gram, 2-gram…) của câu máy có xuất hiện trong câu tham chiếu không → tỉ lệ trùng cao = giống người. Phạt câu
> **quá ngắn** (gian lận: chỉ ghi vài từ chắc đúng) bằng brevity penalty.

## 4. Các bước
- **⓪ Cho sẵn + bảng eˣ** · pill `1-gram`: câu máy = "the cat sat" (3 từ); tham chiếu = "the cat sat down" (4 từ). Bảng: e^(−0.33)=0.72. (`.cell.given`)
- **① Precision 1-gram** — số từ máy có trong tham chiếu: the✓ cat✓ sat✓ → `p₁ = 3/3 = __` → 1.0. `.why`: mọi từ máy đều xuất hiện trong tham chiếu → trùng từ vựng hoàn hảo.
- **② Brevity penalty** — câu máy ngắn hơn (3 < 4): `BP = exp(1 − ref/cand) = exp(1 − 4/3) = exp(−0.33) = __` → 0.72. `.hint`: BP < 1 phạt vì câu máy thiếu từ ("down").
- **③ BLEU (chỉ 1-gram)** — `BLEU = BP·p₁ = 0.72·1.0 = __` → 0.72. `.why`: dù trùng từ 100%, điểm bị kéo xuống vì **quá ngắn** → tránh gian lận độ dài.
- **④ Hạn chế** · pill `không hiểu nghĩa` — `.note`: BLEU đếm trùng bề mặt → phạt oan câu **diễn đạt khác mà đúng nghĩa**. Thực tế dùng nhiều n-gram (1–4) + nhiều tham chiếu; bổ sung bằng chỉ số ngữ nghĩa. SVG: hai câu, tô từ trùng.

## 5. Tự kiểm tra (`.quiz`)
1. Brevity penalty phạt cái gì? → `.qa` **Câu máy quá ngắn so với tham chiếu.**
2. Hạn chế chính của BLEU? → `.qa` **Đếm trùng bề mặt — không hiểu nghĩa / diễn đạt khác.**

## 6. Rút ra
> **Rút ra.** BLEU = precision n-gram × brevity penalty; nhanh nhưng đếm bề mặt. Bài tiếp (L5): chấm xếp hạng nhiều lớp bằng top-k accuracy.

## 7. `data-q` & số mẫu
- Sinh câu máy/tham chiếu ngắn; đếm trùng 1-gram; BP rơi mốc eˣ.
- Khóa: độ dài & trùng; `p1, bp, bleu`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| p₁ | 1.0 |
| BP | 0.72 |
| BLEU | 0.72 |
