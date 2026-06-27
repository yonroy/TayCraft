# SPEC — B4 · k-NN (k láng giềng gần nhất) (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `B4-knn` · English *k-NN* · ~12 phút.
> Tiền đề: A2 (khoảng cách/chuẩn).

## 1. Định vị
Phân loại bằng cách **bỏ phiếu theo k điểm gần nhất** — không "học" tham số, chỉ đo khoảng cách. Mô hình "lười" trực quan nhất.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** k-NN cho thấy ý tưởng cốt lõi của ML: **mẫu giống nhau thì nhãn giống nhau**. Không huấn luyện, chỉ
  cần khoảng cách — nền tảng của truy hồi (retrieval) và nhiều hệ gợi ý.
- `.formula`:
  ```
  d(x, xᵢ) = √Σ(xⱼ − xᵢⱼ)²      → chọn k điểm d nhỏ nhất → nhãn = đa số phiếu
  ```

## 3. Trực giác (`.intuition`)
> Hỏi **k người hàng xóm gần nhất** rồi theo số đông. k nhỏ → nhạy nhiễu (1 hàng xóm lạ cũng đổi quyết định); k lớn → mượt
> nhưng có thể "nuốt" ranh giới lớp.

## 4. Các bước
- **⓪ Cho sẵn** · pill `5 điểm, k=3`: A(1,1)🔵, B(2,1)🔵, C(4,4)🔴, D(5,4)🔴, E(4,1)🔴; điểm hỏi Q(2,2). (`.cell.given`)
- **① Khoảng cách tới Q** — dùng `d²` (khỏi căn): `Q–A: (1)²+(1)²=__ (2) ; Q–B: 0+1=__ (1) ; Q–C: 4+4=__ (8) ; Q–D: 9+4=__ (13) ; Q–E: 4+1=__ (5)`.
  `.why`: so sánh khoảng cách thì dùng **d²** là đủ (căn là hàm tăng) → số đẹp hơn.
- **② Chọn k=3 gần nhất** — sắp xếp: B(1) < A(2) < E(5) → 3 láng giềng = **B🔵, A🔵, E🔴**.
- **③ Bỏ phiếu** — `🔵: 2 phiếu, 🔴: 1 phiếu → Q = __` → 🔵 (Xanh). `.hint`: chọn k **lẻ** để tránh hòa phiếu.
- **④ Hình** · pill `vùng lân cận` — SVG: các điểm màu + vòng tròn bao 3 điểm gần Q. `.note`: nếu k=1 thì theo B (gần nhất) → vẫn 🔵;
  nếu k=5 thì 🔴 thắng 3–2 → **đổi kết quả** — minh họa độ nhạy theo k.

## 5. Tự kiểm tra (`.quiz`)
1. k-NN có "huấn luyện" không? → `.qa` **Không — chỉ lưu dữ liệu và đo khoảng cách lúc dự đoán.**
2. Vì sao nên chọn k lẻ? → `.qa` **Tránh hòa phiếu giữa hai lớp.**

## 6. Rút ra
> **Rút ra.** k-NN = đo khoảng cách + bỏ phiếu đa số; đơn giản nhưng chậm khi dữ liệu lớn (phải so mọi điểm). Bài tiếp (B5):
> gom cụm **không nhãn** — k-means.

## 7. `data-q` & số mẫu
- Sinh điểm 2 lớp tách được + điểm hỏi; tính d² và chọn k; đảm bảo đa số rõ ràng.
- Khóa: tọa độ điểm; `d2a..d2e`; danh sách 3 gần nhất; `vote`, `pred`.

## Phụ lục — số mẫu
| | d² | | |
|---|---|---|---|
| Q–B | 1 | Q–A | 2 |
| Q–E | 5 | Q–C | 8 |
| k=3 → | 🔵 (2–1) | | |
