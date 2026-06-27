# SPEC — K2 · Phương trình Bellman (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `K2-bellman` · English *Bellman equation* · ~13 phút.
> Tiền đề: K1 (return), A16 (kỳ vọng).

## 1. Định vị
Giá trị một trạng thái = **thưởng ngay + γ·giá trị trạng thái kế**. Quan hệ đệ quy này là nền của mọi thuật toán RL dựa giá trị.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Tính return đòi nhìn vô tận tương lai. Bellman **gói** toàn bộ tương lai vào "giá trị trạng thái kế" → biến bài
  toán vô hạn thành **một bước đệ quy**. Q-learning, value iteration, TD đều là Bellman dưới dạng cập nhật.
- `.formula`:
  ```
  V(s) = E[ r + γ·V(s') ]        Q(s,a) = E[ r + γ·maxₐ' Q(s', a') ]
  ```

## 3. Trực giác (`.intuition`)
> "Giá trị chỗ tôi đứng = phần thưởng tôi nhận khi rời đi + giá trị (đã chiết khấu) của chỗ tôi đến." Như **định giá nhà** = tiền thuê
> năm nay + giá trị (chiết khấu) căn nhà năm sau. Đệ quy gói cả tương lai vào một bước.

## 4. Các bước
- **⓪ Cho sẵn** · pill `γ=0.9`: ở trạng thái s, hành động cho thưởng r = 1 và sang s' có V(s') = 10. (`.cell.given`)
- **① Áp Bellman** — `V(s) = r + γ·V(s') = 1 + 0.9·10 = __` → 10. `.why`: không cần cộng vô hạn thưởng — V(s') đã tóm gọn toàn bộ tương lai từ s'.
- **② Dạng Q (có hành động)** — `Q(s,a) = r + γ·maxₐ' Q(s',a')`; nếu maxQ' = 8 → `Q = 1 + 0.9·8 = __` → 8.2. `.hint`: Q nhìn theo (trạng thái, hành động); V nhìn theo trạng thái.
- **③ Vì sao đệ quy giải được** — γ<1 làm phép lặp **co** → lặp cập nhật hội tụ về nghiệm duy nhất. `.why`: đây là lý do value iteration chạy được.
- **④ Từ phương trình → thuật toán** · pill `cập nhật` — `.note`: thay "=" bằng "cập nhật một phần" → **TD/Q-learning** (Bài K3). Bellman là phương trình; các thuật toán là cách giải xấp xỉ. SVG: s →(r)→ s', mũi tên giá trị truyền ngược.

## 5. Tự kiểm tra (`.quiz`)
1. Bellman gói cái gì vào một bước? → `.qa` **Toàn bộ tương lai — qua giá trị trạng thái kế V(s').**
2. Q(s,a) khác V(s) ở đâu? → `.qa` **Q xét theo cả hành động a; V chỉ theo trạng thái.**

## 6. Rút ra
> **Rút ra.** Bellman: V(s)=r+γV(s'); gói tương lai vào trạng thái kế, γ<1 đảm bảo hội tụ. Bài tiếp (K3): học Q từ kinh nghiệm — Q-learning.

## 7. `data-q` & số mẫu
- Sinh r, γ, V(s') nguyên nhỏ; tính V(s) và dạng Q.
- Khóa: `r, gamma, vNext, maxQ`; `V`, `Q`.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| V(s) | 10 |
| Q(s,a) (maxQ'=8) | 8.2 |
