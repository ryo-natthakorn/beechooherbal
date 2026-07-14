# Handoff — Bee Choo Herbal (beechooherbal.com) WP→Astro migration
**Date:** 2026-07-14 · **Repo:** `ryo-natthakorn/beechooherbal` (GitHub, branch `main`, synced) · **Local:** `c:\Users\Computer RC Herbal\Desktop\beechooherbal`

## Branch strategy — CHANGED 2026-07-14: direct-to-main, no more feature branches
As of today, work happens **directly on `main`** — commit and push straight to `main`, no
feature branch, no PR. This supersedes the `worktree-phase3-homepage` pattern used earlier today
(commits through `f51217a`, then one follow-up commit `789a978`, merged via PR #1 and PR #2). That
branch and its worktree (`.claude/worktrees/phase3-homepage/`) are now stale — `main` has
everything from them (fast-forwarded to `18f4207`) plus nothing more. Don't resume work in that
worktree or branch out of habit; if you see it referenced in an older doc, treat `main` as current.
Working rhythm is unchanged: one batch → `npm run build` exit 0 → stop for review (plain English,
lead with evidence) → commit/push ONLY when told → wait for the next batch. Only the branch/PR step
is gone — everything else in "Hard-won gotchas" below still applies.

## Read these first (do not duplicate their content — they are the record)
1. `CLAUDE.md` — standing spec: goals, SEO rules, i18n Path A decision, phase checklist. Two bullets carry dated 2026-07-14 corrections.
2. `docs/session-2026-07-14-audit.md` — full independent audit of Phases 1–2: what verified clean, which 4 claims were false/stale, verified next steps. **Supersedes** `docs/session-2026-06-23.md` §2 where they conflict.
3. `SKILL.md` — migration playbook; note the dated caveat appended to its "Redirects" section.
4. `inventory/` — Phase 1 data (all counts independently re-verified 2026-07-14; trust it).

## State at handoff — Phase 2 (foundation) COMPLETE and live-verified
Commits this session (all pushed; messages carry full detail):
- `13080bf` — audit corrections + `src/i18n/pairs.ts` populated (all 17 verified EN↔TH pairs + 2 corrected archive pairs)
- `60c0a06` — `LanguageSwitcher.astro` + root-level `middleware.ts` (Accept-Language 302 `/` → `/th/home/`, bot-safe) + `@vercel/functions`
- `066063e` — TH placeholder moved to `src/pages/th/home.astro` (real Thai home URL) + `vercel.json` true-301s for `/th` and `/th/`

Live verification on `beechooherbal.vercel.app` (2026-07-14, all pass): `/th/`+`/th` → 301 → `/th/home/` (200); Thai-browser visitor on `/` → 302 → `/th/home/`; English visitor and Googlebot (even with Thai header) stay 200 on `/`. Real domain still points at WordPress — nothing SEO-facing is exposed yet.

## Phase 3 homepage batch — DONE and on `main`, awaiting Crispin sign-off
Plan: `docs/superpowers/plans/2026-07-14-homepage.md` (11 tasks). Tasks 1–10 built the real EN
(`/`) and TH (`/th/home/`) homepages (brand tokens/fonts, shared UI strings, treatments data,
downloaded + magic-byte-verified images, `TreatmentCard`/`Header`/`Footer` components, both pages
wired through `BaseLayout`). Task 11 (final verification) ran 2026-07-14:
- `npm run build` — exit 0, no warnings.
- `beechooladies` grep across homepage files — only match is an explanatory code comment in
  `TreatmentCard.astro`; no live `href` uses it. The known bug (heading linking to
  beechooladies.com.sg) is fixed.
- hreflang on `/` — all three tags correct: `en` → `/`, `th` → `/th/home/`, `x-default` → `/`.
- `npm run astro check` — **fails**, logged below under Known issues; does not block the build.

Follow-up fix batch (commit `789a978`, merged via PR #2): restored the hero + treatment YouTube
videos, the 4 customer review screenshots, and the awards recognitions banner that were missing
from the first pass (all present on the live site — the hero video was a lazy-loaded JS widget the
original scrape missed, which is also why its caption briefly became the page's first heading).
Also fixed the language switcher: the root-language `middleware.ts` was 302-redirecting every
Thai-browser visitor away from `/`, so clicking "EN" could never land — it now sets an explicit
`beechoo_lang` cookie that middleware honours over `Accept-Language`. Switcher redesigned as a
floating pill toggle fixed to the right edge.

`main` is ready to show Crispin for homepage design sign-off (CLAUDE.md §10 Phase 3 requires this
before building any other page).

## Known issues
- **`astro check` fails on `astro.config.mjs:27`** — TS error `Type 'Plugin<any>[]' is not
  assignable to type 'PluginOption'` on the `tailwindcss()` plugin, caused by a dependency-hoisting
  conflict: two different `vite` package instances resolve (root `node_modules/vite` vs Astro's
  nested `node_modules/astro/node_modules/vite`), so their `Plugin` types are structurally
  incompatible even though the plugin works fine at runtime. Pre-existing conflict, not caused by
  the Phase 3 homepage work. `npm run build` passes clean (exit 0, no warnings) — this doesn't
  block anything shippable. This is also the first time `astro check` has ever run in this repo
  (main didn't have `@astrojs/check`/`typescript` installed until this branch added them in
  `cdf111b`), so there is no prior baseline to compare against. **Deferred** — needs its own small
  cleanup task (likely an npm `overrides` entry pinning a single `vite` version, or a dedupe/reinstall),
  separate from the Phase 3 branch. Do not fix opportunistically inside an unrelated batch.

## Next work: Phase 3 (real pages, EN + TH per CLAUDE.md §10)
Homepage FIRST, shown to Crispin for design sign-off before any other page — see above, DONE and
awaiting sign-off. After sign-off: the 7 treatment pages, About, Team, Locations, Privacy Policy,
Testimonials, FAQ (+ "Herbal vs Hair Transplant"), Products, Events & News.

## Open decisions (waiting on user/Crispin — do not decide unilaterally)
- Repo is **PUBLIC**; docs record a decision to keep it private (client work). Flagged twice, unresolved.
- `/category/events-news/` → `/events-news-release/` one-off 301: reasoned in `inventory/events-dupe-check.md` but needs Crispin sign-off (URL-behaviour change).
- Medium-confidence pair `/events-news-release/` ↔ `/th/เหตุการณ์และข่าว/`: needs native-speaker check.
- Whether to rebuild author archives (`/author/admin/` ↔ `/th/author/admin/` — both live on old site).
- Orphan pages (30 EN / 26 TH): Crispin decision, see `inventory/orphans-for-crispin.md`.
- The `astro check` dependency-hoisting conflict above — needs its own cleanup task.

## Hard-won gotchas (cost real time — don't rediscover)
- **Astro native `redirects` = meta-refresh + HTTP 200** on this deployment (static, no adapter) — NOT a real 301. All one-to-one redirects go in `vercel.json` with `"statusCode": 301` (`"permanent": true` sends 308). Proven empirically; see SKILL.md caveat.
- **Vercel preview deployments are behind SSO** — curl gets a login redirect. Test on the production `beechooherbal.vercel.app` URL after push, or deploy a throwaway Vercel project from a source copy (worked; delete it after with `echo y | npx vercel project rm <name>` **from Git Bash** — PowerShell pipes a UTF-16 BOM that breaks CLI prompts).
- Vercel CLI is authenticated on this machine (account `ryo-natthakorn`, team scope `ryo-panyee-wedding`); repo folder is linked (`.vercel/`, git-ignored).
- The old site lies: `<html lang>`/`og:locale` say `en-US` on Thai pages; hreflang is self-referential; slugs lie (`…ประเวศ…-2567-2` is really Chatuchak). Language/pairing truth = Thai script + the verified map. Blog EN↔TH twins pair by **publish-date adjacency + title** (REST dates prove twins posted minutes apart).
- WP REST posts: collection page-1 queries 500, but `per_page=1&page=N` retrieves all 54 posts fine — Phase 4 migrates via REST, no scraping.
- User's working rhythm: one batch → `npm run build` exit 0 → **stop for review (plain English, lead with evidence)** → commit/push ONLY when told. Commit style: `Phase N part M: summary` + bullets + `Co-Authored-By: Claude <model> <noreply@anthropic.com>`.
- Persistent memory exists at `~\.claude\projects\c--Users-Computer-RC-Herbal-Desktop-beechooherbal\memory\` (audit summary + "verify claims before trusting" note).

## Suggested skills (invoke via Skill tool)
- `superpowers:verification-before-completion` — before claiming any batch done; this project demands evidence-first reporting.
- `impeccable:impeccable` — for the Phase 3 homepage design pass (modern/clean redesign is Goal 4).
- `superpowers:brainstorming` — before starting the homepage build (creative work; explore layout/UX intent with the user first).
- `verify` / `run` — to exercise built pages in the real app rather than trusting build output.
- `code-review` — before pushing larger Phase 3/4 batches.
