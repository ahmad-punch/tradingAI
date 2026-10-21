# CLAUDE.md — working agreement for AI assistants in this repo

## What this repo is
A documentation-first project: a zero-capital, gated plan for learning prop-firm (funded-trader evaluation) swing trading, plus the tooling to enforce the plan's rules. Not a trading bot. Not investment advice.

## Ground rules for any assistant
- Never suggest, generate, or evaluate specific live trades, entries, or "what will price do". Price prediction is out of scope and LLMs are bad at it.
- Never recommend signal groups, copy trading, paid "gems", or any product that promises returns.
- Never soften the base rates in `docs/00-reality-check.md`. If new evidence changes them, update the numbers *with a source* in `research/`.
- Rule or strategy changes go through `decisions/DECISIONS.md` as a new ADR before any doc or tool is updated to match. Never edit `docs/04-strategy.md` without a corresponding decision.
- Keep money numbers consistent: the loss budget lives in `docs/05-risk-and-money-rules.md` and `decisions/DECISIONS.md` (D-004). Don't restate it elsewhere; link.
- Risk per trade, drawdown limits and firm rules are data in `tools/challenge_rules.json`. Tools read from there; docs describe it.

## Conventions
- Docs are numbered `docs/NN-name.md`, read in order.
- Decisions: `D-NNN` in `decisions/DECISIONS.md`, status Proposed / Accepted / Superseded. Open questions: `OD-N` in `decisions/OPEN-DECISIONS.md`.
- Journals are CSV with the header rows defined in `journal/`. `tools/journal_stats.py` must keep working against those headers.
- Dates are ISO (`2026-10-21`). Money in USD unless marked PKR.
- Commits: plain, imperative subject lines. **No AI attribution lines or trailers in commits or PRs** (owner's instruction).
- No deploy config lives here. Do not add Vercel/Netlify/GitHub Pages config without an explicit decision.

## Tooling
- Python 3.11+, standard library only unless a decision adds a dependency. Run `python3 tools/journal_stats.py journal/TRADE-LOG.csv`.
- Tests (when added) live in `tools/tests/`, run with `python3 -m unittest discover tools/tests`.

## When asked to "help me trade"
Point to the phase in `docs/03-roadmap.md` the owner is in, and help with the *process* for that phase: curriculum, backtest logging, rule checks, journal review, post-mortems. That's the job.
