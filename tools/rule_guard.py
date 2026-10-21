#!/usr/bin/env python3
"""Replay a trade log against a prop firm's rules and report breaches and distance-to-breach.

Standard library only. This is the tool for Phase 2: treat any simulated breach as a blown account.

Usage:
  python3 tools/rule_guard.py journal/TRADE-LOG.csv --firm ftmo_2step_swing --balance 25000 --phase 0

Input columns used: date_open, date_close (ISO dates), result_r, risk_pct (optional; falls back to house rule),
mae_r (optional, max adverse excursion in R, used to estimate intraday floating loss).

Model (deliberately conservative):
  - Realised P&L of a trade is booked on date_close.
  - Worst floating loss of a trade (mae_r * risk) is assumed to occur on date_open and on every day
    it's open; this overstates risk, which is what we want for a guard.
  - Daily loss = (equity_low_of_day - reference) / initial_balance, reference = max(balance, equity)
    at the start of the day (the harsher common definition).
  - Max loss is static from initial balance unless drawdown_type == "trailing".
"""
import argparse
import csv
import json
import os
import sys
from collections import defaultdict
from datetime import date, timedelta


def load_rules(firm):
    with open(os.path.join(os.path.dirname(__file__), "challenge_rules.json")) as f:
        data = json.load(f)
    if firm not in data["firms"]:
        sys.exit(f"unknown firm {firm}; known: {', '.join(data['firms'])}")
    return data["firms"][firm], data["house_rules"]


def parse(path, default_risk):
    trades = []
    with open(path, newline="") as f:
        for r in csv.DictReader(f):
            if not r.get("result_r", "").strip():
                continue
            try:
                o = date.fromisoformat(r["date_open"][:10])
                c = date.fromisoformat((r.get("date_close") or r["date_open"])[:10])
                res = float(r["result_r"])
                risk = float(r["risk_pct"]) if r.get("risk_pct", "").strip() else default_risk
                mae = float(r["mae_r"]) if r.get("mae_r", "").strip() else (1.0 if res < 0 else 0.5)
            except (ValueError, KeyError) as e:
                print(f"skipping row {r.get('trade_id')}: {e}", file=sys.stderr)
                continue
            trades.append({"id": r.get("trade_id"), "open": o, "close": c, "r": res, "risk": risk, "mae": abs(mae)})
    return sorted(trades, key=lambda t: (t["close"], t["open"]))


def replay(trades, rules, house, balance, phase_idx):
    init = balance
    daily_limit = rules["max_daily_loss_pct"]
    total_limit = rules["max_total_loss_pct"]
    trailing = rules.get("drawdown_type") == "trailing"
    phase = rules["phases"][phase_idx]
    target = phase["profit_target_pct"]
    min_days = phase["min_trading_days"]

    if not trades:
        return {"days": 0, "breaches": [], "passed": False}

    start = min(t["open"] for t in trades)
    end = max(t["close"] for t in trades)
    closed_by_day = defaultdict(float)   # realised $ P&L per day
    for t in trades:
        closed_by_day[t["close"]] += t["r"] * t["risk"] / 100 * init
    trading_days = {t["close"] for t in trades} | {t["open"] for t in trades}

    bal = init
    peak = init
    breaches = []
    worst_daily_distance = 99.0
    worst_total_distance = 99.0
    daily_profit = defaultdict(float)
    d = start
    while d <= end:
        open_trades = [t for t in trades if t["open"] <= d <= t["close"]]
        floating_worst = -sum(t["mae"] * t["risk"] / 100 * init for t in open_trades)
        ref = bal  # equity at day start approximated by balance
        equity_low = bal + floating_worst
        daily_loss_pct = (ref - equity_low) / init * 100
        max_loss_line = (peak if trailing else init) * (1 - total_limit / 100)
        total_dist = (equity_low - max_loss_line) / init * 100
        worst_daily_distance = min(worst_daily_distance, daily_limit - daily_loss_pct)
        worst_total_distance = min(worst_total_distance, total_dist)
        if daily_loss_pct >= daily_limit:
            breaches.append((d.isoformat(), f"DAILY LOSS {daily_loss_pct:.2f}% >= {daily_limit}%"))
        if equity_low <= max_loss_line:
            breaches.append((d.isoformat(), f"MAX LOSS equity {equity_low:.0f} <= line {max_loss_line:.0f}"))
        bal += closed_by_day.get(d, 0.0)
        daily_profit[d] += closed_by_day.get(d, 0.0)
        peak = max(peak, bal)
        d += timedelta(days=1)

    net_pct = (bal - init) / init * 100
    cons = rules.get("consistency_rule_max_day_share_pct")
    cons_note = None
    if cons and bal > init:
        best_day = max(daily_profit.values())
        share = best_day / (bal - init) * 100
        cons_note = f"best day = {share:.0f}% of profit (limit {cons}%)" + (" BREACH" if share > cons else "")
    passed = (target is not None and net_pct >= target and len(trading_days) >= min_days and not breaches
              and not (cons_note and "BREACH" in cons_note))
    return {
        "phase": phase["name"], "days_span": (end - start).days + 1, "trading_days": len(trading_days),
        "net_pct": round(net_pct, 2), "target_pct": target, "min_days": min_days,
        "worst_distance_to_daily_breach_pct": round(worst_daily_distance, 2),
        "worst_distance_to_max_breach_pct": round(worst_total_distance, 2),
        "house_min_distance_pct": house["min_distance_to_breach_pct"],
        "consistency": cons_note, "breaches": breaches, "passed": passed,
    }


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("path")
    p.add_argument("--firm", default="ftmo_2step_swing")
    p.add_argument("--balance", type=float, default=25000)
    p.add_argument("--phase", type=int, default=0, help="index into the firm's phases (0 = Phase 1)")
    a = p.parse_args()
    rules, house = load_rules(a.firm)
    trades = parse(a.path, house["risk_per_trade_pct"])
    out = replay(trades, rules, house, a.balance, a.phase)
    print(f"firm: {rules['name']}")
    for k, v in out.items():
        if k == "breaches":
            continue
        print(f"{k:>36}: {v}")
    if out.get("breaches"):
        print("\nBREACHES (treat the account as blown from the first one):")
        for d, msg in out["breaches"]:
            print(f"  {d}  {msg}")
    else:
        print("\nno breaches")
    if out.get("worst_distance_to_daily_breach_pct", 99) < house["min_distance_to_breach_pct"]:
        print(f"WARNING: came within {out['worst_distance_to_daily_breach_pct']}% of the daily limit; house rule is {house['min_distance_to_breach_pct']}%")


if __name__ == "__main__":
    main()
