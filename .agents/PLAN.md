# Model Arena — Implementation Roadmap

## Project Overview

A Next.js 14 application that aggregates model benchmark data from multiple leaderboard sources and presents it in a unified side-by-side comparison interface. The product is a research and discovery tool — not a model runner.

**Sources:** Chatbot Arena (LMSYS) · ArtificialAnalysis · HuggingFace Open LLM Leaderboard · LiveCodeBench / SWE-bench

**Core value proposition:** Pick 2–4 models, see all their benchmark scores across every major source in one view.

**Data strategy:** Live fetch where clean public endpoints exist; curated static JSON where they don't.

---

## Data Sources & Refresh Strategy & Refresh Strategy

| Source | Access | Refresh | Notes |
|---|---|---|---|
| **Chatbot Arena (LMSYS)** | Static snapshot | Weekly manual update | No public API. Use community-maintained JSON snapshots from HuggingFace datasets, or scrape leaderboard HTML. |
| **ArtificialAnalysis** | Mixed | Live fetch + static fallback | Public API exists for quality index, latency, and output speed. Augment with static JSON for scores not in the API. |
| **HuggingFace Open LLM Leaderboard** | Live | Daily via HF Datasets API | Dataset hosted on HF Hub. Fetch latest parquet/JSON snapshot via datasets API — no key required for public datasets. |
| **LiveCodeBench / SWE-bench** | Static | Manual, per major release | Results published as papers and JSONs. Curate into a static data file and update on leaderboard releases. |

---

## MVP Scope

**In scope:**
- Model selection UI — search, filter by provider, filter by benchmark source availability
- Side-by-side comparison view — select 2–4 models, see all benchmark scores in one table
- Benchmark detail — scores, rank, benchmark description, link to original source
- Data freshness indicator — show when each source was last updated
- Shareable URLs — sync selected model IDs to the query string
- Mobile-responsive layout at 375px+
- Live fetch for HF Leaderboard from day one; static JSON for the other three sources at launch

**Explicitly deferred:**
- Trend charts over time (requires storing historical snapshots)
- User accounts / saved comparisons
- Cost and pricing data (unclear sources)
- Automated scraping pipelines
- E2E test automation

---

## Phase 1: Foundation & Data Layer

**Goal:** Establish types, static data files, fetch utilities, and UI primitives.

### 1.1 Type Definitions (`types/`)

- [ ] `types/models.ts` — `ModelEntry`: id, name, provider, family, releaseDate, parameterCount, contextWindow, license
- [ ] `types/benchmarks.ts` — `BenchmarkSource`, `BenchmarkScore`, `ModelBenchmarkData`
- [ ] `types/api.ts` — `BenchmarkResponse`, `CompareResponse`, `ErrorResponse`
- [ ] `types/index.ts` — barrel exports

### 1.2 Static Data Files (`data/`)

- [ ] `data/models.json` — ~40 models (GPT-4o, Claude 3.5, Gemini 1.5, Llama 3, Mistral, Phi-3, Qwen, DeepSeek, Gemma, Command R+, etc.)
- [ ] `data/chatbot-arena.json` — ELO scores and ranks from latest Arena snapshot
- [ ] `data/artificialanalysis.json` — Quality Index, output speed, latency
- [ ] `data/livecode-swebench.json` — pass@1 scores for LiveCodeBench, SWE-bench Verified

Each file follows the shape:
```json
{
  "source": "chatbot-arena",
  "lastUpdated": "2025-02-01",
  "scores": [
    { "modelId": "gpt-4o", "rank": 1, "score": 1287, "subscores": {} }
  ]
}
```

### 1.3 Data Fetch Utilities (`lib/`)

- [ ] `lib/hf-leaderboard.ts` — fetch latest Open LLM Leaderboard data from HF Datasets API (public, no key). Cache with `next: { revalidate: 86400 }`.
- [ ] `lib/artificialanalysis.ts` — fetch live quality/performance metrics from AA API; merge with static JSON for missing fields. Cache with `next: { revalidate: 21600 }`.
- [ ] `lib/data-merger.ts` — merge scores from all 4 sources keyed by `modelId`. Returns `ModelBenchmarkData[]`. Handles missing sources gracefully.
- [ ] `lib/models.ts` — load `models.json`, attach merged benchmark scores, expose filter/sort helpers.
- [ ] `lib/utils.ts` — `cn()` and standard formatters; add `formatScore()`, `formatRank()`.

### 1.4 UI Primitives (`components/ui/`)

- [ ] `Button.tsx`, `Card.tsx`, `Badge.tsx`, `LoadingSpinner.tsx`
- [ ] `Input.tsx`, `Textarea.tsx`, `Checkbox.tsx`, `Toggle.tsx`
- [ ] `Tooltip.tsx` — for benchmark score explanations
- [ ] `ScoreBadge.tsx` — coloured pill showing score and source label
- [ ] `DataFreshnessTag.tsx` — "Last updated X days ago" with link to source

---

## Phase 2: Backend API

**Goal:** API routes that serve benchmark data.

### 2.1 Routes

- [x] `app/api/v1/health/route.ts` — GET, returns server status
- [ ] `app/api/v1/models/route.ts` — `GET`: return model list with filters (`provider`, `family`, `hasArenaScore`, `hasLiveCodeScore`).
- [ ] `app/api/v1/benchmarks/[modelId]/route.ts` — `GET`: return all benchmark scores for a single model across all sources.
- [ ] `app/api/v1/compare/route.ts` — `GET`: accepts `?modelIds=m1,m2,m3`. Returns merged benchmark data for requested models. Max 4 models.

### 2.2 Caching

Use Next.js built-in fetch caching with revalidate intervals:

- HF Leaderboard: revalidate every 24 hours
- ArtificialAnalysis: revalidate every 6 hours
- Static JSON: no revalidation (build-time only)
- On-demand revalidation via `POST /api/v1/revalidate` (secret-protected) for manual refreshes

---

## Phase 3: Frontend Components

**Goal:** All UI components built for the benchmark aggregation use case.

### 3.1 Components

- [ ] `components/ModelSelector.tsx` — search by name, filter by provider and benchmark availability. Card shows provider, parameter count, context window.
- [ ] `components/BenchmarkTable.tsx` — matrix layout: rows = benchmark sources/tasks, columns = selected models, cells = score + rank. Columns sortable.
- [ ] `components/MetricsChart.tsx` — bar or radar chart comparing benchmark scores across selected models. Toggle between chart types.
- [ ] `components/SourcePanel.tsx` — sidebar or tab showing source methodology, last-updated timestamp, and link to original leaderboard for each benchmark source.
- [ ] `components/ModelCard.tsx` — summary card for a single model showing all benchmark scores, used in the selection step.
- [ ] `components/CompareLayout.tsx` — two-panel layout: left = model selector, right = comparison table and chart.
- [ ] `components/BenchmarkFilter.tsx` — filter the comparison view by source (Arena, AA, HF, LiveCode) and by task type (chat, code, reasoning).
- [ ] `components/Header.tsx`, `Footer.tsx`, `ErrorBoundary.tsx`

---

## Phase 4: Page Integration

**Goal:** Wire everything together into a working end-to-end flow.

### 4.1 Main Page (`app/page.tsx`)

- [ ] State: `selectedModelIds` (array, max 4), `activeFilters`, `activeBenchmarkSources`
- [ ] On mount: fetch `/api/v1/models` to populate `ModelSelector`
- [ ] On compare: fetch `/api/v1/compare?modelIds=...` to populate `BenchmarkTable` and `MetricsChart`
- [ ] URL state: sync `selectedModelIds` to query string so comparisons are shareable via URL
- [ ] Hero section: brief explainer of the site and which sources are covered, with data freshness for each

### 4.2 Model Detail Page (`app/models/[id]/page.tsx`)

- [ ] Server component: fetch full benchmark data for a single model at build/request time
- [ ] Shows complete score breakdown across all 4 sources
- [ ] Links to compare with similar models

### 4.3 Layout & Styles

- [ ] `app/layout.tsx` — page metadata, error boundary wrapper, global font
- [ ] `app/globals.css` — Tailwind base, OKLCH theme colors, code block styles

---

## Phase 5: Tests

**Goal:** Test data merging logic and API routes — the highest-value things to catch regressions in.

### 5.1 Unit Tests (`tests/unit/`)

- [ ] `lib/data-merger.test.ts` — handles missing sources, deduplicates models, correct score lookup by modelId
- [ ] `lib/models.test.ts` — filter and sort helpers
- [ ] `lib/validations.test.ts` — updated schemas for new request shapes (GET params, not POST body)
- [ ] `lib/hf-leaderboard.test.ts` — mocked: correct parsing of HF Datasets API response format

### 5.2 Manual Testing Checklist

- [ ] Comparison of 2, 3, and 4 models renders correctly
- [ ] Max 4 model limit enforced client-side
- [ ] Filter by provider narrows model list correctly
- [ ] Filter by benchmark source shows/hides columns correctly
- [ ] Shareable URL: loading with `?modelIds=...` pre-selects models
- [ ] Data freshness tag shows correct date for each source
- [ ] Mobile layout at 375px and 768px
- [ ] All error states visible (no data for model, fetch failure, invalid modelId)

**Not in scope for MVP:** Playwright E2E tests. Add after the UI stabilises post-launch.

---

## Phase 6: Polish & Documentation

### 6.1 Documentation

- [ ] `README.md` — setup, data sources, how to update static JSON files, screenshots
- [ ] `docs/data-sources.md` — detailed notes per source: where data comes from, how to refresh, known limitations
- [ ] Inline JSDoc for `data-merger.ts` and `hf-leaderboard.ts`

### 6.2 Performance

- [ ] Static JSON loaded at build time — zero runtime cost for static sources
- [ ] Live fetches use Next.js ISR — no cold-start cost on page load
- [ ] Bundle size < 300KB
- [ ] Lighthouse 90+ across all metrics

### 6.3 Final Review

- [ ] TypeScript strict mode — zero `any` types
- [ ] ESLint passing with no suppressions
- [ ] No secrets or API keys in source
- [ ] Keyboard navigation throughout
- [ ] ARIA labels on all interactive elements

---

## Deferred (Post-MVP)

- **Historical trend charts** — requires storing snapshots in a lightweight DB (SQLite or Postgres)
- **Automated scraping pipeline** — Playwright or Cheerio to scrape Chatbot Arena HTML on a cron
- **User saved comparisons** — needs auth (Clerk or NextAuth)
- **Email alerts** — notify when a model's rank changes significantly
- **Embed widget** — shareable iframe for a model's score card
- **Additional sources** — HELM, BIG-Bench Hard, MMLU-Pro standalone leaderboard

---

## Implementation Order Summary

```
Phase 1 (Data Layer)
├── types/models.ts, benchmarks.ts, api.ts
├── data/models.json, chatbot-arena.json, artificialanalysis.json, livecode-swebench.json
├── lib/hf-leaderboard.ts
├── lib/artificialanalysis.ts
├── lib/data-merger.ts
├── lib/models.ts
└── components/ui/Tooltip.tsx, ScoreBadge.tsx, DataFreshnessTag.tsx

Phase 2 (Backend)
├── app/api/v1/health/route.ts
├── app/api/v1/models/route.ts
├── app/api/v1/benchmarks/[modelId]/route.ts
└── app/api/v1/compare/route.ts

Phase 3 (Frontend)
├── components/ModelSelector.tsx
├── components/BenchmarkTable.tsx
├── components/MetricsChart.tsx
├── components/SourcePanel.tsx
├── components/ModelCard.tsx
├── components/CompareLayout.tsx
├── components/BenchmarkFilter.tsx
└── components/Header.tsx, Footer.tsx, ErrorBoundary.tsx

Phase 4 (Integration)
├── app/page.tsx
├── app/models/[id]/page.tsx
└── app/layout.tsx

Phase 5 (Tests)
└── tests/unit/*.test.ts + manual checklist

Phase 6 (Polish)
├── README.md, docs/data-sources.md
├── Performance audit
└── Final review
```

---

## Dependencies & Environment

### Required

None required for a static-only launch. All static benchmark data is bundled at build time.

### Optional (live fetch sources)

```bash
# No key needed for HuggingFace public datasets API
AA_API_KEY=aa_...   # ArtificialAnalysis, if they require auth for programmatic access
REVALIDATE_SECRET=  # For on-demand ISR revalidation endpoint
```

### Install for testing

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

---

## MVP Success Criteria

- [ ] User can select 2–4 models and see a side-by-side benchmark comparison table
- [ ] All 4 sources represented: Chatbot Arena, ArtificialAnalysis, HF Open LLM Leaderboard, LiveCodeBench/SWE-bench
- [ ] Data freshness date shown for each source with a link to the original
- [ ] Comparison is shareable via URL query string
- [ ] HF Leaderboard data fetched live and revalidated every 24h
- [ ] Mobile responsive at 375px+
- [ ] TypeScript strict, ESLint clean, no console errors in production
- [ ] Static JSON files are easy for a developer to update manually without touching application code
