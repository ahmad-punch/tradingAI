#!/usr/bin/env python3
"""Position size from risk % and stop distance. Standard library only.

Usage:
  python3 tools/position_size.py --balance 25000 --risk 0.75 --entry 1.0850 --stop 1.0800 --pair EURUSD
  python3 tools/position_size.py --balance 25000 --risk 0.5 --entry 2350.0 --stop 2335.0 --pair XAUUSD

Assumes a USD account. For pairs where USD is not the quote currency (e.g. EURGBP, USDJPY)
pass --quote-to-usd with the conversion rate of the quote currency into USD.
"""
import argparse
import json
import os
import sys

# contract size (units per standard lot) and pip size per instrument family
SPECS = {
    "EURUSD": (100_000, 0.0001), "GBPUSD": (100_000, 0.0001), "AUDUSD": (100_000, 0.0001),
    "NZDUSD": (100_000, 0.0001), "USDCAD": (100_000, 0.0001), "USDCHF": (100_000, 0.0001),
    "USDJPY": (100_000, 0.01), "EURJPY": (100_000, 0.01), "GBPJPY": (100_000, 0.01),
    "EURGBP": (100_000, 0.0001), "AUDNZD": (100_000, 0.0001),
    "XAUUSD": (100, 0.01),      # gold: 100 oz per lot, pip = 0.01
    "US500": (1, 0.1), "NAS100": (1, 0.1), "US30": (1, 0.1),
}


def position_size(balance, risk_pct, entry, stop, pair, quote_to_usd=1.0):
    pair = pair.upper()
    if pair not in SPECS:
        raise ValueError(f"unknown pair {pair}; add it to SPECS")
    if entry == stop:
        raise ValueError("entry and stop cannot be equal")
    contract, pip = SPECS[pair]
    risk_amount = balance * risk_pct / 100.0
    sl_pips = abs(entry - stop) / pip
    pip_value_per_lot = contract * pip * quote_to_usd  # in USD
    lots = risk_amount / (sl_pips * pip_value_per_lot)
    return {
        "pair": pair,
        "risk_amount_usd": round(risk_amount, 2),
        "sl_pips": round(sl_pips, 1),
        "pip_value_per_lot_usd": round(pip_value_per_lot, 4),
        "lots": round(lots, 2),
        "lots_floor_0_01": max(0.01, int(lots * 100) / 100),
    }


def main():
    rules_path = os.path.join(os.path.dirname(__file__), "challenge_rules.json")
    default_risk = 0.75
    try:
        with open(rules_path) as f:
            default_risk = json.load(f)["house_rules"]["risk_per_trade_pct"]
    except (OSError, KeyError, ValueError):
        pass
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--balance", type=float, required=True)
    p.add_argument("--risk", type=float, default=default_risk, help="percent of balance to risk")
    p.add_argument("--entry", type=float, required=True)
    p.add_argument("--stop", type=float, required=True)
    p.add_argument("--pair", required=True)
    p.add_argument("--quote-to-usd", type=float, default=1.0)
    a = p.parse_args()
    r = position_size(a.balance, a.risk, a.entry, a.stop, a.pair, a.quote_to_usd)
    for k, v in r.items():
        print(f"{k:>22}: {v}")
    if a.risk > 1.0:
        print("WARNING: risk above 1% violates house rules (tools/challenge_rules.json)", file=sys.stderr)


if __name__ == "__main__":
    main()
