"use client";

import { useRef, useState, type ReactNode } from "react";
import type { Bilingual } from "@/lib/types";

export const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-mist-50 transition-colors placeholder:text-mist-600 focus:border-signal-400/60";

export const labelClass =
  "mb-1.5 block font-display text-[0.65rem] uppercase tracking-[0.16em] text-mist-500";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <Field label={label}>
      <input
        className={inputClass}
        value={value}
        type={type}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <Field label={label}>
      <textarea
        className={`${inputClass} resize-y leading-relaxed`}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function BilingualField({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: Bilingual;
  onChange: (value: Bilingual) => void;
  rows?: number;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className={labelClass}>{label}</span>
        <span className="flex gap-1">
          {(["en", "sw"] as const).map((code) => (
            <span
              key={code}
              className="rounded border border-white/10 px-1.5 py-0.5 font-display text-[0.6rem] uppercase text-mist-500"
            >
              {code}
            </span>
          ))}
        </span>
      </div>
      <div className="space-y-2">
        <textarea
          className={`${inputClass} resize-y`}
          rows={rows}
          placeholder="English"
          value={value.en}
          onChange={(e) => onChange({ ...value, en: e.target.value })}
        />
        <textarea
          className={`${inputClass} resize-y`}
          rows={rows}
          placeholder="Kiswahili"
          value={value.sw}
          onChange={(e) => onChange({ ...value, sw: e.target.value })}
        />
      </div>
    </div>
  );
}

export function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex w-full items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.015] px-3 py-2.5 text-left"
    >
      <span className="font-display text-xs uppercase tracking-[0.14em] text-mist-300">{label}</span>
      <span
        className={`relative h-5 w-9 rounded-full transition-colors ${value ? "bg-signal-400" : "bg-white/15"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-ink-950 transition-all ${value ? "left-[1.15rem]" : "left-0.5"}`}
        />
      </span>
    </button>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <Field label={label}>
      <select className={inputClass} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-ink-850">
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

async function compressImage(file: File, maxSize = 1400): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close?.();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();
  return canvas.toDataURL("image/jpeg", 0.82);
}

export function ImageField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  hint?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await compressImage(file));
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div className="flex gap-3">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-ink-900">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => ref.current?.click()}
              className="rounded-lg border border-white/10 px-3 py-1.5 font-display text-[0.68rem] uppercase tracking-[0.14em] text-mist-200 transition-colors hover:border-signal-400/50 hover:text-signal-300"
            >
              {busy ? "…" : "Upload"}
            </button>
            {value ? (
              <button
                type="button"
                onClick={() => onChange(null)}
                className="rounded-lg border border-white/10 px-3 py-1.5 font-display text-[0.68rem] uppercase tracking-[0.14em] text-mist-400 transition-colors hover:border-red-400/50 hover:text-red-300"
              >
                Remove
              </button>
            ) : null}
          </div>
          <input
            ref={ref}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              void handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <input
            className={inputClass}
            value={value ?? ""}
            placeholder={hint ?? "…or paste an image URL"}
            onChange={(e) => onChange(e.target.value || null)}
          />
        </div>
      </div>
    </div>
  );
}

export function SaveBar({
  onSave,
  status,
}: {
  onSave: () => void;
  status: "idle" | "saving" | "saved" | "error";
}) {
  return (
    <div className="sticky bottom-0 z-20 -mx-5 mt-8 flex items-center gap-4 border-t border-white/[0.08] bg-ink-950/90 px-5 py-4 backdrop-blur-xl sm:-mx-8 sm:px-8">
      <button
        type="button"
        onClick={onSave}
        disabled={status === "saving"}
        className="rounded-full bg-signal-400 px-6 py-2.5 font-display text-sm text-ink-950 transition-colors hover:bg-signal-300 disabled:opacity-60"
      >
        {status === "saving" ? "Saving…" : "Save changes"}
      </button>
      {status === "saved" ? <span className="text-sm text-signal-300">Saved ✓</span> : null}
      {status === "error" ? <span className="text-sm text-red-300">Error — try again</span> : null}
    </div>
  );
}

export function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-white/[0.012] p-5 sm:p-6">
      <h2 className="display text-lg text-mist-50">{title}</h2>
      {description ? <p className="mt-1 text-xs text-mist-500">{description}</p> : null}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}
