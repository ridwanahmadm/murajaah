# Murajaah application conventions

Root AGENTS.md and sources/ are synced reference material; never change them.

- Continue the existing Next.js App Router app, strict TypeScript and local Dexie storage.
- UI copy is Bahasa Indonesia. Use app/tokens.css for design tokens.
- Only free inference on the user's device is permitted: local Ollama or opt-in browser WebLLM. Never add cloud or paid fallback.
- All AI output and backup imports require Zod and semantic validation.
- Keep AI origin, draft/verified status and source attribution explicit.
- Never generate Quran verse text from model memory. Arabic examples must be pasted from a source.
- No secrets in code, backups, or NEXT_PUBLIC variables. Keep .env.local untracked.
- Save publications and imports atomically. Preserve existing data on failure.
- Validation: npm run lint; npm run typecheck; npm test; npm run check:contrast; npm run build; npm run test:e2e.
- Opt-in live AI tests require a running local Ollama and AI_MODEL; no paid service is allowed.
