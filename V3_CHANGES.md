# Orderflow v3 - Institutional Strength Updates

## Changes Made in v3 (from v2)

### 1. Wall Alert Engine with Institutional Strength Calculation

**New Function:** `checkWallAlerts(currentPrice, bidEntries, askEntries)`

**How it works:**
- Calculates institutional threshold in base units: `instThresholdQty = instUSD / currentPrice`
  - Example for BTC at $71,837: `$150,000 / $71,837 = 2.08 BTC`
- Scans order book bids (below price) and asks (above price)
- Calculates wall strength: `strength = orderSize / instThresholdQty`
- **Thresholds:**
  - Must be **>3x institutional** to qualify as a wall
  - Must be **>5x institutional** to trigger an alert (strong wall)
- **Cooldown:** 15 seconds between wall alerts to prevent spam

**Alert Format:**
```
🛡️ SUPPORT WALL
4.8x institutional • 10.0000 BTC • $718,370

🧱 RESISTANCE WALL  
6.2x institutional • 15.5000 BTC • $1,113,474
```

**Integration:** Called automatically on every depth update (~100ms) in `snapshotHM()`

---

### 2. Key Levels Filtering - 2x Institutional Strength

**Modified Function:** `renderHiLiq()`

**Change:** Added strength filter to only display key levels with strength >= 0.5

```javascript
// Only show levels with 2x institutional strength (strength >= 0.5)
if(strength < 0.5) continue;
```

**What this means:**
- Strength is calculated as: `lv.tot / maxTot` (ratio from 0 to 1)
- Only levels representing the top 50% of volume activity are shown
- This filters out weak/insignificant levels and focuses on institutional-grade support/resistance
- Results in cleaner, more actionable key levels display

---

### 3. Alert Strength Calculation Explained

The "x" notation means **"times institutional size"**:

**Example Calculations:**

For **BTC/USDT** at $71,837:
- Institutional threshold: $150,000 / $71,837 = **2.08 BTC**
- A 10 BTC wall = 10 / 2.08 = **4.8x institutional** ✅ Triggers alert (>5x)
- A 7 BTC wall = 7 / 2.08 = **3.4x institutional** ⚠️ Qualifies as wall but no alert (>3x, <5x)
- A 4 BTC wall = 4 / 2.08 = **1.9x institutional** ❌ Not significant enough

For **PAXG/USDT** at $2,800:
- Institutional threshold: $25,000 / $2,800 = **8.93 PAXG**
- A 50 PAXG wall = 50 / 8.93 = **5.6x institutional** ✅ Triggers alert
- A 35 PAXG wall = 35 / 8.93 = **3.9x institutional** ⚠️ Wall but no alert

---

### File Comparison

| Feature | v2 | v3 |
|---------|----|----|
| Wall Detection | Basic (12x avg trade size) | Institutional strength-based (3x/5x thresholds) |
| Key Levels Filter | Top 30% by volume | Strength >= 0.5 (top 50%) |
| Alert Cooldown | 8 seconds (trades) | 15 seconds (walls) |
| Strength Display | Stars (★) | Explicit "x.x institutional" |

---

### Testing Recommendations

1. **Monitor Console Logs:** Wall alerts log detailed info to console:
   ```
   WALL ALERT: Support at $71500 - 5.2x institutional (10.8500 units)
   ```

2. **Verify Alert Frequency:** Should see wall alerts only for truly significant walls (>5x)

3. **Check Key Levels Panel:** Should show fewer, stronger levels compared to v2

4. **Compare Symbols:** Test with both BTC (high value) and PAXG (lower value) to verify threshold calculations work correctly

---

### Technical Notes

- **Institutional Thresholds** (from SYMS config):
  - BTC: $150,000 USD
  - PAXG: $25,000 USD
  
- **Whale Thresholds** (for reference):
  - BTC: $500,000 USD
  - PAXG: $50,000 USD

- The wall detection runs on the order book depth stream (updates ~100ms)
- Only checks top 40 levels on each side (bids/asks)
- Alerts fire for the strongest wall per tick to avoid spam
