# SPEC — H4 · Multi-Head Attention (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `18-multi-head-attention` · English *Multi-Head Attention* · ~13 phút.
> Tiền đề: 11 (self-attention), 02 (nhân ma trận). **Đã có phiếu** — spec để nâng cấp/tái tạo.

## 1. Định vị
Chia chiều thành nhiều **đầu (head)** chạy attention **song song**, mỗi đầu học một kiểu quan hệ, rồi **ghép** lại và trộn bằng Wₒ.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Một đầu attention chỉ bắt **một** kiểu quan hệ (vd "chủ–động từ"). Nhiều đầu cho mô hình nhìn **nhiều mối liên
  hệ cùng lúc** (cú pháp, đồng tham chiếu, vị trí…) trên các không gian con khác nhau → biểu diễn giàu hơn với cùng chi phí.
- `.formula`:
  ```
  headᵢ = Attention(Q Wqᵢ, K Wkᵢ, V Wvᵢ)        out = Concat(head₁…head_h)·Wₒ
  ```

## 3. Trực giác (`.intuition`)
> Như **nhiều chuyên gia** cùng đọc câu, mỗi người soi một loại quan hệ. Mỗi đầu làm việc trên một **lát chiều** nhỏ (d/h), nộp kết
> quả; ghép các lát lại rồi trộn (Wₒ) thành đầu ra đầy đủ.

## 4. Các bước
- **⓪ Cho sẵn** · pill `d=4, h=2 đầu`: kết quả mỗi đầu (đã tính attention riêng): head₁ = (0.7, 0.3), head₂ = (0.2, 0.8). (`.cell.given`)
- **① Mỗi đầu trên một lát chiều** — d=4 chia 2 đầu, mỗi đầu dₖ=2; chạy attention **độc lập**. `.why`: tách không gian con để mỗi đầu chuyên một kiểu quan hệ.
- **② Ghép (concat)** — `Concat(head₁, head₂) = (__, __, __, __)` → (0.7, 0.3, 0.2, 0.8). `.hint`: nối nối tiếp → lại đủ chiều d=4.
- **③ Trộn bằng Wₒ** — nhân vectơ ghép với Wₒ → đầu ra cuối (trộn thông tin giữa các đầu). `.why`: Wₒ cho các đầu "nói chuyện" với nhau thành một biểu diễn thống nhất.
- **④ Cùng chi phí** · pill `d/h mỗi đầu` — `.note`: vì mỗi đầu chỉ d/h chiều, tổng tính toán ≈ một đầu d chiều → "nhiều góc nhìn miễn phí". SVG: x chia 2 lát → 2 attention → ghép → Wₒ.

## 5. Tự kiểm tra (`.quiz`)
1. Vì sao dùng nhiều đầu? → `.qa` **Mỗi đầu bắt một kiểu quan hệ trên không gian con riêng → biểu diễn giàu hơn.**
2. Sau khi ghép các đầu, làm gì? → `.qa` **Nhân Wₒ để trộn thông tin giữa các đầu.**

## 6. Rút ra
> **Rút ra.** Multi-head = chia chiều → attention song song → ghép → Wₒ; nhiều quan hệ, cùng chi phí. Bài tiếp (19): từ token id sang vectơ — embedding & vị trí.

## 7. `data-q` & số mẫu
- Cho đầu ra mỗi đầu (vectơ nhỏ); ghép.
- Khóa: `h1a,h1b,h2a,h2b`; vectơ ghép.

## Phụ lục — số mẫu
| | KQ |
|---|---|
| concat | (0.7, 0.3, 0.2, 0.8) |
