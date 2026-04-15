# Sound Alert System - Complete Guide

## ✅ Sound Alerts ARE Working!

The system has **TWO types of voice alerts** that announce different events:

---

## 1. Whale/Institutional Trade Alerts 🔊

### **When They Fire:**

Voice alerts trigger for **large trades** that meet these criteria:

| Alert Type | Threshold (PAXG) | Threshold (BTC) | Voice Announcement |
|------------|------------------|-----------------|-------------------|
| **Absorption** | ≥ $50K, minimal price impact | ≥ $500K, minimal price impact | "Absorption detected. PAXG/USDT. 53K dollars at 2650.00. Buyers absorbing all sell orders." |
| **Aggressive Buy/Sell** | ≥ $50K, 10+ streak, 3× avg | ≥ $500K, 10+ streak, 3× avg | "Strong buy pressure. PAXG/USDT. 120K dollars at 2650.00. Aggressive buying detected." |
| **Wall Formation** | ≥ $100K, 12× avg size | ≥ $1M, 12× avg size | "Buy wall forming. PAXG/USDT. 150K dollars at 2650.00. Large buy orders stacking up." |
| **Mega Whale** | ≥ $100K (2× whale) | ≥ $1M (2× whale) | "Whale. Whale buying. PAXG/USDT. 120K dollars at 2650.00. Large whale transaction." |
| **Mega Mega Whale** | ≥ $250K (5× whale) | ≥ $2.5M (5× whale) | "Whale. Whale selling. PAXG/USDT. 280K dollars at 2648.00. Mega whale activity detected." |
| **Institutional** | ≥ $75K (1.5× whale) | ≥ $750K (1.5× whale) | "Institutional. Institutional buy. PAXG/USDT. 80K dollars at 2650.00. Institutional-sized trade detected." |

### **What Gets Announced:**

```javascript
// Format:
"[Prefix] [Alert Type]. [Symbol]. [Amount] dollars at [Price]. [Note]."

// Examples:
"Whale. Whale buying. PAXG/USDT. 120K dollars at 2650.00. Large whale transaction."
"Institutional. Institutional sell. BTC/USDT. 800K dollars at 95000.0. Institutional-sized trade detected."
"Absorption detected. PAXG/USDT. 53K dollars at 2650.00. Buyers absorbing all sell orders."
"Strong buy pressure. PAXG/USDT. 120K dollars at 2650.00. Aggressive buying detected."
```

### **Voice Settings:**
- **Rate:** 0.9 (slightly slower for clarity)
- **Pitch:** 1.0 (normal)
- **Volume:** 0.9 (90%)
- **Cooldown:** 6 seconds between voice alerts

---

## 2. Signal Alerts 🔊

### **When They Fire:**

Voice alerts trigger when the **signal engine** detects a trading opportunity:

**Requirements:**
- Signal conditions met (2 required + mode-specific optional count)
- Star rating meets threshold for current mode
- Cooldown expired (2 minutes minimum between same-direction signals)

### **What Gets Announced:**

```javascript
// BUY Signal:
"Buy signal on PAXG/USDT. Price 2650.00. Near support $2645.00. Strength 4 stars."

// SELL Signal:
"Sell signal on BTC/USDT. Price 95000.0. Near resistance $95500.0. Strength 3 stars."
```

### **Voice Settings:**
- **Rate:** 1.1 (slightly faster)
- **Pitch:** 1.2 for BUY (higher), 0.8 for SELL (lower)
- **Volume:** 1.0 (100%)
- **No cooldown** (uses signal cooldown of 2 min instead)

---

## How to Enable/Disable Sound

### **Toggle Button:**
Click the `🔊 OFF` button in the control bar
- Changes to `🔊 ON` when enabled
- Green highlight when active

### **Console Check:**
```javascript
console.log('Sound enabled:', soundOn); // true or false
```

---

## Which Alerts Trigger Voice?

### **✅ YES - These Announce:**

#### **Trade Alerts (from fireNotifs):**
1. **Absorption Detected** - Large trade with minimal price impact
2. **Strong Buy/Sell Pressure** - Aggressive directional flow
3. **Buy/Sell Wall Forming** - Very large orders stacking
4. **Whale Buying/Selling** - 2× whale threshold or more
5. **Institutional Buy/Sell** - 1.5× whale threshold or more

#### **Signal Alerts (from fireSignalNotif):**
6. **BUY Signals** - When conditions met & star threshold reached
7. **SELL Signals** - When conditions met & star threshold reached

### **❌ NO - These Don't Announce:**

- Trades below institutional threshold (< $25K PAXG, < $150K BTC)
- Institutional trades below 1.5× whale (filtered out)
- Alerts during 8-second cooldown period
- Voice alerts during 6-second voice cooldown
- Signals below star threshold for current mode
- Signals during 2-minute cooldown

---

## Voice Alert Flow

### **For Whale/Institutional Trades:**

```
Large Trade Detected (≥ instUSD)
    ↓
Check 8-second cooldown
    ↓ (passed)
Classify alert type
    ↓
Create alert object
    ↓
fireNotifs(alert)
    ↓
if (soundOn) → speak(alert)
    ↓
Check 6-second voice cooldown
    ↓ (passed)
Generate speech text
    ↓
Speak via browser TTS
```

### **For Trading Signals:**

```
Signal Engine Evaluates
    ↓
Conditions Met? (required + optional)
    ↓ (yes)
Star Rating ≥ Mode Threshold?
    ↓ (yes)
Cooldown Expired? (2 min)
    ↓ (yes)
fireSignalNotif(direction, price, stars...)
    ↓
if (soundOn) → Speak signal
    ↓
Generate speech text
    ↓
Speak via browser TTS
```

---

## Testing Sound Alerts

### **Test 1: Manual Voice Test**

Open console and run:
```javascript
// Test whale alert voice
speak({
  type: 'WHALE BUYING',
  sym: activeSym,
  p: ST[activeSym].last,
  usd: 120000,
  note: 'Large whale transaction',
  emoji: '🐋'
});

// Test signal voice
const txt = `Buy signal on ${SYMS[activeSym].label}. Price ${ST[activeSym].last.toFixed(2)}. Near support. Strength 4 stars.`;
const u = new SpeechSynthesisUtterance(txt);
u.rate = 1.1; u.pitch = 1.2; u.volume = 1;
window.speechSynthesis.speak(u);
```

### **Test 2: Wait for Real Alerts**

1. Enable sound: Click `🔊 OFF` → `🔊 ON`
2. Open console (F12)
3. Wait for large trades or signals
4. Listen for announcements
5. Check console for confirmation:
   ```
   🔊 Attempting voice alert...
   Voice alert skipped (cooldown)  // if too soon
   ```

### **Test 3: Verify Browser Permissions**

Some browsers require user interaction before allowing speech:
1. Click anywhere on page first
2. Then enable sound
3. Try manual test above

---

## Troubleshooting

### **Problem: No sound at all**

**Check 1: Is sound enabled?**
```javascript
console.log('soundOn:', soundOn); // Should be true
```

**Fix:** Click `🔊 OFF` button to enable

---

**Check 2: Browser blocking speech?**
```javascript
// Test if speech synthesis works
const test = new SpeechSynthesisUtterance('Test');
window.speechSynthesis.speak(test);
```

**If no sound:**
- Browser may block autoplay
- Click page first, then try again
- Check browser settings for microphone/speech permissions

---

**Check 3: Volume too low?**
```javascript
// Check system volume
// Check browser tab not muted
// Check computer speakers working
```

---

### **Problem: Sound only works sometimes**

**Cause: Cooldown active**

Voice alerts have a **6-second cooldown**:
```javascript
if(now - lastVoiceAlertTime < 6000) {
  console.log('Voice alert skipped (cooldown)');
  return;
}
```

**This is NORMAL** - prevents spam during volatile periods

---

### **Problem: Want different voice settings**

**Current Settings:**
```javascript
// Whale/Inst alerts:
u.rate = 0.9;   // Slower
u.pitch = 1.0;  // Normal
u.volume = 0.9; // 90%

// Signal alerts:
u.rate = 1.1;        // Faster
u.pitch = 1.2 or 0.8; // Higher for buy, lower for sell
u.volume = 1.0;      // 100%
```

**To customize:** Edit the `speak()` function in HTML file

---

## Alert Priority

When multiple alerts fire rapidly:

1. **First alert** → Speaks immediately
2. **Next 6 seconds** → Skipped (cooldown)
3. **After 6 seconds** → Next alert speaks
4. **Browser queue** → Only one announcement at a time

**Example scenario:**
```
10:00:00 - Whale buy $120K → ✅ SPEAKS
10:00:03 - Inst sell $80K  → ⏸️ SKIPPED (cooldown)
10:00:05 - Signal BUY ★★★  → ⏸️ SKIPPED (cooldown)
10:00:07 - Whale sell $150K → ⏸️ SKIPPED (cooldown)
10:00:07 - Signal SELL ★★★★ → ✅ SPEAKS (6s passed)
```

---

## Summary Table

| Alert Type | Triggers Voice? | Cooldown | Pitch | Example |
|------------|----------------|----------|-------|---------|
| Whale Trade | ✅ YES | 6 seconds | 1.0 | "Whale. Whale buying..." |
| Institutional Trade | ✅ YES | 6 seconds | 1.0 | "Institutional. Institutional buy..." |
| Absorption | ✅ YES | 6 seconds | 1.0 | "Absorption detected..." |
| Aggressive Pressure | ✅ YES | 6 seconds | 1.0 | "Strong buy pressure..." |
| Wall Formation | ✅ YES | 6 seconds | 1.0 | "Buy wall forming..." |
| BUY Signal | ✅ YES | 2 minutes | 1.2 | "Buy signal on..." |
| SELL Signal | ✅ YES | 2 minutes | 0.8 | "Sell signal on..." |
| Small trades (<inst) | ❌ NO | N/A | N/A | Silent |
| Filtered inst (<1.5×) | ❌ NO | N/A | N/A | Silent |
| During cooldown | ❌ NO | N/A | N/A | Skipped |

---

## Best Practices

### **For Active Monitoring:**
- ✅ Keep sound ON
- ✅ Use headphones for clarity
- ✅ Monitor console for confirmations
- ⚠️ Expect frequent alerts in volatile markets

### **For Casual Monitoring:**
- ⚠️ Sound can be distracting
- ✅ Rely on visual chips/toasts
- ✅ Check Telegram/WhatsApp instead
- ✅ Review alerts periodically

### **For Backtesting:**
- ❌ Turn sound OFF
- ✅ Focus on visual signals
- ✅ Review journal entries
- ✅ Analyze performance stats

---

## Console Diagnostics

Every voice attempt logs to console:

```javascript
// When alert fires:
📡 fireNotifs called for: WHALE BUYING | Sound: true, TG: YES, WA: NO
🔊 Attempting voice alert...

// If cooldown blocks it:
Voice alert skipped (cooldown)

// Successful speech:
(No message - browser handles silently)
```

**To debug:**
1. Open console (F12)
2. Enable sound
3. Watch for messages
4. If you see "Attempting voice alert..." but hear nothing → browser issue
5. If you don't see the message → alert didn't fire (check thresholds)

---

**Bottom Line:** Sound alerts work for **whale/institutional trades** AND **trading signals**, with smart cooldowns to prevent spam. Enable with `🔊 ON` button and listen for real-time market activity! 🎯
