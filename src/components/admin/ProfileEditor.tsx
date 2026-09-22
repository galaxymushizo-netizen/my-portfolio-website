"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BilingualField,
  ImageField,
  Panel,
  SaveBar,
  TextField,
  TextAreaField,
  inputClass,
  labelClass,
} from "@/components/admin/fields";
import type { Bilingual, Profile, Skill, TimelineItem } from "@/lib/types";

type Status = "idle" | "saving" | "saved" | "error";

export function ProfileEditor({
  profile: initialProfile,
  timeline,
  skills,
}: {
  profile: Profile;
  timeline: TimelineItem[];
  skills: Skill[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<Profile>(initialProfile);
  const [status, setStatus] = useState<Status>("idle");

  const set = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/profile", {
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
        <p className="eyebrow">About</p>
        <h1 className="display mt-2 text-3xl text-mist-50">Profile & identity</h1>
        <p className="mt-2 max-w-xl text-sm text-mist-400">
          Your photo, your story, what you are learning and building. This is the part visitors
          read to understand the person behind the projects.
        </p>
      </header>

      <div className="space-y-6">
        <Panel title="Profile photo" description="Used automatically in the public About section.">
          <ImageField
            label="Photo"
            value={form.photoUrl}
            onChange={(v) => set("photoUrl", v)}
            hint="…or paste an image URL"
          />
        </Panel>

        <Panel title="Identity">
          <TextField label="Name" value={form.name} onChange={(v) => set("name", v)} />
          <BilingualField
            label="Tagline"
            value={form.tagline}
            onChange={(v) => set("tagline", v)}
            rows={1}
          />
          <BilingualField
            label="Short bio"
            value={form.shortBio}
            onChange={(v) => set("shortBio", v)}
            rows={2}
          />
          <BilingualField
            label="Long biography — separate paragraphs with a blank line"
            value={form.bio}
            onChange={(v) => set("bio", v)}
            rows={10}
          />
        </Panel>

        <Panel title="Now" description="Shown as three blocks under the biography. One item per line.">
          <TextAreaField
            label="What I'm learning"
            value={form.learning.en}
            rows={5}
            onChange={(v) => set("learning", { ...form.learning, en: v })}
          />
          <TextAreaField
            label="Ninachojifunza (Swahili)"
            value={form.learning.sw}
            rows={5}
            onChange={(v) => set("learning", { ...form.learning, sw: v })}
          />
          <TextAreaField
            label="What I'm building"
            value={form.building.en}
            rows={5}
            onChange={(v) => set("building", { ...form.building, en: v })}
          />
          <TextAreaField
            label="Ninachojenga (Swahili)"
            value={form.building.sw}
            rows={5}
            onChange={(v) => set("building", { ...form.building, sw: v })}
          />
          <TextAreaField
            label="What I'm reaching for"
            value={form.goals.en}
            rows={5}
            onChange={(v) => set("goals", { ...form.goals, en: v })}
          />
          <TextAreaField
            label="Ninacholenga (Swahili)"
            value={form.goals.sw}
            rows={5}
            onChange={(v) => set("goals", { ...form.goals, sw: v })}
          />
        </Panel>

        <Panel title="Contact">
          <TextField label="Email" value={form.email} onChange={(v) => set("email", v)} />
          <TextField
            label="WhatsApp (with country code)"
            value={form.whatsapp}
            onChange={(v) => set("whatsapp", v)}
          />
          <BilingualField
            label="Location"
            value={form.location}
            onChange={(v) => set("location", v)}
            rows={1}
          />
          <TextField
            label="Resume / CV link"
            value={form.resumeUrl ?? ""}
            onChange={(v) => set("resumeUrl", v || null)}
          />
        </Panel>
      </div>

      <SaveBar onSave={save} status={status} />

      <div className="mt-12 space-y-6">
        <TimelineManager items={timeline} />
        <SkillsManager items={skills} />
      </div>
    </div>
  );
}

function TimelineManager({ items }: { items: TimelineItem[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<{ year: string; title: Bilingual; body: Bilingual }>({
    year: "",
    title: { en: "", sw: "" },
    body: { en: "", sw: "" },
  });

  const add = async () => {
    if (!draft.title.en.trim()) return;
    await fetch("/api/admin/timeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setDraft({ year: "", title: { en: "", sw: "" }, body: { en: "", sw: "" } });
    router.refresh();
  };

  return (
    <Panel
      title="Personal story timeline"
      description="Each entry is a chapter. Write in your own voice — not a resume."
    >
      <div className="space-y-3">
        {items.map((item) => (
          <TimelineRow key={item.id} item={item} />
        ))}
      </div>
      <div className="mt-6 space-y-3 rounded-xl border border-dashed border-white/[0.12] p-4">
        <p className={labelClass}>New chapter</p>
        <TextField label="Marker (year, number or symbol)" value={draft.year} onChange={(v) => setDraft({ ...draft, year: v })} />
        <BilingualField label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} rows={1} />
        <BilingualField label="Body" value={draft.body} onChange={(v) => setDraft({ ...draft, body: v })} rows={3} />
        <button
          type="button"
          onClick={add}
          className="rounded-full border border-signal-400/40 px-5 py-2 font-display text-xs uppercase tracking-[0.16em] text-signal-300 transition-colors hover:bg-signal-400/10"
        >
          + Add chapter
        </button>
      </div>
    </Panel>
  );
}

function TimelineRow({ item }: { item: TimelineItem }) {
  const router = useRouter();
  const [form, setForm] = useState(item);
  const [busy, setBusy] = useState(false);

  const patch = async (data: Partial<TimelineItem>) => {
    setBusy(true);
    await fetch(`/api/admin/timeline/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, ...data }),
    });
    setBusy(false);
    router.refresh();
  };

  const remove = async () => {
    await fetch(`/api/admin/timeline/${item.id}`, { method: "DELETE" });
    router.refresh();
  };

  const move = async (delta: number) => {
    await fetch(`/api/admin/timeline/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, position: item.position + delta }),
    });
    router.refresh();
  };

  return (
    <div className="rounded-xl border border-white/[0.07] bg-ink-900/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <input
          className={`${inputClass} max-w-[7rem]`}
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
          onBlur={() => patch({ year: form.year })}
        />
        <div className="flex gap-1.5">
          <button type="button" onClick={() => move(-1.5)} className="rounded-md border border-white/10 px-2 py-1 text-xs text-mist-300">
            ↑
          </button>
          <button type="button" onClick={() => move(1.5)} className="rounded-md border border-white/10 px-2 py-1 text-xs text-mist-300">
            ↓
          </button>
          <button type="button" onClick={remove} className="rounded-md border border-white/10 px-2 py-1 text-xs text-red-300">
            ✕
          </button>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <BilingualField label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} rows={1} />
        <BilingualField label="Body" value={form.body} onChange={(v) => setForm({ ...form, body: v })} rows={3} />
        <button
          type="button"
          disabled={busy}
          onClick={() => patch({})}
          className="rounded-full bg-signal-400 px-5 py-1.5 font-display text-xs text-ink-950 disabled:opacity-50"
        >
          Save chapter
        </button>
      </div>
    </div>
  );
}

function SkillsManager({ items }: { items: Skill[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState({ name: "", category: "craft", level: 60 });

  const add = async () => {
    if (!draft.name.trim()) return;
    await fetch("/api/admin/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setDraft({ name: "", category: "craft", level: 60 });
    router.refresh();
  };

  return (
    <Panel title="Skills" description="Names and honest confidence levels.">
      <div className="space-y-2">
        {items.map((skill) => (
          <SkillRow key={skill.id} skill={skill} />
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-white/[0.12] p-4">
        <div className="min-w-[10rem] flex-1">
          <span className={labelClass}>New skill</span>
          <input
            className={inputClass}
            value={draft.name}
            placeholder="e.g. PostgreSQL"
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
        </div>
        <div className="w-28">
          <span className={labelClass}>Category</span>
          <input
            className={inputClass}
            value={draft.category}
            onChange={(e) => setDraft({ ...draft, category: e.target.value })}
          />
        </div>
        <div className="w-20">
          <span className={labelClass}>Level</span>
          <input
            className={inputClass}
            type="number"
            min={0}
            max={100}
            value={draft.level}
            onChange={(e) => setDraft({ ...draft, level: Number(e.target.value) })}
          />
        </div>
        <button
          type="button"
          onClick={add}
          className="rounded-full border border-signal-400/40 px-5 py-2 font-display text-xs uppercase tracking-[0.16em] text-signal-300 transition-colors hover:bg-signal-400/10"
        >
          + Add
        </button>
      </div>
    </Panel>
  );
}

function SkillRow({ skill }: { skill: Skill }) {
  const router = useRouter();
  const [form, setForm] = useState(skill);

  const save = async () => {
    await fetch(`/api/admin/skills/${skill.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.refresh();
  };

  const remove = async () => {
    await fetch(`/api/admin/skills/${skill.id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/[0.07] bg-ink-900/40 p-3">
      <input
        className={`${inputClass} min-w-[9rem] flex-1`}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        className={`${inputClass} w-28`}
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />
      <input
        className={`${inputClass} w-20`}
        type="number"
        min={0}
        max={100}
        value={form.level}
        onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
      />
      <button type="button" onClick={save} className="rounded-full bg-signal-400 px-4 py-2 font-display text-xs text-ink-950">
        Save
      </button>
      <button type="button" onClick={remove} className="rounded-full border border-white/10 px-3 py-2 text-xs text-red-300">
        ✕
      </button>
    </div>
  );
}
