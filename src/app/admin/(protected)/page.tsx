import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { messages, projects, thoughts } from "@/db/schema";
import { getSiteData } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const user = await requireAdmin();
  const data = await getSiteData();
  const unread = await db
    .select({ id: messages.id })
    .from(messages)
    .where(eq(messages.read, false));
  const recent = await db.select().from(messages).orderBy(desc(messages.createdAt)).limit(4);

  const stats = [
    { label: "Projects", value: data.projects.length, glyph: "⟁", href: "/admin/projects" },
    {
      label: "Published thoughts",
      value: data.thoughts.filter((t) => t.published).length,
      glyph: "⊹",
      href: "/admin/thoughts",
    },
    { label: "Drafts", value: data.thoughts.filter((t) => !t.published).length, glyph: "✦", href: "/admin/thoughts" },
    { label: "Unread messages", value: unread.length, glyph: "☍", href: "/admin/messages" },
  ];

  const quickLinks = [
    { href: "/admin/site", label: "Landing question, hero text & symbols" },
    { href: "/admin/profile", label: "Photo, biography, timeline & skills" },
    { href: "/admin/projects", label: "Add, edit, feature and reorder projects" },
    { href: "/admin/thoughts", label: "Write and publish thoughts" },
    { href: "/admin/account", label: "Change password or login identity" },
  ];

  return (
    <div>
      <header className="mb-10">
        <p className="eyebrow">Control room</p>
        <h1 className="display mt-2 text-3xl text-mist-50 sm:text-4xl">
          Hello, {user.username}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-mist-400">
          Everything on the public site is editable here. Changes appear immediately — no
          rebuild, no deploy.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="hover-lift group rounded-2xl border border-white/[0.07] bg-white/[0.012] p-5"
          >
            <span className="glyph text-lg">{stat.glyph}</span>
            <p className="display mt-3 text-3xl text-mist-50">{stat.value}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-mist-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.012] p-6">
          <h2 className="display text-lg text-mist-50">Quick edits</h2>
          <div className="mt-4 divide-y divide-white/[0.06]">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between gap-4 py-3 text-sm text-mist-300 transition-colors hover:text-signal-300"
              >
                {link.label}
                <span>→</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.012] p-6">
          <h2 className="display text-lg text-mist-50">Latest messages</h2>
          {recent.length === 0 ? (
            <p className="mt-4 text-sm text-mist-500">No messages yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {recent.map((message) => (
                <div
                  key={message.id}
                  className="rounded-xl border border-white/[0.06] bg-ink-900/40 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-display text-sm text-mist-50">{message.name}</p>
                    <span className="text-[0.65rem] uppercase tracking-[0.14em] text-mist-600">
                      {message.createdAt.toISOString().slice(0, 10)}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-mist-400">
                    {message.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
