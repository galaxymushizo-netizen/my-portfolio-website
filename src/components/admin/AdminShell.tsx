"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

const NAV = [
  { href: "/admin", label: "Overview", glyph: "⌁" },
  { href: "/admin/site", label: "Site", glyph: "◉" },
  { href: "/admin/profile", label: "Profile & About", glyph: "✦" },
  { href: "/admin/projects", label: "Projects", glyph: "⟁" },
  { href: "/admin/thoughts", label: "Thoughts", glyph: "⊹" },
  { href: "/admin/messages", label: "Messages", glyph: "☍" },
  { href: "/admin/account", label: "Account", glyph: "⌘" },
];

export function AdminShell({
  username,
  children,
}: {
  username: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-ink-950 text-mist-50">
      <div className="mx-auto flex max-w-[1400px] gap-0 lg:gap-8">
        <aside className="hidden w-60 shrink-0 border-r border-white/[0.06] lg:block">
          <div className="sticky top-0 flex h-screen flex-col py-8">
            <Link href="/admin" className="mb-8 flex items-center gap-2.5 px-6">
              <span className="font-display text-xl text-signal-400">⌘</span>
              <span>
                <span className="display block text-sm leading-tight text-mist-50">Galaxy</span>
                <span className="font-display text-[0.6rem] uppercase tracking-[0.2em] text-mist-500">
                  control room
                </span>
              </span>
            </Link>
            <nav className="flex-1 space-y-0.5 px-3">
              {NAV.map((item) => {
                const active =
                  item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                      active
                        ? "bg-white/[0.06] text-mist-50"
                        : "text-mist-400 hover:bg-white/[0.03] hover:text-mist-100"
                    }`}
                  >
                    <span
                      className={`font-display text-sm ${active ? "text-signal-400" : "text-mist-600"}`}
                    >
                      {item.glyph}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="space-y-3 px-6">
              <Link
                href="/"
                target="_blank"
                className="block font-display text-[0.68rem] uppercase tracking-[0.16em] text-mist-500 transition-colors hover:text-signal-300"
              >
                View site ↗
              </Link>
              <p className="text-xs text-mist-600">{username}</p>
              <button
                type="button"
                onClick={logout}
                disabled={loggingOut}
                className="w-full rounded-lg border border-white/[0.09] px-3 py-2 font-display text-[0.68rem] uppercase tracking-[0.16em] text-mist-300 transition-colors hover:border-red-400/40 hover:text-red-300 disabled:opacity-50"
              >
                {loggingOut ? "…" : "Log out"}
              </button>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-ink-950/90 backdrop-blur-xl lg:hidden">
            <div className="flex items-center justify-between px-5 py-3">
              <Link href="/admin" className="flex items-center gap-2">
                <span className="font-display text-lg text-signal-400">⌘</span>
                <span className="display text-sm">Galaxy</span>
              </Link>
              <div className="flex gap-2">
                <Link
                  href="/"
                  target="_blank"
                  className="rounded-lg border border-white/[0.09] px-3 py-1.5 font-display text-[0.62rem] uppercase tracking-[0.16em] text-mist-300"
                >
                  Site ↗
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-lg border border-white/[0.09] px-3 py-1.5 font-display text-[0.62rem] uppercase tracking-[0.16em] text-mist-300"
                >
                  Exit
                </button>
              </div>
            </div>
            <div className="no-scrollbar flex gap-1 overflow-x-auto px-4 pb-3">
              {NAV.map((item) => {
                const active =
                  item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`shrink-0 rounded-full border px-3 py-1.5 font-display text-[0.62rem] uppercase tracking-[0.14em] ${
                      active
                        ? "border-signal-400/50 text-signal-300"
                        : "border-white/[0.08] text-mist-400"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </header>

          <main className="px-5 py-8 sm:px-8 lg:py-12">{children}</main>
        </div>
      </div>
    </div>
  );
}
