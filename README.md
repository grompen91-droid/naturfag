# Naturfag Quiz

JSON-driven scroll-snap quiz built with Vite, React 19, TypeScript, Tailwind CSS v4, and Zod.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Edit the quiz

**Full guide:** [docs/quiz-json-guide.md](docs/quiz-json-guide.md) — step-by-step JSON reference, examples, and checklist.

All content lives in **`public/quiz.json`**. The root is an array of steps:

```json
[
  {
    "video": "/videos/intro.mp4",
    "title": "Step title",
    "body": ["Paragraph one", "Paragraph two"],
    "questions": [
      {
        "text": "Question text?",
        "options": ["A", "B", "C"],
        "answer": 1
      }
    ]
  }
]
```

| Field | Required | Notes |
|-------|----------|-------|
| `video` | No | Path under `public/`. Omit for text-only steps. |
| `title` | Yes | Left column heading |
| `body` | Yes | Array of paragraphs |
| `questions` | Yes | At least one per step |
| `questions[].answer` | Yes | 0-based index of the correct option |

1. Add MP4 files to `public/videos/`.
2. Edit `public/quiz.json` — add steps, questions, or remove `video` for text-only panels.
3. Save and refresh the dev server. Invalid JSON or schema errors appear in the browser console.

Button labels (Tilbake, Neste spørsmål) are hardcoded in Norwegian in the React components.

## Build

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. Import the project in [Vercel](https://vercel.com/new).
3. Framework preset: **Vite** (or use the included `vercel.json`).
4. Build command: `npm run build`
5. Output directory: `dist`

No environment variables are required. The quiz is fully static.

## Project structure

```
public/
  quiz.json          # Quiz content
  videos/            # Optional MP4 files
src/
  App.tsx
  main.tsx
  index.css
  styles/tokens.css
  lib/               # Zod schema, helpers
  context/           # QuizProvider
  components/        # UI panels
```

## Placeholder videos

The sample `quiz.json` references `/videos/intro.mp4`. That file is not included in the repo — add your own video or remove the `video` field from the first step for a text-only flow.
