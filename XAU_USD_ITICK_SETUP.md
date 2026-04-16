# XAU/USD & BTC/USDT Order Flow Terminal - Dual Symbol Setup

## Quick Start Guide

Your orderflow terminal now supports **BOTH symbols**:
- ✅ **BTC/USDT** (Bitcoin) - via Binance WebSocket (FREE, no registration)
- ✅ **XAU/USD** (Gold Spot) - via iTick API (FREE with token)

**Click the symbol buttons at the top to switch between them!**

---

## Data Sources

### BTC/USDT (Default)
- **Provider**: Binance
- **Cost**: FREE
- **Registration**: Not required
- **Features**: Full tick data, buy/sell volume, all orderflow features
- **WebSocket**: `wss://stream.binance.com:9443/ws/btcusdt@aggTrade`

### XAU/USD (Gold)
- **Provider**: iTick API
- **Cost**: FREE (permanent tier)
- **Registration**: Required (get token below)
- **Features**: Tick data, real-time quotes, full orderflow analysis
- **WebSocket**: `wss://api.itick.org/sws`

---

## Step 1: Get Your FREE iTick API Token

**Option A: iTick (Requires Registration)**
1. Visit: **https://itick.org** (NOT itick.io)
2. Click "Register" or "Sign Up"
3. Sign up with email (no credit card required!)
4. Verify your email
5. Go to dashboard → API Keys
6. Copy your API token

**The free tier is PERMANENT** - no expiration, no time limits!

---

**Option B: Use Yahoo Finance Instead (NO Registration Needed!)** ⭐ RECOMMENDED

If iTick registration is difficult, you can use **Yahoo Finance** which requires:
- ✅ NO account needed
- ✅ NO API key
- ✅ Completely free forever
- ✅ XAUUSD=X symbol for gold

Simply replace the iTick code with Yahoo Finance polling (see troubleshooting section below).

---

## Step 2: Add Your API Token

Open `order-flow-terminal.html` and find this line (around line 191):

```javascript
const ITICK_API_TOKEN = 'YOUR_ITICK_API_TOKEN'; // Get free token from https://itick.io/register
```

Replace `'YOUR_ITICK_API_TOKEN'` with your actual token:

```javascript
const ITICK_API_TOKEN = 'bb42e24746784dc0af8...your_actual_token_here';
```

---

## Step 3: Open the Terminal

Simply open `order-flow-terminal.html` in your browser:

```bash
# On macOS
open order-flow-terminal.html

# Or drag the file into your browser
```

---

## What You Get

### ✅ Real-Time XAU/USD Data
- Live gold spot prices
- Bid/ask spreads
- Volume data
- Price changes

### ✅ Historical K-Line Data
- Multiple timeframes: 1m, 5m, 15m, 1h, 4h
- Up to 200 candles loaded initially
- OHLCV data for charting

### ✅ Order Flow Features
- Volume profile overlay
- Footprint charts (1-min bars)
- Cumulative delta
- Buy/sell pressure ratio

### ✅ Whale & Institutional Alerts
- Detects large trades ≥$100K (Whale)
- Detects mega trades ≥$500K (Institutional)
- Sound alerts enabled by default
- Email/SMS/WhatsApp notifications (optional)

---

## Free Tier Limits

- **Rate Limit**: 60 requests/minute
- **Data Quality**: Minute-level updates (not tick-by-tick)
- **Historical Data**: Up to 1 year available
- **Cost**: $0 forever

This is perfect for:
- ✅ Personal trading analysis
- ✅ Strategy development
- ✅ Market monitoring
- ✅ Learning order flow concepts

---

## Troubleshooting

### No Data Showing?
1. Check that you replaced `YOUR_ITICK_API_TOKEN` with your actual token
2. Open browser console (F12) to see any error messages
3. Verify your internet connection
4. Check iTick dashboard to ensure your account is active

### WebSocket Not Connecting?
- iTick WebSocket URL: `wss://api.itick.org/future`
- Make sure your firewall isn't blocking WebSocket connections
- Try refreshing the page

### Rate Limit Errors?
- Free tier allows 60 requests/minute
- The terminal is optimized to stay within limits
- If you hit limits, wait a minute and refresh

---

## API Endpoints Used

### 1. Historical K-Lines (REST)
```
GET https://api.itick.org/forex/kline
Headers: 
  - accept: application/json
  - token: YOUR_API_TOKEN
Params:
  - region: gb
  - code: XAUUSD
  - kType: 1 (1min), 5 (5min), 15, 60 (1hr), 240 (4hr)
  - limit: 200
```

### 2. Real-Time Ticks (WebSocket)
```
WS wss://api.itick.org/future
Subscribe message:
{
  "ac": "subscribe",
  "params": "XAUUSD$GB",
  "types": "tick,quote"
}
```

### 3. Current Quote (REST - polled every 5s)
```
GET https://api.itick.org/forex/quote
Headers:
  - accept: application/json
  - token: YOUR_API_TOKEN
Params:
  - region: gb
  - code: XAUUSD
```

---

## Upgrade Options (Optional)

If you need more later:

### Professional Plan - $99/month
- 1000 requests/second
- Millisecond-level data (<80ms latency)
- Unlimited historical data
- Priority support

### Enterprise Plan - $199/month
- Dedicated servers
- Custom integrations
- SLA guarantees
- Account manager

**But for most users, the FREE tier is more than enough!**

---

## Support

- iTick Documentation: https://doc.itick.org
- Support Email: Available on iTick website
- Response Time: <15 minutes (7×24 chat)

---

## Comparison: Why iTick?

| Feature | iTick (Free) | AMP/Rithmic |
|---------|--------------|-------------|
| Cost | $0 | $50-65/month |
| Setup Time | 5 minutes | 3-7 days |
| XAU/USD Data | ✅ Yes | ✅ Yes |
| Real-Time | ✅ Minute-level | ✅ Tick-level |
| API Complexity | Simple REST/WS | Complex Protocol Buffers |
| Trading Execution | ❌ No | ✅ Yes |
| Best For | Analysis & Learning | Professional Trading |

---

## Next Steps

1. ✅ Get your free iTick API token
2. ✅ Add it to the HTML file
3. ✅ Open the terminal in your browser
4. ✅ Watch live XAU/USD order flow data!

Enjoy your gold futures analysis! 🥇📊
