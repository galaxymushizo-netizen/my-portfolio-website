"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Panel, TextField } from "@/components/admin/fields";

export function AccountForm({ email, username }: { email: string; username: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ email, username, currentPassword: "", newPassword: "" });
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  const save = async () => {
    setStatus("saving");
    setMessage("");
    const res = await fetch("/api/admin/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setStatus("error");
      setMessage(data.error ?? "Could not save");
      return;
    }
    setStatus("saved");
    setForm((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
    router.refresh();
    window.setTimeout(() => setStatus("idle"), 2400);
  };

  return (
    <div>
      <header className="mb-8">
        <p className="eyebrow">Security</p>
        <h1 className="display mt-2 text-3xl text-mist-50">Account</h1>
        <p className="mt-2 max-w-xl text-sm text-mist-400">
          This is the only way into the control room. Sessions last 30 days and are stored
          server-side.
        </p>
      </header>

      <div className="max-w-2xl space-y-6">
        <Panel title="Login identity">
          <TextField label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <TextField
            label="Username"
            value={form.username}
            onChange={(v) => setForm({ ...form, username: v })}
          />
        </Panel>

        <Panel title="Password" description="Leave blank to keep your current password.">
          <TextField
            label="Current password"
            type="password"
            value={form.currentPassword}
            onChange={(v) => setForm({ ...form, currentPassword: v })}
          />
          <TextField
            label="New password (min 8 characters)"
            type="password"
            value={form.newPassword}
            onChange={(v) => setForm({ ...form, newPassword: v })}
          />
        </Panel>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={save}
            disabled={status === "saving"}
            className="rounded-full bg-signal-400 px-6 py-2.5 font-display text-sm text-ink-950 disabled:opacity-50"
          >
            {status === "saving" ? "Saving…" : "Save account"}
          </button>
          {status === "saved" ? <span className="text-sm text-signal-300">Saved ✓</span> : null}
          {status === "error" ? <span className="text-sm text-red-300">{message}</span> : null}
        </div>
      </div>
    </div>
  );
}
