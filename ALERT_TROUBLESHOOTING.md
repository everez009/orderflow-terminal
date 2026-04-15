# Alert System Troubleshooting Guide

## Problem: No Alerts Received

If you haven't received any alerts for the past day, follow this diagnostic checklist.

---

## Step 1: Open Browser Console (CRITICAL)

**How to open:**
- Chrome/Edge: Press `F12` or `Ctrl+Shift+J` (Windows) / `Cmd+Option+J` (Mac)
- Firefox: Press `F12` or `Ctrl+Shift+K`
- Safari: Enable Developer menu first, then `Cmd+Option+C`

**What to look for:**

### **A. Check if Large Trades Are Detected**

You should see messages like:
```
🔍 Large trade detected: 🐋 WHALE | $53,000 | BUY @ $2,650.00
🔍 Large trade detected: 🏛 INST | $30,000 | SELL @ $2,648.50
```

**If you DON'T see these:**
- ❌ No trades are meeting the institutional threshold
- Possible causes:
  - Market is quiet (no large trades happening)
  - WebSocket disconnected
  - Wrong symbol selected

**Fix:**
```javascript
// Check WebSocket status in console:
console.log('WebSocket state:', ws?.readyState);
// 0 = CONNECTING, 1 = OPEN ✅, 2 = CLOSING, 3 = CLOSED ❌

// Check last trade time:
console.log('Last trade:', ST[activeSym].trades[0]);
```

---

### **B. Check if Alerts Are Being Skipped**

Look for:
```
⏸️ Alert skipped (cooldown active, 3.2s remaining)
⏭️ Institutional trade below 1.5× whale threshold ($75,000), no alert fired
```

**If you see cooldown messages:**
- ✅ System is working correctly
- Alerts are being throttled to prevent spam
- Wait 8 seconds between large trades

**If you see "below 1.5× whale threshold":**
- ✅ System is filtering smaller institutional trades
- This is NORMAL - prevents notification spam
- Only trades ≥ 1.5× whale trigger alerts

---

### **C. Check if Alerts Are Firing**

Look for:
```
✅ ALERT FIRED: 🐋 WHALE BUYING | PAXGUSDT | $120,000 @ $2,650.00
   → Visual chip: YES (active)
   → Voice: ENABLED
   → Telegram: CONFIGURED
   → WhatsApp: NOT CONFIGURED
```

**If you DON'T see "ALERT FIRED":**
- ❌ Alert conditions not met
- See section above about thresholds

**If you DO see "ALERT FIRED" but no notifications:**
- Problem is in notification delivery (see Step 2)

---

## Step 2: Check Notification Configuration

In console, run:
```javascript
// Check all notification settings
const cfg = {
  sound: soundOn,
  telegram: {
    token: localStorage.getItem('tgTok') ? 'SET' : 'NOT SET',
    chatId: localStorage.getItem('tgCid') ? 'SET' : 'NOT SET'
  },
  whatsapp: {
    phone: localStorage.getItem('waNr') ? 'SET' : 'NOT SET',
    apiKey: localStorage.getItem('waKey') ? 'SET' : 'NOT SET'
  }
};
console.table(cfg);
```

### **Expected Output:**
```
┌─────────────┬──────────┐
│ (index)     │ Values   │
├─────────────┼──────────┤
│ sound       │ true     │
│ telegram    │ {token: 'SET', chatId: 'SET'} │
│ whatsapp    │ {phone: 'SET', apiKey: 'SET'} │
└─────────────┴──────────┘
```

### **Common Issues:**

#### **Issue 1: Sound Disabled**
```
sound: false
```
**Fix:** Click 🔊 OFF button to enable sound

#### **Issue 2: Telegram Not Configured**
```
telegram: {token: 'NOT SET', chatId: 'NOT SET'}
```
**Fix:**
1. Click ⚙ ALERTS button
2. Enter Telegram Bot Token
3. Enter Chat ID
4. Click "Save Settings"
5. Click "Test Telegram" to verify

#### **Issue 3: WhatsApp Not Configured**
```
whatsapp: {phone: 'NOT SET', apiKey: 'NOT SET'}
```
**Fix:**
1. Click ⚙ ALERTS button
2. Enter phone number (with country code, e.g., +1234567890)
3. Enter CallMeBot API key
4. Click "Save Settings"
5. Click "Test WhatsApp" to verify

---

## Step 3: Test Notifications Manually

### **Test Telegram:**
1. Click ⚙ ALERTS button
2. Fill in Telegram credentials
3. Click "Test Telegram" button
4. Check console for result:
   ```
   ✅ Telegram connected
   ```
   or
   ```
   ❌ Error message
   ```

### **Test WhatsApp:**
1. Click ⚙ ALERTS button
2. Fill in WhatsApp credentials
3. Click "Test WhatsApp" button
4. Check console for result

### **Test Voice:**
1. Make sure 🔊 ON is showing
2. Wait for next alert OR trigger manually:
   ```javascript
   // Force a test alert
   speak({
     type: 'TEST ALERT',
     sym: activeSym,
     p: ST[activeSym].last,
     usd: 50000,
     note: 'This is a test',
     emoji: '🧪'
   });
   ```

---

## Step 4: Check Alert Frequency

### **How Many Alerts Should You Expect?**

Based on historical data:

| Market Condition | Alerts Per Hour | Alerts Per Day |
|------------------|-----------------|----------------|
| Quiet (weekend)  | 2-5             | 20-50          |
| Normal           | 8-15            | 100-200        |
| Volatile         | 20-30           | 300-500        |
| Extreme          | 40-50           | 500-800        |

**If you're seeing ZERO alerts all day, something is wrong.**

### **Check Recent Alert History:**

In console:
```javascript
// Show last 10 alerts
console.log('Recent alerts:', ST[activeSym].alerts.slice(0, 10));

// Count alerts today
const today = new Date().toDateString();
const todayAlerts = ST[activeSym].alerts.filter(a => 
  new Date(a.t).toDateString() === today
);
console.log(`Today's alerts: ${todayAlerts.length}`);
```

**Expected:** At least 20-50 alerts per day during normal trading

**If count is 0:**
- No large trades occurred (unlikely for full day)
- OR alerts are being blocked somewhere

---

## Step 5: Verify WebSocket Connection

### **Check Connection Status:**

In console:
```javascript
console.log('WebSocket readyState:', ws?.readyState);
console.log('WebSocket URL:', ws?.url);
```

**Expected:**
```
WebSocket readyState: 1  // OPEN
```

**If state is 3 (CLOSED):**
```javascript
// Force reconnect
connect();
```

### **Check If Trades Are Coming In:**

In console:
```javascript
// Monitor trade flow
let tradeCount = 0;
const checkInterval = setInterval(() => {
  const currentCount = ST[activeSym].trades.length;
  const newTrades = currentCount - tradeCount;
  console.log(`Trades in last 5s: ${newTrades} (total: ${currentCount})`);
  tradeCount = currentCount;
}, 5000);

// Stop monitoring after 30 seconds
setTimeout(() => clearInterval(checkInterval), 30000);
```

**Expected:** Several trades per 5 seconds during active market

**If 0 trades:**
- WebSocket not connected
- Symbol has no activity (switch to BTC if PAXG is quiet)

---

## Step 6: Check Threshold Calibration

### **Current Thresholds:**

```javascript
console.log('Current thresholds:');
console.log('PAXG - Inst:', SYMS.PAXGUSDT.instUSD, '| Whale:', SYMS.PAXGUSDT.whaleUSD);
console.log('BTC - Inst:', SYMS.BTCUSDT.instUSD, '| Whale:', SYMS.BTCUSDT.whaleUSD);
```

**Expected:**
```
PAXG - Inst: 25000 | Whale: 50000
BTC - Inst: 150000 | Whale: 500000
```

### **Are Thresholds Too High?**

Check recent trade sizes:
```javascript
// Analyze last 100 trades
const recent = ST[activeSym].trades.slice(0, 100);
const avgTrade = recent.reduce((sum, t) => sum + t.usd, 0) / recent.length;
const maxTrade = Math.max(...recent.map(t => t.usd));
const minWhale = SYMS[activeSym].whaleUSD;

console.log(`Average trade: $${avgTrade.toLocaleString()}`);
console.log(`Largest trade: $${maxTrade.toLocaleString()}`);
console.log(`Whale threshold: $${minWhale.toLocaleString()}`);
console.log(`Ratio (max/whale): ${(maxTrade/minWhale*100).toFixed(1)}%`);
```

**If ratio < 50%:**
- Largest trades are less than half the whale threshold
- Thresholds might be too high for current market
- Consider lowering (see Step 7)

---

## Step 7: Adjust Thresholds (If Needed)

### **Temporary Lower Thresholds for Testing:**

In console:
```javascript
// Lower PAXG thresholds by 50%
SYMS.PAXGUSDT.instUSD = 12500;  // Was 25000
SYMS.PAXGUSDT.whaleUSD = 25000; // Was 50000

// Lower BTC thresholds by 50%
SYMS.BTCUSDT.instUSD = 75000;   // Was 150000
SYMS.BTCUSDT.whaleUSD = 250000; // Was 500000

console.log('⚠️ Thresholds lowered for testing');
console.log('Refresh page to restore original values');
```

**Wait 5-10 minutes and check if alerts start firing.**

**If alerts fire with lower thresholds:**
- Original thresholds were too high for current market conditions
- Permanently adjust in the SYMS config (line ~666)

**If still no alerts:**
- Problem is elsewhere (connection, configuration, etc.)

---

## Step 8: Common Root Causes & Fixes

### **Cause 1: WebSocket Disconnected**

**Symptoms:**
- No trades in console
- Status shows "ERROR" or "RECONNECTING"
- No "Large trade detected" messages

**Fix:**
```javascript
// Force reconnection
connect();

// Verify
console.log('WS state:', ws?.readyState); // Should be 1
```

---

### **Cause 2: Wrong Symbol Selected**

**Symptoms:**
- Watching PAXG during quiet periods
- No large trades happening

**Fix:**
- Switch to BTC tab (more active)
- Or wait for PAXG volatility

---

### **Cause 3: Notifications Not Configured**

**Symptoms:**
- See "ALERT FIRED" in console
- But no voice/Telegram/WhatsApp

**Fix:**
- Configure at least ONE notification channel
- Test each channel individually

---

### **Cause 4: Browser Tab Suspended**

**Symptoms:**
- Alerts work when tab active
- Stop when tab in background

**Fix:**
- Keep tab visible
- Use wake lock feature (mobile)
- Don't minimize browser

---

### **Cause 5: Cooldown Too Aggressive**

**Symptoms:**
- See many "cooldown active" messages
- Missing alerts during volatile periods

**Fix:**
```javascript
// Reduce cooldown from 8s to 4s
// Find this line in code (~1706):
if(now-lastAlertTime<8000) {
// Change to:
if(now-lastAlertTime<4000) {
```

---

## Quick Diagnostic Script

Copy-paste this into console for full system check:

```javascript
console.log('=== ORDERFLOW ALERT DIAGNOSTIC ===\n');

// 1. WebSocket
console.log('1. WebSocket:', ws?.readyState === 1 ? '✅ CONNECTED' : '❌ DISCONNECTED');

// 2. Recent trades
const trades = ST[activeSym].trades;
console.log(`2. Total trades tracked: ${trades.length}`);
console.log(`   Last trade: ${trades[0] ? '$'+trades[0].usd.toLocaleString() : 'NONE'}`);

// 3. Today's alerts
const today = new Date().toDateString();
const todayAlerts = ST[activeSym].alerts.filter(a => 
  new Date(a.t).toDateString() === today
);
console.log(`3. Alerts today: ${todayAlerts.length}`);

// 4. Notification config
const cfg = getCfg();
console.log('4. Notifications:');
console.log(`   Sound: ${soundOn ? '✅ ON' : '❌ OFF'}`);
console.log(`   Telegram: ${cfg.tgTok&&cfg.tgCid ? '✅ CONFIGURED' : '❌ NOT SET'}`);
console.log(`   WhatsApp: ${cfg.waNr&&cfg.waKey ? '✅ CONFIGURED' : '❌ NOT SET'}`);

// 5. Thresholds
console.log('5. Current thresholds:');
console.log(`   ${activeSym}: Inst=$${SYMS[activeSym].instUSD.toLocaleString()}, Whale=$${SYMS[activeSym].whaleUSD.toLocaleString()}`);

// 6. Recent trade analysis
if (trades.length > 0) {
  const avgTrade = trades.slice(0, 50).reduce((sum, t) => sum + t.usd, 0) / Math.min(50, trades.length);
  const maxTrade = Math.max(...trades.slice(0, 50).map(t => t.usd));
  console.log('6. Trade analysis (last 50):');
  console.log(`   Average: $${avgTrade.toLocaleString()}`);
  console.log(`   Maximum: $${maxTrade.toLocaleString()}`);
  console.log(`   vs Whale: ${(maxTrade/SYMS[activeSym].whaleUSD*100).toFixed(1)}%`);
}

console.log('\n=== END DIAGNOSTIC ===');
```

---

## Expected Console Output (Working System)

```
🔍 Large trade detected: 🐋 WHALE | $120,000 | BUY @ $2,650.00
🧽 ABSORPTION ALERT: Buyers absorbing all sell orders | $120,000
✅ ALERT FIRED: 🧽 ABSORPTION DETECTED | PAXGUSDT | $120,000 @ $2,650.00
   → Visual chip: YES (active)
   → Voice: ENABLED
   → Telegram: CONFIGURED
   → WhatsApp: NOT CONFIGURED
📡 fireNotifs called for: ABSORPTION DETECTED | Sound: true, TG: YES, WA: NO
🔊 Attempting voice alert...
📱 Sending Telegram notification...
```

---

## Still No Alerts?

If you've gone through all steps and still no alerts:

1. **Take screenshot of console** showing last 30 seconds
2. **Check browser console for errors** (red messages)
3. **Verify internet connection** is stable
4. **Try different browser** (Chrome recommended)
5. **Clear browser cache** and reload
6. **Check if ad blocker** is blocking WebSocket

Then share the diagnostic output for further assistance.

---

**Last Updated:** April 14, 2026  
**Version:** V4.1.0 with Enhanced Logging
