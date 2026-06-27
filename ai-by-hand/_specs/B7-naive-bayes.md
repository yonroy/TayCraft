# SPEC — B7 · Naive Bayes (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `B7-naive-bayes` · English *Naive Bayes* · ~13 phút.
> Tiền đề: A16/A17 (xác suất, phân phối).

## 1. Định vị
Phân loại bằng **định lý Bayes** + giả định "các đặc trưng độc lập". Nhanh, mạnh cho lọc thư rác / phân loại văn bản.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Naive Bayes cho thấy cách **đảo ngược xác suất**: từ "thư rác hay viết chữ X" suy ra "thấy X thì có
  phải rác". Giả định độc lập "ngây thơ" làm phép nhân đơn giản nhưng hiệu quả bất ngờ.
- `.formula`:
  ```
  P(lớp | x) ∝ P(lớp) · ∏ᵢ P(xᵢ | lớp)      → chọn lớp có tích lớn nhất
  ```

## 3. Trực giác (`.intuition`)
> Mỗi đặc trưng **bỏ một lá phiếu** (xác suất) cho từng lớp; nhân hết phiếu lại với "thành kiến ban đầu" P(lớp). Lớp nào tích
> cao nhất thì thắng. "Naive" = coi các đặc trưng **không liên quan nhau** cho dễ nhân.

## 4. Các bước
- **⓪ Cho sẵn** · pill `2 lớp`: P(rác)=0.4, P(thường)=0.6; từ "khuyến mãi": P(km|rác)=0.6, P(km|thường)=0.1; từ "bạn":
  P(bạn|rác)=0.2, P(bạn|thường)=0.5. Thư chứa **{khuyến mãi}**. (`.cell.given`)
- **① Điểm cho lớp "rác"** — `P(rác)·P(km|rác) = 0.4·0.6 = __` → 0.24. `.why`: nhân thành kiến ban đầu với bằng chứng từ đặc trưng.
- **② Điểm cho lớp "thường"** — `P(thường)·P(km|thường) = 0.6·0.1 = __` → 0.06.
- **③ So sánh & chuẩn hóa** — `0.24 > 0.06 → dự đoán __ (RÁC)`; xác suất `= 0.24/(0.24+0.06) = __` → 0.8.
  `.hint`: chỉ cần **so sánh** tích; chia tổng để ra xác suất thật (mẫu số chung bỏ được khi so sánh).
- **④ Thêm đặc trưng** · pill `nhân tiếp` — nếu thư còn chữ "bạn": nhân thêm `P(bạn|·)`: rác `0.24·0.2=0.048`, thường `0.06·0.5=0.03`
  → vẫn RÁC nhưng sát hơn. `.note`: xác suất 0 cho một từ sẽ "giết" cả tích → thực tế dùng **làm trơn Laplace** (cộng 1).
- **⑤ Vẽ & so sánh hai cột** · pill `tích phiếu` — ĐỀ: trục trống (2 khung nét đứt, nhãn rác/thường) cho HS tự vẽ chiều cao
  hai cột điểm; ĐÁP ÁN: SVG hai cột số thật (`drawBars`), cột rác cao hơn. Chuẩn hóa = chia tổng hai cột.

> **Bố cục 3 trang** (đề có đủ 5 bước nên tách): Trang 1 ĐỀ = bước 0–3; Trang 2 ĐỀ = bước 4–5 + tự kiểm tra; Trang 3 = ĐÁP ÁN.
> Footer ghi `1/3 · ĐỀ`, `2/3 · ĐỀ`, `3/3 · ĐÁP ÁN`.

## 5. Tự kiểm tra (`.quiz`)
1. Giả định "naive" là gì? → `.qa` **Các đặc trưng độc lập với nhau khi đã biết lớp.**
2. Vì sao cần làm trơn (Laplace)? → `.qa` **Tránh xác suất 0 làm cả tích về 0.**

## 6. Rút ra
> **Rút ra.** Naive Bayes = P(lớp)·∏P(đặc trưng|lớp), chọn lớp lớn nhất; nhanh và mạnh cho văn bản. Bài tiếp (B8): chia dữ liệu
> bằng **cây quyết định** dựa trên entropy & information gain.

## 7. `data-q` & số mẫu
- Sinh tiền nghiệm & likelihood (bội 0.1) cho 2 lớp; chọn đặc trưng có trong thư.
- Khóa: các xác suất cho sẵn; `scoreRac, scoreThuong`, `post`, `pred`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| điểm rác | 0.24 |
| điểm thường | 0.06 |
| P(rác\|km) | 0.8 → RÁC |
