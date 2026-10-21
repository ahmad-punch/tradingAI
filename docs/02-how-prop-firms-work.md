# 02 — How prop firms work (and which ones we can use from Pakistan)

Full research with sources: [research/prop-firms.md](../research/prop-firms.md). This page is the decision-ready summary. Numbers as of Oct 2026; **verify at checkout**, rules change monthly.

## The mechanism in one diagram

```
 You pay fee ($40-$550)
        │
        ▼
 Phase 1 (simulated $X account): make +8-10% without
   • losing >5% in a day (equity-based, resets at fixed server time)
   • losing >10% overall (static, or trailing on some firms)
   • breaking news / weekend / consistency rules
   • trading fewer than 3-4 days
        │ pass (~10-15% do)
        ▼
 Phase 2: make +5% under the same loss rules
        │ pass
        ▼
 "Funded" (still simulated): profits paid to you at 80-95% split,
   every 14 days or on demand; fee refunded on 1st-4th payout.
   Scaling: +25% balance every few profitable months, cap ~$2M.
        │ ~45% of funded ever get one payout; median payout ≈ $1,100
        ▼
 Payout in USDT / Rise / wire
```

The firm's revenue is fees. Around half flows back as payouts. The firm wants you to *almost* pass, buy again, and tell your friends. None of that makes the payouts fake; it makes the marketing untrustworthy.

## The firms, filtered for us

| Firm | Pakistan OK? | 25k 2-step fee | Targets | Daily / max loss | Swing-friendly? | Free trial | Notes |
|---|---|---|---|---|---|---|---|
| **FTMO** | Appears yes (verify) | ~€250 | 10% / 5% | 5% / 10% static | **Yes** with "Swing" account: no news or weekend rules | Yes, unlimited time | Oldest, most audited (public accounts). Fee refunded at 1st payout. 2-step has no consistency rule. |
| **FundedNext** | **Yes** (official list) | ~$200 | 8% / 5% | 5% / 10% | Evaluation yes; check funded rules | Yes, 14 days | Up to 95% split. Pakistan payouts only via USDT/USDC/Rise. |
| **FundingPips** | Appears yes (verify) | ~$168 | 8% / 5% | 5% / 10% static | Evaluation yes; **funded: no weekend holding** | Unclear | Cheapest major. Fee refunded at 4th payout. |
| **The5ers** | Appears yes (verify) | 20k $165 | 10% / 5% | 5% / 10% | **Yes**, weekends allowed; 2-min news rule | No (money-back) | No consistency rule on High Stakes. |
| **Alpha Capital** | Appears yes (verify) | ~$117 | 6% / 6% | 3-4% / 6% static | Yes, news+weekend allowed | No | Tighter drawdown; cheaper. |
| **Maven** | Unclear jurisdiction | 10k $44 | 8% / 5% | 4% / 8% | Yes | No | Cheap; least transparent of this list. |
| E8 Markets | **No** | — | — | — | — | — | Pakistan on official restricted list |
| Topstep (futures) | **No** | — | — | — | — | — | Pakistan on official restricted list |

**Working shortlist for Phase 3 (decision OD-1):** FTMO Swing 2-step (25k or 50k) as the primary because of audited finances, static drawdown, no consistency rule, no news/weekend rules, free trial to practise on. The5ers High Stakes as the backup. FundedNext as the third for diversification in Phase 5. Reasoning: we are swing trading, so we buy the rule set that doesn't fight swing trading, and we pay a bit more for the firm least likely to vanish.

## Rules that kill swing traders specifically (check every one before buying)

1. **Weekend holding banned** → can't swing. FTMO Standard bans it; FTMO Swing doesn't. FundingPips bans it on *funded* accounts.
2. **Trailing drawdown on equity** → a trade that goes to +4% then back to breakeven has moved your floor up. Avoid for a first challenge.
3. **Best-day consistency rule (30-50%)** → a single 2.5R swing win can be 40% of a small sample's profit. FTMO 2-step and The5ers High Stakes have none.
4. **News window** → holding through is usually fine; *opening* within ±2-5 min is banned. Our strategy never opens near news anyway.
5. **Daily loss measured on equity at a fixed server time** → two open swing trades plus an overnight gap can breach a day you weren't awake for. Position sizing is the only defence.

## Payment and legality from Pakistan (read research/tooling-and-learning.md §3)

- A 2022 State Bank of Pakistan circular bars banks from processing payments to offshore forex trading platforms and treats resident forex trading abroad as a FERA violation. **Prop-firm fees are a different posture** (a fee for a simulated service; no trading capital remitted) but it is a grey area and not something to assume. **Open decision OD-6: get a one-hour consultation with a Pakistani lawyer/accountant before the first paid fee.** This is a real risk, not a formality.
- PKR cards usually fail at these checkouts. The community uses USDT via P2P; that has its own compliance risk. Payouts arrive as USDT or via Rise.
- Keep every invoice and payout record. Payouts are foreign-source income.

## Red flags for a bad firm (any one = don't buy)

Unverifiable company registration · anonymous leadership · rule changes after you pass · "compliance review" delaying payouts · 100% split with very cheap fees · review bursts dated before launch · payout "proof" without transaction records · no named broker/liquidity path · heavy reliance on "resets" and promo codes · firm under 12 months old · doesn't publish financials or at least payout data on an independent tracker (Payout Junction, Prop Firm Match).

## What happened to firms people trusted (so diversification is a rule, not a nice-to-have)

My Forex Funds (frozen 2023, traders unpaid ~2.5 years even though the CFTC case was later dismissed) · True Forex Funds (insolvent 2024) · The Funded Trader (paused 2024, ~900 unpaid) · SurgeTrader, Funded Engineer, FundedFirm, Indigo (2024) · MyFundedFX, OANDA Prop Trader, ATFunded (2026). Estimates of ~100 firms closed in 2024-25. **Rule: never more than 40% of allocation at one firm once scaling.**
