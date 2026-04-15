# Trading Mode Quick Reference

## At a Glance

| Mode | Icon | Threshold | Frequency | Best For |
|------|------|-----------|-----------|----------|
| **Scalping** | ⚡ | 1/5 optional (20%) | HIGH | Fast trades, 1M-5M |
| **Day Trading** | 📊 | 2/5 optional (40%) | MEDIUM | Balanced, 15M-1H |
| **Swing Trading** | 🎯 | 3/5 optional (60%) | LOW | Quality setups, 1H+ |

---

## When to Use Each Mode

### ⚡ SCALPING
- Market is ranging/choppy
- High volume periods (market open)
- You want many trade opportunities
- Using tight stops (<0.5%)
- Timeframe: 1M or 5M

### 📊 DAY TRADING (Default)
- Normal market conditions
- Want balance of quality & quantity
- Multiple trades per day
- Moderate stops (0.5-1%)
- Timeframe: 15M or 1H

### 🎯 SWING TRADING
- Strong trending market
- Only want A+ setups
- Patient approach
- Wider stops (1-2%+)
- Timeframe: 1H or higher

---

## How to Switch Modes

1. Click the mode button in the control bar
2. Signals instantly re-evaluate
3. Your choice is saved automatically
4. Persists across browser refreshes

**No restart needed!** Changes take effect immediately.

---

## What You'll See

### Active Signal
```
⚡ ▲ BUY SIGNAL ★★★
Near support $2,345.50
FP: B12.5 S3.2 · VP: 58% buy · Mode: Scalping
```

### No Signal
```
📊 SCANNING... (Day Trading)
```

### Console Log (on switch)
```
🎯 Trading mode changed to: 🎯 SWING TRADING - High quality signals, fewer trades, higher confidence
   • Optional conditions required: 3/5
   • Alert threshold: 60% (3★+)
```

---

## Star Ratings Explained

| Stars | Match Rate | Meaning |
|-------|-----------|---------|
| ★ | 20% | Weak signal |
| ★★ | 40% | Moderate signal |
| ★★★ | 60% | Strong signal |
| ★★★★ | 80% | Very strong |
| ★★★★★ | 100% | Maximum conviction |

**Mode determines minimum stars for alerts:**
- Scalp: Alerts on 1★+
- Day: Alerts on 2★+
- Swing: Alerts on 3★+

---

## Pro Tips

💡 **Morning Volatility:** Start with Scalp mode, switch to Day as market settles

💡 **Trending Markets:** Use Swing mode to catch big moves

💡 **Ranging Markets:** Use Scalp mode for mean reversion plays

💡 **Low Confidence?** Switch to Swing mode for filtered signals

💡 **Need More Trades?** Switch to Scalp mode temporarily

💡 **Check Console:** See exactly why signals fire (or don't)

---

## Troubleshooting

**Problem:** Not seeing enough signals in Swing mode  
**Solution:** This is normal! Swing mode is selective. Try Day mode.

**Problem:** Too many signals in Scalp mode  
**Solution:** Focus on 3★+ signals only, or switch to Day mode.

**Problem:** Mode doesn't save  
**Solution:** Check browser localStorage is enabled. Clear cache and reload.

**Problem:** Signals seem wrong after switching  
**Solution:** Wait 1-2 seconds for re-evaluation. Refresh if needed.

---

## Keyboard Shortcuts (Future Enhancement)

Not yet implemented, but planned:
- `Alt + 1` → Scalp mode
- `Alt + 2` → Day mode
- `Alt + 3` → Swing mode

---

## Quick Decision Tree

```
Want more signals?
├─ Yes → Use Scalp mode (⚡)
└─ No ↓
   
Want fewer, higher quality signals?
├─ Yes → Use Swing mode (🎯)
└─ No ↓
   
Want balanced approach?
└─ Use Day mode (📊) ← DEFAULT
```

---

## Remember

✅ All modes use the same 7 conditions  
✅ Only the threshold changes  
✅ Switch anytime without losing data  
✅ Mode persists across sessions  
✅ Visual indicators show active mode  

**Choose the mode that matches your trading style!** 🚀
