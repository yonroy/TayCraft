"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatVnd } from "@/lib/utils";

// Kênh liên hệ admin cho fallback "chờ duyệt tay" — set ở env (NEXT_PUBLIC_*), để trống nếu không dùng.
const CONTACT = {
  zalo: process.env.NEXT_PUBLIC_CONTACT_ZALO, // số điện thoại Zalo, vd 0901234567
  messenger: process.env.NEXT_PUBLIC_CONTACT_FB, // URL đầy đủ, vd https://m.me/yourpage
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL, // vd hotro@taycraft.vn
};
const HAS_CONTACT = Boolean(CONTACT.zalo || CONTACT.messenger || CONTACT.email);

// Sau bao lâu chưa nhận được tiền thì gợi ý liên hệ admin (ms).
const HELP_DELAY_MS = 60_000;

interface OrderData {
  id: string;
  amountVnd: number;
  transferCode: string;
  transferContent: string; // nội dung CK đầy đủ hiển thị (có tiền tố SEVQR nếu VietinBank)
  qrUrl: string;
  bank: { bank: string; account: string; accountName: string };
}

export function QrCheckout({ product, productLabel }: { product?: string; productLabel?: string }) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tạo đơn khi vào trang (và mỗi lần bấm "Thử lại" → tăng attempt để chạy lại effect).
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product }),
        });
        const data = await res.json();
        if (!active) return;
        if (data.alreadyOwned) {
          router.replace("/learn");
          return;
        }
        if (!res.ok) {
          setError(data.error ?? "Không tạo được đơn hàng. Bạn thử lại nhé.");
          return;
        }
        setOrder(data);
      } catch {
        if (active) setError("Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.");
      }
    })();
    return () => {
      active = false;
    };
  }, [router, product, attempt]);

  // Poll trạng thái mỗi 4s.
  useEffect(() => {
    if (!order) return;
    pollRef.current = setInterval(async () => {
      const res = await fetch(`/api/orders/${order.id}/status`);
      if (!res.ok) return;
      const { status } = await res.json();
      if (status === "paid") {
        setPaid(true);
        if (pollRef.current) clearInterval(pollRef.current);
        // Để khách kịp đọc lời chúc; vẫn tự dẫn vào khu học nếu họ không bấm nút.
        setTimeout(() => {
          router.push("/learn");
          router.refresh();
        }, 6000);
      }
    }, 4000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [order, router]);

  // Sau HELP_DELAY_MS chưa nhận được tiền → hiện khối liên hệ admin (poll vẫn chạy tiếp).
  useEffect(() => {
    if (!order || paid) return;
    const t = setTimeout(() => setShowHelp(true), HELP_DELAY_MS);
    return () => clearTimeout(t);
  }, [order, paid]);

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  }

  if (error) {
    return (
      <div className="co-alert">
        <p>{error}</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setError(null);
            setOrder(null);
            setAttempt((a) => a + 1);
          }}
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (paid) {
    return (
      <div className="co-success">
        <div className="emoji">🎉</div>
        <h2>Chúc mừng bạn!</h2>
        <p>
          Bạn đã mở khóa <b style={{ color: "var(--ink)" }}>{productLabel ?? "gói học"}</b> — chúc bạn
          học thật vui và hiểu AI tới tận con số ✍️
        </p>
        <div style={{ marginTop: 22 }}>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => {
              router.push("/learn");
              router.refresh();
            }}
          >
            Vào học ngay →
          </button>
        </div>
        <p className="tiny" style={{ color: "var(--dim)" }}>
          Tự động chuyển vào khu học sau vài giây…
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="co-card" style={{ textAlign: "center" }}>
        <p className="co-qr-sub">Đang tạo đơn hàng…</p>
      </div>
    );
  }

  return (
    <div className="co-card">
      <div className="co-qr-title">Quét QR để thanh toán</div>
      <p className="co-qr-sub">
        Mở app ngân hàng, quét mã. Hệ thống tự mở khóa sau khi nhận được tiền.
      </p>
      <p className="co-steps">① Quét &amp; chuyển khoản → ② Chờ xác nhận → ③ Tự mở khóa</p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={order.qrUrl} alt="QR chuyển khoản" width={260} height={340} className="co-qr-img" />

      <div className="co-rows">
        <Row label="Ngân hàng" value={order.bank.bank} />
        <Row
          label="Số tài khoản"
          value={order.bank.account}
          onCopy={() => copy(order.bank.account, "stk")}
          copied={copied === "stk"}
        />
        <Row label="Chủ tài khoản" value={order.bank.accountName} />
        <Row
          label="Số tiền"
          value={formatVnd(order.amountVnd)}
          onCopy={() => copy(String(order.amountVnd), "amount")}
          copied={copied === "amount"}
        />
        <Row
          label="Nội dung CK"
          value={order.transferContent}
          highlight
          onCopy={() => copy(order.transferContent, "code")}
          copied={copied === "code"}
        />
      </div>

      <p className="co-warn">
        ⚠️ Giữ <b>nguyên nội dung chuyển khoản</b> (cả từ khóa đầu) để hệ thống nhận diện đơn của bạn.
      </p>

      <div className="co-waiting">
        <span className="co-dot" />
        Đang chờ chuyển khoản — tự mở khóa ngay khi nhận được (thường dưới 1 phút)
      </div>

      {showHelp && <AdminFallback order={order} onCopy={copy} copied={copied} />}
    </div>
  );
}

// Khối fallback: hiện sau ~60s nếu chưa tự nhận được tiền → khách nhắn admin duyệt tay.
function AdminFallback({
  order,
  onCopy,
  copied,
}: {
  order: OrderData;
  onCopy: (text: string, label: string) => void;
  copied: string | null;
}) {
  const msg = `Tôi đã chuyển khoản đơn ${order.transferCode} (${formatVnd(
    order.amountVnd,
  )}). Nhờ admin kiểm tra và mở khóa giúp ạ.`;
  const subject = `Xác nhận thanh toán ${order.transferCode}`;

  return (
    <div className="co-fallback">
      <h3>Đã chuyển khoản mà chưa mở khóa? 🤔</h3>
      <p>
        Hệ thống thường tự mở khóa trong 1–2 phút. Nếu đã lâu, nhắn cho admin kèm mã đơn{" "}
        <b className="co-mono">{order.transferCode}</b> để được duyệt tay (thường trong vài giờ).
      </p>

      <div className="co-actions">
        {CONTACT.zalo && (
          <ContactLink href={`https://zalo.me/${CONTACT.zalo}`} label="💬 Nhắn Zalo" />
        )}
        {CONTACT.messenger && <ContactLink href={CONTACT.messenger} label="💬 Messenger" />}
        {CONTACT.email && (
          <ContactLink
            href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(
              subject,
            )}&body=${encodeURIComponent(msg)}`}
            label="✉️ Gửi email"
          />
        )}
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => onCopy(msg, "msg")}>
          {copied === "msg" ? "✓ Đã copy lời nhắn" : "Copy lời nhắn"}
        </button>
      </div>

      {!HAS_CONTACT && (
        <p style={{ marginTop: 8 }}>
          Copy lời nhắn trên rồi gửi cho admin qua kênh liên hệ trên trang chủ.
        </p>
      )}
    </div>
  );
}

function ContactLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
      {label}
    </a>
  );
}

function Row({
  label,
  value,
  highlight,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  onCopy?: () => void;
  copied?: boolean;
}) {
  return (
    <div className="co-row">
      <span className="co-k">{label}</span>
      <span className={highlight ? "co-v hl" : "co-v"}>
        {value}
        {onCopy && (
          <button type="button" className="co-copy" onClick={onCopy}>
            {copied ? "✓" : "Copy"}
          </button>
        )}
      </span>
    </div>
  );
}
