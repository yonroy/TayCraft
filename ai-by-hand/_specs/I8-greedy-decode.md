# SPEC — I8 · Greedy decode trọn một chuỗi (GIẢNG GIẢI, A4 dọc)

> Quy tắc chung: xem `_specs/README.md`. slug `I8-greedy-decode` · English *Greedy decode* · ~11 phút.
> Tiền đề: I2 (sampling), 09 (softmax), G8 (greedy vs beam).

## 1. Định vị
Sinh văn bản **tự hồi quy**: mỗi bước chọn token **xác suất cao nhất**, nối vào, đưa lại làm đầu vào, lặp tới `<eos>`.

## 2. Vì sao quan trọng (`.intro` + `.formula`)
- **Vì sao quan trọng.** Đây là vòng lặp sinh cơ bản của mọi LLM: token → mô hình → logits → chọn → nối → lặp. Greedy là cách chọn
  đơn giản nhất (tất định); hiểu nó là hiểu "LLM viết câu thế nào".
- `.formula`:
  ```
  lặp:  logitsₜ = Model(token₁…tₜ₋₁) → tokenₜ = argmax(logitsₜ) → nối → tới khi <eos>
  ```

## 3. Trực giác (`.intuition`)
> Như **viết từng chữ**, mỗi chữ chọn "khả dĩ nhất ngay lúc đó" rồi đọc lại cả câu để viết chữ kế. Tất định: cùng đầu vào → cùng đầu
> ra. Nhanh, nhưng thiển cận (không nhìn xa như beam — Bài G8).

## 4. Các bước
- **⓪ Cho sẵn** · pill `từ điển {A,B,C}, 3 bước`: logits từng bước — B1: (2,1,0); B2: (0,3,1); B3 (sau A,B): (1,0,4 → token "C/eos"). (`.cell.given`)
- **① Bước 1** — argmax(2,1,0) = `token __` → A. `.why`: chọn lớn nhất → token đầu là A.
- **② Bước 2 (đầu vào "A")** — argmax(0,3,1) = `token __` → B. `.hint`: token vừa sinh (A) thành đầu vào để tính logits bước 2.
- **③ Bước 3 (đầu vào "A B")** — argmax(1,0,4) = `token __` → C; gặp `<eos>` → dừng. Chuỗi = **"A B C"**. `.why`: lặp tới khi mô hình phát token kết thúc.
- **④ Tất định & hạn chế** · pill `dễ lặp` — `.note`: greedy luôn cho cùng kết quả; dễ ra câu **nhạt/lặp**. Muốn đa dạng → sampling (I2); muốn tối ưu hơn → beam (G8). SVG: chuỗi token nối dần với mũi tên hồi quy.

## 5. Tự kiểm tra (`.quiz`)
1. Greedy decode chọn token thế nào mỗi bước? → `.qa` **argmax logits (xác suất cao nhất).**
2. Token vừa sinh dùng làm gì? → `.qa` **Đầu vào cho bước kế (tự hồi quy).**

## 6. Rút ra
> **Rút ra.** Greedy decode = lặp argmax + nối + hồi quy tới `<eos>`; tất định, dễ lặp. Bài tiếp (I9): giảm lặp bằng repetition penalty.

## 7. `data-q` & số mẫu
- Sinh logits mỗi bước có argmax rõ; chuỗi 3 token.
- Khóa: logits từng bước; `t1, t2, t3`, chuỗi.

## Phụ lục — số mẫu
| bước | token |
|---|---|
| 1 | A |
| 2 | B |
| 3 | C → eos |
