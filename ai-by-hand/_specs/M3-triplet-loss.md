# SPEC — M3 · Triplet loss (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `M3-triplet-loss` · English *Triplet loss* · ~12 phút.
> Tiền đề: A2 (khoảng cách), M2 (contrastive).

## 1. Định vị
Học khoảng cách bằng **bộ ba** (anchor, positive, negative): ép `d(a,p)` **nhỏ hơn** `d(a,n)` ít nhất một **lề (margin)**.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Cho nhận diện khuôn mặt, truy hồi ảnh: cần "cùng người gần, khác người xa". Triplet loss định nghĩa trực tiếp
  yêu cầu đó với một **lề** → embedding có cấu trúc khoảng cách rõ ràng (FaceNet).
- `.formula`:
  ```
  L = max( 0, d(a,p) − d(a,n) + margin )      (= 0 khi đã thỏa: d(a,n) ≥ d(a,p) + margin)
  ```

## 3. Trực giác (`.intuition`)
> Kéo **positive** (cùng lớp) lại gần neo và đẩy **negative** (khác lớp) ra xa, nhưng chỉ tới khi cách nhau **đủ một lề** — vượt lề rồi
> thì thôi (loss = 0), khỏi tốn sức. Lề tạo "khoảng đệm an toàn" giữa các lớp.

## 4. Các bước
- **⓪ Cho sẵn** · pill `margin=1`: d(a,p) = 3, d(a,n) = 2. (`.cell.given`)
- **① Tính biểu thức trong max** — `d(a,p) − d(a,n) + margin = 3 − 2 + 1 = __` → 2. `.why`: dương > 0 nghĩa là **vi phạm** — negative còn gần hơn mức cho phép.
- **② Loss** — `L = max(0, 2) = __` → 2. `.hint`: loss > 0 → bộ ba "khó", sẽ bị kéo/đẩy mạnh khi cập nhật.
- **③ Trường hợp đã thỏa** — nếu d(a,p)=2, d(a,n)=4: `2 − 4 + 1 = −1 → L = max(0,−1) = __` → 0. `.why`: đã cách đủ lề → không phạt → không học thừa.
- **④ Chọn bộ ba khó** · pill `hard mining` — `.note`: chọn negative **gần** anchor (hard negative) cho tín hiệu học mạnh; bộ ba dễ (loss=0) vô ích. So với InfoNCE (M2) dùng nhiều âm cùng lúc. SVG: anchor, p (gần), n (xa) + lề.

## 5. Tự kiểm tra (`.quiz`)
1. Triplet loss = 0 khi nào? → `.qa` **Khi d(a,n) ≥ d(a,p) + margin (đã cách đủ lề).**
2. "Hard negative" là gì? → `.qa` **Negative gần anchor → bộ ba khó, cho tín hiệu học mạnh.**

## 6. Rút ra
> **Rút ra.** Triplet loss = max(0, d(a,p)−d(a,n)+margin); ép cùng-lớp gần, khác-lớp xa một lề. Bài tiếp (M4): căn chỉnh ảnh–chữ — CLIP.

## 7. `data-q` & số mẫu
- Sinh d(a,p), d(a,n), margin nhỏ; tính loss (cả ca thỏa & vi phạm).
- Khóa: `dap, dan, margin`; `inner, loss`.

## Phụ lục — số mẫu
| d(a,p), d(a,n) | L |
|---|---|
| 3, 2 (margin 1) | 2 |
| 2, 4 (margin 1) | 0 |
