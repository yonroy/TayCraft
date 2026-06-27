# SPEC — K4 · SARSA (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `K4-sarsa` · English *SARSA* · ~12 phút.
> Tiền đề: K3 (Q-learning).

## 1. Định vị
Biến thể **on-policy** của Q-learning: cập nhật bằng hành động **thật sự được chọn** ở s' (a'), không phải max. Tên = (S,A,R,S',A').

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** SARSA học giá trị của **chính chính sách đang chạy** (kể cả phần khám phá), nên **an toàn** hơn ở môi trường có
  rủi ro (tránh đường "tối ưu nhưng nguy hiểm"). So sánh SARSA vs Q-learning làm rõ on-policy vs off-policy.
- `.formula`:
  ```
  Q(s,a) ← Q(s,a) + α·[ r + γ·Q(s', a') − Q(s,a) ]      (a' = hành động THẬT chọn ở s')
  ```

## 3. Trực giác (`.intuition`)
> SARSA hỏi: "nếu tôi **tiếp tục cư xử như đang cư xử** (kể cả thỉnh thoảng khám phá), giá trị là bao nhiêu?" → ước lượng theo a' thật.
> Q-learning thì giả định "từ s' sẽ luôn chơi tối ưu (max)". Khác nhau ở chỗ a' thật hay a' tốt nhất.

## 4. Các bước
- **⓪ Cho sẵn** · pill `α=0.5, γ=0.9`: Q(s,a) = 2; r = 1; ở s' agent **thật sự chọn** a' với Q(s',a') = 3 (không phải max = 4). (`.cell.given`)
- **① Mục tiêu SARSA** — `r + γ·Q(s',a') = 1 + 0.9·3 = __` → 3.7. `.why`: dùng **a' thật** → phản ánh đúng chính sách (gồm cả khám phá).
- **② TD error & cập nhật** — `δ = 3.7 − 2 = 1.7 → Q ← 2 + 0.5·1.7 = __` → 2.85. `.hint`: cùng dạng cập nhật như Q-learning, chỉ khác mục tiêu.
- **③ So với Q-learning** — Q-learning dùng max=4 → mục tiêu 4.6, Q mới 3.3; SARSA dùng a' thật=3 → Q mới 2.85. `.why`: SARSA **thận trọng** hơn vì tính cả nước đi khám phá (có thể kém).
- **④ An toàn vs tối ưu** · pill `on-policy` — `.note`: ví dụ "vách đá": Q-learning đi sát mép (tối ưu nếu không lỡ), SARSA đi vòng an toàn (vì tính rủi ro khám phá). SVG: hai mục tiêu (max vs a' thật) trên cùng trục.

## 5. Tự kiểm tra (`.quiz`)
1. SARSA dùng hành động nào ở s'? → `.qa` **Hành động thật sự được chọn (a'), không phải max.**
2. Vì sao SARSA "an toàn" hơn? → `.qa` **Tính cả nước khám phá → tránh đường tối ưu nhưng rủi ro.**

## 6. Rút ra
> **Rút ra.** SARSA = on-policy: mục tiêu r+γQ(s',a') theo a' thật → thận trọng hơn Q-learning. Bài tiếp (K5): cân bằng khám phá–khai thác bằng ε-greedy.

## 7. `data-q` & số mẫu
- Sinh Q, α, γ, r, Q(s',a') (và max để so) nhỏ; tính mục tiêu, Q mới hai cách.
- Khóa: `Q, alpha, gamma, r, qNext, maxQ`; `targetS, QnewS, targetQ`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| mục tiêu SARSA | 3.7 |
| Q mới (SARSA) | 2.85 |
| Q mới (Q-learning) | 3.3 |
