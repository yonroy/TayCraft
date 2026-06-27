# SPEC — D4 · KL Divergence (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `D4-kl-divergence` · English *KL Divergence* · ~13 phút.
> Tiền đề: A16/A17 (phân phối), A18 (log), 17 (cross-entropy). Dùng bảng tra ln.

## 1. Định vị
Đo **khoảng cách giữa hai phân phối** P và Q: P "thật", Q "xấp xỉ". Nền của cross-entropy, VAE, distillation.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Học = làm phân phối dự đoán Q **gần** phân phối thật P. KL đo độ "phí thông tin" khi dùng Q thay P. Tối
  thiểu cross-entropy chính là tối thiểu KL (khi P cố định).
- `.formula`:
  ```
  D_KL(P‖Q) = Σ pᵢ·ln(pᵢ/qᵢ) ≥ 0      = 0 ⇔ P = Q     (bất đối xứng: KL(P‖Q) ≠ KL(Q‖P))
  ```

## 3. Trực giác (`.intuition`)
> KL = "**ngạc nhiên dư thừa**" khi bạn tin vào Q nhưng sự thật là P. Q càng lệch P càng nhiều bất ngờ → KL lớn. Bằng 0 chỉ khi
> Q trùng P. Lưu ý: **không đối xứng** — đổi vai P, Q ra số khác.

## 4. Các bước
- **⓪ Cho sẵn + bảng ln** · pill `2 lớp`: P = (0.5, 0.5) (thật), Q = (0.25, 0.75) (dự đoán). Bảng: `ln 2 = 0.69, ln(2/3) = −0.405`. (`.cell.given`)
- **① Tỉ số từng lớp** — `p₁/q₁ = 0.5/0.25 = __ (2) ; p₂/q₂ = 0.5/0.75 = __` → 2/3. `.why`: KL nhìn **tỉ số** p/q ở mỗi lớp — Q hụt hay dư so với P.
- **② Lấy ln & nhân p** — `0.5·ln 2 = 0.5·0.69 = __ (0.345) ; 0.5·ln(2/3) = 0.5·(−0.405) = __` → −0.203.
  `.hint`: trọng số là **p** (phân phối thật) — lớp nào thật hay xảy ra thì đóng góp nhiều.
- **③ Cộng → KL** — `0.345 + (−0.203) = __` → 0.143. `.why`: KL ≥ 0; ở đây > 0 vì Q ≠ P.
- **④ Bất đối xứng & liên hệ CE** · pill `CE = H(P)+KL` — `.note`: cross-entropy `H(P,Q) = H(P) + D_KL(P‖Q)`; với P cố định, giảm CE = giảm KL.
  Đảo P↔Q cho số khác. SVG: hai cột P và Q chồng để thấy lệch.

## 5. Tự kiểm tra (`.quiz`)
1. KL = 0 khi nào? → `.qa` **Khi Q trùng P.**
2. KL(P‖Q) có bằng KL(Q‖P) không? → `.qa` **Không — KL bất đối xứng.**

## 6. Rút ra
> **Rút ra.** KL đo độ lệch P→Q (≥0, bất đối xứng); tối thiểu CE = tối thiểu KL. Bài tiếp (10): cơ chế **học** — một bước gradient.

## 7. `data-q` & số mẫu
- Chọn P, Q (2–3 lớp) sao cho p/q rơi mốc bảng ln (2, 1/2, 2/3, 3/2…).
- Khóa: `p1,p2,q1,q2`; tỉ số; `t1,t2` (p·ln(p/q)); `kl`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| 0.5·ln2 | 0.345 |
| 0.5·ln(2/3) | −0.203 |
| D_KL | 0.143 |
