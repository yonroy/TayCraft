# SPEC — M5 · Knowledge distillation (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `M5-knowledge-distillation` · English *Knowledge distillation* · ~13 phút.
> Tiền đề: 09 (softmax), I2 (nhiệt độ), D4 (KL). Dùng bảng eˣ.

## 1. Định vị
Mô hình **trò** (nhỏ) học bắt chước **phân phối mềm** của mô hình **thầy** (lớn) — không chỉ nhãn đúng mà cả "độ tự tin tương đối" giữa các lớp.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Mô hình lớn mạnh nhưng chậm/đắt. Distillation **nén** tri thức vào mô hình nhỏ chạy nhanh, giữ phần lớn chất lượng.
  Bí quyết: **soft targets** (xác suất thầy ở nhiệt độ cao) mang nhiều thông tin hơn nhãn cứng ("mèo 0.7, chó 0.2 → mèo giống chó").
- `.formula`:
  ```
  soft = softmax(z_thầy / T)     L = α·CE(nhãn cứng, trò) + (1−α)·T²·KL(soft_thầy ‖ soft_trò)
  ```

## 3. Trực giác (`.intuition`)
> Nhãn cứng chỉ nói "đáp án là mèo". Thầy nói thêm "mèo 0.7, **chó 0.2** (hơi giống), xe 0.0" — **tri thức tối** về quan hệ giữa lớp. Nâng
> **nhiệt độ T** làm các xác suất nhỏ lộ rõ → trò học được cả những gợi ý tinh tế đó.

## 4. Các bước
- **⓪ Cho sẵn + bảng eˣ** · pill `3 lớp, T=2`: logits thầy z = (2, 0, 1). Bảng: e⁰=1, e⁰·⁵=1.65, e¹=2.72. (`.cell.given`)
- **① Làm mềm bằng T** — `z/T = (1, 0, 0.5) → e=(2.72, 1, 1.65), Σ=5.37 → soft = (__, __, __)` → (0.51, 0.19, 0.31). `.why`: chia T làm phân phối **phẳng hơn** → lộ "chó 0.19" (gợi ý quan hệ), không bị "mèo" áp đảo.
- **② So với T=1** — softmax(z) = (0.67, 0.09, 0.24): nhọn hơn. `.hint`: T cao → soft target giàu thông tin hơn cho trò học.
- **③ Loss trò** — trò khớp soft target của thầy bằng KL (Bài D4) + một phần nhãn cứng (CE). `.why`: kết hợp "bắt chước thầy" và "đúng đáp án thật" → trò vừa giống thầy vừa không sai nhãn.
- **④ Vì sao T²** · pill `cân gradient` — `.note`: chia T làm gradient của KL nhỏ đi ~1/T² → nhân lại **T²** để cân với số hạng CE. Trò nhỏ đạt gần chất lượng thầy lớn. SVG: cột soft (T=2) vs nhọn (T=1).

## 5. Tự kiểm tra (`.quiz`)
1. "Soft targets" mang thông tin gì hơn nhãn cứng? → `.qa` **Quan hệ/độ giống giữa các lớp (xác suất tương đối).**
2. Tăng nhiệt độ T làm gì? → `.qa` **Làm phân phối phẳng hơn → lộ xác suất nhỏ (gợi ý tinh tế).**

## 6. Rút ra
> **Rút ra.** Distillation = trò khớp soft target (softmax/T) của thầy + nhãn cứng → nén mô hình. **Hết Phần M.** Tiếp Phần N (Capstone) — Bài N1: MLP đủ vòng.

## 7. `data-q` & số mẫu
- Chọn logits thầy rơi mốc bảng eˣ với T=2; tính soft (T=2) và (T=1).
- Khóa: `z1..z3`, `T`; `soft1..soft3`, `hard1..hard3`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| soft (T=2) | (0.51, 0.19, 0.31) |
| softmax (T=1) | (0.67, 0.09, 0.24) |
