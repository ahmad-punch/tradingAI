# Research: tooling, learning resources, Pakistan constraints, AI in retail trading

Compiled 2026-10-21 by an AI research pass. Prices and rules change often; **[verify]** marks items not confirmed from a primary source.

## 1. Free curricula and a ~60-hour path

- **Babypips School of Pipsology** — https://www.babypips.com/learn/forex/school-of-pipsology — 11 grades, ~456 lessons; ~25–35 focused hours. Strong on vocabulary/mechanics/risk; weak on actual edge.
- **Adam Grimes, "The Art and Science of Trading"** (MarketLife) — free video course; widely regarded as the best free, non-selling TA curriculum; stresses that patterns only matter when backed by statistics. 2026 availability **[verify]**.
- **CME Group Education** — https://www.cmegroup.com/education — free futures/options mechanics.
- **Investopedia** — free dictionary; paid Academy not worth it.
- **YouTube** — no channel is free of selling. ICT/SMC content has a large following and a long record of disputed claims; treat as "concepts, unverified track record." Avoid anyone selling signals or "funded guarantees."
- **Books, in order:** Mark Douglas *Trading in the Zone*; Van Tharp *Trade Your Way to Financial Freedom* (R-multiples, expectancy, position sizing); Brent Penfold *Universal Principles of Successful Trading* (risk of ruin, validating an edge); Tomasini & Jaekle *Trading Systems* (once coding backtests).

**Minimal path (~60 h):** Babypips Preschool–High School skimmed (20 h) → Grimes first half (15 h) → Tharp sizing chapters + Douglas (11 h) → journal sheet + 100 replay trades on one setup (15 h). Skip ICT/SMC until you can measure your own expectancy.

## 2. Backtesting / replay tools

| Tool | Cost (2026, verify) | Notes |
|---|---|---|
| TradingView Bar Replay | Not on Free; Essential ~$13–15/mo | Replay results not saved; export CSV. https://newtrading.io/tradingview-free-vs-paid/ |
| FX Replay | Free tier (2 sessions); $15/mo; $29/mo Pro; FTMO clients 30% off | Best manual replay with built-in journal. https://fxreplay.com/pricing |
| Forex Tester Online | ~$20/mo or lifetime ~$250–399 (conflicting) | Tick data 270+ instruments |
| Soft4FX | $109 one-time | MT4/MT5 add-on, Windows |
| MT5 Strategy Tester | Free | Needs an MQL5 EA for automation; data quality depends on broker |
| cTrader | Free | Backtest for cBots only; no manual replay |

**Python:** backtesting.py (simplest), vectorbt (parameter sweeps), Backtrader (mature, unmaintained), NautilusTrader (overkill). Practical: backtesting.py to quantify a setup's expectancy; keep execution discretionary.

**Data:** Dukascopy free tick data incl. XAUUSD and indices (https://github.com/theorycraft-trading/dukascopy); HistData.com free M1 forex/XAU (UTC-5 fixed, no volume); OANDA v20 API (free with account, Pakistan eligibility unverified); Polygon free tier limited; Databento for CME futures; yfinance daily bars only.

## 3. Demo accounts and Pakistan-specific constraints

**Demos:** any MT5/cTrader broker demo; TradingView Paper Trading free; **FTMO Free Trial**: 14-day replica of the Challenge, no card (https://ftmo.oanda.com/ftmo-free-trial/). Other free trials: https://thegodfunded.com/en/blog/best-prop-firms-free-trial-2026

**Legal/regulatory — important:**
- **SBP EPD Circular Letter No. 08 of 2022 (18 May 2022)** directed banks to stop payments to offshore forex platforms, calling resident purchases a violation of FERA 1947 s.4(1); remittance for this purpose barred under s.5(1). https://www.sbp.org.pk/epd/2022/FECL8.htm ; https://www.brecorder.com/news/amp/40174203
- Neither SECP nor SBP licenses offshore CFD brokers. FIA has made arrests in forex-funding cases. https://arynews.tv/three-arrested-over-illegal-forex-trading-in-karachi/ **Funding a broker with PKR is a real legal risk; consult a Pakistani lawyer.**
- **Prop-firm evaluations are a different posture**: a fee for a simulated account, a payout received; no forex remitted abroad "for trading." Still a grey area; not legal advice.
- **Broker acceptance:** Exness and Pepperstone reported to accept Pakistan clients; IC Markets/OANDA **[verify]**.
- **Prop firms:** US-style futures firms (Apex, Topstep, etc.) mostly block Pakistan; FundedNext accepts; FTMO, The5ers, FundingPips generally accept **[verify per firm]**. PropFirmMatch has Pakistan-filtered lists: https://propfirmmatch.com/prop-firm-lists/countries/pakistan/payouts/crypto-payout-methods
- **Payment rails:** PKR cards to trading merchants rarely succeed; community has converged on Binance P2P USDT for fees and crypto/Rise (riseworks.io) for payouts, used by ~19 of 52 firms. SBP has separately restricted crypto; P2P USDT carries its own compliance risk.

## 4. Journaling

| Tool | Price (verify) | Fit |
|---|---|---|
| TradeZella | $24–49/mo | Replay + journal |
| Edgewonk | ~$170–200/yr | Best discipline analytics |
| Tradervue | Free up to 100 trades/mo | Cheapest start |
| TraderSync | $30–80/mo | AI chat, many brokers |
| Free templates | Curved Trading Google Sheet; Jurnl-It discipline sheet; Notion templates | Fine to start |

**Metrics to compute (per setup, ≥50 trades):** expectancy (aim > +0.2R), win rate, avg win/loss R, R distribution, profit factor (>1.5), max drawdown in R and % mapped to firm limits, rule-adherence % (target >95%), avg R on compliant vs non-compliant trades, trades/day, session, hold time, planned vs actual risk.

## 5. AI in retail trading: realistic vs hype (2026)

**Realistic, used today:** journal review and weekly summaries from CSV; rule-enforcement scripts/EAs that hard-stop at loss thresholds; code generation for Pine alerts, pandas, backtest scaffolds (verify for lookahead bugs); news-calendar summarisation; screeners on D1/H4 for setups you already defined.

**Hype:** LLMs predicting price (near-martingale at retail horizons; any signal is stale and non-exclusive); "AI prop-firm passing bots" (trip hyperactivity/consistency/herd rules).

**Evidence:** Lopez-Lira & Tang (arXiv 2304.07619) — ChatGPT headline sentiment correlates with next-day equity returns, in-sample. LSE sentiment paper — Sharpe 3.05 after costs on US equity news, not transferable to FX/gold technicals. TradingAgents (arXiv 2412.20138) — multi-agent LLM beats baselines in backtest, not live. FinGPT — good at sentiment, weak at reasoning, negative returns in FinMem comparison. Ntale 2026 (arXiv 2607.15414) — "numerical hallucination, context-window limits, inconsistent sideways-regime performance." Net: nothing credible shows LLMs reading charts into a durable FX/gold edge after costs.

**EAs/copying under firm rules** (FTMO https://ftmo.com/en/forbidden-trading-practices/): EAs allowed but >2,000 server requests/day = hyperactive; no "AI/ultra-high-speed tools" for unfair advantage; no third party may trade your account; same purchased EA across many accounts flagged as herd trading. Copying across your *own* accounts widely allowed; copying external masters is a termination offence.

## 6. Existing product landscape

- **Aggregators:** PropFirmMatch, PropFirmMap, TradingFunder, TheGodFunded (affiliate-funded).
- **Firm-side analytics:** FTMO Account MetriX.
- **Trader-side risk managers:** MQL5 "Prop Firm Risk Manager PRO EA"; cTrader "PropFirmGuard PRO"; Prop Shield (indie); PropTally (multi-account tracker).
- **Trade copiers:** Thor, PineConnector.
- **Journals with prop features:** TradeZella, TraderSync, FX Replay.
- **Education businesses:** Pakistan's **Sarmaaya Financials** (sarmaaya.pk) — "Forex Fundamentals", "Technical Analysis Masterclass", "Trading Mastery"; Trustpilot praises beginner-friendliness, criticises a partner prop-firm referral and app stability. The India/Pakistan model: course + Telegram/Discord community + prop-firm affiliate links. https://uk.trustpilot.com/review/sarmaaya.pk

**Gaps a developer could fill (observed, not validated):**
1. Cross-firm rule engine: encode each firm's rules as data; compute "distance to breach" live from MT5/cTrader feeds.
2. Rule-adherence journal with an enforced pre-trade checklist and LLM-written weekly reviews.
3. South-Asia onboarding layer (eligibility, rails, fees) that avoids facilitating FERA violations.
4. Open-source replay-to-journal pipeline on Dukascopy data.
Tools that help evade copy/herd detection breach firm ToS; don't build those.

## Key uncertainties
Exact 2026 prices; IC Markets/OANDA/Pepperstone Pakistan acceptance and firm country lists; Grimes course availability; ICT allegations are forum-sourced; legality of CFD trading / crypto P2P funding from Pakistan is contested, the SBP 2022 circular is the one primary source.
