# Murajaah

M1–M2: local-first Indonesian learning library. Next.js App Router, strict TypeScript, Tailwind, Dexie, Zod. No login or server database.

## Run
`npm install`, `npm run dev`. Validate with `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`. Deploy as a Next.js project on Vercel.

## Scope and assumptions
NN/g usability guidance is the intended reference; brand tokens were not supplied: use the included neutral/green design tokens, Inter and self-hosted Noto Naskh Arabic through next/font. Fonts are bundled from Fontsource packages through next/font/local; no build-time or runtime font CDN. Single user, light theme. Generation, settings and backup flows are deferred to M4–M5. Environment names are prepared in .env.example; no secrets or AI calls are used in M1–M2.

The starter library has seven standard topic outlines, two draft lessons and ten draft questions. Book title is a user-specified reference only, not an attribution of seed content. No book text or Quran verses are bundled. Arabic examples are isolated letter diagrams, explicitly labelled. A future Quran integration must use the single QuranProvider interface and check current terms before activation.

## Local data
Dexie database `murajaah`, version 1: subjects → topics → lessons → questions; attempts and readings; metadata. Seed marker and all seed records are written atomically once. Reopening does not overwrite later local edits. Reading completion persists. Clearing browser storage removes local data; backups are deferred to M5. Draft/verified and seed/ai/manual provenance are validated by Zod. All initial items are drafts; default policy does not filter drafts.

## Conventions
Run lint, typecheck and tests before committing. Tokens live in app/tokens.css. Keep source reference provenance explicit. Do not generate Quran verses from memory. Treat sources/ and synced AGENTS.md as read-only. Developer documentation belongs in this README; never overwrite synced project instructions.

Dependency audit: five high-severity development-only findings in the ESLint fast-glob/micromatch/braces chain. The suggested fix downgrades eslint-config-next to an incompatible major; no forced downgrade was applied. Production dependencies are audited separately.

## M1–M2 validation
Lint (no warnings), strict typecheck, three seed integrity tests, and production build passed. Playwright reading/completion persistence flow passed at 360 and 1280 px; axe found no violations on the tested lesson page and no horizontal overflow. This is not a full WCAG audit: other widths, zoom, manual keyboard testing and full-library axe coverage remain for M5. Run browser checks with `npx playwright install chromium` then `npx playwright test`.

## M3 Quiz
Pure scope selection, weighted sampling without replacement, shuffled options and answer mapping live in lib/quiz.ts. Latest attempts use box 0–5: incorrect resets to 0, correct advances one box (max 5). Sampling weights: never seen 6, latest incorrect 8, correct 1/box. These are learning heuristics, not an accuracy guarantee. Sessions use the available count when fewer than 5/10/20 questions exist. Attempts persist per answer; an unfinished session itself is not restored on reload. Review links open a labelled new tab to preserve the active session. Retry selects only the incorrect questions and reshuffles them.

M3 validation: lint, strict typecheck, eight unit tests and production build passed. Four browser cases at 360/1280 px passed, including known-wrong answers, retry, persisted attempts after reload, and prior reading flow. Axe reported zero violations on quiz setup, first feedback, results and lesson pages tested. No page errors occurred in the quiz flow. Full accessibility hardening remains M5.
