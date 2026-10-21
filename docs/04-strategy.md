# 04 — Strategy v1 (draft, not frozen)

> Status: **DRAFT**. Becomes "v1 frozen" only when decision D-005 is logged after passing the Phase 1 gate. Until then this is the template we backtest against, not something to trade.

## Why swing, why rule-based, why one strategy

- **Prop-firm rules favour swing trading.** Daily-loss limits punish many small fast losses; swing trades are few, planned, and sized so one stop costs 0.5-0.75%. The guest blew 15 accounts scalping and passed 3 of 5 swing trading.
- **Rule-based** so that (a) it can be backtested honestly, (b) rule adherence can be measured, (c) it can be taught to someone else and (d) a script can check it. Discretion is the enemy of all four.
- **One** strategy because strategy-hopping is the single most common failure mode in the transcript and in the literature. We get good at one thing.

## Markets

Start with 4, all liquid, all offered by every firm, all with clean daily trends:
- EUR/USD, GBP/USD (majors; tight spreads)
- XAU/USD (gold; trends well, but volatile — half risk until proven)
- US500 or NAS100 (index CFD; optional, add only if backtest supports)

No exotics, no crypto on the prop account (rules often differ), no stocks.

## Timeframes

- **Daily (D1)** for bias and levels.
- **4-hour (H4)** for entry trigger.
- Nothing below H1, ever, in v1.

## The setup (to be backtested — this is a reasonable, widely-used trend-pullback template, not a secret)

1. **Bias (D1):** price above a rising 50-day EMA = long-only; below a falling 50 EMA = short-only. EMA flat or price whipsawing across it = no trade in that market this week.
2. **Location:** price has pulled back to a prior D1 swing level or the 20 EMA zone, in the direction of bias.
3. **Trigger (H4):** a close back in the direction of bias (e.g. for longs: an H4 candle closes above the previous H4 high after the pullback).
4. **Entry:** at the H4 close, or a limit at 50% of the trigger candle (choose one in backtest and freeze it).
5. **Stop loss:** beyond the pullback swing low/high plus 1 × ATR(14, H4). Never moved further away. Never.
6. **Take profit:** fixed 2.5R in v1. (Partial at 1.5R + trail is a v2 question; don't mix.)
7. **Breakeven:** stop to entry once price reaches +1.5R. (Test with and without; freeze one.)
8. **Risk:** 0.75% of account per trade; 0.5% for gold and during the first month of any new account.
9. **Max exposure:** 2 open trades at once; never two trades correlated the same way (e.g. long EUR/USD + long GBP/USD count as one and share the risk budget).
10. **Filters:** no new entries in the 24 hours before a scheduled high-impact event on the traded currency (NFP, CPI, FOMC, ECB/BoE decisions). No entries on Friday after 12:00 London. Check the firm's weekend-holding rule; if swing positions over weekends are banned on the challenge type you buy, choose a different challenge type, not a different strategy.
11. **Weekly cap:** if the week reaches −2.25% (three stops), no more entries until Monday.
12. **Monthly target:** 3%. When reached, drop risk to 0.5% for the rest of the month. The target is a ceiling on aggression, not a goal to chase.

## What the backtest must record per trade

date, market, direction, bias-EMA state, pullback level, trigger candle time, entry price, SL price, TP price, R multiple result, max adverse excursion in R, days held, screenshot filename, did-rules-allow-it (Y/N), notes. Template: [journal/BACKTEST-LOG.csv](../journal/BACKTEST-LOG.csv).

## What would make us kill v1

- Backtest expectancy < +0.3R over 100 trades across two distinct periods.
- More than 8 consecutive losses in backtest (at 0.75% that's −6%; too close to firm limits).
- Rules that can't be stated unambiguously (if you and a second reader disagree on >2 of 10 charts, the rule is discretionary and must be rewritten).

## Explicitly not in v1

Scalping, indicators beyond EMA/ATR, news trading, martingale/adding to losers, "hedging", EAs/bots executing trades, copying anyone's signals, trading during the Asian session, trading more than 4 markets.
