# SPEC — B10 · SVM: lề hình học (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `B10-svm-margin` · English *SVM margin* · ~13 phút.
> Tiền đề: A2 (chuẩn), A5 (phép chiếu), tích vô hướng.

## 1. Định vị
SVM tìm đường phân tách có **lề rộng nhất**. Lề = khoảng cách từ đường tới điểm gần nhất; rộng → khái quát tốt.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Nhiều đường tách được hai lớp, nhưng đường **"thoáng" nhất** (xa cả hai bên nhất) ít sai trên dữ liệu
  mới. SVM định nghĩa rõ "thoáng" = lề, và chỉ vài **vectơ hỗ trợ** sát lề mới quyết định đường.
- `.formula`:
  ```
  Đường: w·x + b = 0      khoảng cách điểm: d = |w·x + b| / ‖w‖      bề rộng lề = 2/‖w‖
  ```

## 3. Trực giác (`.intuition`)
> Tưởng tượng một **con đường** rộng nhất có thể nhét giữa hai lớp mà không đè lên điểm nào. Vạch giữa đường là ranh giới; mép
> đường chạm vài điểm — đó là **vectơ hỗ trợ**. Càng rộng đường, phân loại càng "chắc tay".

## 4. Các bước
- **⓪ Cho sẵn** · pill `đường + điểm`: w = (1, 1), b = −3; các điểm A(3,2)🔵, B(1,1)🔴, C(4,4)🔵. (`.cell.given`)
- **① Chuẩn ‖w‖** — `‖w‖ = √(1²+1²) = √2 ≈ __` → 1.41. `.why`: chia cho ‖w‖ để biến "điểm số thô" w·x+b thành **khoảng cách thật**.
- **② Khoảng cách từ A** — `w·A + b = 1·3+1·2−3 = 2`; `d_A = |2|/√2 = √2 ≈ __` → 1.41. Dấu **dương** → A ở phía lớp 🔵.
  `.hint`: dấu của w·x+b cho biết **phía** nào của đường; trị tuyệt đối chia ‖w‖ cho **khoảng cách**.
- **③ Khoảng cách từ B** — `w·B + b = 1+1−3 = −1`; `d_B = |−1|/√2 ≈ __` → 0.71; dấu âm → phía lớp 🔴. `.why`: B gần đường hơn → ứng viên **vectơ hỗ trợ**.
- **④ Bề rộng lề** · pill `2/‖w‖` — `= 2/√2 = √2 ≈ __` → 1.41. `.note`: SVM **tối đa hóa** đại lượng này (tương đương **tối thiểu ‖w‖**)
  với ràng buộc mọi điểm nằm đúng phía & ngoài lề. SVG: đường + 2 mép lề + điểm.

## 5. Tự kiểm tra (`.quiz`)
1. Dấu của w·x + b cho biết gì? → `.qa` **Điểm nằm phía nào của đường phân tách.**
2. SVM tối ưu hóa cái gì? → `.qa` **Lề rộng nhất ⇔ ‖w‖ nhỏ nhất (với ràng buộc phân loại đúng).**

## 6. Rút ra
> **Rút ra.** Lề = |w·x+b|/‖w‖, bề rộng = 2/‖w‖; SVM chọn đường lề rộng nhất, chỉ phụ thuộc vectơ hỗ trợ. Bài tiếp (B11): ghép
> nhiều mô hình yếu — **Gradient Boosting**.

## 7. `data-q` & số mẫu
- Sinh w, b nguyên nhỏ + điểm hai lớp tách được; tính w·x+b, chia ‖w‖.
- Khóa: `w1,w2,b`; tọa độ điểm; `normw`, `scoreA, dA`, `scoreB, dB`, `margin`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| ‖w‖ | √2 ≈ 1.41 |
| d(A) | √2 ≈ 1.41 (phía 🔵) |
| d(B) | 0.71 (phía 🔴) |
| bề rộng lề | √2 ≈ 1.41 |
