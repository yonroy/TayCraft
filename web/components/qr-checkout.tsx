"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatVnd } from "@/lib/utils";

interface OrderData {
  id: string;
  amountVnd: number;
  transferCode: string;
  qrUrl: string;
  bank: { bank: string; account: string; accountName: string };
}

export function QrCheckout() {
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tạo đơn khi vào trang.
  useEffect(() => {
    let active = true;
    (async () => {
      const res = await fetch("/api/orders", { method: "POST" });
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
  }, [router]);

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
          value={order.transferCode}
          highlight
          onCopy={() => copy(order.transferCode, "code")}
          copied={copied === "code"}
        />
      </dl>

      <p className="mt-5 text-xs text-dim text-center">
        ⚠️ Nhập đúng <b>nội dung chuyển khoản</b> để hệ thống nhận diện đơn của bạn.
      </p>

      <div className="mt-4 flex items-center justify-center gap-2 text-dim text-sm">
        <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
        Đang chờ thanh toán…
      </div>
    </div>
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
