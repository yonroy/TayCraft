## Về dự án này
Bộ **phiếu tính tay "Làm toán AI ✍️"** dạy nền tảng AI/Deep Learning theo tinh thần Prof. Tom Yeh: không code — người học tự điền ma trận, nhân–cộng từng ô, chạy softmax/backprop/attention bằng số thật. Mỗi chủ đề = 1 file HTML = 2 trang A4/A3 (ĐỀ + ĐÁP ÁN), in ra giải bằng bút chì hoặc lưu PDF. Toàn bộ tiếng Việt, học theo thứ tự.

Context đầy đủ tại: `d:\SecondBrain\_projects\TayCraft AI\MEMORY\CONTEXT.md`
Xem lịch sử quyết định: `d:\SecondBrain\_projects\TayCraft AI\MEMORY\DECISIONS.md`

---

## Tech Stack
- **Frontend:** HTML5 + CSS3 thuần (không framework)
- **Tương tác:** JavaScript thuần (vanilla), SVG vẽ bằng JS
- **Build / Backend / Database:** KHÔNG có — tài liệu tĩnh, mở `.html` trong browser là chạy
- **Output:** in-ra-PDF qua trình duyệt (`window.print()`), CSS print-first (A4/A3)

---

## Quy tắc coding bắt buộc

### Ngôn ngữ & Style
- HTML/CSS/JS thuần, không thêm thư viện/framework/bundler
- Số âm hiển thị bằng dấu trừ "−" qua `WB.fmtInt`/`fmtTrim`, không phải "-"
- Đa số phiếu dùng `wb.css`; riêng `11-self-attention.html` có `<style>` nội bộ — chú ý khi đụng tới

### Architecture
- Mọi số biến thiên bọc trong `<span data-q="key">`; `generate()` tính số rồi `WB.setAll({...})` cập nhật mọi thẻ cùng khóa
- Dùng lại 3 file lõi (`wb.css`, `wb-random.js`, `index.html`) — không lặp lại code/style trong từng phiếu
- Hình động (phụ thuộc số): vẽ trong `generate()`. Hình tĩnh: vẽ một lần sau `WB.wire(generate)`

### Không được làm
- ❌ **Không sửa class CSS cũ trong `wb.css`** — chỉ thêm class bổ sung (additive)
- ❌ **Không hardcode số** vào worked-example — phải sinh qua `data-q` (bấm 🎲 mà số không đổi là sai)
- ❌ Không xóa comment có `// IMPORTANT:` hoặc `# NOTE:`
- ❌ **Không tự chạy `git commit` hoặc `git push` khi chưa được xác nhận**

---

## Nhắc nhở commit & push — Bắt buộc
Sau khi hoàn thành bất kỳ task nào có thay đổi file, luôn hiển thị:
```
📦 Task hoàn thành. Bạn có muốn commit và push không?

Files đã thay đổi:
  <danh sách file>

Gợi ý:
  git add .
  git commit -m "<loại>: <mô tả ngắn>"
  git push

→ Xác nhận để tôi chạy, hoặc "skip" nếu bạn tự làm sau.
```
**Quy tắc:** Chỉ chạy git sau khi người dùng gõ "ok"/"commit"/xác nhận rõ ràng. Không tự động commit — dù task có vẻ "hoàn chỉnh".

---

## Patterns đặc thù của dự án này

### Số động (data-q)
```html
<span class="blk"></span>                       <!-- ĐỀ: ô trống -->
<span class="cell ans" data-q="a1">2</span>     <!-- ĐÁP ÁN: lộ số -->
```
```js
function generate(){
  const a1 = WB.randIntNZ(-5,5);
  WB.setAll({ a1, a1w: WB.wrap(a1) });   // (−3) cho thừa số âm
}
WB.wire(generate);
```

### Khi ra phiếu mới
- Bật thẻ trong `index.html`: `class="card todo"` → `card done`, sửa `href`, đổi `○` → `Mở →`
- Footer đúng: `Bài NN` và `Trang 1/2 · ĐỀ` / `2/2 · ĐÁP ÁN`
- **Kiểm tràn lề bằng số** (`.page` có `overflow:hidden`) — xem checklist mục 8 trong `ai-by-hand/CACH-TAO-PHIEU.md`

### Quy ước màu (in được)
lam `#0e7490` = vào/xuôi/Q · cam `#b45309` = trọng số/đáp án/ngược/K · tím `#7c5cff` = thành phần thứ ba/V

---

## Files quan trọng
- `ai-by-hand/CACH-TAO-PHIEU.md` — công thức + checklist dựng phiếu (đọc đầu tiên)
- `ai-by-hand/wb.css` — style dùng chung; chỉ thêm additive
- `ai-by-hand/wb-random.js` — engine `window.WB` (randomize/format)
- `ai-by-hand/index.html` — mục lục + tracker tiến độ

---

## Khi tôi hỏi về dự án
Nếu thiếu context, hãy hỏi lại thay vì tự bịa. Ưu tiên đọc file thực tế trong codebase thay vì giả định.
