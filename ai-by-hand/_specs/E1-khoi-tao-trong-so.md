# SPEC — E1 · Khởi tạo trọng số (Xavier / He) (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `E1-khoi-tao-trong-so` · English *Weight init* · ~12 phút.
> Tiền đề: A16 (phương sai), C2/04 (kích hoạt). Mở đầu Phần E (regularization/normalization).

## 1. Định vị
Chọn **độ lớn ban đầu** của trọng số để tín hiệu không teo cũng không nổ khi qua nhiều lớp. Xavier cho tanh/sigmoid, He cho ReLU.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Khởi tạo quá nhỏ → tín hiệu teo dần (vanishing); quá lớn → nổ (exploding). Mục tiêu: giữ **phương sai
  kích hoạt ổn định** qua các lớp. Xavier/He chọn độ lệch chuẩn theo số đầu vào để đạt điều đó.
- `.formula`:
  ```
  Xavier:  Var(w) = 1/n_in   (std = √(1/n_in))      He (ReLU):  Var(w) = 2/n_in   (std = √(2/n_in))
  ```

## 3. Trực giác (`.intuition`)
> Mỗi nơ-ron cộng `n_in` tích → phương sai đầu ra ≈ n_in × Var(w) × Var(x). Muốn đầu ra **không phình theo n_in**, ta cho Var(w)
> tỉ lệ nghịch n_in. ReLU "tắt nửa" tín hiệu → He nhân đôi để bù.

## 4. Các bước
- **⓪ Cho sẵn** · pill `n_in = 2`: lớp có 2 đầu vào, dùng kích hoạt ReLU. (`.cell.given`)
- **① Xavier std** — `√(1/n_in) = √(1/2) = __` → 0.707. `.why`: giữ phương sai đầu ra ≈ phương sai đầu vào (hợp tanh/sigmoid đối xứng).
- **② He std** — `√(2/n_in) = √(2/2) = __` → 1. `.hint`: ReLU loại bỏ nửa âm → mất nửa phương sai → nhân 2 trong tử số để bù.
- **③ Kiểm phương sai đầu ra** — với He, `Var(z) ≈ n_in · Var(w) · Var(x) = 2 · 1 · Var(x)`, sau ReLU **÷2** → `≈ Var(x)`. `.why`: nhờ vậy tín
  hiệu giữ độ lớn qua nhiều lớp → train được mạng sâu.
- **④ Hỏng nếu sai** · pill `teo / nổ` — `.note`: dùng std cố định 0.01 cho mạng 50 lớp → kích hoạt teo về 0; std 1 cho tanh → bão hòa.
  Khởi tạo đúng + normalize (E6/20) + residual (F9) mới train nổi mạng sâu. SVG: cột phương sai theo độ sâu (ổn định vs teo/nổ).

## 5. Tự kiểm tra (`.quiz`)
1. Vì sao He nhân 2 so với Xavier? → `.qa` **ReLU loại nửa âm, mất nửa phương sai → bù gấp đôi.**
2. Khởi tạo quá lớn gây gì? → `.qa` **Exploding: kích hoạt/gradient nổ qua các lớp.**

## 6. Rút ra
> **Rút ra.** Xavier/He chọn std theo n_in để giữ phương sai ổn định; He cho ReLU. Bài tiếp (E2): nếu sai, tín hiệu **vanishing /
> exploding** thế nào qua các lớp.

## 7. `data-q` & số mẫu
- Sinh n_in (số chính phương nhỏ: 2, 4, 8) để √ đẹp; tính Xavier/He std.
- Khóa: `nin`; `xavier`, `he`.

## Phụ lục — số mẫu
| n_in | Xavier | He |
|---|---|---|
| 2 | 0.707 | 1.0 |
| 4 | 0.5 | 0.707 |
