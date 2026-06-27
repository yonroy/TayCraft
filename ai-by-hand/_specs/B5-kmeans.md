# SPEC — B5 · k-means 1 vòng (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `B5-kmeans` · English *k-means* · ~13 phút.
> Tiền đề: A2 (khoảng cách), B4 (gán theo gần nhất).

## 1. Định vị
Gom dữ liệu **không nhãn** thành k cụm: lặp **gán điểm → tâm gần nhất**, rồi **dời tâm về trung bình cụm**. Học không giám sát kinh điển.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Nhiều khi ta có dữ liệu nhưng **không có nhãn**. k-means tự tìm cấu trúc nhóm — nền của phân khúc
  khách hàng, nén màu ảnh, khởi tạo nhiều thuật toán khác.
- `.formula`:
  ```
  Gán: cụm(xᵢ) = argminⱼ ‖xᵢ − μⱼ‖      Cập nhật: μⱼ = trung bình các điểm thuộc cụm j
  ```

## 3. Trực giác (`.intuition`)
> Hai vòng lặp xen kẽ: (1) mỗi điểm **chọn tâm gần nhất** làm nhà; (2) mỗi tâm **dời về giữa** đám con của mình. Lặp tới khi
> không ai đổi nhà → cụm ổn định.

## 4. Các bước
- **⓪ Cho sẵn** · pill `4 điểm, k=2`: P₁(1,1), P₂(2,1), P₃(5,4), P₄(6,5); tâm khởi tạo μ₁=(1,1), μ₂=(6,5). (`.cell.given`)
- **① Gán theo tâm gần nhất** — so `d²` tới μ₁, μ₂: `P₂→μ₁: 1 vs μ₂: 32 → cụm 1`; `P₃→μ₁: 25 vs μ₂: 2 → cụm 2`.
  Kết quả: cụm1 = {P₁, P₂}, cụm2 = {P₃, P₄}. `.why`: mỗi điểm về tâm gần hơn để giảm tổng khoảng cách nội cụm.
- **② Dời tâm về trung bình** — `μ₁ = ((1+2)/2, (1+1)/2) = (__, __) (1.5, 1)`; `μ₂ = ((5+6)/2, (4+5)/2) = (__, __)` → (5.5, 4.5).
  `.hint`: tâm mới = trung bình tọa độ các điểm trong cụm.
- **③ Vòng tiếp có đổi?** — gán lại với tâm mới: các điểm **giữ nguyên cụm** → đã **hội tụ**. `.why`: khi không điểm nào đổi nhà, thuật toán dừng.
- **④ Hình** · pill `2 cụm` — SVG: 4 điểm, tâm cũ (×) và tâm mới (★), đường nối điểm→tâm. `.note`: k-means nhạy với **tâm khởi tạo**;
  khởi tạo xấu có thể ra cụm kém (chạy nhiều lần, chọn kết quả tốt nhất).

## 5. Tự kiểm tra (`.quiz`)
1. k-means cần nhãn không? → `.qa` **Không — học không giám sát.**
2. Khi nào dừng lặp? → `.qa` **Khi không điểm nào đổi cụm (tâm không dời nữa).**

## 6. Rút ra
> **Rút ra.** k-means = lặp gán-rồi-dời-tâm tới hội tụ; đơn giản nhưng phụ thuộc khởi tạo & k. Bài tiếp (B6): giảm chiều dữ
> liệu bằng **PCA** (dùng trị riêng A11).

## 7. `data-q` & số mẫu
- Sinh 2 cụm tách rõ + tâm khởi tạo; tính d², gán, trung bình.
- Khóa: tọa độ điểm & tâm; gán cụm; `m1x,m1y,m2x,m2y` (tâm mới).

## Phụ lục — số mẫu
| | KQ |
|---|---|
| cụm 1 | {P₁, P₂} → μ₁=(1.5, 1) |
| cụm 2 | {P₃, P₄} → μ₂=(5.5, 4.5) |
| vòng 2 | hội tụ |
