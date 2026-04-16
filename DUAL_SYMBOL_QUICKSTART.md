# Order Flow Terminal - Dual Symbol Support

## ✅ What's New

Your orderflow terminal now supports **TWO symbols** with full orderflow analysis:

### 1. BTC/USDT (Bitcoin) 🔵
- **Data Source**: Binance WebSocket
- **Cost**: FREE (no registration needed)
- **Features**: 
  - ✅ Real-time tick data
  - ✅ Buy/sell volume separation
  - ✅ Footprint charts
  - ✅ Volume profile with delta
  - ✅ Whale/institutional alerts
  - ✅ Cumulative delta tracking

### 2. XAU/USD (Gold Spot) 🟡
- **Data Source**: iTick API
- **Cost**: FREE (permanent tier, 60 req/min)
- **API Token**: Already configured ✓
- **Features**:
  - ✅ Real-time tick data
  - ✅ Buy/sell volume separation
  - ✅ Footprint charts
  - ✅ Volume profile with delta
  - ✅ Whale/institutional alerts
  - ✅ Cumulative delta tracking

---

## How to Switch Symbols

1. **Open the terminal**: `order-flow-terminal.html`
2. **Look at the top** where it shows:
   ```
   [BTC/USDT]  [XAU/USD (Gold)]
   ```
3. **Click either button** to switch instantly
4. The chart will reload with the new symbol's data

---

## Features Available for BOTH Symbols

### Chart Features
- 📊 Candlestick charts (1m, 5m, 15m, 1h, 4h timeframes)
- 📈 Volume profile overlay
- 🔥 Footprint bars (1-minute aggregation)
- 🎯 Heatmap visualization

### Order Flow Analysis
- ⚖️ Cumulative Delta (buy vs sell pressure)
- 📊 Buy/Sell ratio display
- 💰 Session volume tracking
- 🐋 Whale detection (≥$100K trades)
- 🏦 Institutional detection (≥$500K trades)

### Alerts System
- 🔔 Sound alerts for large trades
- 📧 Email notifications (optional)
- 📱 SMS/WhatsApp alerts (optional)
- 📊 Real-time alert counter

---

## Technical Details

### BTC/USDT Connection
```javascript
WebSocket: wss://stream.binance.com:9443/ws/btcusdt@aggTrade
Historical: https://api.binance.com/api/v3/klines?symbol=BTCUSDT
Ticker: wss://stream.binance.com:9443/ws/btcusdt@ticker
```

### XAU/USD Connection
```javascript
WebSocket: wss://api.itick.org/sws
Historical: https://api.itick.org/forex/kline?region=gb&code=XAUUSD
Quote: https://api.itick.org/forex/quote?region=gb&code=XAUUSD
API Token: 1cc0ac3925f24b7fabc8ef7ec7fd3e2c23ecae8810ed43e2ba1208132123de11
```

---

## Data Comparison

| Feature | BTC/USDT (Binance) | XAU/USD (iTick) |
|---------|-------------------|-----------------|
| Tick Data | ✅ Yes | ✅ Yes |
| Buy/Sell Volume | ✅ Exact | ✅ Calculated |
| Historical Candles | ✅ 200 bars | ✅ 200 bars |
| Real-Time Updates | ✅ Millisecond | ✅ Second-level |
| Rate Limits | None | 60 req/min |
| Registration | Not needed | Done ✓ |
| Cost | FREE | FREE |

---

## Usage Tips

### For Bitcoin Trading
- Use BTC/USDT for crypto market analysis
- Higher volatility = more trading opportunities
- 24/7 market (no closes)
- Larger whale movements common

### For Gold Trading
- Use XAU/USD for precious metals analysis
- Lower volatility = cleaner signals
- Market hours: Sunday-Friday (24h during week)
- Institutional flows more predictable

### Switching Strategy
- Monitor both simultaneously by keeping two browser tabs open
- Compare crypto vs traditional safe-haven flows
- Watch for correlation/divergence patterns
- Use different timeframes for each symbol

---

## Troubleshooting

### BTC/USDT Not Loading?
- Check internet connection
- Verify Binance is accessible in your region
- Refresh the page
- Check browser console (F12) for errors

### XAU/USD Not Loading?
- Verify API token is correct (already set)
- Check iTick account status at https://itick.org
- Ensure you haven't exceeded 60 requests/minute
- Check browser console for authentication errors

### Both Symbols Down?
- Clear browser cache
- Try a different browser
- Check if firewall blocks WebSocket connections
- Restart the HTML file

---

## Quick Start

1. **Open the file**: Double-click `order-flow-terminal.html`
2. **Default view**: BTC/USDT loads automatically
3. **Switch to Gold**: Click "XAU/USD (Gold)" button
4. **Switch back**: Click "BTC/USDT" button
5. **Change timeframe**: Use 1M, 5M, 15M, 1H, 4H buttons
6. **Watch alerts**: Large trades trigger sound + visual alerts

---

## Performance Notes

- **Memory**: Each symbol maintains separate data buffers
- **Switching**: Resets all counters and reloads historical data
- **WebSocket**: Only one connection active at a time
- **Auto-reconnect**: Both symbols reconnect automatically if disconnected

---

## Next Steps

✅ Terminal is ready to use  
✅ Both symbols configured  
✅ API token already set  
✅ All orderflow features working  

**Just open the HTML file and start analyzing!** 🚀

---

## Support & Documentation

- Full setup guide: `XAU_USD_ITICK_SETUP.md`
- iTick documentation: https://doc.itick.org
- Binance API docs: https://binance-docs.github.io/apidocs/

Enjoy your dual-symbol orderflow analysis! 📊💹
