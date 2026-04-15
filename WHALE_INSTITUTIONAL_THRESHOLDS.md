# Whale & Institutional Alert Thresholds Guide

## Overview

The orderflow terminal monitors large trades and generates alerts when trades exceed specific USD value thresholds. These thresholds differ by trading pair to account for different asset prices and typical trade sizes.

---

## Current Thresholds

### **PAXG/USDT (Gold)**

| Alert Type | USD Threshold | Description |
|------------|---------------|-------------|
| 🏛 **Institutional** | ≥ $25,000 | Large institutional-sized trade |
| 🐋 **Whale** | ≥ $50,000 | Very large whale transaction |
| ⚡ **Mega Whale** | ≥ $150,000 | Extremely large whale (3x whale threshold) |

### **BTC/USDT (Bitcoin)**

| Alert Type | USD Threshold | Description |
|------------|---------------|-------------|
| 🏛 **Institutional** | ≥ $150,000 | Large institutional-sized trade |
| 🐋 **Whale** | ≥ $500,000 | Very large whale transaction |
| ⚡ **Mega Whale** | ≥ $1,500,000 | Extremely large whale (3x whale threshold) |

---

## How Alerts Are Generated

### **Step 1: Trade Monitoring**

Every trade is monitored in real-time via Binance WebSocket:

```javascript
// Each trade contains:
{
  price: 2650.50,      // Trade execution price
  quantity: 18.87,     // Amount traded
  usd_value: 50000,    // price × quantity
  is_sell: false       // true = sell, false = buy
}
```

### **Step 2: Threshold Check**

```javascript
if (usd_value >= cfg.instUSD) {
  // Trade is at least institutional size
  const is_whale = usd_value >= cfg.whaleUSD;
  
  if (is_whale) {
    tag = 'whale';
  } else {
    tag = 'inst';
  }
}
```

### **Step 3: Alert Classification**

The system analyzes market conditions to determine the alert type:

#### **A. Absorption Detection** 🧽
```javascript
Condition: 
- Trade ≥ whale threshold ($50K PAXG / $500K BTC)
- Price impact < 0.02% (minimal movement)

Meaning: Large orders being absorbed without moving price
Alert: "ABSORPTION DETECTED"
```

#### **B. Aggressive Pressure** 💪💥
```javascript
Condition:
- 10+ consecutive trades in same direction
- Current trade ≥ 3× average recent trade
- Trade ≥ whale threshold

Meaning: Sustained aggressive buying or selling
Alert: "STRONG BUY/SELL PRESSURE"
```

#### **C. Wall Formation** 🧱
```javascript
Condition:
- Trade size ≥ 12× average trade size
- Trade value ≥ 2× whale threshold

Meaning: Large limit orders stacking up
Alert: "BUY/SELL WALL FORMING"
```

#### **D. Mega Whale** 🐋⚡
```javascript
Condition:
- Trade ≥ 2× whale threshold ($100K PAXG / $1M BTC)

Meaning: Exceptionally large single transaction
Alert: "WHALE BUYING/SELLING" with "Mega whale activity" note
```

#### **E. Standard Whale** 🐋
```javascript
Condition:
- Trade ≥ whale threshold but < 2× whale
- Doesn't meet special conditions above

Meaning: Large whale transaction
Alert: "WHALE BUYING/SELLING"
```

#### **F. Large Institutional** 🏛
```javascript
Condition:
- Trade ≥ 1.5× whale threshold
- But doesn't qualify as whale alert

Meaning: Significant institutional activity
Alert: "INSTITUTIONAL BUY/SELL"
```

#### **G. Standard Institutional** (No Alert)
```javascript
Condition:
- Trade ≥ institutional threshold
- But < 1.5× whale threshold

Action: Trade recorded but NO alert fired
Reason: Too frequent, would spam notifications
```

---

## Alert Frequency Control

### **Cooldown System**

To prevent alert spam, there's an **8-second minimum** between alerts:

```javascript
const now = Date.now();
const lastAlertTime = s.lastTradeAlert || 0;

if (now - lastAlertTime < 8000) {
  // Skip alert notification
  // Still record trade for analysis
  return;
}
```

**Impact:**
- Maximum ~7-8 alerts per minute
- Prevents notification fatigue
- Only most significant trades trigger alerts

---

## Where Thresholds Are Displayed

### **Alert Bar Header**

The current thresholds are shown in the alert bar:

```
┌─────────────────────────────────────────────┐
│ ALERTS (3)  WHALE ≥ $50,000 · INST ≥ $25K │
└─────────────────────────────────────────────┘
```

This updates automatically when you switch symbols.

---

## Trading Mode Impact on Signals

**Important:** Whale/institutional thresholds are **NOT affected** by trading mode.

Trading modes only affect **signal generation** (BUY/SELL signals), not whale alerts:

| Mode | Signal Threshold | Whale Threshold |
|------|------------------|-----------------|
| ⚡ Scalp | Lower (easier signals) | **Unchanged** |
| 📊 Day | Medium (balanced) | **Unchanged** |
| 🎯 Swing | Higher (quality only) | **Unchanged** |

Whale alerts fire based on **actual trade size**, regardless of your trading style.

---

## Real-World Examples

### **Example 1: PAXG Whale Buy**

```
Trade Details:
- Price: $2,650.00
- Quantity: 20 PAXG
- USD Value: $53,000
- Direction: Buy

Threshold Check:
- $53,000 ≥ $25,000 (instUSD) ✅
- $53,000 ≥ $50,000 (whaleUSD) ✅
- $53,000 < $100,000 (2× whale) ❌

Alert Classification:
- Not absorption (normal price impact)
- Not aggressive pressure (isolated trade)
- Not wall formation (not 12× avg size)
- Standard whale trade

Result:
🐋 WHALE BUYING
Large whale transaction
$53,000 @ $2,650.00
```

### **Example 2: BTC Mega Whale Sell**

```
Trade Details:
- Price: $95,000.00
- Quantity: 20 BTC
- USD Value: $1,900,000
- Direction: Sell

Threshold Check:
- $1.9M ≥ $150,000 (instUSD) ✅
- $1.9M ≥ $500,000 (whaleUSD) ✅
- $1.9M ≥ $1,500,000 (3× whale) ✅

Alert Classification:
- Mega whale (>3× threshold)

Result:
🐋 WHALE SELLING
Mega whale activity detected
$1,900,000 @ $95,000.00
```

### **Example 3: PAXG Absorption**

```
Trade Details:
- Price: $2,649.95 (previous: $2,650.00)
- Quantity: 25 PAXG
- USD Value: $66,250
- Direction: Sell
- Price Impact: 0.002% (minimal)

Threshold Check:
- $66,250 ≥ $50,000 (whaleUSD) ✅
- Price impact < 0.02% ✅

Alert Classification:
- Absorption detected (large trade, minimal impact)

Result:
🧽 ABSORPTION DETECTED
Sellers absorbing all buy orders
$66,250 @ $2,649.95
```

### **Example 4: BTC Institutional (No Alert)**

```
Trade Details:
- Price: $94,500.00
- Quantity: 0.5 BTC
- USD Value: $47,250
- Direction: Buy

Threshold Check:
- $47,250 < $150,000 (instUSD) ❌

Result:
❌ No alert (below institutional threshold)
Trade still recorded in tape for analysis
```

---

## Why Different Thresholds for PAXG vs BTC?

### **Price Difference**
- PAXG: ~$2,650 per unit
- BTC: ~$95,000 per unit
- **36× price difference**

### **Typical Trade Sizes**
- PAXG: Retail traders buy 1-10 units ($2.6K-$26K)
- BTC: Retail traders buy 0.01-0.1 BTC ($950-$9,500)

### **Institutional Definitions**
- PAXG: $25K = ~9.4 units (significant for gold token)
- BTC: $150K = ~1.6 BTC (significant for Bitcoin)

### **Whale Definitions**
- PAXG: $50K = ~18.9 units (very large for retail)
- BTC: $500K = ~5.3 BTC (whale territory)

**The thresholds are calibrated to represent similar market impact relative to each asset's typical trading patterns.**

---

## Adjusting Thresholds (Advanced)

If you want to customize thresholds, edit the `SYMS` configuration:

```javascript
const SYMS={
  PAXGUSDT:{
    label:'PAXG/USDT',
    whaleUSD:50000,   // Change this
    instUSD:25000,    // Change this
    bucket:0.5,
    dec:2,
    klSym:'PAXGUSDT'
  },
  BTCUSDT: {
    label:'BTC/USDT',
    whaleUSD:500000,  // Change this
    instUSD:150000,   // Change this
    bucket:10,
    dec:1,
    klSym:'BTCUSDT'
  }
};
```

### **Recommended Threshold Ranges**

#### **PAXG/USDT**
```
Conservative (fewer alerts):
- instUSD: 30,000 - 40,000
- whaleUSD: 60,000 - 80,000

Current (balanced):
- instUSD: 25,000
- whaleUSD: 50,000

Aggressive (more alerts):
- instUSD: 15,000 - 20,000
- whaleUSD: 30,000 - 40,000
```

#### **BTC/USDT**
```
Conservative (fewer alerts):
- instUSD: 200,000 - 250,000
- whaleUSD: 750,000 - 1,000,000

Current (balanced):
- instUSD: 150,000
- whaleUSD: 500,000

Aggressive (more alerts):
- instUSD: 100,000 - 120,000
- whaleUSD: 300,000 - 400,000
```

**Warning:** Lower thresholds = more alerts = potential notification spam. The current settings are optimized based on historical data to balance signal quality with frequency.

---

## Alert Delivery Methods

When a whale/institutional alert fires, it's delivered via:

### **1. Visual Alert Chip**
```
Appears in alert bar (top of screen)
Color-coded: Gold (whale) or Purple (institutional)
Shows: Type, emoji, USD value, price
```

### **2. Voice Alert** (if enabled)
```
Text-to-speech announcement
Example: "Whale buying detected. Fifty-three thousand dollars."
```

### **3. Telegram Notification** (if configured)
```
Sent to your Telegram bot
Includes: Symbol, type, amount, price, timestamp
```

### **4. WhatsApp via CallMeBot** (if configured)
```
Sent to your WhatsApp
Same information as Telegram
```

---

## Monitoring Alert Activity

### **Console Logging**

Open browser console (F12) to see detailed alert information:

```javascript
// When alert fires:
🐋 WHALE BUY: $53,000 @ $2,650.00 (PAXGUSDT)
✅ Alert chip added
🔊 Voice alert triggered
📱 Telegram notification sent

// Cooldown active:
⏸️ Alert skipped (cooldown active, 3.2s remaining)
```

### **Alert Counter**

The alert bar shows total count:
```
ALERTS (12)  ← Number of alerts in current session
```

Click to scroll through all alerts horizontally.

---

## Alert Classification Logic (Detailed Multipliers)

The system uses **specific multipliers** of the base thresholds to determine alert types:

### **Special Alert Conditions with Multipliers:**

#### **1. Absorption Detection** 🧽
```javascript
Required:
- usd >= cfg.whaleUSD (1× whale threshold)
- priceImpact < 0.02% (extremely minimal movement)

Formula:
priceImpact = Math.abs(currentPrice - previousPrice) / previousPrice

Example PAXG:
- Trade: $50,000+ (≥ 1× whale)
- Price change: < 0.02%
- Result: ABSORPTION DETECTED
```

#### **2. Aggressive Pressure** 💪💥
```javascript
Required:
- sameDirectionCount >= 10 (10+ consecutive trades same direction)
- usd >= avgRecentTrade * 3 (3× average recent trade size)
- usd >= cfg.whaleUSD (≥ 1× whale threshold)

Formula:
avgRecentTrade = sum(last 20 trades) / count(last 20 trades)

Example BTC:
- Last 20 trades avg: $50,000
- Current trade: $150,000+ (≥ 3× avg AND ≥ whale)
- 10+ consecutive buys or sells
- Result: STRONG BUY/SELL PRESSURE
```

#### **3. Wall Formation** 🧱
```javascript
Required:
- q >= avgTradeSize * 12 (12× average trade quantity)
- usd >= cfg.whaleUSD * 2 (≥ 2× whale threshold)

Formula:
avgTradeSize = sum(all trade quantities) / count(all trades)

Example PAXG:
- Average trade: 2 PAXG
- Current trade: 24+ PAXG (≥ 12× avg)
- USD value: $100,000+ (≥ 2× whale of $50K)
- Result: BUY/SELL WALL FORMING
```

#### **4. Mega Whale** 🐋⚡
```javascript
Required:
- usd >= cfg.whaleUSD * 2 (≥ 2× whale threshold)
- Additional note if: usd >= cfg.whaleUSD * 5 (≥ 5× whale)

Thresholds:
PAXG: $100,000+ (2×) or $250,000+ (5×)
BTC: $1,000,000+ (2×) or $2,500,000+ (5×)

Example:
- PAXG trade: $120,000 → "Large whale transaction"
- PAXG trade: $300,000 → "Mega whale activity detected"
```

#### **5. Standard Institutional Alert Filter** 🏛
```javascript
Required for institutional alert:
- usd >= cfg.whaleUSD * 1.5 (≥ 1.5× whale threshold)

If usd < cfg.whaleUSD * 1.5:
- Trade recorded in tape
- NO alert fired (too small)
- Prevents notification spam

Thresholds:
PAXG: Must be ≥ $75,000 (1.5× $50K whale)
BTC: Must be ≥ $750,000 (1.5× $500K whale)

Example:
- PAXG trade: $60,000 → No alert (below 1.5× whale)
- PAXG trade: $80,000 → INSTITUTIONAL BUY alert
```

---

## Complete Threshold Hierarchy

### **PAXG/USDT Alert Ladder:**

```nocode
$0 ──────────────────────────────────────────────
     ↓ No alert (retail trades)
$25,000 ─────────────────────────────────────────
     ↓ Institutional threshold (recorded, no alert unless ≥1.5× whale)
$50,000 ─────────────────────────────────────────
     ↓ Whale threshold (base for multipliers)
     ├─ Standard whale alert
     ├─ Can trigger absorption (if low impact)
     └─ Can trigger aggressive pressure (if 10+ streak + 3× avg)
$75,000 ─────────────────────────────────────────
     ↓ 1.5× whale - Minimum for institutional alert
     └─ INSTITUTIONAL BUY/SELL alert fires
$100,000 ────────────────────────────────────────
     ↓ 2× whale
     ├─ WHALE BUYING/SELLING (large transaction)
     └─ Can trigger wall formation (if 12× avg size)
$150,000 ────────────────────────────────────────
     ↓ 3× whale - Mega whale territory
     └─ "Mega whale activity detected" note
$250,000 ────────────────────────────────────────
     ↓ 5× whale - Extreme mega whale
     └─ "Mega whale activity detected" note
```

### **BTC/USDT Alert Ladder:**

```nocode
$0 ──────────────────────────────────────────────
     ↓ No alert (retail trades)
$150,000 ────────────────────────────────────────
     ↓ Institutional threshold (recorded, no alert unless ≥1.5× whale)
$500,000 ────────────────────────────────────────
     ↓ Whale threshold (base for multipliers)
     ├─ Standard whale alert
     ├─ Can trigger absorption (if low impact)
     └─ Can trigger aggressive pressure (if 10+ streak + 3× avg)
$750,000 ────────────────────────────────────────
     ↓ 1.5× whale - Minimum for institutional alert
     └─ INSTITUTIONAL BUY/SELL alert fires
$1,000,000 ──────────────────────────────────────
     ↓ 2× whale
     ├─ WHALE BUYING/SELLING (large transaction)
     └─ Can trigger wall formation (if 12× avg size)
$1,500,000 ──────────────────────────────────────
     ↓ 3× whale - Mega whale territory
     └─ "Mega whale activity detected" note
$2,500,000 ──────────────────────────────────────
     ↓ 5× whale - Extreme mega whale
     └─ "Mega whale activity detected" note
```

---

## Real-World Examples with Multipliers

### **Example 1: Wall Formation (2× Whale + 12× Size)**

```
PAXG Trade Details:
- Average trade size: 1.5 PAXG
- Current trade: 20 PAXG @ $2,650 = $53,000
- Direction: Buy

Multiplier Checks:
✓ Quantity: 20 / 1.5 = 13.3× avg (≥ 12×) ✅
✓ USD Value: $53,000 ≥ $100,000 (2× whale)? ❌

Result:
❌ Wall formation NOT triggered (need BOTH conditions)
✅ Standard whale alert instead
```

### **Example 2: Aggressive Pressure (3× Avg + 10 Streak)**

```
BTC Trade Details:
- Last 20 trades average: $40,000
- Recent streak: 12 consecutive buys
- Current trade: $150,000 buy

Multiplier Checks:
✓ Streak: 12 trades (≥ 10) ✅
✓ Size: $150,000 / $40,000 = 3.75× avg (≥ 3×) ✅
✓ Whale: $150,000 ≥ $500,000? ❌

Result:
❌ Aggressive pressure NOT triggered (must also be ≥ whale)
Trade recorded but no special alert
```

### **Example 3: Perfect Wall Formation**

```
BTC Trade Details:
- Average trade size: 0.3 BTC
- Current trade: 4.0 BTC @ $95,000 = $380,000
- Direction: Sell

Multiplier Checks:
✓ Quantity: 4.0 / 0.3 = 13.3× avg (≥ 12×) ✅
✓ USD Value: $380,000 ≥ $1,000,000 (2× whale)? ❌

Result:
❌ Still not enough (need ≥ 2× whale = $1M)
Would need: 10.5+ BTC @ $95K = $1M+
```

### **Example 4: Mega Whale (5× Threshold)**

```
PAXG Trade Details:
- Trade: 100 PAXG @ $2,650 = $265,000
- Direction: Buy

Multiplier Checks:
✓ Whale: $265,000 ≥ $50,000 ✅
✓ 2× Whale: $265,000 ≥ $100,000 ✅
✓ 5× Whale: $265,000 ≥ $250,000 ✅

Result:
🐋 WHALE BUYING
Note: "Mega whale activity detected"
(Triggers because ≥ 5× whale threshold)
```

### **Example 5: Institutional Filter (1.5× Rule)**

```
BTC Trade Details:
- Trade: 1.2 BTC @ $95,000 = $114,000
- Direction: Buy

Multiplier Checks:
✓ Institutional: $114,000 ≥ $150,000? ❌
✗ Below institutional threshold entirely

Result:
❌ No alert at all
Trade recorded in tape only
```

```
BTC Trade Details:
- Trade: 6.0 BTC @ $95,000 = $570,000
- Direction: Sell

Multiplier Checks:
✓ Institutional: $570,000 ≥ $150,000 ✅
✓ Whale: $570,000 ≥ $500,000 ✅
✓ 1.5× Whale: $570,000 ≥ $750,000? ❌

Result:
🐋 WHALE SELLING
(Standard whale alert, not institutional)
Note: "Large whale transaction"
```

```
BTC Trade Details:
- Trade: 8.5 BTC @ $95,000 = $807,500
- Direction: Buy

Multiplier Checks:
✓ Institutional: $807,500 ≥ $150,000 ✅
✓ Whale: $807,500 ≥ $500,000 ✅
✓ 1.5× Whale: $807,500 ≥ $750,000 ✅
✓ 2× Whale: $807,500 ≥ $1,000,000? ❌

Result:
🏛 INSTITUTIONAL BUY
(Falls between 1.5× and 2× whale)
Note: "Institutional-sized trade detected"
```

---

## Key Takeaways

### **Minimum Requirements for Alerts:**

| Asset | Minimum for ANY Alert | Minimum for Whale Alert |
|-------|----------------------|------------------------|
| PAXG | $25,000 | $50,000 |
| BTC | $150,000 | $500,000 |

### **Special Alert Conditions:**

- **Absorption**: Whale size + <0.02% price impact
- **Aggressive Pressure**: 10+ same-direction trades + 3× avg size
- **Wall Formation**: 12× avg trade size + 2× whale threshold
- **Mega Whale**: 3× whale threshold ($150K PAXG / $1.5M BTC)

### **Frequency Limits:**

- Maximum ~7-8 alerts per minute (8-second cooldown)
- Smaller institutional trades (<1.5× whale) don't trigger alerts
- All trades recorded in tape regardless of alert status

### **Best Practices:**

✅ Monitor alert bar for real-time large trade detection  
✅ Use voice alerts for hands-free monitoring  
✅ Check console for detailed analysis  
✅ Don't lower thresholds too much (alert fatigue)  
✅ Remember: alerts ≠ trading signals (separate systems)  

---

**Current Settings**: Balanced (optimized for quality over quantity)  
**Last Updated**: April 14, 2026  
**Version**: V4.1.0
