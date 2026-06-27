# SPEC — K6 · Policy Gradient (REINFORCE) (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `K6-policy-gradient` · English *Policy Gradient* · ~13 phút.
> Tiền đề: K1 (return), 09 (softmax), A13 (chuỗi/log).

## 1. Định vị
Học **chính sách π(a|s)** trực tiếp (không qua bảng Q): tăng xác suất các hành động dẫn tới **return cao**, giảm hành động return thấp.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Nhiều bài toán có **không gian hành động liên tục/rất lớn** → bảng Q bất khả. Policy gradient tối ưu thẳng tham số
  chính sách bằng gradient ascent trên return kỳ vọng. Nền của REINFORCE, A2C, PPO.
- `.formula`:
  ```
  ∇J = E[ ∇_θ log π(a|s) · G ]        θ ← θ + α·G·∇_θ log π(a|s)
  ```

## 3. Trực giác (`.intuition`)
> "Hành động nào dẫn tới **kết quả tốt** (G cao) thì **làm thường xuyên hơn**." Gradient của log π chỉ hướng "tăng xác suất hành động đã
> chọn"; nhân với G (có dấu) → nâng nếu G dương, hạ nếu G âm. Đó là "thử–thưởng/phạt".

## 4. Các bước
- **⓪ Cho sẵn** · pill `2 hành động`: chính sách softmax cho π(a₁)=0.6, π(a₂)=0.4; agent đã chọn a₁ và nhận return G = 2; α = 0.1. (`.cell.given`)
- **① Gradient log-prob (hành động đã chọn)** — với softmax, `∂ log π(a₁)/∂z₁ = 1 − π(a₁) = 1 − 0.6 = __` → 0.4. `.why`: tăng logit của a₁ làm π(a₁) tăng — đạo hàm dương khi π chưa bằng 1.
- **② Nhân với return** — `G·∇ = 2·0.4 = __` → 0.8 → cập nhật `z₁ ← z₁ + α·0.8`. `.hint`: G dương → **nâng** xác suất a₁ (làm lại hành động tốt).
- **③ Nếu G âm** — giả sử G = −2: `G·∇ = −0.8` → **hạ** logit a₁. `.why`: hành động dẫn tới kết quả tệ → giảm xác suất chọn lại.
- **④ Phương sai cao** · pill `cần baseline` — `.note`: G thô dao động mạnh → gradient nhiễu, học chậm. Trừ một **baseline** (giá trị trung bình) → dùng **advantage** thay G (Bài K7) giảm phương sai. SVG: π trước/sau cập nhật (a₁ tăng).

## 5. Tự kiểm tra (`.quiz`)
1. Policy gradient nâng/hạ xác suất hành động theo gì? → `.qa` **Theo return G: G dương → nâng, âm → hạ.**
2. Nhược điểm chính của REINFORCE? → `.qa` **Phương sai gradient cao (cần baseline/advantage).**

## 6. Rút ra
> **Rút ra.** Policy gradient: θ ← θ + α·G·∇log π; làm nhiều hành động return cao. Bài tiếp (K7): giảm phương sai bằng advantage/baseline.

## 7. `data-q` & số mẫu
- Sinh π (softmax) cho 2 hành động, G (±), α; tính ∇logπ = 1−π, cập nhật.
- Khóa: `pi1, pi2, G, alpha`; `grad`, `update`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| ∇log π(a₁) | 0.4 |
| G·∇ | 0.8 (G=2) |
