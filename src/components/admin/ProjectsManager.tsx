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
  inputClass,
  labelClass,
} from "@/components/admin/fields";
import { PROJECT_STATUSES } from "@/lib/types";
import type { Bilingual, Project } from "@/lib/types";

const CATEGORIES = ["web", "tool", "education", "system", "productivity", "mobile", "design", "other"];

type EditableProject = Omit<Project, "id" | "position"> & {
  id?: number;
  position?: number;
};

type Draft = {
  name: string;
  slug: string;
  shortDescription: Bilingual;
  fullDescription: Bilingual;
  imageUrl: string | null;
  gallery: string[];
  technologies: string[];
  status: string;
  githubUrl: string | null;
  liveUrl: string | null;
  projectDate: string | null;
  featured: boolean;
  category: string;
};

const emptyDraft = (): Draft => ({
  name: "",
  slug: "",
  shortDescription: { en: "", sw: "" },
  fullDescription: { en: "", sw: "" },
  imageUrl: null,
  gallery: [],
  technologies: [],
  status: "in-progress",
  githubUrl: null,
  liveUrl: null,
  projectDate: String(new Date().getFullYear()),
  featured: false,
  category: "web",
});

export function ProjectsManager({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [saving, setSaving] = useState(false);

  const create = async () => {
    if (!draft.name.trim()) return;
    setSaving(true);
    const res = await fetch("/api/admin/projects", {
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

  const ordered = [...projects].sort((a, b) => a.position - b.position);

  const reorder = async (id: number, delta: number) => {
    const ids = ordered.map((p) => p.id);
    const index = ids.indexOf(id);
    const target = index + delta;
    if (target < 0 || target >= ids.length) return;
    const next = [...ids];
    next.splice(index, 1);
    next.splice(target, 0, id);
    await fetch("/api/admin/projects/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next }),
    });
    router.refresh();
  };

  return (
    <div>
      <header className="mb-8">
        <p className="eyebrow">Projects</p>
        <h1 className="display mt-2 text-3xl text-mist-50">Projects & experiments</h1>
        <p className="mt-2 max-w-xl text-sm text-mist-400">
          Add as many as you like. Feature one to give it the large card on the homepage.
        </p>
      </header>

      <div className="space-y-4">
        {ordered.map((project, index) => (
          <ProjectRow
            key={project.id}
            project={project}
            index={index}
            total={ordered.length}
            onMove={(delta) => reorder(project.id, delta)}
          />
        ))}
      </div>

      <div className="mt-10">
        <Panel title="New project" description="You can fill in the details now or later.">
          <DraftFields draft={draft} setDraft={setDraft} />
          <button
            type="button"
            onClick={create}
            disabled={saving || !draft.name.trim()}
            className="rounded-full bg-signal-400 px-6 py-2.5 font-display text-sm text-ink-950 disabled:opacity-50"
          >
            {saving ? "Adding…" : "+ Add project"}
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
  draft: EditableProject;
  setDraft: (updater: (prev: EditableProject) => EditableProject) => void;
}) {
  const set = <K extends keyof EditableProject>(key: K, value: EditableProject[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Project name" value={draft.name} onChange={(v) => set("name", v)} />
        <TextField
          label="Slug (url)"
          value={draft.slug}
          onChange={(v) => set("slug", v)}
          placeholder="auto-generated"
        />
      </div>
      <BilingualField
        label="Short description"
        value={draft.shortDescription}
        onChange={(v) => set("shortDescription", v)}
        rows={2}
      />
      <BilingualField
        label="Full description — blank line between paragraphs"
        value={draft.fullDescription}
        onChange={(v) => set("fullDescription", v)}
        rows={6}
      />
      <ImageField label="Cover image" value={draft.imageUrl} onChange={(v) => set("imageUrl", v)} />
      <div>
        <span className={labelClass}>Gallery (one image URL per line)</span>
        <textarea
          className={`${inputClass} h-24`}
          value={draft.gallery.join("\n")}
          onChange={(e) =>
            set(
              "gallery",
              e.target.value.split("\n").map((v) => v.trim()).filter(Boolean),
            )
          }
        />
      </div>
      <div>
        <span className={labelClass}>Technologies (one per line)</span>
        <textarea
          className={`${inputClass} h-24`}
          value={draft.technologies.join("\n")}
          onChange={(e) =>
            set(
              "technologies",
              e.target.value.split("\n").map((v) => v.trim()).filter(Boolean),
            )
          }
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField
          label="Status"
          value={draft.status}
          onChange={(v) => set("status", v)}
          options={PROJECT_STATUSES.map((s) => ({ value: s, label: s }))}
        />
        <SelectField
          label="Category"
          value={draft.category}
          onChange={(v) => set("category", v)}
          options={CATEGORIES.map((c) => ({ value: c, label: c }))}
        />
        <TextField label="Date" value={draft.projectDate ?? ""} onChange={(v) => set("projectDate", v)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="GitHub link" value={draft.githubUrl ?? ""} onChange={(v) => set("githubUrl", v || null)} />
        <TextField label="Live demo link" value={draft.liveUrl ?? ""} onChange={(v) => set("liveUrl", v || null)} />
      </div>
      <Toggle label="Featured project" value={draft.featured} onChange={(v) => set("featured", v)} />
    </div>
  );
}

function ProjectRow({
  project,
  index,
  total,
  onMove,
}: {
  project: Project;
  index: number;
  total: number;
  onMove: (delta: number) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Project>(project);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const set = <K extends keyof Project>(key: K, value: Project[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = async (patch?: Partial<Project>) => {
    setStatus("saving");
    await fetch(`/api/admin/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, ...(patch ?? {}) }),
    });
    setStatus("saved");
    router.refresh();
    window.setTimeout(() => setStatus("idle"), 1800);
  };

  const remove = async () => {
    if (!window.confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/projects/${project.id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.012]">
      <div className="flex flex-wrap items-center gap-3 p-4">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-ink-900">
          {project.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.imageUrl} alt="" className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <p className="display truncate text-base text-mist-50">
            {project.name}
            {project.featured ? <span className="ml-2 text-signal-400">✦</span> : null}
          </p>
          <p className="truncate text-xs text-mist-500">{project.category} · {project.status}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(-1)}
            className="rounded-md border border-white/10 px-2 py-1 text-xs text-mist-300 disabled:opacity-30"
          >
            ↑
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => onMove(1)}
            className="rounded-md border border-white/10 px-2 py-1 text-xs text-mist-300 disabled:opacity-30"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => save({ featured: !project.featured })}
            className={`rounded-md border px-2.5 py-1 font-display text-[0.62rem] uppercase tracking-[0.14em] ${
              project.featured
                ? "border-signal-400/50 text-signal-300"
                : "border-white/10 text-mist-400"
            }`}
          >
            {project.featured ? "Featured" : "Feature"}
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
            draft={form}
            setDraft={(updater) => setForm((prev) => updater(prev) as Project)}
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => save()}
              className="rounded-full bg-signal-400 px-6 py-2.5 font-display text-sm text-ink-950"
            >
              {status === "saving" ? "Saving…" : "Save project"}
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
