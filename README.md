# PromptDuck 🦆

Cognitive prompt engineering platform — transform raw ideas into production-grade AI prompts using intelligent heuristics, structured templates, and multi-mode optimization.

## Features

- **Multi-Mode Prompt Generation** — General, Builder, Cursor AI, and Midjourney modes
- **Cognitive Heuristics Engine** — 14+ enhancement strategies (Universal Clarity, Format Optimization, Self-Repairing Logic, Multi-Role Collision, etc.)
- **Builder Mode** — R-T-C-F-G (Role → Task → Constraints → Format → Goal) structured templates for app development prompts with smart intent classification and project scaffolding
- **AI-Powered Suggestions** — Remix and enhance prompts with contextual recommendations
- **Prompt Library** — Save, organize, and reuse prompts with cloud sync via Supabase
- **Playground** — Interactive prompt testing environment with conversation history
- **Analytics** — Usage tracking via PostHog
- **Authentication** — Supabase Auth with email/password

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite + SWC |
| Styling | Tailwind CSS + shadcn/ui |
| Routing | React Router v6 (HashRouter) |
| State | Zustand |
| Query | TanStack React Query |
| Backend | Supabase (Auth, Database, Edge Functions) |
| AI | OpenAI API, Google Gemini |
| Analytics | PostHog |

## Getting Started

```bash
npm install
npm run dev
```

Opens at `http://localhost:8080`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 8080 |
| `npm run build` | Production build |
| `npm run build:dev` | Dev-mode build |
| `npm run lint` | ESLint check |
| `npm run preview` | Preview production build |

## Project Structure

```
src/
├── components/     # UI components (ui/, generator/, landing/, library/, playground/, etc.)
├── constants/      # Modes, heuristics, personas, categories
├── hooks/          # Custom React hooks (auth, generation, playground, supabase)
├── pages/          # Route pages (Landing, Generator, Library, Playground, Settings)
├── services/       # OpenAI, analytics, optimistic generation, copilot
├── store/          # Zustand stores (apiKey, credit, generator, prompt, theme, ui)
├── types/          # TypeScript type definitions
├── utils/          # Exporters, heuristic selectors, migration utils
├── integrations/   # Supabase client setup
├── App.tsx         # Root component with routing
└── main.tsx        # Entry point

supabase/
└── functions/      # Edge Functions (generate-prompt with intent classification)
```

## Environment Variables

Copy `.env` to configure:

- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — Supabase project credentials
- `VITE_POSTHOG_KEY` — PostHog analytics
