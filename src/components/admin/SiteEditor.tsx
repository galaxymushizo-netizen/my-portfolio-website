"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BilingualField,
  ImageField,
  Panel,
  SaveBar,
  TextField,
} from "@/components/admin/fields";
import type { SiteSettings } from "@/lib/types";

type Status = "idle" | "saving" | "saved" | "error";

export function SiteEditor({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [form, setForm] = useState<SiteSettings>(initial);
  const [status, setStatus] = useState<Status>("idle");

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("saved");
      router.refresh();
      window.setTimeout(() => setStatus("idle"), 2200);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div>
      <header className="mb-8">
        <p className="eyebrow">Homepage</p>
        <h1 className="display mt-2 text-3xl text-mist-50">Site & landing</h1>
        <p className="mt-2 max-w-xl text-sm text-mist-400">
          The first question a visitor sees, the hero copy, the paths they can choose, and the
          decorative symbols used across the site.
        </p>
      </header>

      <div className="space-y-6">
        <Panel title="Identity" description="Browser title and the description used by search engines and link previews.">
          <TextField
            label="Website title"
            value={form.siteTitle}
            onChange={(v) => set("siteTitle", v)}
          />
          <BilingualField
            label="Site description"
            value={form.siteDescription}
            onChange={(v) => set("siteDescription", v)}
            rows={2}
          />
          <ImageField
            label="Social share image"
            value={form.metaImage}
            onChange={(v) => set("metaImage", v)}
          />
        </Panel>

        <Panel title="Landing question" description="Shown full-screen before anything else.">
          <BilingualField
            label="Question"
            value={form.landingQuestion}
            onChange={(v) => set("landingQuestion", v)}
            rows={1}
          />
          <BilingualField
            label="Hint under the question"
            value={form.landingHint}
            onChange={(v) => set("landingHint", v)}
            rows={2}
          />
        </Panel>

        <Panel title="The three paths">
          <BilingualField
            label="Path 1 — work"
            value={form.pathWork}
            onChange={(v) => set("pathWork", v)}
            rows={1}
          />
          <BilingualField
            label="Path 1 — description"
            value={form.pathWorkHint}
            onChange={(v) => set("pathWorkHint", v)}
            rows={1}
          />
          <BilingualField
            label="Path 2 — me"
            value={form.pathMe}
            onChange={(v) => set("pathMe", v)}
            rows={1}
          />
          <BilingualField
            label="Path 2 — description"
            value={form.pathMeHint}
            onChange={(v) => set("pathMeHint", v)}
            rows={1}
          />
          <BilingualField
            label="Path 3 — connect"
            value={form.pathConnect}
            onChange={(v) => set("pathConnect", v)}
            rows={1}
          />
          <BilingualField
            label="Path 3 — description"
            value={form.pathConnectHint}
            onChange={(v) => set("pathConnectHint", v)}
            rows={1}
          />
        </Panel>

        <Panel title="Hero" description="The section revealed once a visitor chooses a door.">
          <BilingualField
            label="Kicker"
            value={form.heroKicker}
            onChange={(v) => set("heroKicker", v)}
            rows={1}
          />
          <BilingualField
            label="Headline"
            value={form.heroTitle}
            onChange={(v) => set("heroTitle", v)}
            rows={2}
          />
          <BilingualField
            label="Subtitle"
            value={form.heroSubtitle}
            onChange={(v) => set("heroSubtitle", v)}
            rows={3}
          />
          <BilingualField
            label="Philosophy line"
            value={form.philosophy}
            onChange={(v) => set("philosophy", v)}
            rows={2}
          />
        </Panel>

        <Panel
          title="Decorative symbols"
          description="Separated by spaces. Used sparingly across the site as drifting marks."
        >
          <TextField
            label="Symbols"
            value={form.symbols}
            onChange={(v) => set("symbols", v)}
            placeholder="⌁ ◉ ⟁ ☍ ✦ ⌘ ⊹"
          />
          <div className="flex flex-wrap gap-3 pt-1">
            {form.symbols
              .split(/\s+/)
              .filter(Boolean)
              .map((glyph, i) => (
                <span key={i} className="glyph text-2xl">
                  {glyph}
                </span>
              ))}
          </div>
        </Panel>
      </div>

      <SaveBar onSave={save} status={status} />
    </div>
  );
}
