# Decision log

Format: ID · date · status (Proposed / Accepted / Superseded by D-xxx) · context · decision · consequences. New decisions append at the bottom. A rule is not in force until its decision is **Accepted** by the owner (edit the status line).

---

## D-001 · 2026-10-21 · Proposed · Why we're doing this and when we stop
**Context.** A friend's success story + a Sarmaya "Learn to Earn" video prompted the question "can I earn from prop-firm trading with no capital?" Research (research/evidence.md) shows ~7% of challenge buyers are ever paid and 1-3% repeatedly.
**Decision.** Treat this as a bounded experiment with numeric gates (docs/03) and a stop rule (docs/05), not as a career change. Owner writes a personal "why" and "stop" statement here before Phase 0 ends:
> Why: ______
> I stop if: ______
**Consequences.** Every later decision references the gates. Stopping is a success condition of the experiment, not a failure.

## D-002 · 2026-10-21 · Proposed · Learn on free material first; no paid course by default
**Context.** The video is an advertisement for a $500 course. The guest credits the community and mentor sessions, not the content, for his turnaround; equivalent content is free (Babypips, Grimes, Douglas, Tharp).
**Decision.** Phase 0-1 use only free material (learning/CURRICULUM.md). A paid course can be reconsidered after Phase 1 via a new decision that names what the free material failed to provide.
**Consequences.** Saves $500; forces us to build our own accountability (weekly review shared with a partner) instead of buying it.

## D-003 · 2026-10-21 · Proposed · Swing trading, one rule-based strategy, nothing below H1
**Context.** Prop-firm rules (daily loss, consistency, news) punish high-frequency trading; the guest blew 15 accounts scalping and passed 3 of 5 swinging; the host's standing advice is swing + 3%/month. A rule-based strategy is the only kind that can be backtested, measured for adherence, taught, and guarded by a script.
**Decision.** Strategy v1 is the D1/H4 trend-pullback template in docs/04, frozen only after the Phase 1 gate (D-005). No scalping, no discretionary entries, no indicators beyond EMA/ATR in v1.
**Consequences.** Slower feedback loop (8-15 trades/month). Fewer chances to overtrade. Gold is half-risk until proven.

## D-004 · 2026-10-21 · Proposed · Loss budget: $600 in year one, separate envelope, no top-ups
**Context.** Industry data: average $800 spent per account lifecycle, $4,300 average among repeat buyers. The failure mode is escalation. The guest spent ~$3,500-4,000 before consistent payouts.
**Decision.** Maximum $600 on challenge fees in the first 12 months from the first paid fee. Funded from a named envelope, never topped up mid-year from salary. Maximum two paid attempts inside that budget. First 50% of any payout goes to the household until a $2,000 trading bankroll exists.
**Consequences.** Could mean stopping after two failed attempts even if "close". That is the design.

## D-005 · (pending Phase 1) · Proposed · Strategy v1 frozen
Filled in when the Phase 1 gate is met: backtest sample size, expectancy, max DD, the exact frozen rules (copy from docs/04 at the time), and the second-reader agreement test result.

## D-006 · (pending Phase 2) · Proposed · Go for first paid challenge
Filled in when the Phase 2 gate is met: firm, account type and size, fee, payment rail used, the 3-month demo stats that justify it, and confirmation that OD-6 (legal check) is closed.

## D-007 · 2026-10-21 · Proposed · No real-money brokerage account, ever, in this plan
**Context.** SBP 2022 circular treats resident offshore forex trading as a FERA violation; the plan doesn't need it; the base rates for retail CFD accounts are 70-90% losers.
**Decision.** The only money that leaves the house is prop-firm fees within D-004. No broker deposits, no crypto trading accounts for this project.
**Consequences.** Removes the single largest way to lose real money. Also removes any temptation to "just test with $100".

## D-008 · 2026-10-21 · Proposed · Firm selection criteria and diversification
**Context.** ~100 firms closed in 2024-25; payouts depend on firm solvency.
**Decision.** Only firms that (a) accept Pakistan on an official page, (b) have been operating 3+ years, (c) have independently tracked payouts, (d) have static drawdown and no consistency rule on the chosen account type, (e) allow weekend holding on the chosen account type. Never more than 40% of total allocation at one firm once scaling. Primary candidate: FTMO Swing 2-step; backup: The5ers High Stakes; third: FundedNext. Final pick in OD-1 after re-verifying rules at purchase time.
**Consequences.** We pay more than the cheapest firms. Acceptable.

## D-009 · 2026-10-21 · Proposed · AI is for enforcement, review and tooling; never for prediction or signals
**Context.** No credible evidence of LLM chart-reading edge after costs; firms terminate accounts for EA herd/copy trading; the household wants to involve AI.
**Decision.** Build tools/rule_guard.py, journal stats, AI weekly review, screener. No auto-trading, no AI signals, no EAs bought or sold.
**Consequences.** The product idea (docs/08) is a behaviour product, not a signal product.

## D-010 · (pending Phase 4) · Proposed · Scale or hold
Filled in after two consecutive payouts.
