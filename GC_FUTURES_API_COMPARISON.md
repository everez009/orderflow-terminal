# GC Gold Futures API Comparison: iTick vs AMP Futures (Rithmic)

## Overview

This document compares two approaches to accessing **GC (COMEX Gold Futures)** real-time market data for your orderflow terminal.

---

## 1. iTick API

### What is it?
iTick is a financial data aggregator that provides REST and WebSocket APIs for global markets including futures, forex, stocks, and crypto. It offers direct access to COMEX gold futures (GC) data.

### ✅ Benefits

#### **Cost & Accessibility**
- **FREE tier available** - No credit card required
- Free plan: 5 requests/minute or 60 requests/minute (varies by endpoint)
- Professional plan: $99/month (1000 req/sec)
- Enterprise plan: $199/month
- **Zero barrier to entry** - Register and get API token immediately

#### **Data Quality**
- Direct connection to COMEX exchange
- Minute-level real-time data on free tier
- Millisecond-level data on paid tier (<80ms latency)
- 99.98% data accuracy
- Historical data up to 1 year (free), unlimited (paid)

#### **Technical Features**
- **REST API** - Simple HTTP requests
- **WebSocket support** - Real-time push notifications
- Multiple contract support (GC, SI, CL, etc.)
- OHLCV data, bid/ask spreads, volume
- Technical indicators included (MACD, RSI)
- Sandbox environment for testing (doesn't count against limits)

#### **Developer Experience**
- Official SDKs: Python, JavaScript, Go, Java
- 100+ code examples in documentation
- Clear JSON response format
- 7×24 hour support (<15 min response time)
- Easy integration - 3 lines of code to get started

#### **Example Usage**
```javascript
// Get GC futures real-time quote
const response = await fetch('https://api.itick.org/future/quotes?region=US&codes=GC', {
  headers: {
    'accept': 'application/json',
    'token': 'YOUR_API_TOKEN'
  }
});
const data = await response.json();
// Returns: { code: 0, data: { GC: [{ price: 2650.5, volume: 1000, ... }] } }
```

### ❌ Limitations

#### **Free Tier Restrictions**
- Rate limited: 5-60 requests/minute
- Minute-level updates only (not tick-by-tick)
- Limited historical depth
- No Level 2 order book data on free tier

#### **Data Granularity**
- **Not true tick data** on free tier (aggregated)
- Free tier may have slight delays during high volatility
- No footprint/orderflow-specific data (buy/sell volume at each price)

#### **Trading Capabilities**
- **Market data ONLY** - Cannot execute trades
- No account management
- No order routing

#### **Best For**
- Personal projects and learning
- Strategy backtesting
- Price monitoring dashboards
- Medium-frequency trading analysis
- Developers on a budget

---

## 2. AMP Futures + Rithmic API

### What is it?
AMP Futures is a futures brokerage that provides access to CME Group exchanges (including COMEX). Rithmic is their technology partner providing ultra-low-latency market data and order execution via Protocol Buffer API.

### ✅ Benefits

#### **Professional-Grade Data**
- **True tick-by-tick data** - Every single trade
- Microsecond timestamps (µs granularity)
- Complete order book depth (Level 2/Level 3)
- Footprint data with buy/sell volume at each price level
- Time & Sales data
- Market depth visualization

#### **Ultra-Low Latency**
- <1ms latency for market data
- Collocated servers near exchanges
- Direct market access
- Optimized for HFT (High-Frequency Trading)

#### **Full Trading Integration**
- Execute trades directly through API
- Order management (limit, market, stop orders)
- Account balance and position tracking
- Risk management tools
- Bracket orders, OCO orders

#### **Exchange Coverage**
- All CME Group exchanges (CME, CBOT, NYMEX, COMEX)
- Real GC futures contracts (not CFDs)
- Multiple contract months
- Options on futures

#### **Advanced Features**
- Custom bar types (volume bars, range bars, tick bars)
- Server-side trailing stops
- Historical tick data access
- Replay functionality for backtesting

### ❌ Limitations

#### **Cost Structure**
- **Must open brokerage account** with AMP Futures
- Monthly platform fees:
  - Rithmic API access: ~$10-25/month base
  - Exchange data fees (per exchange):
    - COMEX Non-Pro Level 2: $13/month
    - CME Non-Pro Level 2: $13/month
    - NYMEX Non-Pro Level 2: $13/month
    - CBOT Non-Pro Level 2: $13/month
  - **Total minimum: ~$50-65/month** for full access
- Additional per-trade commissions: $0.20-0.25 per contract

#### **Complexity**
- **Protocol Buffers** - Not simple JSON
- Requires specialized libraries (pyrithmic, rithmic-cpp, etc.)
- Complex authentication flow
- Multiple "PLANTS" (separate connections for ticker, history, orders)
- Steep learning curve

#### **Setup Requirements**
- Must complete KYC (Know Your Customer) verification
- Fund brokerage account (minimum deposit varies)
- Wait for account approval (1-3 days)
- Configure API permissions
- Install and configure RTrader Pro (optional but recommended)

#### **Technical Challenges**
- Protocol Buffer serialization/deserialization
- Async programming required
- Connection management across multiple plants
- Heartbeat monitoring
- Reconnection logic complexity

#### **Example Complexity**
```python
# Python example using pyrithmic library
from rithmic import RithmicTickerApi, RithmicEnvironment

# Requires credentials file setup
api = RithmicTickerApi(
    env=RithmicEnvironment.RITHMIC_PAPER_TRADING,
    auto_connect=True
)
es_stream = api.stream_market_data('GCZ4', 'COMEX')
# Much more complex than iTick!
```

#### **Best For**
- Professional traders and institutions
- High-frequency trading strategies
- Orderflow analysis requiring tick-level precision
- Live trading with execution
- Algorithmic trading systems
- Those who need Level 2/3 data

---

## Side-by-Side Comparison Table

| Feature | iTick API | AMP Futures + Rithmic |
|---------|-----------|----------------------|
| **Initial Cost** | FREE | $50-65/month minimum |
| **Setup Time** | 5 minutes | 3-7 days (account approval) |
| **Data Type** | Aggregated quotes | True tick-by-tick |
| **Latency** | ~100-500ms (free), <80ms (paid) | <1ms |
| **Historical Data** | 1 year (free), unlimited (paid) | Available (additional cost) |
| **Level 2 Data** | ❌ (paid only) | ✅ Included |
| **Order Execution** | ❌ Market data only | ✅ Full trading API |
| **Ease of Use** | ⭐⭐⭐⭐⭐ Very easy | ⭐⭐ Complex |
| **Documentation** | Excellent, 100+ examples | Moderate, requires expertise |
| **Language Support** | Python, JS, Go, Java SDKs | C++, .NET, Python (limited) |
| **WebSocket** | ✅ Simple JSON | ✅ Protocol Buffers |
| **Rate Limits** | 5-60 req/min (free) | None (within fair use) |
| **Support** | 7×24 chat (<15 min) | Business hours email |
| **Footprint Data** | ❌ Basic OHLCV only | ✅ Full orderflow |
| **Account Required** | ❌ Just API token | ✅ Brokerage account + KYC |
| **Best Use Case** | Analysis, monitoring, learning | Professional trading, HFT |

---

## Recommendation for Your Orderflow Terminal

### Choose **iTick API** if:
✅ You want to start **immediately** (no account setup)  
✅ You're on a **budget** (free tier available)  
✅ You need **price data and basic volume** for charts  
✅ You're building a **monitoring/analysis tool**  
✅ You don't need tick-by-tick precision  
✅ You prefer **simple REST/WebSocket JSON** APIs  

### Choose **AMP Futures + Rithmic** if:
✅ You need **true orderflow data** (footprint charts, delta)  
✅ You want **tick-by-tick precision** for scalping  
✅ You plan to **execute trades** programmatically  
✅ You need **Level 2 order book** depth  
✅ You're a **professional trader** or institution  
✅ Budget is **not a constraint** ($50-65+/month)  
✅ You have **development expertise** with Protocol Buffers  

---

## Hybrid Approach (Recommended for Most Users)

For your orderflow terminal, consider this strategy:

1. **Start with iTick API** (FREE)
   - Quick setup, immediate results
   - Get GC futures price data flowing
   - Build your charting and UI
   - Test your concepts

2. **Upgrade later if needed**
   - If you find you need tick-level precision
   - If you want to add live trading
   - If you need deeper orderbook data
   - Then migrate to Rithmic

3. **Use iTick for now because:**
   - Your current terminal uses Binance WebSocket (similar simplicity)
   - iTick has similar ease-of-use
   - You can swap data sources later without major rewrites
   - Free tier is sufficient for learning and development

---

## Quick Start with iTick API

### Step 1: Get Free API Token
Visit: https://itick.io/register  
No credit card required!

### Step 2: Test GC Futures Data
```bash
curl -X GET "https://api.itick.org/future/quotes?region=US&codes=GC" \
  -H "accept: application/json" \
  -H "token: YOUR_API_TOKEN"
```

### Step 3: Integrate into Your Terminal
Replace the Binance WebSocket connection in `order-flow-terminal.html` with iTick API calls.

---

## Conclusion

For most developers building orderflow terminals, **iTick API is the better starting point** due to:
- Zero cost barrier
- Immediate access
- Simpler integration
- Sufficient data quality for learning and analysis

**Rithmic/AMP Futures** is overkill unless you specifically need:
- Tick-level precision for HFT
- Live trade execution
- Professional-grade orderflow analytics
- And have the budget/expertise to support it

Start with iTick, validate your concept, then upgrade to Rithmic if your requirements grow.
