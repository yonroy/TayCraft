# SPEC — A17 · Phân phối Bernoulli / Categorical (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `A17-bernoulli-categorical` · English *Distributions* · ~12 phút.
> Tiền đề: A16 (xác suất, kỳ vọng).

## 1. Định vị
Hai phân phối rời rạc cốt lõi: **Bernoulli** (2 kết cục, vd có/không) và **Categorical** (K lớp). Đầu ra softmax **chính là** Categorical.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Phân loại nhị phân = Bernoulli; phân loại nhiều lớp = Categorical. Hiểu hai phân phối này là hiểu
  **mô hình nói gì** ở đầu ra, và vì sao cross-entropy đo sai lệch giữa dự đoán và nhãn.
- `.formula`:
  ```
  Bernoulli:   P(1) = p, P(0) = 1 − p,   E[X] = p,   Var = p(1 − p)
  Categorical: pₖ ≥ 0,   Σₖ pₖ = 1   (dự đoán lớp = argmax pₖ)
  ```

## 3. Trực giác (`.intuition`)
> Bernoulli = **một đồng xu lệch** (mặt 1 ra với xác suất p). Categorical = **một con xúc xắc lệch** K mặt. Softmax biến điểm
> số thô (logit) thành đúng một con xúc xắc lệch như vậy — các mặt cộng lại bằng 1.

## 4. Các bước
- **⓪ Cho sẵn** · pill `p, K=3`: Bernoulli p = 0.7; Categorical 3 lớp p = (0.2, 0.5, 0.3). (`.cell.given`)
- **① Bernoulli đầy đủ** — `P(0) = 1 − 0.7 = __ (0.3) ; E[X] = __ (0.7) ; Var = 0.7·0.3 = __` → 0.21.
  `.why`: chỉ một tham số p quyết định tất cả; phương sai lớn nhất tại p = 0.5 (bất định nhất).
- **② Kiểm Categorical hợp lệ** — `0.2 + 0.5 + 0.3 = __` → 1; mọi pₖ ≥ 0. `.hint`: thiếu/thừa 1 là phân phối sai.
- **③ Dự đoán & "độ tự tin"** — `argmax = lớp __ (lớp 2, p=0.5)`; xác suất lớp đúng đo độ tự tin. `.why`: mô hình chọn lớp
  xác suất cao nhất; giá trị đó vào cross-entropy `−ln pₖ`.
- **④ Nối với softmax/one-hot** · pill `đầu ra mạng` — `.note` + SVG cột: nhãn thật = one-hot (vd lớp 2 → (0,1,0));
  Categorical dự đoán so với one-hot này. Càng khớp → loss càng nhỏ.

## 5. Tự kiểm tra (`.quiz`)
1. Bernoulli khác Categorical ở đâu? → `.qa` **Bernoulli: 2 kết cục; Categorical: K lớp.**
2. Tổng xác suất Categorical phải bằng? → `.qa` **1.**

## 6. Rút ra
> **Rút ra.** Bernoulli/Categorical là "ngôn ngữ đầu ra" của bộ phân loại; softmax tạo ra Categorical, one-hot là nhãn thật.
> Bài tiếp (A18): **exp & log** — hai hàm đứng sau softmax và cross-entropy, làm tay bằng bảng tra.

## 7. `data-q` & số động
- Sinh `p` Bernoulli ∈ {0.6,0.7,0.8}; vectơ Categorical 3 giá trị bội 0.1 tổng = 1; nhãn one-hot theo argmax.
- Khóa: `p`, `q=1−p`, `EX`, `varB`; `c1,c2,c3`, `csum`, `argmax`; one-hot `oh1..oh3`.

## Phụ lục — số mẫu
| | Kết quả |
|---|---|
| P(0) Bernoulli | 0.3 |
| Var Bernoulli | 0.21 |
| Σ Categorical | 1 |
| argmax | lớp 2 (0.5) |
