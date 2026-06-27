# SPEC — B9 · Cây quyết định: Gini (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `B9-cay-quyet-dinh-gini` · English *Decision tree (Gini)* · ~12 phút.
> Tiền đề: B8 (entropy/IG).

## 1. Định vị
Thước "độ bẩn" thay cho entropy: **Gini impurity**. Dùng trong CART/scikit-learn — không cần log nên tính nhanh hơn.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Gini đo xác suất "phân loại sai nếu gắn nhãn ngẫu nhiên theo tỉ lệ lớp". Cùng ý với entropy (thuần →
  0, lộn xộn → cao) nhưng **không có log** → rẻ tính, là mặc định của nhiều thư viện cây.
- `.formula`:
  ```
  Gini(S) = 1 − Σ pₖ²      Gini_split = Σ (|con|/|cha|)·Gini(con)   (chọn split nhỏ nhất)
  ```

## 3. Trực giác (`.intuition`)
> Gini = **khả năng đoán trật** khi rút ngẫu nhiên hai mẫu và so nhãn. Thuần một lớp → không bao giờ trật → 0. Hai lớp đều
> nhau → trật nhiều → Gini lớn (tối đa 0.5 với 2 lớp).

## 4. Các bước
- **⓪ Cho sẵn** · pill `8 mẫu`: cha 4 Có / 4 Không; chia thành nhánh (3 Có,1 Không) và (1 Có,3 Không). (`.cell.given`)
- **① Gini cha** — `1 − [(4/8)² + (4/8)²] = 1 − (0.25+0.25) = __` → 0.5. `.why`: 2 lớp cân bằng → Gini cực đại 0.5 (bẩn nhất).
- **② Gini mỗi nhánh** — nhánh (3,1): `1 − [(3/4)² + (1/4)²] = 1 − (0.5625+0.0625) = __` → 0.375; nhánh (1,3) đối xứng → 0.375.
- **③ Gini sau chia (trọng số)** — `(4/8)·0.375 + (4/8)·0.375 = __` → 0.375; giảm so với 0.5. `.hint`: chọn phép chia có **Gini sau nhỏ nhất**
  (tương đương "Gini gain" lớn nhất = 0.5 − 0.375 = 0.125).
- **④ So với entropy** · pill `cùng ý` — `.note`: Gini và entropy thường chọn **cùng phép chia**; Gini không cần log nên nhanh hơn.
  Cả hai = 0 khi nhánh thuần. SVG: cây cha → 2 con kèm số đếm.

## 5. Tự kiểm tra (`.quiz`)
1. Gini của một nhánh thuần bằng bao nhiêu? → `.qa` **0.**
2. Gini khác entropy ở điểm tính toán nào? → `.qa` **Không dùng log (chỉ bình phương) → rẻ hơn.**

## 6. Rút ra
> **Rút ra.** Gini = 1 − Σp²; chọn phép chia làm Gini sau nhỏ nhất. Cùng tinh thần entropy nhưng nhanh. Hết Phần B (ML cổ điển);
> Bài tiếp (B10): lề hình học của **SVM**.

## 7. `data-q` & số mẫu
- Chọn phân bố cha/con đẹp (bội đơn giản) để bình phương ra số tròn.
- Khóa: số đếm; `giniCha`, `giniTrai`, `giniPhai`, `giniSplit`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| Gini(cha) | 0.5 |
| Gini(3:1) | 0.375 |
| Gini sau chia | 0.375 (gain 0.125) |
