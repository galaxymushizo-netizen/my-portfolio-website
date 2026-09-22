"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { inputClass, labelClass } from "@/components/admin/fields";

export function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Login failed");
        setBusy(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Network error");
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 60% at 50% 0%, rgba(196,248,42,0.06), transparent 60%), #06070a",
        }}
      />
      <div className="relative w-full max-w-sm">
        <div className="mb-10 text-center">
          <span className="font-display text-3xl text-signal-400">⌘</span>
          <h1 className="display mt-4 text-2xl text-mist-50">Galaxy · Control room</h1>
          <p className="mt-2 text-sm text-mist-500">
            Only the administrator can enter. Start. Build. Learn.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="space-y-4 rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6"
        >
          <label className="block">
            <span className={labelClass}>Email or username</span>
            <input
              className={inputClass}
              value={identifier}
              autoComplete="username"
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="admin@galaxy.dev"
              required
            />
          </label>
          <label className="block">
            <span className={labelClass}>Password</span>
            <input
              className={inputClass}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {error ? <p className="text-sm text-red-300">{error}</p> : null}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-signal-400 px-6 py-3 font-display text-sm text-ink-950 transition-colors hover:bg-signal-300 disabled:opacity-60"
          >
            {busy ? "Checking…" : "Enter"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-relaxed text-mist-600">
          Default credentials are set through the ADMIN_EMAIL / ADMIN_PASSWORD
          environment variables.
        </p>
      </div>
    </div>
  );
}
