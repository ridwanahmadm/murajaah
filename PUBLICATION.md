# Murajaah public publication

Live URL: https://belajartahsin.ridwan-22693.chatgpt.site
Audience: public. Native Sites deployment returned `succeeded`.

- Site: `appgprj_6ac5836915bc8191a2c1df422bb66a59`
- Version: `appgprj_6ac5836915bc8191a2c1df422bb66a59~appgver_8e635c49faf881918c397d957bb512ef`
- Deployment: `appgdep_6ac58507b39c8191a3be58f4777aa6e1`
- Published source commit: `03cc5b886bedd671a82385efc0d3e448b823f4b9`
- Site checkout/identity: `public-site/.openai/hosting.json`. Reuse this existing project; do not register another site for later updates.

Run `npm run build:public` from this workspace to build `dist-public/` and refresh the sanitized Site checkout. Use the Sites hosting workflow to open/sync that same checkout before future publication. Its static directory is `dist`. Credentials belong only in session memory/stdin; no credential or local AI configuration is part of this release.

For users: open the public URL, wait for **Salinan offline siap**, then install via the browser menu or **Pasang Murajaah** when available. The browser retains application files and each user's own IndexedDB data. **Pertahankan penyimpanan** requests browser-supported persistent storage; clearing browser/app storage still deletes data.

Existing localhost records are independent of this public origin: export JSON from localhost settings, then import it in public settings. There is no automatic synchronization or public upload of personal study records. Keep a JSON backup for migration/recovery.

Public material creation is manual and free of AI API calls; local Next continues to use free Ollama only. Public output bundles the supplied Quran font and source PDF, with attribution retained in the lessons.

Validation: 59 unit tests, 28 local browser cases, 6 public browser cases, 24 contrast checks, lint/typecheck, public static build and local Next webpack production build passed. Two optional live Ollama browser cases were skipped. Native successful deployment status verifies publication; no agent fetch of the production URL was used.

Public URL label changed to `belajartahsin` on 7 October 2026. Native slug change returned `complete` and the new live URL; the existing project, saved version and public audience are retained. Because browser data is scoped to its origin, JSON export/import is required to carry personal records between the previous address and this address.
