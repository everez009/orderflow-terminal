# Order Flow Terminal v2 - Alert System Upgrade

## Overview
Updated the order flow terminal with layman-friendly alert messages that are easier to understand for all traders, with smart filtering to prevent alert spam.

## 🚨 ALERT FREQUENCY CONTROL

### Smart Cooldowns Implemented
- **Trade Alerts**: Minimum 8 seconds between alerts (prevents spam during high activity)
- **Voice Alerts**: 6-second cooldown (ensures clear, non-overlapping speech)
- **Price Rejection**: 60-second cooldown (only fires when pattern is confirmed)
- **Delta Divergence**: 45-second cooldown (requires strong divergence signal)
- **Spoofing Detection**: 30-second cooldown (prevents false positives)

### Stricter Detection Thresholds
- **Absorption**: Price impact < 0.02% (was 0.03%) - only extreme cases
- **Aggressive Pressure**: 10+ consecutive trades, 3x average size (was 8 trades, 2x)
- **Wall Formation**: 12x average trade size, 2x whale threshold (was 8x, 1x)
- **Whale Alerts**: Only on trades 2x+ whale threshold (was any whale trade)
- **Institutional Alerts**: Only on trades 1.5x+ whale threshold (filters small inst trades)

## New Alert Types with Emojis & Color Coding

### 🟢 BULLISH ALERTS (Green)
- **BUY WALL FORMING** 🧱 - Large buy orders stacking up
- **BULLISH REJECTION** 🎯 - Price bouncing off support level
- **BULLISH DIVERGENCE** 📊 - Price falling but buyers accumulating
- **WHALE BUYING** 🐋 - Large whale buying detected
- **INSTITUTIONAL BUY** 🏛 - Institutional-sized buy order
- **STRONG BUY PRESSURE** 💪 - Aggressive buying detected
- **ABSORPTION DETECTED** 🧽 - Buyers absorbing all sell orders

### 🔴 BEARISH ALERTS (Red)
- **SELL WALL FORMING** 🧱 - Large sell orders stacking up
- **BEARISH REJECTION** 🎯 - Price rejecting from resistance
- **BEARISH DIVERGENCE** 📊 - Price rising but sellers distributing
- **WHALE SELLING** 🐋 - Large whale selling detected
- **INSTITUTIONAL SELL** 🏛 - Institutional-sized sell order
- **STRONG SELL PRESSURE** 💥 - Aggressive selling detected
- **ABSORPTION DETECTED** 🧽 - Sellers absorbing all buy orders

### ⚪ NEUTRAL/WARNING ALERTS (White)
- **SPOOFING SUSPECTED** ⚠️ - Orders appearing/disappearing quickly

### 🧽 ABSORPTION DETECTED
- **What it means:** Large orders being eaten without price moving
- **Detection:** Whale-sized trades with minimal price impact (<0.03%)
- **Why it matters:** Shows strong support/resistance where large players are absorbing orders

### 💪 STRONG BUY PRESSURE  
- **What it means:** Aggressive buying detected
- **Detection:** 8+ consecutive buy trades, each 2x larger than average
- **Why it matters:** Indicates strong bullish momentum and institutional accumulation

### 💥 STRONG SELL PRESSURE
- **What it means:** Aggressive selling detected  
- **Detection:** 8+ consecutive sell trades, each 2x larger than average
- **Why it matters:** Indicates strong bearish momentum and institutional distribution

### 🧱 WALL FORMING
- **What it means:** Large limit orders stacking up
- **Detection:** Individual trades 8x larger than average trade size
- **Why it matters:** Shows where major support/resistance levels are forming

### 🎯 PRICE REJECTING LEVEL
- **What it means:** Price bouncing off key level
- **Detection:** Price touching same level 3-5 times within 1 minute
- **Why it matters:** Confirms important support/resistance zones

### 📊 DELTA DIVERGENCE
- **What it means:** Price and order flow moving opposite
- **Detection:** Price trend contradicts net order flow delta by 30%+
- **Why it matters:** Reveals hidden market dynamics and potential reversals

### ⚠️ SPOOFING SUSPECTED
- **What it means:** Orders appearing/disappearing quickly
- **Detection:** 3+ large orders appearing AND disappearing within 5 seconds
- **Why it matters:** Warns of potential market manipulation

### 🐋 WHALE BUYING/SELLING
- **What it means:** Large whale transaction
- **Detection:** Trades exceeding whale threshold ($50K+)
- **Why it matters:** Tracks major player activity

### 🏛 INSTITUTIONAL BUY/SELL
- **What it means:** Institutional-sized trade detected
- **Detection:** Trades exceeding institutional threshold ($10K+)
- **Why it matters:** Monitors professional trader activity

## Technical Improvements

### Color-Coded Alert System
- **Green Border + Green Text** = Bullish/Long signals (buying pressure)
- **Red Border + Red Text** = Bearish/Short signals (selling pressure)
- **White Text** = Neutral/warning signals (spoofing, etc.)
- Applied to: Price display, alert notes, Telegram messages, voice announcements
- Instantly identify market direction at a glance!

### Smart Direction Detection
- Automatically determines if alert is bullish or bearish
- Buy walls, bullish divergence, support rejection → GREEN 🟢
- Sell walls, bearish divergence, resistance rejection → RED 🔴
- Voice alerts announce "Bullish" or "Bearish" before alert type
- Telegram messages show 🟢 or 🔴 emoji for quick identification

### Enhanced Detection Engine
- Added `checkAdvancedAlerts()` function for real-time market analysis
- Added `createAdvancedAlert()` for consistent alert creation
- Improved state tracking with multiple cooldown timers:
  - `lastTradeAlert` - tracks trade-based alerts
  - `lastPriceRejectionAlert` - tracks price rejection alerts
  - `lastDeltaDivergenceAlert` - tracks delta divergence alerts
  - `lastSpoofAlert` - tracks spoofing detection alerts

### Alert Frequency Management
- **8-second minimum** between trade alerts (prevents spam)
- **6-second voice cooldown** (clear, non-overlapping speech)
- **60-second price rejection cooldown** (confirmed patterns only)
- **45-second delta divergence cooldown** (strong signals only)
- Trades still recorded but alerts filtered during cooldown periods

### Stricter Detection Criteria
- Raised thresholds to reduce false positives
- Only alerts on HIGH-CONFIDENCE signals
- Filters out minor institutional trades
- Requires stronger evidence for each alert type

### Better Notification Support
- Updated WhatsApp messages with emoji support
- Enhanced Telegram formatting with better visual hierarchy
- Improved voice alerts with clearer, natural language
- Voice rate adjusted to 0.9 (slower, more clear)
- Voice pitch normalized to 1.0 (natural tone)

## Files Modified
- `/Users/mac/orderflow/orderflow_1304262038-v1.html` (updated in place)
- `/Users/mac/orderflow/orderflow_1304262038-v2.html` (new copy with changes)

## Usage
Simply open the HTML file in a browser. The alerts will automatically appear in the alert bar at the bottom when conditions are detected. Notifications will be sent via:
- Visual alert chips in the UI
- Voice announcements (if enabled)
- Telegram messages (if configured)
- WhatsApp messages (if configured)

## Benefits
✅ Easy to understand - no trading jargon
✅ Visual emojis for quick recognition
✅ Clear explanations of what's happening
✅ Multiple detection methods for comprehensive coverage
✅ Smart filtering to avoid alert fatigue
✅ Works across all notification channels
