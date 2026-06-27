# SPEC — G8 · Giải mã: Greedy vs Beam search (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `G8-greedy-beam` · English *Greedy vs Beam* · ~13 phút.
> Tiền đề: G7 (seq2seq), 09 (softmax). Liên hệ I2/I8 (sampling/decode).

## 1. Định vị
Cách **chọn token** khi sinh chuỗi: greedy lấy xác suất cao nhất **mỗi bước** (tham lam, có thể hụt); beam giữ **k chuỗi tốt nhất** để tránh kẹt local.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Chuỗi tốt nhất **không** phải nối các token tốt nhất từng bước (token đầu hơi kém có thể mở ra phần sau rất tốt).
  Greedy thiển cận; beam tìm rộng hơn → bản dịch/sinh chất lượng cao hơn ở chi phí tính toán.
- `.formula`:
  ```
  điểm chuỗi = ∏ p(tokenₜ)  (hoặc Σ log p)      Greedy: argmax mỗi bước      Beam: giữ top-k theo điểm tích lũy
  ```

## 3. Trực giác (`.intuition`)
> Greedy = **luôn rẽ vào đường đẹp nhất ngay trước mặt** → dễ vào ngõ cụt. Beam = giữ **k tuyến đường hứa hẹn nhất** song song, mỗi bước
> mở rộng tất cả rồi tỉa lại còn k → ít bỏ lỡ tuyến tốt hơn ở xa.

## 4. Các bước
- **⓪ Cho sẵn** · pill `2 token A/B, beam k=2`: bước 1 P(A)=0.6, P(B)=0.4. Tiếp theo: sau A → P(A)=0.5,P(B)=0.5; sau B → P(A)=0.9,P(B)=0.1. (`.cell.given`)
- **① Greedy** — bước 1 chọn `A (0.6)`; bước 2 chọn max sau A = `0.5` → chuỗi **A?**, điểm `0.6·0.5 = __` → 0.30. `.why`: greedy khóa chặt token đầu mạnh nhất, không xét hệ quả.
- **② Beam mở rộng mọi nhánh** — `AA=0.6·0.5=0.30 ; AB=0.6·0.5=0.30 ; BA=0.4·0.9=__ (0.36) ; BB=0.4·0.1=0.04`. `.hint`: nhân xác suất dọc chuỗi (hoặc cộng log).
- **③ Tỉa top-k & chọn** — giữ 2 tốt nhất: `BA (0.36)`, `AA/AB (0.30)`; **tốt nhất = BA = 0.36 > greedy 0.30**. `.why`: token đầu B (kém hơn) mở ra phần sau rất mạnh
  → beam tìm được, greedy bỏ lỡ.
- **④ k điều tiết** · pill `rộng ↔ tốn` — `.note`: k=1 là greedy; k lớn → gần tối ưu nhưng tốn; beam còn dễ ra câu **nhạt/lặp** → thực tế kèm length penalty / sampling
  (Bài I2). SVG: cây tìm kiếm 2 mức, tô nhánh được giữ.

## 5. Tự kiểm tra (`.quiz`)
1. Vì sao greedy không tối ưu? → `.qa` **Chuỗi tốt nhất ≠ nối token tốt nhất từng bước (thiển cận).**
2. Beam k=1 tương đương gì? → `.qa` **Greedy search.**

## 6. Rút ra
> **Rút ra.** Greedy tham lam từng bước (dễ hụt); beam giữ top-k theo điểm tích lũy → tốt hơn, tốn hơn. Bài tiếp (G9): mẹo huấn luyện
> decoder — teacher forcing.

## 7. `data-q` & số mẫu
- Sinh xác suất 2 bước sao cho beam > greedy (token đầu yếu mở ra nhánh mạnh); tính điểm chuỗi.
- Khóa: `pA,pB`, `pAA..pBB` (cond); điểm `sAA..sBB`, `greedy`, `beamBest`.

## Phụ lục — số mẫu
| chuỗi | điểm |
|---|---|
| greedy (A?) | 0.30 |
| BA | 0.36 ← tốt nhất |
| BB | 0.04 |
