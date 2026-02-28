# Model Arena

Compare AI models across multiple leaderboards in a single interface.

## Data Sources

- **Chatbot Arena** - Crowdsourced LLM evaluation (ELO ratings)
- **ArtificialAnalysis** - Quality, speed, and intelligence scores
- **LiveCodeBench** - Code generation benchmarks (Pass@1/5/10)
- **SWE-bench** - Real-world software engineering task performance

## Features

- Side-by-side model comparison (up to 4 models)
- Filterable model catalog by provider, architecture, and tags
- Interactive bar and radar chart visualizations
- URL-persisted filter and selection state for shareable links
- REST API for programmatic access to benchmark data

## Tech Stack

- Next.js 16 (App Router, Server Components)
- TypeScript
- Tailwind CSS
- Recharts
- nuqs (URL state management)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/models` | List all models with optional filters |
| `GET /api/v1/benchmarks/[modelId]` | Get benchmark scores for a specific model |
| `GET /api/v1/compare?modelIds=a,b,c` | Compare multiple models |
| `GET /api/v1/health` | Check data source status |
| `POST /api/v1/revalidate` | Trigger cache revalidation (requires secret) |

## Scripts

```bash
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
npm run format     # Run Prettier
```
