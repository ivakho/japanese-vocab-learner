# Lingua Cards — Japanese Vocabulary Learner

A local-first React + TypeScript vocabulary quiz for Japanese → English or Japanese → Russian learning.

## Requirements

- Node.js 20+ recommended
- npm

## Run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Preview a production build:

```bash
npm run preview
```

## Vocabulary format

Use a UTF-8 `.txt` file.

English:

```text
@title: Basic Countries
@translation: en

にほん ||| Japan
ロシア ||| Russia
ひと ||| Person
```

Russian:

```text
@title: Basic Countries RU
@translation: ru

にほん ||| Япония
ロシア ||| Россия
ひと ||| Человек
```

Rules:

- `@title:` is required and cannot be empty.
- `@translation:` must be `en` or `ru`.
- Each vocabulary row is `Japanese ||| Translation`.
- Empty lines are ignored.
- Lines beginning with `#` are comments.
- Import size is 1–100 pairs.
- Sets with 1–3 pairs can be stored but cannot start a quiz.
- Duplicate Japanese entries are rejected.
- Invalid files are rejected as a whole and are never partially saved.

## AI generation

Ask an AI to produce plain text with no markdown:

```text
Create a UTF-8 plain-text vocabulary file using exactly this format:

@title: Basic Japanese Adjectives
@translation: en

Japanese ||| English

Create 40 unique Japanese vocabulary pairs.

Rules:
- one pair per line
- use the delimiter |||
- no numbering
- no markdown
- no explanations
- no extra text
- use unique Japanese entries
```

For Russian, change `@translation: en` to `@translation: ru` and ask for Russian translations.

## Quiz behavior

- Every original pair becomes a target exactly once.
- The target order is shuffled with Fisher–Yates.
- Every question contains one correct Japanese card and three unique distractors.
- Distractors are always selected from the full original set, so previously answered words may return as distractors.
- A round can only be answered once.
- Correct answers increase the score by one.
- The result screen shows correct, incorrect, and percentage scores.

## Data and privacy

The application has no backend or account system. Imported word sets are stored only in the browser's `localStorage` and are not uploaded anywhere.

## Project structure

```text
src/
  components/
  hooks/
  pages/
  types/
  utils/
```

Business logic is separated from UI for parsing, storage, randomization, and quiz generation.
