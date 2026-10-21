# 03 — Roadmap

Six phases. Each phase has an **entry condition**, a **time box**, **what you do**, and an **exit gate** measured by numbers in [tracking/PROGRESS.md](../tracking/PROGRESS.md). You cannot skip a gate. If a time box expires without the gate being met, the phase is extended once; if it expires again, the project goes to [the stop rule](05-risk-and-money-rules.md#the-stop-rule).

Cash at risk is **$0 through Phase 2**. Total cash at risk over the whole plan is capped (decision D-004, proposed $600 in 12 months).

Time assumption: **8-10 hours/week** around a day job. Swing trading on daily/4-hour charts needs ~30-60 minutes of chart work per day plus a weekend review; it does not need you at the screen during market hours.

---

## Phase 0 — Orientation (week 1-2) · cost $0

**Entry:** now.

**Do:**
- Read this repo's docs 00-08.
- Babypips School of Pipsology: Preschool → Elementary (currencies, pips, lots, leverage, order types, margin). ~10 hours.
- Open a free MT5 demo (any major broker that serves Pakistan) and a TradingView free account. Place 20 demo orders purely to learn the mechanics: market, limit, stop, SL/TP, partial close, position size calculator.
- Read the rule pages of two prop firms end-to-end (FTMO, FundedNext). Write the rules into [tools/challenge_rules.json](../tools/challenge_rules.json).
- Write your personal **why/stop** statement in [decisions/DECISIONS.md](../decisions/DECISIONS.md) D-001.

**Exit gate:**
- [ ] Can explain, from memory, every term in [docs/01](01-glossary.md).
- [ ] Can compute position size for a given risk % and SL distance by hand and with the tool.
- [ ] Can list the daily loss, max loss, min days, consistency and news rules of 2 firms without looking.

---

## Phase 1 — Build one strategy (week 3-8) · cost $0

**Entry:** Phase 0 gate.

**Do:**
- Babypips Middle School → High School (support/resistance, trends, candlesticks, multiple time frames, risk management, trading plan). ~20 hours.
- Read *Trading in the Zone* (Mark Douglas) and the position-sizing chapters of Van Tharp. ~10 hours.
- Define **one** rule-based swing strategy in [docs/04-strategy.md](04-strategy.md): markets, timeframe, entry conditions, SL placement, TP placement, risk %, filters (news, session, weekend), max open trades. Every rule must be unambiguous enough that your brother could execute it identically.
- **Backtest by hand** using TradingView bar replay (or FX Replay): 100 historical setups across 3-4 markets and at least two different years. Log each in [journal/BACKTEST-LOG.csv](../journal/BACKTEST-LOG.csv). Compute win rate, average R, expectancy, max consecutive losses, max drawdown in R.
- Run [tools/journal_stats.py](../tools/journal_stats.py) on the log.

**Exit gate (all required):**
- [ ] ≥ 100 hand-backtested trades following the written rules.
- [ ] Expectancy ≥ +0.3R per trade.
- [ ] Max drawdown in the backtest, at 0.75% risk per trade, stays under 6% (firm limit is usually 10%; we want margin).
- [ ] Rules written such that two people would take the same trades (test this: have someone else read the rules and mark 10 charts).
- [ ] Decision logged: D-005 "Strategy v1 frozen".

If the gate fails: adjust the strategy *once*, re-run 100 fresh samples (different period). If it fails again, that strategy is dead; pick the next candidate. Never "tune" on the same data you tested on.

---

## Phase 2 — Forward test on demo under prop rules (week 9-24, i.e. ~3-4 months) · cost $0

**Entry:** Phase 1 gate.

**Do:**
- Trade the frozen strategy on an MT5 demo sized like the target challenge (e.g. $25k or $50k), risking 0.5-0.75% per trade.
- Run [tools/rule_guard.py](../tools/rule_guard.py) daily: it reads the demo account history and tells you if you would have breached the firm's daily/max loss, min days, consistency or news rules. Treat a simulated breach exactly as a real one: **reset the demo and log it as a blown account.**
- Also take at least one **free prop-firm trial** (FTMO Free Trial, FundedNext trial) in month 2-3 to feel the real dashboard.
- Journal every trade in [journal/TRADE-LOG.csv](../journal/TRADE-LOG.csv) with screenshots. Weekly review every Sunday using [journal/WEEKLY-REVIEW-TEMPLATE.md](../journal/WEEKLY-REVIEW-TEMPLATE.md).
- Rule adherence % is the headline metric, not profit.

**Exit gate (all required, measured over the *last* 3 calendar months):**
- [ ] ≥ 40 forward-tested trades.
- [ ] Rule adherence ≥ 95% (trades taken exactly per plan / total trades).
- [ ] Expectancy ≥ +0.25R.
- [ ] Zero simulated breaches in the last 60 days.
- [ ] Net return over the 3 months ≥ +6% (i.e. you would have passed a Phase 1 target of ~8-10% in ~4 months at this pace, with margin) **and** max drawdown ≤ 5%.
- [ ] You have passed at least one *free* trial challenge, or come within the rules on it.
- [ ] Decision logged: D-006 "Go for first paid challenge" with firm, size and fee named.

Most people fail this gate. That is the point: it's free to fail here.

---

## Phase 3 — First paid challenge (month 7-10) · cost: 1-2 challenge fees (~$100-$250 each)

**Entry:** Phase 2 gate + money available within the loss budget.

**Do:**
- Buy a mid-sized two-step challenge at a reputable firm (research in [docs/02](02-how-prop-firms-work.md)); likely $25k-$50k. Smaller sizes have the same fee-per-dollar and lower payouts; larger have higher fees and the same pass probability.
- Trade **identically** to Phase 2. Same risk, same strategy, same hours. The only thing that changes is that the fee is real.
- Target 3%/month. Do not try to pass in a week. Phase 1 of the challenge should take 2-4 months. Most firms now have no time limit; confirm before buying.
- Continue journal + rule guard + weekly review.

**Exit gate:**
- [ ] Challenge passed (both phases) → Phase 4.
- [ ] Challenge failed: do a written post-mortem in [journal/POST-MORTEMS.md](../journal/POST-MORTEMS.md). If the failure was a **rule-adherence** failure (you deviated), go back to Phase 2 for 60 days before the second attempt. If it was a **strategy** failure within rules (edge didn't show), stop and re-evaluate in a decision record. Maximum **two** paid attempts inside the first loss budget.

---

## Phase 4 — Funded, first payouts (month 10-15) · cost: $0 new

**Entry:** passed challenge.

**Do:**
- Same strategy, same risk (consider dropping to 0.5% for the first month — the first payout matters more than its size).
- Request the first payout at the first eligible date even if small; it validates the firm and refunds the fee at most firms.
- After the first payout: log it, re-read [docs/06](06-psychology.md) ("the good times are also dangerous").

**Exit gate:**
- [ ] Two consecutive payouts received.
- [ ] Rule adherence still ≥ 95%.
- [ ] Decision logged: D-010 "Scale or hold".

---

## Phase 5 — Scale (month 15+)

**Do:**
- Use payouts (not salary) to buy additional challenges at 1-2 other reputable firms, max one new challenge per month. Diversifies firm risk (firms collapse).
- Use the firm's scaling plan.
- Expected income model, all at 1.25%/month and 80% split, for a sense of scale, not a promise:

| Simulated allocation | Gross/month | Your 80% |
|---|---|---|
| $50k | $625 | $500 |
| $200k | $2,500 | $2,000 |
| $500k | $6,250 | $5,000 |
| $800k (video guest) | $10,000 | $8,000 |
| $1M | $12,500 | $10,000 |
| $4M (needed for $50k/mo at 1.5%) | $60,000 | $48,000 |

Note the last row: most firms cap allocation at $1-4M *per trader* and several explicitly stop scaling or impose stricter rules for large accounts. $50k/month is a 4-6 year outcome with low probability, not a plan. $2-10k/month is the realistic success scenario over 2-3 years.

**This is also when teaching starts** (brother/wife): they begin at Phase 0 using this repo, with you as the mentor. See [docs/08](08-teaching-and-product.md).

---

## Timeline summary (optimistic-but-honest)

| Phase | Weeks | Cumulative | Cash at risk |
|---|---|---|---|
| 0 Orientation | 2 | week 2 | $0 |
| 1 Strategy + backtest | 6 | week 8 | $0 |
| 2 Forward test | 16 | week 24 | $0 |
| 3 First paid challenge | 12-16 | week 40 | $100-$500 |
| 4 Funded, first payouts | 12-20 | week 60 | $0 |
| 5 Scale | ongoing | year 2+ | funded from payouts |

First dollar earned: realistically **month 10-14**. First $1,000/month: **month 14-20**. Anyone promising faster is selling something.
