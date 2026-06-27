# SPEC — B8 · Cây quyết định: Entropy & Information Gain (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `B8-cay-quyet-dinh-entropy` · English *Decision tree (entropy)* · ~14 phút.
> Tiền đề: A16 (xác suất), A18 (log). Dùng bảng log₂.

## 1. Định vị
Cây quyết định chọn câu hỏi chia dữ liệu **giảm độ "hỗn loạn" (entropy)** nhiều nhất. Information Gain đo mức giảm đó.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Cây hỏi từng câu "có/không" để tách lớp — dễ hiểu, dễ giải thích. Bí quyết: chọn câu hỏi làm dữ liệu
  **"sạch lớp" nhất**. Entropy đo độ lẫn lộn; IG đo lợi ích của một phép chia. Đây cũng là nền của Random Forest, XGBoost.
- `.formula`:
  ```
  H(S) = −Σ pₖ·log₂ pₖ      IG = H(cha) − Σ (|con|/|cha|)·H(con)
  ```

## 3. Trực giác (`.intuition`)
> Entropy = **mức bất ngờ / lộn xộn**: nửa-nửa (0.5/0.5) → H=1 (rối nhất); thuần một lớp → H=0 (chắc chắn). Chọn phép chia kéo
> các nhánh con về **càng thuần càng tốt** — đó là information gain lớn.

## 4. Các bước
- **⓪ Cho sẵn + bảng log₂** · pill `8 mẫu`: cha có 4 "Có" / 4 "Không". Một đặc trưng chia thành: nhánh trái (3 Có, 1 Không),
  nhánh phải (1 Có, 3 Không). Bảng: `log₂(1/2)=−1, log₂(1/4)=−2, log₂(3/4)=−0.415`. (`.cell.given`)
- **① Entropy cha** — `H = −(4/8)log₂(4/8) − (4/8)log₂(4/8) = __` → 1. `.why`: 50–50 là trạng thái lộn xộn nhất → entropy cực đại = 1 (bit).
- **② Entropy mỗi nhánh con** — nhánh (3,1): `H = −(3/4)(−0.415) − (1/4)(−2) = 0.311 + 0.5 = __` → 0.811; nhánh (1,3) đối xứng → 0.811.
- **③ Information Gain** — `IG = 1 − [(4/8)·0.811 + (4/8)·0.811] = 1 − 0.811 = __` → 0.189.
  `.hint`: trọng số mỗi nhánh = tỉ lệ số mẫu rơi vào nhánh đó.
- **④ Ý nghĩa & chọn nhánh** · pill `chọn câu hỏi tốt nhất` — `.note`: IG càng lớn càng đáng chia; cây thử **mọi đặc trưng**, chọn
  IG cao nhất, rồi lặp trên từng nhánh tới khi thuần (H=0) hoặc đạt điều kiện dừng. SVG: cây nhỏ cha → 2 con.

## 5. Tự kiểm tra (`.quiz`)
1. Entropy bằng 0 nghĩa là gì? → `.qa` **Nhánh thuần một lớp (không lộn xộn).**
2. Cây chọn phép chia theo tiêu chí nào? → `.qa` **Information Gain lớn nhất (giảm entropy nhiều nhất).**

## 6. Rút ra
> **Rút ra.** Entropy đo lộn xộn, IG đo lợi ích chia; cây tham lam chọn IG lớn nhất ở mỗi bước. Bài tiếp (B9): độ "bẩn" thay
> bằng **Gini** (CART) — rẻ tính hơn, ý tưởng tương tự.

## 7. `data-q` & số mẫu
- Chọn phân bố cha & con rơi vào mốc có trong bảng log₂ (1/2, 1/4, 3/4) để tính tay.
- Khóa: số đếm mỗi nhánh; `Hcha`, `Htrai`, `Hphai`, `IG`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| H(cha) | 1 |
| H(nhánh 3:1) | 0.811 |
| IG | 0.189 |
