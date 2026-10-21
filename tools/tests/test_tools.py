import csv
import os
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import position_size as ps  # noqa: E402
import journal_stats as js  # noqa: E402
import rule_guard as rg  # noqa: E402


class PositionSize(unittest.TestCase):
    def test_eurusd(self):
        r = ps.position_size(25000, 0.75, 1.0850, 1.0800, "EURUSD")
        self.assertEqual(r["risk_amount_usd"], 187.5)
        self.assertEqual(r["sl_pips"], 50.0)
        self.assertAlmostEqual(r["lots"], 0.38, places=2)

    def test_gold(self):
        r = ps.position_size(25000, 0.5, 2350.0, 2335.0, "XAUUSD")
        # 1500 pips of 0.01, $1 per pip per lot -> 125 / 1500 = 0.083
        self.assertAlmostEqual(r["lots"], 0.08, places=2)

    def test_rejects_equal(self):
        with self.assertRaises(ValueError):
            ps.position_size(1000, 1, 1.0, 1.0, "EURUSD")


def write_csv(rows, header):
    f = tempfile.NamedTemporaryFile("w", suffix=".csv", delete=False, newline="")
    w = csv.DictWriter(f, fieldnames=header)
    w.writeheader()
    for r in rows:
        w.writerow(r)
    f.close()
    return f.name


class JournalStats(unittest.TestCase):
    def test_expectancy_and_adherence(self):
        header = ["trade_id", "date_close", "market", "result_r", "rules_followed"]
        rows = [
            {"trade_id": 1, "date_close": "2026-11-01", "market": "EURUSD", "result_r": "2.5", "rules_followed": "Y"},
            {"trade_id": 2, "date_close": "2026-11-02", "market": "EURUSD", "result_r": "-1", "rules_followed": "Y"},
            {"trade_id": 3, "date_close": "2026-11-03", "market": "XAUUSD", "result_r": "-1", "rules_followed": "N"},
            {"trade_id": 4, "date_close": "2026-11-04", "market": "XAUUSD", "result_r": "2.5", "rules_followed": "Y"},
        ]
        s = js.stats(js.load(write_csv(rows, header)))
        self.assertEqual(s["trades"], 4)
        self.assertEqual(s["win_rate"], 0.5)
        self.assertAlmostEqual(s["expectancy_r"], 0.75)
        self.assertEqual(s["rule_adherence"], 0.75)
        self.assertEqual(s["longest_losing_streak"], 2)
        self.assertEqual(s["max_drawdown_r"], 2.0)


class RuleGuard(unittest.TestCase):
    def setUp(self):
        self.rules, self.house = rg.load_rules("ftmo_2step_swing")

    def test_clean_pass(self):
        header = ["trade_id", "date_open", "date_close", "result_r", "risk_pct", "mae_r"]
        rows = []
        for i in range(6):
            rows.append({"trade_id": i, "date_open": f"2026-11-{2+i*3:02d}", "date_close": f"2026-11-{4+i*3:02d}",
                         "result_r": "2.5", "risk_pct": "0.75", "mae_r": "0.4"})
        out = rg.replay(rg.parse(write_csv(rows, header), 0.75), self.rules, self.house, 25000, 0)
        self.assertEqual(out["breaches"], [])
        self.assertGreaterEqual(out["net_pct"], 10.0)
        self.assertTrue(out["passed"])

    def test_daily_breach_detected(self):
        header = ["trade_id", "date_open", "date_close", "result_r", "risk_pct", "mae_r"]
        # three 2% losers closing the same day = 6% > 5% daily limit
        rows = [{"trade_id": i, "date_open": "2026-11-03", "date_close": "2026-11-03",
                 "result_r": "-1", "risk_pct": "2", "mae_r": "1"} for i in range(3)]
        out = rg.replay(rg.parse(write_csv(rows, header), 0.75), self.rules, self.house, 25000, 0)
        self.assertTrue(any("DAILY" in b[1] for b in out["breaches"]))
        self.assertFalse(out["passed"])


if __name__ == "__main__":
    unittest.main()
