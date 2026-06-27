"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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

export function QrCheckout({ product }: { product?: string }) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tạo đơn khi vào trang.
  useEffect(() => {
    let active = true;
    (async () => {
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
        setError(data.error ?? "Có lỗi xảy ra");
        return;
      }
      setOrder(data);
    })();
    return () => {
      active = false;
    };
  }, [router, product]);

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
        setTimeout(() => {
          router.push("/learn");
          router.refresh();
        }, 1500);
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
    return <p className="text-center text-accent-2">{error}</p>;
  }

  if (paid) {
    return (
      <div className="text-center rounded-3xl border border-accent bg-paper p-10">
        <div className="text-5xl">✅</div>
        <h2 className="mt-3 text-xl font-bold">Thanh toán thành công!</h2>
        <p className="mt-2 text-dim">Đang mở khóa trọn bộ cho bạn…</p>
      </div>
    );
  }

  if (!order) {
    return <p className="text-center text-dim">Đang tạo đơn hàng…</p>;
  }

  return (
    <div className="rounded-3xl border border-line p-6 sm:p-8">
      <h2 className="text-xl font-bold text-center">Quét QR để thanh toán</h2>
      <p className="text-center text-dim text-sm mt-1">
        Mở app ngân hàng, quét mã. Hệ thống tự mở khóa sau khi nhận được tiền.
      </p>

      <div className="mt-6 flex flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={order.qrUrl}
          alt="QR chuyển khoản"
          width={260}
          height={340}
          className="rounded-xl border border-line"
        />
      </div>

      <dl className="mt-6 space-y-2 text-sm">
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
      </dl>

      <p className="mt-5 text-xs text-dim text-center">
        ⚠️ Giữ <b>nguyên nội dung chuyển khoản</b> (cả từ khóa đầu) để hệ thống nhận diện đơn của bạn.
      </p>

      <div className="mt-4 flex items-center justify-center gap-2 text-dim text-sm">
        <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
        Đang chờ thanh toán…
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
    <div className="mt-6 rounded-2xl border border-accent-2/40 bg-accent-2/5 p-5">
      <h3 className="text-sm font-bold">Đã chuyển khoản mà chưa mở khóa? 🤔</h3>
      <p className="mt-1 text-xs text-dim">
        Hệ thống thường tự mở khóa trong 1–2 phút. Nếu đã lâu, nhắn cho admin kèm mã đơn{" "}
        <b className="font-mono text-accent-2">{order.transferCode}</b> để được duyệt tay (thường
        trong vài giờ).
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
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
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-3 text-xs"
          onClick={() => onCopy(msg, "msg")}
        >
          {copied === "msg" ? "✓ Đã copy lời nhắn" : "Copy lời nhắn"}
        </Button>
      </div>

      {!HAS_CONTACT && (
        <p className="mt-2 text-xs text-dim">
          Copy lời nhắn trên rồi gửi cho admin qua kênh liên hệ trên trang chủ.
        </p>
      )}
    </div>
  );
}

function ContactLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-9 items-center rounded-lg border border-line px-3 text-xs font-medium hover:bg-line/40"
    >
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
    <div className="flex items-center justify-between gap-3 border-b border-line/60 pb-2">
      <dt className="text-dim">{label}</dt>
      <dd className="flex items-center gap-2">
        <span className={highlight ? "font-mono font-bold text-accent-2" : "font-medium"}>
          {value}
        </span>
        {onCopy && (
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={onCopy}>
            {copied ? "✓" : "Copy"}
          </Button>
        )}
      </dd>
    </div>
  );
}
