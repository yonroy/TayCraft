# Email Templates cho Supabase Auth (OTP 6 số)

Dán vào **Supabase Dashboard → Authentication → Email Templates**.
Mục tiêu: hiển thị **mã 6 số `{{ .Token }}`** để khách gõ ngay trong webview (Facebook/Instagram),
kèm nút link dự phòng `{{ .ConfirmationURL }}` cho ai mở bằng trình duyệt thường.

- **Confirm signup** → gửi cho user MỚI (lần đầu nhập email).
- **Magic Link** → gửi cho user CŨ (đã từng đăng nhập, quay lại).

Nội dung 2 bản gần như giống nhau, chỉ khác câu chào. Cả hai đều dùng `{{ .Token }}`.

---

## 1) Template: Confirm signup

**Subject:**
```
Mã đăng nhập Làm toán AI: {{ .Token }}
```

**Message body (HTML):**
```html
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7f9;padding:24px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <tr>
    <td align="center">
      <table width="440" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e6e8ec;">
        <tr>
          <td style="padding:28px 32px 8px;text-align:center;">
            <div style="font-size:20px;font-weight:800;color:#0e7490;">Làm toán AI ✍️</div>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 32px 0;text-align:center;">
            <p style="margin:0;font-size:15px;color:#3a4250;">Chào mừng bạn! Đây là mã đăng nhập để vào học:</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;text-align:center;">
            <div style="display:inline-block;background:#fff7ed;border:1px solid #fdba74;border-radius:12px;padding:14px 28px;">
              <span style="font-size:34px;font-weight:800;letter-spacing:10px;color:#b45309;font-family:'Courier New',monospace;">{{ .Token }}</span>
            </div>
            <p style="margin:12px 0 0;font-size:13px;color:#8a93a2;">Mã có hiệu lực trong 1 giờ. Đừng chia sẻ mã này cho ai.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 8px;text-align:center;">
            <p style="margin:0;font-size:13px;color:#8a93a2;">Hoặc bấm nút bên dưới nếu bạn mở email trên trình duyệt:</p>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 32px 28px;text-align:center;">
            <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#0e7490;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:12px 28px;border-radius:10px;">Vào học ngay →</a>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px;background:#fafbfc;border-top:1px solid #eef0f3;text-align:center;">
            <p style="margin:0;font-size:12px;color:#98a1af;">Nếu bạn không yêu cầu email này, bỏ qua nó nhé.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```

---

## 2) Template: Magic Link

**Subject:**
```
Mã đăng nhập Làm toán AI: {{ .Token }}
```

**Message body (HTML):**
```html
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7f9;padding:24px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <tr>
    <td align="center">
      <table width="440" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e6e8ec;">
        <tr>
          <td style="padding:28px 32px 8px;text-align:center;">
            <div style="font-size:20px;font-weight:800;color:#0e7490;">Làm toán AI ✍️</div>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 32px 0;text-align:center;">
            <p style="margin:0;font-size:15px;color:#3a4250;">Mừng bạn quay lại! Đây là mã đăng nhập của bạn:</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;text-align:center;">
            <div style="display:inline-block;background:#fff7ed;border:1px solid #fdba74;border-radius:12px;padding:14px 28px;">
              <span style="font-size:34px;font-weight:800;letter-spacing:10px;color:#b45309;font-family:'Courier New',monospace;">{{ .Token }}</span>
            </div>
            <p style="margin:12px 0 0;font-size:13px;color:#8a93a2;">Mã có hiệu lực trong 1 giờ. Đừng chia sẻ mã này cho ai.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 8px;text-align:center;">
            <p style="margin:0;font-size:13px;color:#8a93a2;">Hoặc bấm nút bên dưới nếu bạn mở email trên trình duyệt:</p>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 32px 28px;text-align:center;">
            <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#0e7490;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:12px 28px;border-radius:10px;">Vào học ngay →</a>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px;background:#fafbfc;border-top:1px solid #eef0f3;text-align:center;">
            <p style="margin:0;font-size:12px;color:#98a1af;">Nếu bạn không yêu cầu email này, bỏ qua nó nhé.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```

---

## Lưu ý

- **Bắt buộc có `{{ .Token }}`** trong body — đây là mã 6 số. Không có nó thì form OTP vô dụng.
- Giữ `{{ .ConfirmationURL }}` làm dự phòng: ai mở email bằng trình duyệt thường bấm link vẫn vào được qua `/auth/callback`.
- Sau khi dán xong 2 template, bấm **Save** cho từng cái.
- Nếu muốn giảm khả năng vào Spam: đảm bảo đã nối **Custom SMTP** (Resend) với domain `lamtoanai.xyz` đã verify — gửi từ `noreply@lamtoanai.xyz` uy tín hơn địa chỉ mặc định của Supabase.
