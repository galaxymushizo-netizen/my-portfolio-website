# My Portfolio Website — Galaxy Builder in Public

Bilingual (English / Kiswahili) interactive portfolio built with Next.js 16, Tailwind CSS 4, Drizzle ORM + Postgres.

Live interactive experience: landing gate → work / about / connect, project + thought detail pages, EN/SW language switch, contact form.

## Quick start (simple mode — no database)

```bash
npm install
npm run dev
# open http://localhost:3000
```

Simple mode works out of the box with built-in content. `/api/health` returns `{ ok:true, mode:"simple" }`. Contact form logs and returns ok.

## Full mode (with database — admin + messages)

1. Create a free Postgres (Neon / Supabase).
2. Copy env:
```bash
cp .env.example .env
# set DATABASE_URL + ADMIN_* in .env
```
3. Push schema + run:
```bash
npx drizzle-kit push
npm run dev
```
Admin: `/admin/login` → manage profile, projects, thoughts, skills, timeline, links, site text, messages.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import in Vercel → Deploy (no env needed for simple mode).
3. Optional: add `DATABASE_URL` in Vercel → Settings → Environment Variables for full mode, then redeploy.

## Project structure

- `src/app/page.tsx` — homepage
- `src/components/SiteExperience.tsx` — interactive experience
- `src/components/sections/` — Hero, Projects, About, Thoughts, Connect
- `src/lib/defaults.ts` — all default bilingual content (edit here for simple mode)
- `src/lib/data.ts` — DB + fallback loader
- `src/app/admin/` — admin UI
- `src/app/api/` — contact, health, auth, admin APIs
- `src/db/schema.ts` — Postgres schema

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build
- `npm start` — serve production
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — eslint
