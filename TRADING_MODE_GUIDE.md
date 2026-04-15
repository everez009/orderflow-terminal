# Trading Mode Settings - User Guide

## Overview

The Order Flow Terminal now supports **three trading modes** that adjust signal sensitivity to match your trading style. This solves the problem of 4-5 star signals being too rare by allowing you to choose how many conditions must align before a signal fires.

---

## The Three Modes

### ⚡ SCALPING MODE
**Best for:** Quick trades, high frequency, lower timeframes (1M-5M)

- **Threshold:** Only 1 optional condition required (out of 5)
- **Alert Level:** 20%+ match rate (1★+)
- **Signal Frequency:** HIGH - Many signals throughout the day
- **Use Case:** 
  - Fast entries/exits
  - Capturing small moves
  - High trade volume
  - Works well in ranging markets

**Example:** If price is at support and footprint delta is positive, you'll get a signal even if only 1 other condition matches.

---

### 📊 DAY TRADING MODE (Default)
**Best for:** Balanced approach, medium frequency, 15M-1H timeframes

- **Threshold:** 2 optional conditions required (out of 5)
- **Alert Level:** 40%+ match rate (2★+)
- **Signal Frequency:** MEDIUM - Quality signals without being too selective
- **Use Case:**
  - Intraday swings
  - Multiple trades per day
  - Balance between frequency and quality
  - Works in most market conditions

**Example:** Price at support + FP delta positive + 2 more conditions (VP bias, POC position, cumulative delta, or order book wall).

---

### 🎯 SWING TRADING MODE
**Best for:** High-quality setups, low frequency, higher timeframes (1H+)

- **Threshold:** 3 optional conditions required (out of 5)
- **Alert Level:** 60%+ match rate (3★+)
- **Signal Frequency:** LOW - Only the strongest signals
- **Use Case:**
  - Multi-hour to multi-day holds
  - Highest probability setups
  - Patient trading approach
  - Works best in trending markets

**Example:** All required conditions PLUS at least 3 of: VP bias, POC position, cumulative delta, order book wall, whale confirmation.

---

## How It Works

### Signal Conditions (7 Total)

**Required (Must Pass):**
1. ✓ AT SUPPORT / AT RESISTANCE - Price near key level
2. ✓ FP DELTA +/- - Footprint shows buying/selling pressure

**Optional (Mode Determines How Many Needed):**
3. VP BIAS BUY/SELL - Session volume profile direction
4. POC ABOVE/BELOW - Point of Control position
5. CUMUL Δ +/- - Cumulative delta direction
6. BID/ASK WALL - Order book liquidity wall
7. WHALE BUY/SELL - Recent large trade confirmation

### Star Rating System

Stars are calculated based on what percentage of optional conditions pass:

| Optional Passing | Stars | Meaning |
|-----------------|-------|---------|
| 1/5 (20%)       | ★     | Weak signal |
| 2/5 (40%)       | ★★    | Moderate signal |
| 3/5 (60%)       | ★★★   | Strong signal |
| 4/5 (80%)       | ★★★★  | Very strong signal |
| 5/5 (100%)      | ★★★★★ | Maximum conviction |

### Mode-Specific Alerts

Each mode has different alert thresholds:

- **Scalp:** Alerts on 1★+ (20% match) - You'll see almost every potential setup
- **Day:** Alerts on 2★+ (40% match) - Filters out weakest signals
- **Swing:** Alerts on 3★+ (60% match) - Only high-confidence setups

---

## Visual Indicators

### Mode Selector Buttons
Located in the control bar next to timeframe buttons:
- **⚡ SCALP** - Orange glow when active
- **📊 DAY** - Green glow when active (default)
- **🎯 SWING** - Purple glow when active

### Signal Bar Display
When a signal fires, it shows:
```
⚡ ▲ BUY SIGNAL ★★★
Near support $2,345.50
FP: B12.5 S3.2 · VP: 58% buy · Mode: Scalping
```

The mode icon appears before the signal direction, and the mode name is shown in the meta information.

### Scanning State
When no signal is present:
```
📊 SCANNING... (Day Trading)
```

---

## Persistence

Your selected mode is **saved to localStorage** and persists across:
- Page refreshes
- Browser restarts
- Different sessions

The terminal automatically loads your last-used mode on startup.

---

## Console Logging

When you switch modes, you'll see detailed info in the browser console:

```
🎯 Trading mode changed to: ⚡ SCALPING - Fast signals, lower threshold, more trades
   • Optional conditions required: 1/5
   • Alert threshold: 20% (1★+)
```

During signal evaluation, the console shows which mode is active:

```
🔍 Signal Check [⚡ SCALPING]: {
  atSupport: true,
  fpBullish: true,
  buyRequiredPass: true,
  buyOptional: "3/1 required",  // Has 3 optional, only needs 1
  sellOptional: "1/1 required"
}
```

---

## Recommended Settings by Asset

### PAXG/USDT (Gold)
- **Low volatility:** Swing mode works well
- **Ranging markets:** Scalp mode for mean reversion
- **Breakouts:** Day mode for trend following

### BTC/USDT
- **High volatility:** Day or Swing mode recommended
- **Scalping possible:** But requires fast execution
- **Trending:** Swing mode captures big moves

---

## Tips for Each Mode

### Scalping Mode Tips
✓ Use 1M or 5M timeframes  
✓ Set tight stop losses (0.3-0.5%)  
✓ Take profits quickly (0.5-1%)  
✓ Watch for false signals in choppy markets  
✓ Best during high-volume periods  

### Day Trading Mode Tips
✓ Use 15M or 1H timeframes  
✓ Moderate stops (0.5-1%)  
✓ Target 1-2% moves  
✓ Good balance for most traders  
✓ Works in most conditions  

### Swing Trading Mode Tips
✓ Use 1H or higher timeframes  
✓ Wider stops (1-2%)  
✓ Target 3-5%+ moves  
✓ Be patient - fewer signals  
✓ Wait for strong trends  

---

## Switching Between Modes

You can switch modes **at any time** without losing data:

1. Click the mode button (⚡ SCALP, 📊 DAY, or 🎯 SWING)
2. Signals immediately re-evaluate with new thresholds
3. Previous signals remain in your journal
4. No disruption to open trades

**Pro Tip:** Some traders switch modes based on market conditions:
- **Morning session:** Scalp mode for opening volatility
- **Mid-day:** Day mode for steady trading
- **Afternoon:** Swing mode to catch end-of-day moves

---

## Troubleshooting

### "Still not seeing enough signals in Swing mode"
This is expected! Swing mode is designed to be selective. Try:
- Switching to Day mode temporarily
- Checking multiple timeframes
- Waiting for stronger trends

### "Too many signals in Scalp mode"
Normal behavior. Solutions:
- Filter manually using star ratings (focus on 3★+)
- Switch to Day mode
- Increase timeframe (5M → 15M)

### "Mode doesn't persist after refresh"
Check browser settings:
- Ensure localStorage is enabled
- Clear cache and reload
- Check console for errors

---

## Technical Details

### Configuration Object
```javascript
TRADING_MODES = {
  scalp: {
    optionalRequired: 1,    // Min optional conditions
    alertStars: 0.2,        // 20% threshold
    color: '#ffa500'        // Orange
  },
  day: {
    optionalRequired: 2,    // Min optional conditions
    alertStars: 0.4,        // 40% threshold
    color: '#00ff88'        // Green
  },
  swing: {
    optionalRequired: 3,    // Min optional conditions
    alertStars: 0.6,        // 60% threshold
    color: '#8a2be2'        // Purple
  }
}
```

### localStorage Key
`orderflow_trading_mode` - Stores current mode ('scalp', 'day', or 'swing')

---

## Summary

The trading mode feature gives you **complete control** over signal frequency:

- **Need more signals?** → Switch to Scalp mode
- **Want balance?** → Stay in Day mode (default)
- **Only want A+ setups?** → Switch to Swing mode

All modes use the same 7 conditions but require different numbers to align, giving you flexibility without changing the underlying analysis engine.

**Happy Trading! 🚀**
