# tradingAI — a zero-capital, evidence-first plan for prop-firm trading

> **Status:** Phase 0 (learning). Nothing has been risked yet. See [tracking/PROGRESS.md](tracking/PROGRESS.md).
>
> **Disclaimer:** This repo is an educational plan written with an AI assistant. It is not investment advice; no one involved is a licensed financial advisor. Trading leveraged products loses money for the large majority of people who try it. Read [docs/00-reality-check.md](docs/00-reality-check.md) before anything else.

## What this is

A friend's story: a senior CSS officer learned "a different kind of trading", practised on a demo, paid a ~$200 "certification exam", got a $10,000 account, and now reportedly makes ~$12,000/month managing ~$300,000. The video shared alongside it (Sarmaya "Learn to Earn", guest Sohail, March 2026) is the same model told by a course graduate.

Translated into plain language, that model is **prop-firm evaluation trading**: a company sells you a paid *simulated* trading test (the "exam" is a challenge fee, not a certification). If you hit a profit target without breaking loss rules, they let you trade a larger *simulated* account and pay you a share (usually 80-90%) of the simulated profits in real money. You never deposit trading capital. You *do* pay fees, and most people pay them many times.

This repo is the plan to find out, cheaply and honestly, whether this can work **for us** — and, if it does, to turn the process into something teachable (brother, wife) and possibly a product.

## The one-paragraph answer

Yes, it is possible to earn from prop firms with no trading capital; the mechanism is real and payouts are real for the small minority who pass and stay disciplined. No, it cannot be done "without losing anything" — challenge fees are the cost of attempts, and the person in the video lost roughly $3,000, a $500 course fee and ~15 failed challenges over three years before his payouts started. The base rate for self-taught traders reaching consistent profitability is low (single-digit percent), the timeline is measured in years not months, and the $50,000/month ambition requires managing several million dollars of simulated capital at ~1%/month, which only a handful of people on any firm do. The realistic, defensible target is: **first funded account in 6-12 months, first payout in 9-15 months, $1,000-3,000/month by month 18-24 if (and only if) the demo results justify it.** Every step has a go/no-go gate so the total cash at risk stays capped (see [docs/05-risk-and-money-rules.md](docs/05-risk-and-money-rules.md)).

## Repo map

| Folder | What's in it |
|---|---|
| [docs/00-reality-check.md](docs/00-reality-check.md) | What the video actually says, what's true, what's omitted, base rates with sources |
| [docs/01-glossary.md](docs/01-glossary.md) | Every term from the transcript explained (TP, SL, RR, swing, scalp, phase 1/2, drawdown...) |
| [docs/02-how-prop-firms-work.md](docs/02-how-prop-firms-work.md) | Mechanics, economics, rules, firm comparison, red flags, Pakistan access |
| [docs/03-roadmap.md](docs/03-roadmap.md) | The phased plan with gates, timelines, and what "done" means for each phase |
| [docs/04-strategy.md](docs/04-strategy.md) | The single starting strategy (rule-based swing trading) and why not scalping |
| [docs/05-risk-and-money-rules.md](docs/05-risk-and-money-rules.md) | Non-negotiable risk rules, loss budget, when to stop |
| [docs/06-psychology.md](docs/06-psychology.md) | The failure modes from the transcript, and the countermeasures |
| [docs/07-ai-and-tooling.md](docs/07-ai-and-tooling.md) | What AI can and cannot do here, tool stack, what we'll build |
| [docs/08-teaching-and-product.md](docs/08-teaching-and-product.md) | Scaling to family and the product idea: what's possible, what isn't |
| [decisions/DECISIONS.md](decisions/DECISIONS.md) | Decision log (ADR style) |
| [decisions/OPEN-DECISIONS.md](decisions/OPEN-DECISIONS.md) | Things not yet decided and what would decide them |
| [learning/](learning/) | Curriculum checklist, reading list, learning log |
| [journal/](journal/) | Trade journal template, weekly review template |
| [tracking/](tracking/) | Progress tracker, KPIs, money-at-risk ledger |
| [tools/](tools/) | Scripts: journal statistics, challenge-rule simulator |
| [research/](research/) | Raw research notes with sources (prop firms, evidence, tooling) |

## How to use this repo

1. Read `docs/00` → `docs/03` in order (about 45 minutes).
2. Do the Phase 0 checklist in [learning/CURRICULUM.md](learning/CURRICULUM.md).
3. Log every session in [learning/LEARNING-LOG.md](learning/LEARNING-LOG.md) and every demo trade in `journal/`.
4. Update [tracking/PROGRESS.md](tracking/PROGRESS.md) weekly. Gates are passed by numbers, not feelings.
5. Any change to the rules goes through [decisions/DECISIONS.md](decisions/DECISIONS.md) first, never mid-trade.
