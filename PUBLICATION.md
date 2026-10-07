# Murajaah public publication

Live URL: https://murajaah.ridwan-22693.chatgpt.site
Audience: public. Native Sites deployment returned `succeeded`.

- Site: `appgprj_6ac5836915bc8191a2c1df422bb66a59`
- Version: `appgprj_6ac5836915bc8191a2c1df422bb66a59~appgver_5d87d72403048191b929fa92e52beaef`
- Deployment: `appgdep_6ac5b2d35f4c8191adac83041fd82289`
- Published source commit: `65d80a38dd5a2a6e084828a63ae2b96330469089`
- Site checkout/identity: `public-site/.openai/hosting.json`. Reuse this existing project; do not register another site for later updates.

Run `npm run build:public` from this workspace to build `dist-public/` and refresh the sanitized Site checkout. Use the Sites hosting workflow to open/sync that same checkout before future publication. Its static directory is `dist`. Credentials belong only in session memory/stdin; no credential or local AI configuration is part of this release.

For users: open the public URL, wait for **Salinan offline siap**, then install via the browser menu or **Pasang Murajaah** when available. The browser retains application files and each user's own IndexedDB data. **Pertahankan penyimpanan** requests browser-supported persistent storage; clearing browser/app storage still deletes data.

Existing localhost records are independent of this public origin: export JSON from localhost settings, then import it in public settings. There is no automatic synchronization or public upload of personal study records. Keep a JSON backup for migration/recovery.

Public material creation supports manual drafts, local PDF extraction and opt-in WebLLM/Qwen3.5 browser AI; local Next also supports free Ollama. No paid inference is used. Public output bundles the supplied Quran font and source PDF, with attribution retained in the lessons.

Validation: 63 unit tests, 30 local browser cases, 12 public browser cases, 24 contrast checks, lint/typecheck, public static build and local Next webpack production build passed. Two optional live Ollama browser cases were skipped. Native successful deployment status verifies publication; no agent fetch of the production URL was used.

Public URL label changed to `murajaah` on 7 October 2026. Native slug change returned `complete` and the new live URL; the existing project, saved version and public audience are retained. Because browser data is scoped to its origin, JSON export/import is required to carry personal records between the previous address and this address.

## GitHub publication — 7 October 2026

- Public repository: https://github.com/ridwanahmadm/murajaah
- Live GitHub Pages site: https://ridwanahmadm.github.io/murajaah/
- Published application source: `d93b23d3045b9bcea6289a9d14964073c8077606`
- Successful build/deployment: https://github.com/ridwanahmadm/murajaah/actions/runs/37563633335
- Pages configuration: workflow deployment, public, HTTPS enforced. `origin` points to this user's GitHub repository; `main` tracks `origin/main`.

Workflow `.github/workflows/pages.yml` builds the static application using `/murajaah/` as the base path and deploys on pushes to `main`. Browser data and local AI settings remain outside GitHub. Public repository Pages and public Actions runners require no paid AI service or hosting subscription.

Verification: GitHub's build and deploy jobs both succeeded. Live homepage, manifest, service worker, supplied Arabic font, and source PDF returned HTTP 200. Manifest and service worker contain the correct repository path. Twelve mobile/desktop browser checks passed for that path, and twelve more passed for the original root path. 63 unit tests, lint, typecheck, 24 contrast checks, and local Next webpack production build passed; GitHub repeated the clean dependency install, checks and static build successfully.

GitHub Pages uses a different browser origin from Sites and localhost. Export/import a JSON backup to migrate personal material and progress. Documentation-only commits may skip CI after successful publication; application changes continue to deploy automatically.

## Murajaah revision

The user explicitly requested renaming the product, Sites URL and GitHub repository to Murajaah. Notes are stored privately and included in backwards-compatible JSON backups. Font Awesome Free icons and license notices are bundled. Material creation separates new/existing subject selection, source entry, editable review and publication. PDF page selection retains page attribution. Quiz begins with an introduction and offers saved questions or reviewed AI generation from existing material.

Revision checks: 63 unit tests, 30 local browser cases, 12 public-root browser cases, 12 GitHub-path browser cases, lint/typecheck, 24 contrast checks, local Next webpack build and both static builds. Two optional live Ollama cases remain opt-in; AI quiz UI tests use controlled responses. The headless browser exposed WebGPU but returned no GPU adapter, so actual browser model inference could not be validated on this runner. Source grounding, invalid evidence/answer rejection, stale-source atomic saves and manual fallback were verified.

## Optional private Google Drive backups and recovery guides

Local device storage stays automatic. Google Drive snapshots are manual and account-specific, using only drive.appdata and memory-only OAuth tokens. Upload creates a new snapshot without deleting old backups. Restore validates bounded downloads, then requires preview and explicit local replacement confirmation. Google requests occur only after user actions; no polling, automatic retry or paid fallback. Offline navigation now serves cached guide HTML before falling back to the application shell.

Guides: public/panduan-cadangan.html and public/panduan-google-drive.html, available from Settings and the device-storage panel. Publisher OAuth Client ID is not yet available: the UI explicitly marks Google Drive inactive, with file export/import fully usable. Live account authorization remains unverified until publisher configuration is supplied; tests use a controlled Google SDK/API response and do not access real accounts.

Validation: 69 unit tests, 30 local browser cases, 16 public-root and 16 GitHub-path browser cases passed, plus lint/typecheck, 24 contrast checks and both production builds. Two opt-in live AI cases were skipped. Drive tests cover private folder/scope, MIME upload, schema/size bounds, expiry, quota failure without retry, preview/cancel/restore, no credentials in JSON and offline guides.
