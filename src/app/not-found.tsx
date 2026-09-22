import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <span className="glyph text-4xl">⌁</span>
      <h1 className="display mt-6 text-3xl text-mist-50 sm:text-4xl">
        This page does not exist yet.
      </h1>
      <p className="mt-3 max-w-sm text-sm text-mist-400">
        Some things are still being built. That is the point.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/[0.12] px-6 py-3 font-display text-sm text-mist-100 transition-all hover:border-signal-400/50 hover:text-signal-300"
      >
        ← Back home
      </Link>
    </div>
  );
}
