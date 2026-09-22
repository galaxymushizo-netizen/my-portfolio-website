"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type MessageItem = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export function MessagesView({ initial }: { initial: MessageItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleRead = async (item: MessageItem) => {
    setItems((prev) => prev.map((m) => (m.id === item.id ? { ...m, read: !m.read } : m)));
    await fetch(`/api/admin/messages/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !item.read }),
    });
    router.refresh();
  };

  const remove = async (id: number) => {
    if (!window.confirm("Delete this message?")) return;
    setItems((prev) => prev.filter((m) => m.id !== id));
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div>
      <header className="mb-8">
        <p className="eyebrow">Inbox</p>
        <h1 className="display mt-2 text-3xl text-mist-50">Messages</h1>
        <p className="mt-2 max-w-xl text-sm text-mist-400">
          Visitors do not need an account to write to you. Everything they send lands here.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.12] p-12 text-center">
          <p className="text-sm text-mist-500">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border bg-white/[0.012] transition-colors ${
                item.read ? "border-white/[0.05]" : "border-signal-400/25"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="flex w-full flex-wrap items-center gap-3 p-4 text-left"
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${item.read ? "bg-mist-600" : "bg-signal-400"}`}
                />
                <span className="min-w-0 flex-1">
                  <span className="display block truncate text-base text-mist-50">
                    {item.name}
                    {item.subject ? (
                      <span className="ml-2 text-sm text-mist-400">— {item.subject}</span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-mist-500">
                    {item.email || "no email"} · {item.createdAt.slice(0, 10)}
                  </span>
                </span>
                <span className="font-display text-xs text-mist-400">
                  {openId === item.id ? "−" : "+"}
                </span>
              </button>

              {openId === item.id ? (
                <div className="space-y-4 border-t border-white/[0.06] p-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-mist-300">
                    {item.message}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.email ? (
                      <a
                        href={`mailto:${item.email}`}
                        className="rounded-full border border-white/[0.12] px-4 py-1.5 font-display text-xs uppercase tracking-[0.14em] text-mist-200"
                      >
                        Reply by email
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => toggleRead(item)}
                      className="rounded-full border border-white/[0.12] px-4 py-1.5 font-display text-xs uppercase tracking-[0.14em] text-mist-300"
                    >
                      {item.read ? "Mark unread" : "Mark read"}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="rounded-full border border-red-400/40 px-4 py-1.5 font-display text-xs uppercase tracking-[0.14em] text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
