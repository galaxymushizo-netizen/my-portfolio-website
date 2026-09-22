"use client";

import { useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import { Reveal, SectionHeading } from "@/components/primitives";
import { pick } from "@/lib/types";
import type { LinkItem, Profile } from "@/lib/types";

type Status = "idle" | "sending" | "sent" | "error";

export function ConnectSection({
  profile,
  links,
}: {
  profile: Profile;
  links: LinkItem[];
}) {
  const { t, lang } = useLang();
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lang }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const field =
    "w-full rounded-xl border border-white/[0.09] bg-white/[0.02] px-4 py-3 text-sm text-mist-50 transition-colors placeholder:text-mist-500 focus:border-signal-400/50";

  return (
    <section id="connect" className="relative scroll-mt-20 border-t border-white/[0.06] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={t("connect.eyebrow")}
          title={t("connect.title")}
          subtitle={t("connect.subtitle")}
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <Reveal>
            <div className="space-y-5">
              {profile.email ? (
                <a
                  href={`mailto:${profile.email}`}
                  className="hover-lift group flex items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.012] px-5 py-4"
                >
                  <span>
                    <span className="block text-[0.66rem] uppercase tracking-[0.18em] text-mist-500">
                      {t("connect.emailDirect")}
                    </span>
                    <span className="display mt-1 block text-base text-mist-50 group-hover:text-signal-300">
                      {profile.email}
                    </span>
                  </span>
                  <span className="glyph text-lg">☍</span>
                </a>
              ) : null}

              {profile.whatsapp ? (
                <a
                  href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover-lift group flex items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.012] px-5 py-4"
                >
                  <span>
                    <span className="block text-[0.66rem] uppercase tracking-[0.18em] text-mist-500">
                      {t("connect.whatsapp")}
                    </span>
                    <span className="display mt-1 block text-base text-mist-50 group-hover:text-signal-300">
                      {profile.whatsapp}
                    </span>
                  </span>
                  <span className="glyph text-lg">⊹</span>
                </a>
              ) : null}
            </div>

            {links.length > 0 ? (
              <div className="mt-10">
                <p className="eyebrow">{t("connect.socials")}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-4 py-2 font-display text-xs uppercase tracking-[0.14em] text-mist-300 transition-all duration-400 hover:border-signal-400/40 hover:text-signal-300"
                    >
                      {link.label}
                      <span className="text-mist-500 transition-transform group-hover:translate-x-0.5">
                        ↗
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-12 border-l border-signal-400/30 pl-5">
              <p className="display text-sm italic text-mist-300">
                “{t("footer.philosophy")}”
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <form onSubmit={submit} className="card-surface rounded-2xl p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[0.66rem] uppercase tracking-[0.16em] text-mist-500">
                    {t("connect.name")}
                  </span>
                  <input
                    className={field}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ada"
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[0.66rem] uppercase tracking-[0.16em] text-mist-500">
                    {t("connect.email")}
                  </span>
                  <input
                    type="email"
                    className={field}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                </label>
              </div>
              <label className="mt-4 block">
                <span className="mb-2 block text-[0.66rem] uppercase tracking-[0.16em] text-mist-500">
                  {t("connect.subject")}
                </span>
                <input
                  className={field}
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Let's build something"
                />
              </label>
              <label className="mt-4 block">
                <span className="mb-2 block text-[0.66rem] uppercase tracking-[0.16em] text-mist-500">
                  {t("connect.message")}
                </span>
                <textarea
                  rows={6}
                  className={`${field} resize-y`}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Hello Galaxy…"
                  required
                />
              </label>

              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-signal-400 px-6 py-3.5 font-display text-sm text-ink-950 transition-all duration-500 hover:bg-signal-300 disabled:opacity-60 sm:w-auto"
              >
                {status === "sending" ? t("connect.sending") : t("connect.send")}
                <span>→</span>
              </button>

              <div className="mt-4 min-h-[1.25rem]">
                {status === "sent" ? (
                  <p className="text-sm text-signal-300">{t("connect.sent")}</p>
                ) : null}
                {status === "error" ? (
                  <p className="text-sm text-amber-300">
                    {form.name.trim() && form.message.trim()
                      ? t("connect.error")
                      : t("connect.required")}
                  </p>
                ) : null}
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
