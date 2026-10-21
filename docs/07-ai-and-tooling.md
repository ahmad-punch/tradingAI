# 07 — AI and tooling: what helps, what's hype, what we'll build

Full research: [research/tooling-and-learning.md](../research/tooling-and-learning.md).

## The honest split

| AI/automation **can** do this well | AI/automation **cannot** do this |
|---|---|
| Enforce rules: compute position size, refuse a trade that breaks the checklist, flag distance-to-breach on daily/max loss | Predict price. LLMs on charts show no durable edge after costs in any credible study; any signal is stale and non-exclusive |
| Journal review: read the CSV, cluster losses by session/market/emotion, write the weekly review draft, spot rule drift | Pass a challenge for you. "AI passing bots" trip hyperactivity, consistency and herd-detection rules and get accounts terminated |
| Backtest tooling: generate the replay logger, the stats script, the Dukascopy data loader; catch look-ahead bugs if asked to | Replace the 100 hand-backtested trades. Pattern recognition is the skill being trained; automating it away leaves you with nothing to execute |
| Curriculum: explain any concept, quiz you on firm rules, summarise news-calendar risk for the week | Make the base rates better |
| Screen D1/H4 charts for setups you *already defined* so you look at 4 charts, not 40 | Choose the strategy. That's a backtest result, not an opinion |

## The stack (all free or under $20/month)

| Need | Tool | Cost |
|---|---|---|
| Charts, bias, levels | TradingView Free (Essential ~$13/mo only if bar replay needed) | $0-13 |
| Replay backtesting | FX Replay free tier → $15/mo in Phase 1 only; or TradingView replay | $0-15 |
| Demo execution | MT5 demo from any broker serving Pakistan (Exness/Pepperstone reported OK; verify) | $0 |
| Prop-rule practice | FTMO Free Trial, FundedNext 14-day trial | $0 |
| Historical data | Dukascopy tick data via `dukascopy-node`; HistData M1 | $0 |
| Journal | `journal/TRADE-LOG.csv` in this repo + `tools/journal_stats.py`; Tradervue free tier if a UI is wanted | $0 |
| Rule enforcement | `tools/rule_guard.py` (ours) reading MT5 history exports; later a cTrader/MT5 plugin | $0 |
| AI review | Claude/ChatGPT with the CSV and the weekly template; prompt in `journal/AI-REVIEW-PROMPT.md` | existing subscription |
| Economic calendar | Forex Factory / Investing.com | $0 |

## What we build, in order (each is small, each is used immediately)

1. **`tools/position_size.py`** — risk % + SL distance → lots. Day 1.
2. **`tools/journal_stats.py`** — reads the CSV, prints expectancy, win rate, avg R, profit factor, max DD in R, consecutive losses, rule-adherence %, compliant-vs-non-compliant expectancy. Phase 1.
3. **`tools/challenge_rules.json` + `tools/rule_guard.py`** — firm rules as data; given a demo account's trade history, report whether any day breached daily loss, whether max loss was breached, min days met, consistency rule status, and current "distance to breach". Phase 2. This is the tool the video's guest didn't have and it is the one that would have saved him 15 accounts.
4. **AI weekly review** — a prompt + script that pipes the week's CSV rows and the previous review into Claude and drafts the review; you edit, you decide. Phase 2.
5. **Setup screener** — Python on Dukascopy D1/H4 data flagging the strategy's conditions (EMA bias + pullback zone + H4 trigger). Phase 2-3. Never auto-trades.
6. **Multi-account dashboard** — only in Phase 5 when there's more than one account. Also the seed of the product (docs/08).

## Rules for using AI in this project

- An AI never places a trade and never tells you to place one. It can say "this chart meets conditions 1-3; condition 4 is not met."
- Every AI-generated script that touches backtests is checked for look-ahead bias (using data from after the decision point). Ask it to show you the timestamp logic.
- AI review of the journal is *descriptive* ("your losses cluster on Fridays"), and any rule change still goes through a decision record.
- No "AI signal" products, no EA purchases, no copy trading. Firms terminate for it and the evidence says it doesn't work.
