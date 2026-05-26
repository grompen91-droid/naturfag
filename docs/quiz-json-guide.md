# Quiz JSON guide

This site loads all content from **`public/quiz.json`**. You do not need to change any React code to update text, videos, or questions — only this file (and video files in `public/videos/`).

After editing, save the file and refresh the browser. In development, invalid JSON or schema errors are logged in the browser console and the page shows an error message.

---

## File location and shape

- **Path:** `public/quiz.json`
- **Root:** a JSON **array** of steps (sections), in display order.

```json
[
  { /* step 1 */ },
  { /* step 2 */ }
]
```

Each object in the array is one **step**. A step becomes one or two full-screen panels when users scroll:

| Step has `video`? | What users see (top to bottom) |
|-------------------|--------------------------------|
| Yes | Video panel → then text + questions panel |
| No | Text + questions panel only |

At the **end of the page** (after all steps), two summary panels are added automatically — you do not configure them in JSON.

---

## Step fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `title` | Yes | string | Heading in the left column |
| `body` | Yes | string[] | Paragraphs of explanatory text (one string = one paragraph) |
| `questions` | Yes | array | At least one question for this step |
| `video` | No | string | Path to an MP4 file under `public/` (see [Videos](#videos)) |

### Minimal text-only step

```json
{
  "title": "My section title",
  "body": ["First paragraph.", "Second paragraph."],
  "questions": [
    {
      "text": "Your question here?",
      "options": ["Option A", "Option B"],
      "answer": 0
    }
  ]
}
```

### Step with video

```json
{
  "video": "/videos/lesson-01.mp4",
  "title": "Introduction",
  "body": ["Watch the video, then answer the questions."],
  "questions": [ /* ... */ ]
}
```

Put the file at `public/videos/lesson-01.mp4`. The path in JSON always starts with `/videos/`.

---

## Question fields

Each item in `questions` is one multiple-choice question. Only **one question is shown at a time** on the right; users move between them with **Tilbake** and **Neste spørsmål**.

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `text` | Yes | string | The question wording |
| `options` | Yes | string[] | **2–6** answer choices |
| `answer` | Yes | number | **0-based index** of the correct option |

### How `answer` works

Options are numbered from **0**:

```json
"options": ["Bearbeidet kjøtt", "Fisk og nøtter", "Sukkerholdig brus"],
"answer": 1
```

- `0` → first option (Bearbeidet kjøtt)
- `1` → second option (Fisk og nøtter) ← correct
- `2` → third option (Sukkerholdig brus)

If `answer` is equal to or greater than the number of options, the app will fail validation.

### Several questions on the same content

Use multiple objects in `questions`. They share the same `title` and `body` for that step:

```json
"questions": [
  {
    "text": "First question?",
    "options": ["A", "B", "C"],
    "answer": 0
  },
  {
    "text": "Second question?",
    "options": ["X", "Y"],
    "answer": 1
  }
]
```

---

## Videos

1. Copy your `.mp4` into `public/videos/` (e.g. `public/videos/intro.mp4`).
2. Reference it in JSON: `"video": "/videos/intro.mp4"`.
3. Omit `video` entirely for a step with only text and questions.

Tips:

- Use H.264 MP4, around 720p, compressed for web.
- Large files increase load time and Vercel bandwidth; keep videos as short as needed.

---

## Full example

```json
[
  {
    "video": "/videos/intro.mp4",
    "title": "Ernæring og helse",
    "body": [
      "Intro paragraph one.",
      "Intro paragraph two."
    ],
    "questions": [
      {
        "text": "Hva er den beste kilden for sunt fett?",
        "options": ["Bearbeidet kjøtt", "Fisk og nøtter", "Sukkerholdig brus"],
        "answer": 1
      },
      {
        "text": "Hvor mange kalorier gir omtrent 1 gram karbohydrat?",
        "options": ["2 kcal", "4 kcal", "9 kcal"],
        "answer": 1
      }
    ]
  },
  {
    "title": "Miljø og bærekraft",
    "body": ["This step has no video."],
    "questions": [
      {
        "text": "Hvilken matgruppe har typisk lavest klimagassutslipp per kalori?",
        "options": ["Storfe", "Kylling", "Belgfrukter og grønnsaker"],
        "answer": 2
      }
    ]
  }
]
```

This produces:

1. Video panel (step 1)
2. Text + questions panel (step 1)
3. Text + questions panel (step 2, no video)
4. Summary overview (automatic)
5. Summary review (automatic)

---

## What users experience (not in JSON)

These behaviours are built into the app; you do not configure them in JSON:

- **Scroll snap** — scrolling jumps between full-screen panels (video or knowledge check).
- **Click to answer** — choosing an option submits immediately; correct answers get a green border, wrong picks red.
- **Summary** — after every question in every step is answered, the page scrolls to a score overview, then users can review answers step by step.

Button labels (**Tilbake**, **Neste spørsmål**) are fixed in the app (Norwegian).

---

## Checklist before publishing

- [ ] Valid JSON (no trailing commas; use a JSON validator if unsure)
- [ ] At least one step in the root array
- [ ] Every step has `title`, `body`, and at least one `question`
- [ ] Each question has 2–6 `options` and a valid `answer` index
- [ ] Every `video` path matches a real file in `public/videos/`
- [ ] Run `npm run dev` locally and walk through the full quiz

---

## Deploying changes

1. Edit `public/quiz.json` (and add videos under `public/videos/` if needed).
2. Commit and push to your Git repository.
3. Vercel rebuilds automatically; visitors get the new content on the next load.

No server or database is involved — only static files.
