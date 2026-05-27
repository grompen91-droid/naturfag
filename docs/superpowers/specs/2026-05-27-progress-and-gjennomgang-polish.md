# Progress rail (B) + Gjennomgang polish

**Date:** 2026-05-27  
**Status:** Approved (option B)

## Progress widget (`QuizProgress`)

### Desktop (`md+`)
- Fixed right rail, vertically centered
- **No** "Spørsmål" label, **no** card shell (border/background)
- Stacked numerals: answered (large) / total (small, muted)
- Slim vertical bar (`~0.2rem` × `~4.5rem`), fill bottom-up
- Complete: green numerals + bar; optional tiny "Ferdig" only when complete
- `igjen` line: omit on desktop

### Mobile
- Top center compact pill: `12/17` tabular, optional `5 igjen` below
- Horizontal slim bar under numerals
- Short label "Spørsmål" allowed on mobile only

### A11y
- `role="progressbar"` on track; full summary in `.quiz-progress__sr-only`

### Layout
- Reduce `quiz-layout-inset-right` to `~4rem` on desktop

## Gjennomgang (`SummaryReview`)

- Remove header duplicate `Spørsmål X av Y` (global progress owns it)
- Remove Riktig/Feil legend (chip colors suffice)
- Nav column: `md:max-w-[17rem] md:flex-shrink-0`; question `md:flex-1`
- Labels: sentence case, less uppercase shouting
- `StepPicker`: optional `compact` prop (smaller padding/type on review only)

## Out of scope

- Dot rail, step-grouped progress, collapsible steps
