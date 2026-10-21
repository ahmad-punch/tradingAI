# 00 — Reality check

Read this first. The plan in this repo only makes sense if you accept everything on this page.

## 1. What your friend's story is, in plain terms

| What you were told | What it actually is |
|---|---|
| "A different kind of trading where they give you a demo account" | A **prop-firm evaluation**. You pay a fee, trade a simulated account under strict loss rules. |
| "$200 certification exam" | A **challenge fee**. It is the price of one attempt. There is no certification, no syllabus, no credential. Fail and you pay again. |
| "Got a real live account starting with $10,000" | A **simulated funded account** of nominal size $10,000. Since 2024 almost no firm puts real capital behind these; they pay you from company revenue. The money you *receive* is real. |
| "Makes $12,000/month managing a $300,000 portfolio" | 4%/month on $300k simulated — plausible but at the very top of the distribution. The video's guest, held up as a star, makes ~1-1.5%/month on ~$800k. |
| "Resigned from CSS because she made way more" | Possible for an individual. It is also exactly the survivorship-bias story that course sellers and firms need told. We never hear from the ~90%+ who paid fees and quit. |
| "She did it while married, serving, managing home — a tech person can too" | Being tech-savvy helps with tooling and discipline systems. It is almost unrelated to the core skill, which is behaving consistently under uncertainty and loss. Data scientists (the guest) blow accounts too. |

## 2. What the video says, honestly summarised

- Host: Faraz, runs **Sarmaya**, a paid course (~$500) plus community. The video exists to sell the course. That doesn't make it false; it means every claim is a marketing claim until verified.
- Guest: Sohail, MS Data Science, now **employed by Sarmaya as a mentor** while trading. Started Dec 2021. Lost ~$2,000 on crypto signals and "gems". Took the course Feb-Jun 2023. Blew his first FTMO challenge, then ~15 cheap challenges in six months by scalping and switching strategies. Returned to the taught swing strategy, 0.5-1% risk, 3%/month target, started journaling and posting calls publicly. Over the next year bought 5 challenges, passed 3. By March 2026 manages ~$800k simulated across 4 firms and showed payouts of $670, $2,462, $3,379, $2,784 in Jan-Mar 2026 (~$9k/quarter shown, host says "~$8k/month" and "PKR 10-15 lakh/month").
- The host's own framing: "I will make no big claims that you're profitable right after training. It's not like that." And: "An analyst can become a good analyst quickly; becoming a trader takes a long time."
- Nothing in the video is a scam in the legal sense. The mechanism works as described. What's missing is the denominator.

## 3. The denominator (base rates)

Sources for every number: [research/evidence.md](../research/evidence.md). Firm-reported and vendor-reported figures are unaudited; the academic ones are not.

| Population | Finding | Source type |
|---|---|---|
| Retail CFD accounts (EU/UK/AU brokers, trailing 12 months) | 68-82% lose money; averages −£2,200 to −€6,900 per losing client | Regulator-mandated disclosures |
| Day traders, Taiwan 1992-2006 (every trader on the exchange) | ~97% lose in a given period; under 1-3% are predictably profitable; no learning on average, only losers quitting | Academic |
| Day traders, Brazil 2013-2015 who persisted 300+ days | 97% lost; 1.1% earned more than minimum wage; 0.5% more than a bank teller | Academic |
| Retail FX, French regulator 2009-2012 | 89% lost; median loss ≈ €1,800 | Regulator |
| Prop-firm challenge buyers, 300,000 accounts across 10 firms (2024) | 14% pass a challenge; 45% of funded ever get a payout; **7% of all buyers ever paid**; average spend ~$800 per account over ~3 attempts | Vendor to prop firms |
| The Funded Trader (own data, 2025) | 1 in 20 pass; 1-2% of all clients ever paid | Firm |
| Topstep (futures, 2025) | 16.8% of attempts pass; 0.71% reach a real-capital account | Firm |
| Industry payouts (independent tracker, 30 days) | median payout $1,092; 78.6% of payouts under $2,000 | Independent tracker |
| Repeat challenge buyers (survey of 459) | average $4,300 spent across 2-5 firms; ~40% ever profitable | Self-selected poll |

So, reading across: roughly **1 in 14 buyers is ever paid, roughly 1 in 50 is paid repeatedly, and the typical payout is about a thousand dollars.** FTMO's own co-founder: "nine out of ten people won't succeed." The guest's ~$8k/month is a far-right-tail outcome; the typical outcome of someone who watched that video and bought a challenge is ~$800 spent and nothing back.

**Time to competence:** no rigorous data. Practitioner folklore says 2-5 years; the academic data says persistence alone doesn't produce learning. The one strong predictor of future profit in the Taiwan data is a *documented* history of net profitability, which is exactly what the demo-phase gate in this plan demands before any fee is paid.

**Return expectations for the competent:** 1-3% a month on simulated capital with losing months. FTMO treats ~2.5%/month sustained over four months as the *elite* threshold for scaling.

## 3b. A legal issue specific to Pakistan (not in the video)

A May 2022 State Bank of Pakistan circular directed banks to block payments to offshore forex trading platforms and characterised resident forex trading abroad as a violation of the Foreign Exchange Regulation Act. Prop-firm fees are a different thing (a fee for a simulated service, no trading capital sent abroad), and the firms in question accept Pakistani clients, but it is a grey area, PKR cards usually fail at these checkouts, and the common workaround (USDT via peer-to-peer) has its own compliance exposure. **Open decision OD-6: a one-hour consultation with a Pakistani lawyer or accountant before the first paid fee.** Details and sources: [research/tooling-and-learning.md §3](../research/tooling-and-learning.md).

## 4. What is NOT possible

- Earning "without losing anything." Every challenge attempt is a possible loss of its fee. The free-trial route caps this to zero only until you buy your first paid challenge.
- "Reliable" income on a schedule. Even good months are statistical. Expect losing months and flat quarters.
- $50,000/month on a realistic timeline from here. At 1.5%/month that needs ~$4M of simulated allocation across firms at 80% split. Firm scaling caps and risk of breaching while scaled make that a 4-6 year project with a tiny probability. Treat $50k/month as a thought experiment, not a plan.
- AI picking trades for you. Large language models do not predict price. They can help you build, test, journal, and enforce rules (see [docs/07](07-ai-and-tooling.md)).
- Skipping the demo phase because you're smart. The guest was a data scientist. He lost for 2.5 years.

## 5. What IS possible, and the bet this repo makes

- Learn the full mechanics for **$0** (free curricula, free demo, free prop-firm trials).
- Build a rule-based swing strategy, backtest it, then forward-test it on demo for 3+ months with the *exact* prop-firm rules enforced by a script we write.
- Only buy a paid challenge when the demo track record (≥ 40 trades, positive expectancy, max drawdown under the firm's limits with margin) says the strategy survives the rules. This single gate is what the guest skipped and what cost him 15 accounts.
- Cap total cash at risk (proposed: **$600 over 12 months**, decision D-004) and stop if the gates aren't met. Walking away with $600 lost and a lot learned is an acceptable outcome. Walking away with $5,000 lost and a gambling habit is not.
- If it works: $1-3k/month within ~18-24 months is a defensible target. Beyond that, scaling is linear with allocation and discipline.

## 6. Why we might still want to do it even with these odds

- The cost of finding out is small and bounded.
- The skill transfers: risk management, probabilistic thinking, journaling, emotional regulation.
- You're a builder. Even if you personally end up a mediocre trader, the **tooling and training system** you build to try (rule-enforcing demo simulator, AI journal reviewer, curriculum) is a product in a market full of people buying $500 courses. See [docs/08](08-teaching-and-product.md).

## 7. Non-negotiables going in

1. No signal groups, no paid "gems", no copying anyone's trades. Ever.
2. No paid course until Phase 1 is complete on free material; if a course is then wanted, it's a logged decision with a reason.
3. No real-money brokerage account. Prop-firm fees are the *only* money that ever leaves the house, within the loss budget.
4. Every rule change goes through the decision log before it's traded.
5. Family members (brother, wife) only start after the system has been validated on you.
