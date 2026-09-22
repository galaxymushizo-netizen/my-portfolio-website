"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BilingualField,
  ImageField,
  Panel,
  SelectField,
  TextField,
  Toggle,
} from "@/components/admin/fields";
import { THOUGHT_CATEGORIES } from "@/lib/types";
import type { Bilingual, Thought } from "@/lib/types";

type Draft = {
  title: Bilingual;
  slug: string;
  excerpt: Bilingual;
  content: Bilingual;
  coverImage: string | null;
  category: string;
  published: boolean;
};

const emptyDraft = (): Draft => ({
  title: { en: "", sw: "" },
  slug: "",
  excerpt: { en: "", sw: "" },
  content: { en: "", sw: "" },
  coverImage: null,
  category: "life",
  published: false,
});

export function ThoughtsManager({ thoughts }: { thoughts: Thought[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [saving, setSaving] = useState(false);

  const create = async () => {
    if (!draft.title.en.trim() && !draft.title.sw.trim()) return;
    setSaving(true);
    const res = await fetch("/api/admin/thoughts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setSaving(false);
    if (res.ok) {
      setDraft(emptyDraft());
      router.refresh();
    }
  };

  return (
    <div>
      <header className="mb-8">
        <p className="eyebrow">Thoughts</p>
        <h1 className="display mt-2 text-3xl text-mist-50">Thoughts & writing</h1>
        <p className="mt-2 max-w-xl text-sm text-mist-400">
          Draft freely. Only published thoughts appear on the public site.
        </p>
      </header>

      <div className="space-y-4">
        {thoughts.length === 0 ? (
          <p className="text-sm text-mist-500">Nothing written yet.</p>
        ) : null}
        {thoughts.map((thought) => (
          <ThoughtRow key={thought.id} thought={thought} />
        ))}
      </div>

      <div className="mt-10">
        <Panel title="New thought">
          <DraftFields draft={draft} setDraft={setDraft} />
          <button
            type="button"
            onClick={create}
            disabled={saving}
            className="rounded-full bg-signal-400 px-6 py-2.5 font-display text-sm text-ink-950 disabled:opacity-50"
          >
            {saving ? "Creating…" : "+ Create thought"}
          </button>
        </Panel>
      </div>
    </div>
  );
}

function DraftFields({
  draft,
  setDraft,
}: {
  draft: Draft;
  setDraft: (updater: (prev: Draft) => Draft) => void;
}) {
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-4">
      <BilingualField label="Title" value={draft.title} onChange={(v) => set("title", v)} rows={1} />
      <TextField
        label="Slug (url)"
        value={draft.slug}
        placeholder="auto-generated from the English title"
        onChange={(v) => set("slug", v)}
      />
      <BilingualField label="Excerpt" value={draft.excerpt} onChange={(v) => set("excerpt", v)} rows={2} />
      <BilingualField
        label="Content — blank line between paragraphs"
        value={draft.content}
        onChange={(v) => set("content", v)}
        rows={10}
      />
      <ImageField label="Cover image" value={draft.coverImage} onChange={(v) => set("coverImage", v)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Category"
          value={draft.category}
          onChange={(v) => set("category", v)}
          options={THOUGHT_CATEGORIES.map((c) => ({ value: c, label: c }))}
        />
        <div className="flex items-end">
          <Toggle label="Published" value={draft.published} onChange={(v) => set("published", v)} />
        </div>
      </div>
    </div>
  );
}

function ThoughtRow({ thought }: { thought: Thought }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Thought>(thought);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const set = <K extends keyof Thought>(key: K, value: Thought[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = async (patch?: Partial<Thought>) => {
    setStatus("saving");
    await fetch(`/api/admin/thoughts/${thought.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, ...(patch ?? {}) }),
    });
    setStatus("saved");
    router.refresh();
    window.setTimeout(() => setStatus("idle"), 1800);
  };

  const remove = async () => {
    if (!window.confirm("Delete this thought permanently?")) return;
    await fetch(`/api/admin/thoughts/${thought.id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.012]">
      <div className="flex flex-wrap items-center gap-3 p-4">
        <div className="min-w-0 flex-1">
          <p className="display truncate text-base text-mist-50">{thought.title.en || thought.title.sw}</p>
          <p className="mt-0.5 text-xs uppercase tracking-[0.12em] text-mist-500">
            {thought.category} · {thought.publishedAt ? thought.publishedAt.slice(0, 10) : "—"}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`rounded-full border px-2.5 py-1 font-display text-[0.6rem] uppercase tracking-[0.14em] ${
              thought.published
                ? "border-emerald-400/40 text-emerald-300"
                : "border-white/10 text-mist-500"
            }`}
          >
            {thought.published ? "Published" : "Draft"}
          </span>
          <button
            type="button"
            onClick={() => save({ published: !thought.published })}
            className="rounded-md border border-white/10 px-2.5 py-1 font-display text-[0.62rem] uppercase tracking-[0.14em] text-mist-300"
          >
            {thought.published ? "Unpublish" : "Publish"}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-md border border-white/10 px-3 py-1 text-xs text-mist-200"
          >
            {open ? "Close" : "Edit"}
          </button>
        </div>
      </div>

      {open ? (
        <div className="space-y-4 border-t border-white/[0.06] p-4">
          <DraftFields
            draft={{
              title: form.title,
              slug: form.slug,
              excerpt: form.excerpt,
              content: form.content,
              coverImage: form.coverImage,
              category: form.category,
              published: form.published,
            }}
            setDraft={(updater) =>
              setForm((prev) =>
                updater({
                  title: prev.title,
                  slug: prev.slug,
                  excerpt: prev.excerpt,
                  content: prev.content,
                  coverImage: prev.coverImage,
                  category: prev.category,
                  published: prev.published,
                }) as Thought,
              )
            }
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => save()}
              className="rounded-full bg-signal-400 px-6 py-2.5 font-display text-sm text-ink-950"
            >
              {status === "saving" ? "Saving…" : "Save thought"}
            </button>
            {status === "saved" ? <span className="text-sm text-signal-300">Saved ✓</span> : null}
            <button
              type="button"
              onClick={remove}
              className="rounded-full border border-red-400/40 px-5 py-2.5 font-display text-xs uppercase tracking-[0.14em] text-red-300"
            >
              Delete
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
