/* tradingAI — pure calculation functions, ported line-for-line from tools/*.py.
 * No DOM access. Works in the browser (window.TACalc) and in node (module.exports) so the
 * same code can be checked against tools/tests/test_tools.py:
 *   node -e "const c=require('./site/assets/calc.js'); console.log(c.positionSize(25000,0.75,1.085,1.08,'EURUSD'))"
 *
 * Data flow is deliberately the same as the Python tools: app objects are first turned into
 * CSV-style rows (string values, TRADE-LOG.csv / BACKTEST-LOG.csv column names), then
 * load() / parseTrades() read those rows exactly like journal_stats.load() / rule_guard.parse().
 * So "what the page shows" == "what the Python tools would print on the exported CSV".
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.TACalc = api;
})(this, function () {
  'use strict';

  /* ---------- tools/challenge_rules.json, embedded verbatim (same keys) ---------- */
  const RULES = {
    "_comment": "Firm rules as data. Verify at checkout; these change monthly. Percentages are of initial balance unless noted. Sources: research/prop-firms.md",
    "_updated": "2026-10-21",
    "firms": {
      "ftmo_2step_swing": {
        "name": "FTMO Challenge 2-step, Swing account",
        "phases": [
          {"name": "Phase 1", "profit_target_pct": 10.0, "min_trading_days": 4},
          {"name": "Phase 2", "profit_target_pct": 5.0, "min_trading_days": 4},
          {"name": "Funded", "profit_target_pct": null, "min_trading_days": 0}
        ],
        "max_daily_loss_pct": 5.0,
        "daily_loss_basis": "equity_or_balance_at_day_start_whichever_higher",
        "day_reset_utc": "23:00",
        "max_total_loss_pct": 10.0,
        "drawdown_type": "static",
        "consistency_rule_max_day_share_pct": null,
        "news_window_minutes": 0,
        "weekend_holding_allowed": true,
        "time_limit_days": null,
        "profit_split_pct": 80,
        "fee_refund": "first_payout",
        "pakistan_accepted": "appears_yes_verify"
      },
      "ftmo_2step_standard": {
        "name": "FTMO Challenge 2-step, Standard account",
        "phases": [
          {"name": "Phase 1", "profit_target_pct": 10.0, "min_trading_days": 4},
          {"name": "Phase 2", "profit_target_pct": 5.0, "min_trading_days": 4},
          {"name": "Funded", "profit_target_pct": null, "min_trading_days": 0}
        ],
        "max_daily_loss_pct": 5.0,
        "daily_loss_basis": "equity_or_balance_at_day_start_whichever_higher",
        "day_reset_utc": "23:00",
        "max_total_loss_pct": 10.0,
        "drawdown_type": "static",
        "consistency_rule_max_day_share_pct": null,
        "news_window_minutes": 2,
        "weekend_holding_allowed": false,
        "time_limit_days": null,
        "profit_split_pct": 80,
        "fee_refund": "first_payout",
        "pakistan_accepted": "appears_yes_verify"
      },
      "the5ers_high_stakes": {
        "name": "The5ers High Stakes (2-step)",
        "phases": [
          {"name": "Step 1", "profit_target_pct": 10.0, "min_trading_days": 3},
          {"name": "Step 2", "profit_target_pct": 5.0, "min_trading_days": 3},
          {"name": "Funded", "profit_target_pct": null, "min_trading_days": 0}
        ],
        "max_daily_loss_pct": 5.0,
        "daily_loss_basis": "balance_at_day_start",
        "day_reset_utc": "00:00",
        "max_total_loss_pct": 10.0,
        "drawdown_type": "static",
        "consistency_rule_max_day_share_pct": null,
        "news_window_minutes": 2,
        "weekend_holding_allowed": true,
        "time_limit_days": null,
        "profit_split_pct": 80,
        "fee_refund": "funded_stage",
        "pakistan_accepted": "appears_yes_verify"
      },
      "fundednext_stellar_2step": {
        "name": "FundedNext Stellar 2-step",
        "phases": [
          {"name": "Phase 1", "profit_target_pct": 8.0, "min_trading_days": 5},
          {"name": "Phase 2", "profit_target_pct": 5.0, "min_trading_days": 5},
          {"name": "Funded", "profit_target_pct": null, "min_trading_days": 0}
        ],
        "max_daily_loss_pct": 5.0,
        "daily_loss_basis": "equity_or_balance_at_day_start_whichever_higher",
        "day_reset_utc": "00:00",
        "max_total_loss_pct": 10.0,
        "drawdown_type": "static",
        "consistency_rule_max_day_share_pct": null,
        "news_window_minutes": 0,
        "weekend_holding_allowed": true,
        "time_limit_days": null,
        "profit_split_pct": 80,
        "fee_refund": "verify",
        "pakistan_accepted": "yes_official"
      }
    },
    "house_rules": {
      "risk_per_trade_pct": 0.75,
      "risk_per_trade_pct_gold": 0.5,
      "risk_per_trade_pct_first_month": 0.5,
      "max_open_risk_pct": 1.5,
      "weekly_loss_cap_pct": 2.25,
      "monthly_loss_cap_pct": 4.0,
      "monthly_target_pct": 3.0,
      "risk_after_target_pct": 0.5,
      "min_distance_to_breach_pct": 2.0
    }
  };

  /* ---------- Python semantics helpers ---------- */

  // Python round(x, n): exact decimal value of the double, ties to even. (JS toFixed/Math.round tie away from zero.)
  function pyRound(x, n) {
    n = n || 0;
    if (typeof x !== 'number' || !isFinite(x)) return x;
    if (Math.abs(x) >= 1e21) return x;
    const neg = x < 0 || Object.is(x, -0);
    const s = Math.abs(x).toFixed(100);              // exact decimal expansion for doubles in normal ranges
    const dot = s.indexOf('.');
    const ip = s.slice(0, dot), fp = s.slice(dot + 1);
    let digits = ip + fp.slice(0, n);
    const rest = fp.slice(n);
    let up;
    if (rest[0] > '5') up = true;
    else if (rest[0] < '5') up = false;
    else up = /[1-9]/.test(rest.slice(1)) ? true : (Number(digits[digits.length - 1]) % 2 === 1);
    if (up) digits = (BigInt(digits) + 1n).toString().padStart(digits.length, '0');
    const str = n ? digits.slice(0, digits.length - n) + '.' + digits.slice(digits.length - n) : digits;
    const v = parseFloat(str);
    return neg ? -v : v;
  }
  // f"{x:.{n}f}"
  function pyFixed(x, n) { return pyRound(x, n).toFixed(n).replace(/^-(0\.?0*)$/, '-$1'); }
  // str(float) for the integral floats used in messages (5.0 -> "5.0")
  function pyFloatStr(x) { return (typeof x === 'number' && Number.isInteger(x)) ? x.toFixed(1) : String(x); }
  // float(str) — accepts what Python accepts for normal CSV content; throws like ValueError otherwise
  function pyFloat(s) {
    if (typeof s === 'number') return s;
    const t = String(s == null ? '' : s).trim();
    if (/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(t)) return Number(t);
    if (/^[+-]?(inf|infinity)$/i.test(t)) return t[0] === '-' ? -Infinity : Infinity;
    if (/^[+-]?nan$/i.test(t)) return NaN;
    throw new Error("could not convert string to float: '" + s + "'");
  }
  function strip(v) { return v == null ? '' : String(v).trim(); }
  function sum(a) { let s = 0; for (const x of a) s += x; return s; } // left-to-right, like CPython <= 3.11 sum()

  /* ---------- ISO date helpers (UTC day numbers, so no timezone drift) ---------- */
  function isoToDay(s) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) throw new Error('Invalid isoformat string: ' + JSON.stringify(s));
    const [y, m, d] = s.split('-').map(Number);
    const t = Date.UTC(y, m - 1, d);
    const back = new Date(t);
    if (back.getUTCFullYear() !== y || back.getUTCMonth() !== m - 1 || back.getUTCDate() !== d) throw new Error('day is out of range for month: ' + s);
    return Math.round(t / 86400000);
  }
  function dayToIso(n) { return new Date(n * 86400000).toISOString().slice(0, 10); }
  function addDaysIso(iso, k) { return dayToIso(isoToDay(iso) + k); }
  function daysBetween(a, b) { try { return isoToDay(String(b).slice(0, 10)) - isoToDay(String(a).slice(0, 10)); } catch (e) { return null; } }

  /* ---------- tools/position_size.py ---------- */
  const SPECS = {
    "EURUSD": [100000, 0.0001], "GBPUSD": [100000, 0.0001], "AUDUSD": [100000, 0.0001],
    "NZDUSD": [100000, 0.0001], "USDCAD": [100000, 0.0001], "USDCHF": [100000, 0.0001],
    "USDJPY": [100000, 0.01], "EURJPY": [100000, 0.01], "GBPJPY": [100000, 0.01],
    "EURGBP": [100000, 0.0001], "AUDNZD": [100000, 0.0001],
    "XAUUSD": [100, 0.01],      // gold: 100 oz per lot, pip = 0.01
    "US500": [1, 0.1], "NAS100": [1, 0.1], "US30": [1, 0.1],
  };
  function positionSize(balance, riskPct, entry, stop, pair, quoteToUsd) {
    if (quoteToUsd === undefined) quoteToUsd = 1.0;
    pair = String(pair).toUpperCase();
    if (!(pair in SPECS)) throw new Error('unknown pair ' + pair + '; add it to SPECS');
    if (entry === stop) throw new Error('entry and stop cannot be equal');
    const [contract, pip] = SPECS[pair];
    const risk_amount = balance * riskPct / 100.0;
    const sl_pips = Math.abs(entry - stop) / pip;
    const pip_value_per_lot = contract * pip * quoteToUsd;
    const lots = risk_amount / (sl_pips * pip_value_per_lot);
    return {
      pair: pair,
      risk_amount_usd: pyRound(risk_amount, 2),
      sl_pips: pyRound(sl_pips, 1),
      pip_value_per_lot_usd: pyRound(pip_value_per_lot, 4),
      lots: pyRound(lots, 2),
      lots_floor_0_01: Math.max(0.01, Math.trunc(lots * 100) / 100),
    };
  }

  /* ---------- tools/journal_stats.py ---------- */
  // load(): rows are CSV dicts (string values). since = ISO date string or null.
  function load(rows, since) {
    const out = [];
    for (const src of rows) {
      if (!strip(src.result_r)) continue;
      const d = src.date_close || src.date || '';
      if (since && d && d < since) continue;
      let r;
      try { r = pyFloat(src.result_r); } catch (e) { continue; }
      const row = Object.assign({}, src);
      row._r = r;
      row._ok = ['Y', 'YES', '1', 'TRUE'].includes(strip(src.rules_followed).toUpperCase());
      out.push(row);
    }
    return out;
  }

  function stats(rows, riskPct) {
    if (riskPct === undefined) riskPct = 0.75;
    const n = rows.length;
    if (n === 0) return { trades: 0 };
    const rs = rows.map(r => r._r);
    const wins = rs.filter(x => x > 0);
    const losses = rs.filter(x => x < 0);
    const win_rate = wins.length / n;
    const avg_win = wins.length ? sum(wins) / wins.length : 0.0;
    const avg_loss = losses.length ? -sum(losses) / losses.length : 0.0;
    const expectancy = sum(rs) / n;
    const gross_win = sum(wins);
    const gross_loss = -sum(losses);
    const pf = gross_loss ? gross_win / gross_loss : Infinity;
    // drawdown in R (sequential)
    let peak = 0.0, cum = 0.0, max_dd_r = 0.0;
    for (const x of rs) {
      cum += x;
      peak = Math.max(peak, cum);
      max_dd_r = Math.max(max_dd_r, peak - cum);
    }
    // longest losing streak
    let streak = 0, worst = 0;
    for (const x of rs) {
      streak = x < 0 ? streak + 1 : 0;
      worst = Math.max(worst, streak);
    }
    const adherence = rows.filter(r => r._ok).length / n;
    const ok_rs = rows.filter(r => r._ok).map(r => r._r);
    const bad_rs = rows.filter(r => !r._ok).map(r => r._r);
    const by_market = {};
    for (const r of rows) {
      const k = ('market' in r && r.market != null) ? r.market : '?';
      (by_market[k] = by_market[k] || []).push(r._r);
    }
    const bm = {};
    Object.keys(by_market).sort().forEach(k => { bm[k] = pyRound(sum(by_market[k]), 2); });
    return {
      trades: n,
      win_rate: pyRound(win_rate, 3),
      avg_win_r: pyRound(avg_win, 2),
      avg_loss_r: pyRound(avg_loss, 2),
      expectancy_r: pyRound(expectancy, 3),
      net_r: pyRound(sum(rs), 2),
      profit_factor: pf !== Infinity ? pyRound(pf, 2) : 'inf',
      max_drawdown_r: pyRound(max_dd_r, 2),
      max_drawdown_pct_at_risk: pyRound(max_dd_r * riskPct, 2),
      net_pct_at_risk: pyRound(sum(rs) * riskPct, 2),
      longest_losing_streak: worst,
      rule_adherence: pyRound(adherence, 3),
      expectancy_rules_followed: ok_rs.length ? pyRound(sum(ok_rs) / ok_rs.length, 3) : null,
      expectancy_rules_broken: bad_rs.length ? pyRound(sum(bad_rs) / bad_rs.length, 3) : null,
      by_market_net_r: bm,
    };
  }

  // Gate checks (docs/03-roadmap.md). Compare the rounded figures, as journal_stats.main() does.
  function phase2Gate(s) {
    const t = s.trades || 0;
    return [
      { id: 'trades', label: '≥ 40 forward-tested trades', ok: t >= 40, value: t },
      { id: 'adherence', label: 'Rule adherence ≥ 95%', ok: t > 0 && s.rule_adherence >= 0.95, value: t ? s.rule_adherence : null },
      { id: 'expectancy', label: 'Expectancy ≥ +0.25R', ok: t > 0 && s.expectancy_r >= 0.25, value: t ? s.expectancy_r : null },
      { id: 'maxdd', label: 'Max drawdown ≤ 5%', ok: t > 0 && s.max_drawdown_pct_at_risk <= 5, value: t ? s.max_drawdown_pct_at_risk : null },
      { id: 'net', label: 'Net return ≥ +6% over the window', ok: t > 0 && s.net_pct_at_risk >= 6, value: t ? s.net_pct_at_risk : null },
    ];
  }
  function phase1Gate(s) {
    const t = s.trades || 0;
    return [
      { id: 'trades', label: '≥ 100 backtested trades', ok: t >= 100, value: t },
      { id: 'expectancy', label: 'Expectancy ≥ +0.30R', ok: t > 0 && s.expectancy_r >= 0.30, value: t ? s.expectancy_r : null },
      { id: 'maxdd', label: 'Max drawdown < 6% at 0.75% risk', ok: t > 0 && s.max_drawdown_pct_at_risk < 6, value: t ? s.max_drawdown_pct_at_risk : null },
    ];
  }

  /* ---------- tools/rule_guard.py ---------- */
  // parse(): rows are CSV dicts. Returns {trades, skipped}. Trade dates are ISO strings.
  function parseTrades(rows, defaultRisk) {
    const trades = [], skipped = [];
    for (const r of rows) {
      if (!strip(r.result_r)) continue;
      try {
        if (!('date_open' in r) || r.date_open == null) throw new Error("KeyError: 'date_open'");
        const o = String(r.date_open).slice(0, 10); isoToDay(o);
        const c = String(r.date_close || r.date_open).slice(0, 10); isoToDay(c);
        const res = pyFloat(r.result_r);
        const risk = strip(r.risk_pct) ? pyFloat(r.risk_pct) : defaultRisk;
        const mae = strip(r.mae_r) ? pyFloat(r.mae_r) : (res < 0 ? 1.0 : 0.5);
        trades.push({ id: r.trade_id, open: o, close: c, r: res, risk: risk, mae: Math.abs(mae) });
      } catch (e) {
        skipped.push({ id: r.trade_id, error: e.message });
      }
    }
    trades.sort((a, b) => (a.close < b.close ? -1 : a.close > b.close ? 1 : (a.open < b.open ? -1 : a.open > b.open ? 1 : 0)));
    return { trades, skipped };
  }

  function replay(trades, rules, house, balance, phaseIdx) {
    const init = balance;
    const daily_limit = rules.max_daily_loss_pct;
    const total_limit = rules.max_total_loss_pct;
    const trailing = rules.drawdown_type === 'trailing';
    const phase = rules.phases[phaseIdx];
    const target = phase.profit_target_pct;
    const min_days = phase.min_trading_days;

    if (!trades.length) return { days: 0, breaches: [], passed: false };

    const startN = Math.min(...trades.map(t => isoToDay(t.open)));
    const endN = Math.max(...trades.map(t => isoToDay(t.close)));
    const closed_by_day = {};   // realised $ P&L per day
    for (const t of trades) closed_by_day[t.close] = (closed_by_day[t.close] || 0.0) + t.r * t.risk / 100 * init;
    const trading_days = new Set();
    trades.forEach(t => trading_days.add(t.close));
    trades.forEach(t => trading_days.add(t.open));

    let bal = init, peak = init;
    const breaches = [];
    let worst_daily_distance = 99.0, worst_total_distance = 99.0;
    const daily_profit = {};
    const days = [];
    for (let dn = startN; dn <= endN; dn++) {
      const d = dayToIso(dn);
      const open_trades = trades.filter(t => t.open <= d && d <= t.close);
      const floating_worst = -sum(open_trades.map(t => t.mae * t.risk / 100 * init));
      const ref = bal;  // equity at day start approximated by balance
      const equity_low = bal + floating_worst;
      const daily_loss_pct = (ref - equity_low) / init * 100;
      const max_loss_line = (trailing ? peak : init) * (1 - total_limit / 100);
      const total_dist = (equity_low - max_loss_line) / init * 100;
      worst_daily_distance = Math.min(worst_daily_distance, daily_limit - daily_loss_pct);
      worst_total_distance = Math.min(worst_total_distance, total_dist);
      if (daily_loss_pct >= daily_limit)
        breaches.push([d, 'DAILY LOSS ' + pyFixed(daily_loss_pct, 2) + '% >= ' + pyFloatStr(daily_limit) + '%']);
      if (equity_low <= max_loss_line)
        breaches.push([d, 'MAX LOSS equity ' + pyFixed(equity_low, 0) + ' <= line ' + pyFixed(max_loss_line, 0)]);
      bal += (closed_by_day[d] || 0.0);
      daily_profit[d] = (daily_profit[d] || 0.0) + (closed_by_day[d] || 0.0);
      peak = Math.max(peak, bal);
      days.push({ date: d, open: open_trades.length, equity_low: equity_low, daily_loss_pct: daily_loss_pct, balance_end: bal });
    }

    const net_pct = (bal - init) / init * 100;
    const cons = rules.consistency_rule_max_day_share_pct;
    let cons_note = null;
    if (cons && bal > init) {
      const best_day = Math.max(...Object.values(daily_profit));
      const share = best_day / (bal - init) * 100;
      cons_note = 'best day = ' + pyFixed(share, 0) + '% of profit (limit ' + String(cons) + '%)' + (share > cons ? ' BREACH' : '');
    }
    const passed = (target !== null && target !== undefined && net_pct >= target && trading_days.size >= min_days && !breaches.length
      && !(cons_note && cons_note.includes('BREACH')));
    return {
      phase: phase.name, days_span: endN - startN + 1, trading_days: trading_days.size,
      net_pct: pyRound(net_pct, 2), target_pct: target, min_days: min_days,
      worst_distance_to_daily_breach_pct: pyRound(worst_daily_distance, 2),
      worst_distance_to_max_breach_pct: pyRound(worst_total_distance, 2),
      house_min_distance_pct: house.min_distance_to_breach_pct,
      consistency: cons_note, breaches: breaches, passed: passed,
      _days: days,   // extra (not in Python): per-day trace for display
    };
  }

  /* ---------- CSV (journal/TRADE-LOG.csv and BACKTEST-LOG.csv) ---------- */
  const TRADE_HEADER = ['trade_id', 'date_open', 'date_close', 'phase', 'account', 'market', 'direction', 'setup_version', 'bias_d1', 'location', 'trigger_time_h4', 'entry', 'stop', 'target', 'risk_pct', 'planned_r', 'result_r', 'mae_r', 'days_held', 'rules_followed', 'checklist_bias', 'checklist_location', 'checklist_trigger', 'checklist_sl_set', 'checklist_size_computed', 'checklist_news_clear', 'checklist_correlation_ok', 'screenshot', 'notes'];
  const BACKTEST_HEADER = ['sample_id', 'date', 'market', 'direction', 'setup_version', 'bias_d1', 'location', 'trigger_time_h4', 'entry', 'stop', 'target', 'planned_r', 'result_r', 'mae_r', 'days_held', 'rules_followed', 'screenshot', 'notes'];
  const CHECK_KEYS = [['bias', 'checklist_bias'], ['location', 'checklist_location'], ['trigger', 'checklist_trigger'], ['slSet', 'checklist_sl_set'], ['sizeComputed', 'checklist_size_computed'], ['newsClear', 'checklist_news_clear'], ['correlationOk', 'checklist_correlation_ok']];

  function numStr(v) { return (v === null || v === undefined || v === '' || (typeof v === 'number' && isNaN(v))) ? '' : String(v); }
  function yn(b) { return b === true ? 'Y' : b === false ? 'N' : ''; }
  function isYes(v) { return v === true || ['Y', 'YES', '1', 'TRUE'].includes(strip(v).toUpperCase()); }
  function numOrNull(v) { const t = strip(v); if (!t) return null; try { const x = pyFloat(t); return isNaN(x) ? null : x; } catch (e) { return null; } }

  function derivedDaysHeld(open, close) { if (!open || !close) return null; return daysBetween(open, close); }

  function tradeToCsvRow(t) {
    const x = t.csvExtra || {};
    const row = {
      trade_id: t.id || '', date_open: t.dateOpen || '', date_close: t.dateClose || '', phase: t.phase || '', account: t.account || '',
      market: t.market || '', direction: t.direction || '',
      setup_version: x.setup_version || '', bias_d1: x.bias_d1 || '', location: x.location || '', trigger_time_h4: x.trigger_time_h4 || '',
      entry: x.entry || '', stop: x.stop || '', target: x.target || '',
      risk_pct: numStr(t.riskPct), planned_r: numStr(t.plannedR), result_r: numStr(t.resultR), mae_r: numStr(t.maeR),
      days_held: numStr(t.daysHeld != null ? t.daysHeld : derivedDaysHeld(t.dateOpen, t.dateClose)),
      rules_followed: yn(t.rulesFollowed), screenshot: x.screenshot || '', notes: t.notes || '',
    };
    const ck = t.checklist || {};
    CHECK_KEYS.forEach(([k, col]) => { row[col] = (k in ck) ? yn(!!ck[k]) : ''; });
    return row;
  }
  function backtestToCsvRow(b) {
    const x = b.csvExtra || {};
    return {
      sample_id: b.id || '', date: b.date || '', market: b.market || '', direction: b.direction || '',
      setup_version: x.setup_version || '', bias_d1: x.bias_d1 || '', location: x.location || '', trigger_time_h4: x.trigger_time_h4 || '',
      entry: x.entry || '', stop: x.stop || '', target: x.target || '',
      planned_r: numStr(b.plannedR), result_r: numStr(b.resultR), mae_r: numStr(b.maeR), days_held: numStr(b.daysHeld),
      rules_followed: yn(b.rulesFollowed), screenshot: x.screenshot || '', notes: b.notes || '',
    };
  }
  const EXTRA_COLS = ['setup_version', 'bias_d1', 'location', 'trigger_time_h4', 'entry', 'stop', 'target', 'screenshot'];
  function csvRowToTrade(r) {
    const extra = {}; EXTRA_COLS.forEach(c => { if (strip(r[c])) extra[c] = r[c]; });
    const checklist = {}; CHECK_KEYS.forEach(([k, col]) => { if (strip(r[col])) checklist[k] = isYes(r[col]); });
    const t = {
      id: strip(r.trade_id) || undefined, dateOpen: strip(r.date_open), dateClose: strip(r.date_close), phase: strip(r.phase), account: strip(r.account),
      market: strip(r.market), direction: strip(r.direction), riskPct: numOrNull(r.risk_pct), plannedR: numOrNull(r.planned_r),
      resultR: numOrNull(r.result_r), maeR: numOrNull(r.mae_r), daysHeld: numOrNull(r.days_held),
      rulesFollowed: isYes(r.rules_followed), checklist: checklist, notes: r.notes || '',
    };
    if (Object.keys(extra).length) t.csvExtra = extra;
    return t;
  }
  function csvRowToBacktest(r) {
    const extra = {}; EXTRA_COLS.forEach(c => { if (strip(r[c])) extra[c] = r[c]; });
    const d = strip(r.date);
    const b = {
      id: strip(r.sample_id) || undefined, date: d, sampleYear: d ? Number(d.slice(0, 4)) || null : null, market: strip(r.market), direction: strip(r.direction),
      plannedR: numOrNull(r.planned_r), resultR: numOrNull(r.result_r), maeR: numOrNull(r.mae_r), daysHeld: numOrNull(r.days_held),
      rulesFollowed: isYes(r.rules_followed), notes: r.notes || '',
    };
    if (Object.keys(extra).length) b.csvExtra = extra;
    return b;
  }

  // RFC 4180 CSV parse -> array of dicts keyed by the header row (like csv.DictReader).
  function csvParse(text) {
    const rows = []; let row = [], field = '', i = 0, q = false;
    text = String(text).replace(/^﻿/, '');
    while (i < text.length) {
      const ch = text[i];
      if (q) {
        if (ch === '"') { if (text[i + 1] === '"') { field += '"'; i += 2; continue; } q = false; i++; continue; }
        field += ch; i++; continue;
      }
      if (ch === '"') { q = true; i++; continue; }
      if (ch === ',') { row.push(field); field = ''; i++; continue; }
      if (ch === '\r') { i++; continue; }
      if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; i++; continue; }
      field += ch; i++;
    }
    if (field !== '' || row.length) { row.push(field); rows.push(row); }
    const nonEmpty = rows.filter(r => !(r.length === 1 && r[0] === ''));
    if (!nonEmpty.length) return { header: [], rows: [] };
    const header = nonEmpty[0].map(h => h.trim());
    return { header, rows: nonEmpty.slice(1).map(r => { const o = {}; header.forEach((h, k) => { o[h] = r[k] === undefined ? null : r[k]; }); return o; }) };
  }
  function csvField(v) { const s = v == null ? '' : String(v); return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
  function csvWrite(header, rows) { return [header.join(',')].concat(rows.map(r => header.map(h => csvField(r[h])).join(','))).join('\r\n') + '\r\n'; }

  // Chronological order used for both stats and CSV export, so the page and the Python tools see the same sequence.
  function chrono(a, b) {
    const ka = (a.dateClose || a.date || a.dateOpen || '') + '|' + (a.dateOpen || '');
    const kb = (b.dateClose || b.date || b.dateOpen || '') + '|' + (b.dateOpen || '');
    return ka < kb ? -1 : ka > kb ? 1 : 0;
  }

  /* ---------- money (docs/05, D-004) ---------- */
  const BUDGET_CAP = 600, BANKROLL_TARGET = 2000, TOOLING_CAP_MONTH = 20;
  function isChallengeFee(row) { return /challenge/i.test(row.item || '') && Number(row.out) > 0; }
  function ledgerSummary(ledger) {
    const rows = ledger.slice().sort((a, b) => (a.date || '') < (b.date || '') ? -1 : (a.date || '') > (b.date || '') ? 1 : 0);
    const out = sum(rows.map(r => Number(r.out) || 0)), inn = sum(rows.map(r => Number(r.in) || 0));
    const fees = rows.filter(isChallengeFee);
    let windowStart = null, windowEnd = null, year1Fees = 0, laterFees = 0;
    if (fees.length && fees[0].date) {
      windowStart = fees[0].date.slice(0, 10);
      windowEnd = (Number(windowStart.slice(0, 4)) + 1) + windowStart.slice(4); // 12 months from the first paid fee
    }
    fees.forEach(f => { if (!windowEnd || (f.date || '') < windowEnd) year1Fees += Number(f.out); else laterFees += Number(f.out); });
    const toolingByMonth = {};
    rows.filter(r => !isChallengeFee(r) && Number(r.out) > 0).forEach(r => { const m = (r.date || '').slice(0, 7) || '?'; toolingByMonth[m] = (toolingByMonth[m] || 0) + Number(r.out); });
    const passedEvidence = rows.some(r => Number(r.in) > 0 || /\bpass(ed)?\b/i.test(r.item || ''));
    return {
      rows, totalOut: out, totalIn: inn, net: inn - out, challengeFeeCount: fees.length, year1Fees, laterFees,
      windowStart, windowEnd, remaining: BUDGET_CAP - year1Fees, pctUsed: Math.min(100, year1Fees / BUDGET_CAP * 100),
      overToolingMonths: Object.keys(toolingByMonth).filter(m => toolingByMonth[m] > TOOLING_CAP_MONTH).map(m => [m, toolingByMonth[m]]),
      passedEvidence,
    };
  }
  // First 50% of every payout to the household while the payout bankroll is under $2,000 (D-004).
  function payoutSplit(ledger) {
    const pays = ledger.filter(r => Number(r.in) > 0).sort((a, b) => (a.date || '') < (b.date || '') ? -1 : (a.date || '') > (b.date || '') ? 1 : 0);
    let bankroll = 0, household = 0, afterCap = 0;
    const lines = pays.map(p => {
      const amt = Number(p.in);
      let h = 0, b = 0, free = 0;
      if (bankroll < BANKROLL_TARGET) {
        h = amt * 0.5;
        b = Math.min(amt - h, BANKROLL_TARGET - bankroll);
        free = amt - h - b;
      } else free = amt;
      bankroll += b; household += h; afterCap += free;
      return { date: p.date, item: p.item, amount: amt, household: h, bankroll: b, free: free, bankrollAfter: bankroll };
    });
    return { lines, household, bankroll, afterCap, reached: bankroll >= BANKROLL_TARGET };
  }
  function projection(allocation, monthlyPct, splitPct) {
    const a = Math.max(0, Number(allocation) || 0);
    const p = Math.min(3, Math.max(0, Number(monthlyPct) || 0));
    const s = Math.min(100, Math.max(0, Number(splitPct) || 0));
    const gross = a * p / 100;
    return { allocation: a, monthlyPct: p, splitPct: s, gross: gross, net: gross * s / 100 };
  }

  /* ---------- self-test: the same cases as tools/tests/test_tools.py ---------- */
  function selfTest() {
    const res = [];
    const t = (name, cond) => res.push({ name, ok: !!cond });
    const pad = n => String(n).padStart(2, '0');
    let r = positionSize(25000, 0.75, 1.0850, 1.0800, 'EURUSD');
    t('EURUSD risk_amount_usd == 187.5', r.risk_amount_usd === 187.5);
    t('EURUSD sl_pips == 50.0', r.sl_pips === 50.0);
    t('EURUSD lots ~= 0.38', Math.abs(r.lots - 0.38) < 0.005);
    r = positionSize(25000, 0.5, 2350.0, 2335.0, 'XAUUSD');
    t('XAUUSD lots ~= 0.08', Math.abs(r.lots - 0.08) < 0.005);
    let threw = false; try { positionSize(1000, 1, 1.0, 1.0, 'EURUSD'); } catch (e) { threw = true; }
    t('equal entry/stop rejected', threw);

    const sample = [
      { trade_id: '1', date_close: '2026-11-01', market: 'EURUSD', result_r: '2.5', rules_followed: 'Y' },
      { trade_id: '2', date_close: '2026-11-02', market: 'EURUSD', result_r: '-1', rules_followed: 'Y' },
      { trade_id: '3', date_close: '2026-11-03', market: 'XAUUSD', result_r: '-1', rules_followed: 'N' },
      { trade_id: '4', date_close: '2026-11-04', market: 'XAUUSD', result_r: '2.5', rules_followed: 'Y' },
    ];
    const s = stats(load(sample));
    t('stats trades == 4', s.trades === 4);
    t('stats win_rate == 0.5', s.win_rate === 0.5);
    t('stats expectancy_r == 0.75', Math.abs(s.expectancy_r - 0.75) < 1e-7);
    t('stats rule_adherence == 0.75', s.rule_adherence === 0.75);
    t('stats longest_losing_streak == 2', s.longest_losing_streak === 2);
    t('stats max_drawdown_r == 2.0', s.max_drawdown_r === 2.0);

    const rules = RULES.firms.ftmo_2step_swing, house = RULES.house_rules;
    const clean = [];
    for (let i = 0; i < 6; i++) clean.push({ trade_id: String(i), date_open: '2026-11-' + pad(2 + i * 3), date_close: '2026-11-' + pad(4 + i * 3), result_r: '2.5', risk_pct: '0.75', mae_r: '0.4' });
    let out = replay(parseTrades(clean, 0.75).trades, rules, house, 25000, 0);
    t('clean pass: no breaches', out.breaches.length === 0);
    t('clean pass: net_pct >= 10', out.net_pct >= 10.0);
    t('clean pass: passed', out.passed === true);

    const blown = [0, 1, 2].map(i => ({ trade_id: String(i), date_open: '2026-11-03', date_close: '2026-11-03', result_r: '-1', risk_pct: '2', mae_r: '1' }));
    out = replay(parseTrades(blown, 0.75).trades, rules, house, 25000, 0);
    t('daily breach detected', out.breaches.some(b => b[1].includes('DAILY')));
    t('daily breach: not passed', out.passed === false);
    return res;
  }

  return {
    RULES, SPECS, TRADE_HEADER, BACKTEST_HEADER, CHECK_KEYS, BUDGET_CAP, BANKROLL_TARGET, TOOLING_CAP_MONTH,
    pyRound, pyFixed, pyFloat, isoToDay, dayToIso, addDaysIso, daysBetween,
    positionSize, load, stats, phase2Gate, phase1Gate, parseTrades, replay,
    tradeToCsvRow, backtestToCsvRow, csvRowToTrade, csvRowToBacktest, csvParse, csvWrite, chrono, derivedDaysHeld,
    isChallengeFee, ledgerSummary, payoutSplit, projection, selfTest,
  };
});
