# Murajaah

M1–M4: local-first Indonesian learning library. Next.js App Router, strict TypeScript, Tailwind, Dexie, Zod. No login or server database.

## Run
`npm install`, `npm run dev`. Validate with `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`. Deploy as a Next.js project on Vercel.

## Scope and assumptions
NN/g usability guidance is the intended reference; brand tokens were not supplied: use the included neutral/green design tokens, Inter and self-hosted Noto Naskh Arabic through next/font. Fonts are bundled from Fontsource packages through next/font/local; no build-time or runtime font CDN. Single user, light theme. AI generation, draft review and access/filter settings are implemented. JSON backups and final hardening remain M5. Environment names are prepared in .env.example; the server-only generation endpoint requires configuration before making real AI calls.

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

## M4: add material and publish
Enter APP_ACCESS_CODE once in Pengaturan on your personal browser. It is saved locally as a capability secret, not a login or an API key. You can replace/delete it. Never share it. AI_API_KEY stays in server environment variables, never NEXT_PUBLIC variables or exports. Create .env.local from .env.example or configure the four values on Vercel; no model name is hardcoded. Select a model supporting Responses API, JSON Schema, vision and web search. AI_PROVIDER defaults to openai; other providers fail closed until an adapter is implemented.

Tambah supports an existing or new subject, topic, reference, optional known locator, pasted text and up to four JPEG/PNG/WebP page photos. Photos are processed in-browser to JPEG, at most 1600 px on the longest side and 750,000 data-URL characters each, with previews/removal. Original photos are not persisted. Source text and images are sent only when you choose Buat draf. A generation request may take up to 90 seconds; deployment must support the route's 120-second duration. No automatic retry spends extra credits.

With supplied text/photos, web tools are disabled and instructions require strict grounding and short evidence, with no long quotations. Exact evidence is checked for text-only sources. Photo evidence requires human review because semantic grounding and OCR accuracy cannot be proven by schema validation. Without supplied material, search is mandatory; every source URL must match a URL returned by the search tool, and attribution is labelled Rujukan umum. Source provenance is assigned by application code, not the model. A book title alone is never proof of access. The model is forbidden from producing Quran verses; Arabic outside isolated pasted example fields is rejected, and model examples must match short substrings of pasted text. Photo-only and general drafts omit Arabic examples. You may paste examples yourself during review. No Quran provider is activated.

Review all lesson fields, rules, examples, linked lessons, answers and explanations. Generated drafts are saved separately in IndexedDB metadata and never appear as lessons until you approve publishing. Save edits explicitly; unsaved edits warn on reload/internal navigation. Publication is a single transaction including subject/topic/lessons/questions, with stable IDs and duplicate-publication prevention. Existing subjects and seed records are not overwritten. Publishing defaults to Draf; the separate verification checkbox is your attestation after checking with a source or teacher. AI origin remains visible even after editing. A verified-only filter applies to library and quizzes; its default is off. Draft sources/evidence are retained with the published records.

## Generation protection and limits
POST /api/generate requires the private code (minimum 24 characters), same-origin browser requests, JSON payload validation, a streamed 3.2 MB body cap, and Zod validation of the AI output. Unknown providers/missing configuration fail closed. No HTML is rendered from model output. URLs are restricted to HTTP(S). Responses are uncached and provider requests set store:false. Errors do not expose provider output, keys or request contents.

The lightweight limiter permits one concurrent request, three starts/minute and twelve starts/hour **per running process**. Vercel instances/cold starts do not share memory: this is not a deployment-wide spending cap. Keep the access code private, configure provider spending limits and, for a public Vercel deployment, an edge/firewall rate limit for /api/generate. A durable distributed limiter would require infrastructure beyond the no-server-database MVP. Changing the server code revokes old browser capabilities. No secrets are bundled or committed. No live AI call is included in automated tests.

Official API references used for the adapter: [web search](https://developers.openai.com/api/docs/guides/tools-web-search), [image inputs](https://developers.openai.com/api/docs/guides/images-vision), [structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs).

M4 validation: lint, strict typecheck, 29 logic/security/transaction tests and production build passed. Ten browser cases at 360/1280 px passed, covering persisted draft edits, approval gating, atomic publication, new subjects, verified-only empty states, JPEG conversion/preview/removal and AI failure. Existing quiz/library tests still pass. Axe found zero violations in tested draft editors and published lessons. Browser generation responses and provider requests are mocked; no live AI output or photo-reading accuracy has been verified without configured credentials.
