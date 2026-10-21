# tradingAI tracker (browser version)

A shareable, no-install version of the plan. Open `index.html` in any browser. No server, no build, no accounts.

## How it works
- **Progress is saved in your browser** (localStorage) under one key. Nothing is sent anywhere.
- **Export / Import** (top right) downloads or loads a JSON file with all your progress. Use it to move between devices, to back up, or to send your week to your accountability partner or an AI assistant for review.
- **Plain / Detailed** toggle switches every page between a plain-language version (for someone with no finance background) and the full version with numbers.
- Sharing the folder shares the pages only, never anyone's progress.

## Pages
| Page | What you do there |
|---|---|
| `index.html` | The honest answer, the odds, your dashboard, first-time setup |
| `roadmap.html` | Six phases with gate checkboxes; live numbers next to numeric gates |
| `learning.html` | Curriculum checklist, learning log, glossary self-test, the psychological traps |
| `journal.html` | Position sizer, pre-trade checklist, trade log, backtest log, stats, rule guard, weekly review, post-mortems |
| `money.html` | The $600 envelope, ledger, stop-rule check, payout split, firm fee table, what-if calculator |
| `decisions.html` | Decision log with status, open decisions, propose new ones |
| `ai.html` | What an AI assistant does here (and doesn't), weekly AI routine, teaching and product |

## Running locally with a server (optional)
Some browsers restrict `file://` features. If anything misbehaves:

```bash
cd site && python3 -m http.server 8787
```

then open http://localhost:8787.

## Data shape
Everything lives under `localStorage['tradingai.v1']` as one JSON object; keys: `profile, gates, curriculum, learninglog, glossaryQuiz, trades, backtest, reviews, postmortems, ledger, settings, decisions, openDecisions, aiRoutine`. The journal page can also export/import the trade log as CSV in the same column order as `journal/TRADE-LOG.csv`, so the Python tools in `tools/` read it directly.
