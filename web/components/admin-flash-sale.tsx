"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { FlashSaleConfig } from "@/lib/settings";

export function AdminFlashSale({ initial }: { initial: FlashSaleConfig }) {
  const [cfg, setCfg] = useState<FlashSaleConfig>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function set<K extends keyof FlashSaleConfig>(k: K, v: FlashSaleConfig[K]) {
    setCfg((c) => ({ ...c, [k]: v }));
    setMsg(null);
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/flash-sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cfg),
      });
      const data = await res.json();
      setMsg(res.ok ? "Đã lưu ✓" : (data.error ?? "Lỗi khi lưu"));
    } catch {
      setMsg("Lỗi mạng khi lưu");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-line p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-bold">Flash sale & social proof</h2>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={cfg.enabled}
            onChange={(e) => set("enabled", e.target.checked)}
          />
          Bật
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2 text-sm">
          <span className="text-dim">Tiêu đề banner</span>
          <input
            className="mt-1 w-full rounded-lg border border-line px-3 py-2"
            value={cfg.headline}
            onChange={(e) => set("headline", e.target.value)}
          />
        </label>
        <label className="text-sm">
          <span className="text-dim">Đếm ngược (phút/khách)</span>
          <input
            type="number"
            min={1}
            className="mt-1 w-full rounded-lg border border-line px-3 py-2"
            value={cfg.countdownMinutes}
            onChange={(e) => set("countdownMinutes", Number(e.target.value))}
          />
        </label>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <label>
            <span className="text-dim">Người xem (min)</span>
            <input
              type="number"
              min={0}
              className="mt-1 w-full rounded-lg border border-line px-3 py-2"
              value={cfg.viewerMin}
              onChange={(e) => set("viewerMin", Number(e.target.value))}
            />
          </label>
          <label>
            <span className="text-dim">Người xem (max)</span>
            <input
              type="number"
              min={0}
              className="mt-1 w-full rounded-lg border border-line px-3 py-2"
              value={cfg.viewerMax}
              onChange={(e) => set("viewerMax", Number(e.target.value))}
            />
          </label>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button onClick={save} disabled={saving}>
          {saving ? "Đang lưu…" : "Lưu cấu hình"}
        </Button>
        {msg && <span className="text-sm text-dim">{msg}</span>}
      </div>
      <p className="mt-2 text-xs text-dim">
        Đếm ngược là evergreen (mỗi khách một mốc, hết thì tự reset). Cần chạy{" "}
        <code>web/drizzle/flash-sale.sql</code> trên Supabase để lưu được; trước đó app dùng giá trị
        mặc định.
      </p>
    </div>
  );
}
