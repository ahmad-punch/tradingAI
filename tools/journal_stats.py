#!/usr/bin/env python3
"""Statistics from journal/TRADE-LOG.csv or journal/BACKTEST-LOG.csv. Standard library only.

Usage:
  python3 tools/journal_stats.py journal/TRADE-LOG.csv [--risk-pct 0.75] [--since 2026-11-01]

Required columns: result_r, rules_followed (Y/N). Optional: date_close (or date), market, mae_r.
Outputs expectancy, win rate, profit factor, max drawdown in R and in % (at --risk-pct),
longest losing streak, rule adherence, and expectancy split by adherence.
"""
import argparse
import csv
import sys
from collections import defaultdict


def load(path, since=None):
    rows = []
    with open(path, newline="") as f:
        for r in csv.DictReader(f):
            if not r.get("result_r", "").strip():
                continue
            d = r.get("date_close") or r.get("date") or ""
            if since and d and d < since:
                continue
            try:
                r["_r"] = float(r["result_r"])
            except ValueError:
                continue
            r["_ok"] = r.get("rules_followed", "").strip().upper() in ("Y", "YES", "1", "TRUE")
            rows.append(r)
    return rows


def stats(rows, risk_pct=0.75):
    n = len(rows)
    if n == 0:
        return {"trades": 0}
    rs = [r["_r"] for r in rows]
    wins = [x for x in rs if x > 0]
    losses = [x for x in rs if x < 0]
    win_rate = len(wins) / n
    avg_win = sum(wins) / len(wins) if wins else 0.0
    avg_loss = -sum(losses) / len(losses) if losses else 0.0
    expectancy = sum(rs) / n
    gross_win = sum(wins)
    gross_loss = -sum(losses)
    pf = gross_win / gross_loss if gross_loss else float("inf")
    # drawdown in R (sequential)
    peak = cum = 0.0
    max_dd_r = 0.0
    for x in rs:
        cum += x
        peak = max(peak, cum)
        max_dd_r = max(max_dd_r, peak - cum)
    # longest losing streak
    streak = worst = 0
    for x in rs:
        streak = streak + 1 if x < 0 else 0
        worst = max(worst, streak)
    adherence = sum(1 for r in rows if r["_ok"]) / n
    ok_rs = [r["_r"] for r in rows if r["_ok"]]
    bad_rs = [r["_r"] for r in rows if not r["_ok"]]
    by_market = defaultdict(list)
    for r in rows:
        by_market[r.get("market", "?")].append(r["_r"])
    return {
        "trades": n,
        "win_rate": round(win_rate, 3),
        "avg_win_r": round(avg_win, 2),
        "avg_loss_r": round(avg_loss, 2),
        "expectancy_r": round(expectancy, 3),
        "net_r": round(sum(rs), 2),
        "profit_factor": round(pf, 2) if pf != float("inf") else "inf",
        "max_drawdown_r": round(max_dd_r, 2),
        "max_drawdown_pct_at_risk": round(max_dd_r * risk_pct, 2),
        "net_pct_at_risk": round(sum(rs) * risk_pct, 2),
        "longest_losing_streak": worst,
        "rule_adherence": round(adherence, 3),
        "expectancy_rules_followed": round(sum(ok_rs) / len(ok_rs), 3) if ok_rs else None,
        "expectancy_rules_broken": round(sum(bad_rs) / len(bad_rs), 3) if bad_rs else None,
        "by_market_net_r": {k: round(sum(v), 2) for k, v in sorted(by_market.items())},
    }


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("path")
    p.add_argument("--risk-pct", type=float, default=0.75)
    p.add_argument("--since", help="ISO date; only trades closed on/after")
    a = p.parse_args()
    s = stats(load(a.path, a.since), a.risk_pct)
    if s["trades"] == 0:
        print("no completed trades found")
        return
    for k, v in s.items():
        print(f"{k:>28}: {v}")
    # gate hints
    print()
    if s["trades"] < 40:
        print(f"gate: need {40 - s['trades']} more trades for the Phase 2 minimum (100 for Phase 1 backtest)")
    if s["rule_adherence"] < 0.95:
        print("gate: rule adherence below 95%")
    if s["expectancy_r"] < 0.25:
        print("gate: expectancy below +0.25R")
    if s["max_drawdown_pct_at_risk"] > 5:
        print("gate: max drawdown above 5% at this risk")


if __name__ == "__main__":
    main()
