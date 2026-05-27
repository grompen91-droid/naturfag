# Quiz chrome redesign: progress rail, reading column, audio toolbar

**Date:** 2026-05-27  
**Status:** Approved  
**Register:** Product (school quiz UI)

## Goal

Improve peripheral UI so the quiz feels calmer and more intentional: progress on the **right** (vertical) on desktop, **top center** (horizontal) on mobile, reading text without a card box, and **consistent** bottom-right audio controls.

## Decisions

| Topic | Choice |
|-------|--------|
| Mobile progress | **A** — top center, horizontal compact bar |
| Desktop progress | Fixed **right**, vertical meter, minimal chrome (no heavy card) |
| Reading column | Remove `.content-panel` bordered box; plain title + body |
| Desktop layout inset | `padding-right: ~5.5rem` (replaces left `quiz-layout-inset`) |
| Audio controls | Shared pill button style; menu uses same tokens |

## Progress widget

- Structure: label → stacked count → optional "X igjen" → progress track
- Mobile: full-width shell at top, horizontal track (~4px height)
- Desktop: narrow rail (~3.5rem), vertical track (~5rem height), fill bottom-up
- Complete: green fill + label "Ferdig"
- ARIA: `role="progressbar"` on track, screen-reader summary unchanged

## Content panel

- Drop `content-panel` wrapper styles (border, shadow, elevated bg)
- Keep motion/stagger and scroll; `font-section` title, `font-body` paragraphs
- Divider between columns unchanged

## Audio toolbar

- Container: `.quiz-audio-toolbar` fixed bottom-right
- Buttons: `.quiz-audio-toolbar__btn` (shared), min 44px height
- "Bytt sang": always secondary (blue-light bg)
- "Demp lyd": primary when audio enabled and not muted; secondary when muted
- Popover menu: unchanged behavior, styled with `surface-elevated` + blue border

## Files

- `src/components/QuizProgress.tsx`
- `src/components/ContentPanel.tsx`
- `src/components/QuizAudioControls.tsx`
- `src/index.css` (progress + audio + layout utility)
- `src/styles/plyr-theme.css` (right inset on video)
- `src/components/KnowledgeCheck.tsx`, `SummaryOverview.tsx`, `SummaryReview.tsx` (class rename)

## Out of scope

- Changing quiz logic, audio rules, or keyboard shortcuts
- Pacifico / global typography overhaul
