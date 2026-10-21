# 05 — Risk and money rules

These are the rules that protect the household, not the account. They are deliberately boring and deliberately hard to change.

## Money that can ever leave the house

| Item | Allowed? | Cap |
|---|---|---|
| Prop-firm challenge fees | Yes | Within the loss budget below |
| Brokerage deposit (real money trading) | **No** | — |
| Paid courses | Not before Phase 1 is complete on free material; then only via a decision record | $0 by default |
| Signal groups, "gems", copy trading, EAs that promise returns | **Never** | — |
| Paid tooling (TradingView Pro, journal app) | Yes, if under $20/month and logged | $20/month |

## The loss budget (decision D-004)

- **Year-1 cap: $600** total on challenge fees (about PKR 170k at Oct 2026 rates). Proposed; confirm in D-004.
- Comes from a separate, named envelope. It is not topped up from salary mid-year under any circumstance. If it's spent, Phase 3/4 pauses until next year's budget or until payouts fund it.
- Payouts can fund further challenges (Phase 5) but **the first 50% of every payout goes to the household**, never back into trading, until the trading "bankroll" of payouts reaches $2,000.

## The stop rule

The project **stops**, and the stop is logged as a decision, if any one of these happens:
1. Loss budget is exhausted without a passed challenge.
2. Two paid challenges fail with the post-mortem citing rule violations (not strategy variance). That means the problem is behaviour, and more fees won't fix it.
3. The Phase 2 gate is missed twice (two extensions).
4. You catch yourself doing any of: hiding losses from your spouse, borrowing to fund fees, trading during work hours against the plan, moving a stop loss further away, opening a scalping chart "just to look", buying a challenge the same day one was breached.
5. Sleep, work performance or family life is measurably affected (the guest's CGPA fell; you'll have equivalents).

Stopping is a legitimate, respectable outcome of this project. The repo stays as a record.

## Per-trade and per-account rules (also encoded in tools/challenge_rules.json)

| Rule | Value | Why |
|---|---|---|
| Risk per trade | 0.75% (0.5% gold / first month on any account) | 5% daily limit ÷ 0.75% ≈ 6 full stops before breach; realistically 2 open trades = 1.5% worst day |
| Max open risk | 1.5% | Two correlated trades count as one |
| Weekly loss cap | −2.25% → stop trading until Monday | Prevents the Thursday-night revenge spiral in the transcript |
| Monthly loss cap | −4% → stop trading until next month, write post-mortem | Keeps max drawdown well inside 10% |
| Monthly target | 3% → reduce risk to 0.5% | The host's number; the guest's turnaround number |
| Stop loss | Always set at entry; never widened | Non-negotiable |
| Position size | Computed, never chosen | Use the calculator every time |
| News | No new entries 24h before high-impact; flat 2 min around release if firm requires | Firm rule and the guest's AUD/NZD lesson |
| Time | No chart below H1; no entries during work hours | Protect the job that funds everything |

## Position size formula

```
risk_amount   = account_balance × risk_pct
sl_distance   = |entry − stop| in price units
pip_value     = contract_size × pip_size (per lot, converted to account currency)
lots          = risk_amount / (sl_distance_in_pips × pip_value_per_lot)
```

[tools/position_size.py](../tools/position_size.py) does this. Use it every single trade; never estimate.

## How prop-firm drawdown rules actually bite (know these cold)

- **Daily loss measured on equity, not balance:** if yesterday's close equity was $50,000 and the daily limit is 5%, open floating losses count. Two open trades at −1.5% plus a −3.5% day = breach even if you never closed anything.
- **Trailing max drawdown:** on some firms (and most futures firms) the max-loss line moves *up* with your peak equity. A 10% trailing DD on an account that reached +6% means your floor is now −4% from start. Prefer static drawdown firms for a first challenge.
- **Daily reset time:** the "day" resets at a fixed server time (often midnight CET). A trade going against you across the reset can breach two "days".
- **Consistency rule:** if 40% of your profit came from one day, some firms won't pay. Swing trading with 2.5R targets can trip this on small samples; check the rule before buying.

## Tax and legal note (to verify — open decision OD-6)

Payouts are foreign-source income. Keep every payout invoice. Ask an accountant how prop-firm income is treated for a Pakistan resident before the first payout, not after.
