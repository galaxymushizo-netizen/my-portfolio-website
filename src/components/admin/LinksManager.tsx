"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Panel, inputClass, labelClass } from "@/components/admin/fields";
import type { LinkItem } from "@/lib/types";

export function LinksManager({ items }: { items: LinkItem[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState({ label: "", url: "", kind: "social" });

  const add = async () => {
    if (!draft.label.trim() || !draft.url.trim()) return;
    await fetch("/api/admin/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setDraft({ label: "", url: "", kind: "social" });
    router.refresh();
  };

  return (
    <div className="mt-12">
      <Panel
        title="Social & contact links"
        description="Shown in the Connect section and the footer. Anything can be added later."
      >
        <div className="space-y-2">
          {items.length === 0 ? (
            <p className="text-sm text-mist-500">No links yet.</p>
          ) : null}
          {items.map((link) => (
            <LinkRow key={link.id} link={link} />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-white/[0.12] p-4">
          <div className="min-w-[8rem] flex-1">
            <span className={labelClass}>Label</span>
            <input
              className={inputClass}
              value={draft.label}
              placeholder="GitHub"
              onChange={(e) => setDraft({ ...draft, label: e.target.value })}
            />
          </div>
          <div className="min-w-[12rem] flex-[2]">
            <span className={labelClass}>URL</span>
            <input
              className={inputClass}
              value={draft.url}
              placeholder="https://"
              onChange={(e) => setDraft({ ...draft, url: e.target.value })}
            />
          </div>
          <div className="w-28">
            <span className={labelClass}>Kind</span>
            <input
              className={inputClass}
              value={draft.kind}
              placeholder="social"
              onChange={(e) => setDraft({ ...draft, kind: e.target.value })}
            />
          </div>
          <button
            type="button"
            onClick={add}
            className="rounded-full border border-signal-400/40 px-5 py-2 font-display text-xs uppercase tracking-[0.16em] text-signal-300 transition-colors hover:bg-signal-400/10"
          >
            + Add link
          </button>
        </div>
      </Panel>
    </div>
  );
}

function LinkRow({ link }: { link: LinkItem }) {
  const router = useRouter();
  const [form, setForm] = useState(link);

  const save = async () => {
    await fetch(`/api/admin/links/${link.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.refresh();
  };

  const remove = async () => {
    await fetch(`/api/admin/links/${link.id}`, { method: "DELETE" });
    router.refresh();
  };

  const move = async (delta: number) => {
    await fetch(`/api/admin/links/${link.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, position: link.position + delta }),
    });
    router.refresh();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/[0.07] bg-ink-900/40 p-3">
      <input
        className={`${inputClass} w-full sm:w-32`}
        value={form.label}
        onChange={(e) => setForm({ ...form, label: e.target.value })}
      />
      <input
        className={`${inputClass} min-w-[10rem] flex-1`}
        value={form.url}
        onChange={(e) => setForm({ ...form, url: e.target.value })}
      />
      <input
        className={`${inputClass} w-24`}
        value={form.kind}
        onChange={(e) => setForm({ ...form, kind: e.target.value })}
      />
      <div className="flex gap-1.5">
        <button type="button" onClick={() => move(-1.5)} className="rounded-md border border-white/10 px-2 py-1.5 text-xs text-mist-300">
          ↑
        </button>
        <button type="button" onClick={() => move(1.5)} className="rounded-md border border-white/10 px-2 py-1.5 text-xs text-mist-300">
          ↓
        </button>
        <button type="button" onClick={save} className="rounded-full bg-signal-400 px-4 py-1.5 font-display text-xs text-ink-950">
          Save
        </button>
        <button type="button" onClick={remove} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-red-300">
          ✕
        </button>
      </div>
    </div>
  );
}
