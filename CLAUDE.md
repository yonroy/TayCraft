# TayCraft AI — "AI by Hand ✍️"

## Second Brain
Đọc các file sau trước khi làm bất cứ gì:
- `d:\SecondBrain\_projects\TayCraft AI\MEMORY\CONTEXT.md` — trạng thái dự án
- `d:\SecondBrain\_global\my-stack.md` — preferences cá nhân (lưu ý: stack ưa thích là Next.js/TS, KHÔNG áp vào dự án này)

Nếu `MEMORY\CONTEXT.md` chưa tồn tại, thông báo cho người dùng.

---

## Tổng quan dự án
Bộ **phiếu tính tay** dạy nền tảng AI/Deep Learning theo tinh thần Prof. Tom Yeh ("AI by Hand"): không code — người học tự điền ma trận, nhân–cộng từng ô, chạy softmax/backprop/attention bằng số thật. Mỗi chủ đề = 1 file HTML = 2 trang A4/A3 (ĐỀ + ĐÁP ÁN), in ra giải bằng bút chì hoặc lưu PDF. Toàn bộ tiếng Việt, học theo thứ tự.

## Tech Stack
- **Frontend:** HTML5 + CSS3 thuần (không framework)
- **Tương tác:** JavaScript thuần (vanilla, không jQuery/React/Vue); SVG vẽ bằng JS
- **Build / Database / Backend:** KHÔNG có — tài liệu tĩnh, không bundler, không package manager, không server
- **Output:** in-ra-PDF qua trình duyệt (`window.print()`); CSS print-first (A4 mặc định, A3 khi cần)

## Cấu trúc quan trọng
```
TayCraft AI/
├── init-project-prompt.md       ← prompt meta khởi tạo Second Brain (không phải nội dung dự án)
└── ai-by-hand/                  ← TOÀN BỘ nội dung
    ├── index.html               ← mục lục + tracker (26 thẻ bài)
    ├── wb.css                   ← style dùng chung (print-first)
    ├── wb-random.js             ← engine "🎲 Đổi số" (window.WB)
    ├── CACH-TAO-PHIEU.md        ← công thức + checklist dựng phiếu mới
    └── NN-ten-khong-dau.html    ← các phiếu bài (01..26)
```

---

## Quy tắc bắt buộc

### Không được làm
- ❌ Không tự ý xóa hoặc rename file mà không báo trước
- ❌ Không để hardcode secret / API key trong code
- ❌ **Không tự `git commit` hoặc `git push` khi chưa được xác nhận rõ ràng**
- ❌ **Không sửa class CSS cũ trong `wb.css`** — chỉ thêm class bổ sung (additive); class cũ đang được mọi phiếu dùng chung
- ❌ Không **hardcode số** vào worked-example ("Hàng 1: …"); mọi số biến thiên phải sinh qua `data-q` + `WB.setAll` (bấm 🎲 mà số không đổi là sai)

### Luôn phải làm
- ✅ Khi ra phiếu mới: **bật thẻ trong `index.html`** từ `class="card todo"` → `card done` (hoặc `card adv done`), sửa `href`, đổi `○` → `Mở →`
- ✅ Mỗi phiếu phải có **đủ 2 trang** (ĐỀ + ĐÁP ÁN), footer ghi đúng `Bài NN` và `Trang 1/2 · ĐỀ` / `2/2 · ĐÁP ÁN`
- ✅ **Kiểm tràn lề BẰNG SỐ** trước khi giao (`.page` có `overflow:hidden` → tràn bị cắt âm thầm) — xem checklist mục 8 trong `CACH-TAO-PHIEU.md`
- ✅ Mỗi phiếu nên có **ít nhất một sơ đồ SVG** đúng bản chất; tuân **quy ước màu** in được (lam = vào/xuôi/Q, cam = trọng số/đáp án/ngược/K, tím = thành phần thứ ba/V)
- ✅ **Sau khi hoàn thành task, nhắc người dùng commit và push code**

### Code style
- HTML/CSS/JS thuần; số âm hiển thị bằng dấu trừ "−" (dùng `WB.fmtInt`/`fmtTrim`), không phải "-"
- Đa số phiếu `<link rel="stylesheet" href="wb.css">`; riêng `11-self-attention.html` nhúng `<style>` nội bộ — chú ý khi đụng tới
- Giữ nguyên comment đánh dấu quan trọng (vd `// IMPORTANT:`)

---

## Patterns của dự án này

### Số động qua `data-q` + `WB.setAll`
```html
<!-- ĐỀ: ô trống --> <span class="blk"></span>
<!-- ĐÁP ÁN: lộ số --> <span class="cell ans" data-q="a1">2</span>
```
```js
function generate(){
  const a1 = WB.randIntNZ(-5,5);            // sinh số
  WB.setAll({ a1, a1w: WB.wrap(a1) });      // cập nhật MỌI thẻ data-q cùng khóa
  drawFig(/* ... */);                       // vẽ lại hình động nếu phụ thuộc số
}
WB.wire(generate);                          // gắn nút 🎲
```

### Khung 2 trang ĐỀ / ĐÁP ÁN + hình SVG
- `<section class="page">` (ĐỀ) và `<section class="page key">` (ĐÁP ÁN) — xem mục 4 của `CACH-TAO-PHIEU.md`.
- Hình **động** (phụ thuộc số): gọi `drawX()` bên trong `generate()`. Hình **tĩnh**: gọi một lần sau `WB.wire(generate)`.

### Đổi khổ giấy A4 → A3
```html
<body class="a3">
<!-- và trong <head> của file đó (CSS không cho ghi đè @page bằng class): -->
<style>@page{ size:A3 portrait; }</style>
```

---

## Files quan trọng — đọc trước khi sửa
- `ai-by-hand/CACH-TAO-PHIEU.md` — công thức + checklist dựng phiếu (đọc đầu tiên khi làm bài mới)
- `ai-by-hand/wb.css` — style dùng chung; chỉ thêm additive, không sửa class cũ
- `ai-by-hand/wb-random.js` — engine `window.WB`; danh sách hàm randomize/format
- `ai-by-hand/index.html` — mục lục + tracker; nhớ cập nhật khi ra bài mới
- `d:\SecondBrain\_projects\TayCraft AI\MEMORY\DECISIONS.md` — lịch sử quyết định kiến trúc

---

## Build & Run
```bash
# Không có build step. Mở phiếu trong trình duyệt:
start "" "d:/MakeSomeThing/TayCraft AI/ai-by-hand/index.html"

# In / lưu PDF: nút "🖨️ In / Lưu PDF" trên phiếu (window.print())

# Soát tràn lề bằng Edge headless (chụp ảnh để mắt thường thấy):
EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
"$EDGE" --headless=new --disable-gpu --window-size=860,1230 \
  --screenshot=out.png "file:///d:/MakeSomeThing/TayCraft AI/ai-by-hand/NN-ten.html"
# Kiểm tràn BẰNG SỐ: tạo bản sao _measure.html chèn script đo .scrollHeight − .clientHeight
# (xem mục 8 CACH-TAO-PHIEU.md). iframe không đo được file:// → phải chèn thẳng vào bản sao.
```

---

## Session Management — Bắt buộc

### Cuối mỗi session
Khi người dùng nói "kết thúc", "done", "xong", hoặc trước khi `/clear`:

1. Cập nhật `d:\SecondBrain\_projects\TayCraft AI\MEMORY\CONTEXT.md`
2. Tạo session log tại `d:\SecondBrain\_projects\TayCraft AI\MEMORY\sessions\YYYY-MM-DD-[tên-ngắn].md`:

```markdown
## [HH:MM] Session — <mô tả ngắn>

**Đã làm:**
- <task hoàn thành>

**Files thay đổi:**
- `path/to/file` — lý do

**Quyết định quan trọng:**
- <lý do chọn A thay vì B>

**Còn dở / TODO:**
- 🔴 [BLOCKED] <task> — <lý do>
- 🟡 [NEXT] <task tiếp theo>
- 🟢 [LATER] <task không gấp>
```

3. Nếu có quyết định kiến trúc → append vào `DECISIONS.md`
4. Nếu có bug đã fix → append vào `MISTAKES.md`
5. Thông báo: `✅ Session đã lưu → MEMORY/sessions/YYYY-MM-DD-[tên-ngắn].md`
6. Hiển thị nhắc commit & push (chỉ chạy git sau khi người dùng gõ "ok"/"commit"):

```
📦 Nhắc nhở: Bạn có muốn commit và push code không?

Files đã thay đổi:
  <danh sách file>

Gợi ý:
  git add .
  git commit -m "<loại>: <mô tả ngắn gọn>"
  git push

Gõ "ok" hoặc "commit" để tôi chạy. Gõ "skip" nếu tự commit sau.
```

### Khi mắc lỗi
Ngay khi phát hiện sai, append vào `MISTAKES.md`:
```
### [YYYY-MM-DD] <tên lỗi ngắn>
**Lỗi:** <làm gì sai>
**Fix:** <đã sửa thế nào>
**Lesson:** <rule cần nhớ>
```

---

## Context Monitoring
Sau mỗi câu trả lời, báo cáo ngắn: `📊 Context: ~XX% | Bloat: [nguồn lớn nhất nếu > 40%]`
- < 40%: OK · 40–70%: gợi ý trim · > 70%: đề xuất `/clear`
