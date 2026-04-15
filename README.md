# OrderFlow Terminal v4.0

Real-time order flow analysis terminal with trade management, volume profiling, and advanced signal detection.

## Quick Start

### Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3011 in your browser.

## Features

✅ **Real-time Market Data** - Live PAXG/USDT and BTC/USDT data from Binance  
✅ **Order Flow Analysis** - Volume profile, footprint charts, heatmap visualization  
✅ **Trade Journal** - Track all trades with automatic SL/TP calculation  
✅ **Performance Analytics** - Win rate, profit factor, average win/loss  
✅ **Multiple Trading Modes** - Scalping, Day Trading, Swing Trading  
✅ **HTF Bias Detection** - Higher timeframe trend analysis  
✅ **Smart Alerts** - Whale and institutional activity detection  
✅ **Mobile Responsive** - Works on all devices  

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   Browser   │◄───────►│   Next.js    │◄───────►│   Binance    │
│  (Client)   │  HTTP   │   (Vercel)   │  API    │   (Market    │
└─────────────┘         └──────┬───────┘         │    Data)     │
                               │                  └──────────────┘
                        ┌──────▼───────┐
                        │   Supabase   │
                        │  (Database)  │
                        └──────────────┘
```

## Database Setup (Optional)

The app works with localStorage by default. For multi-device sync and persistence:

### 1. Create Supabase Project

1. Go to https://supabase.com
2. Create new project
3. Copy Project URL and Anon Key

### 2. Setup Database

In Supabase SQL Editor, run the SQL from `supabase-schema.sql`:

```sql
-- Copy and paste contents of supabase-schema.sql
```

### 3. Configure Environment

Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Restart App

```bash
npm run dev
```

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Or connect your GitHub repo at https://vercel.com/new

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/trades` - Get all trades
- `POST /api/trades` - Create new trade
- `PUT /api/trades/[id]` - Update/close trade
- `DELETE /api/trades/[id]` - Delete trade
- `GET /api/stats` - Get trading statistics
- `GET /api/volume-profile?symbol=PAXGUSDT` - Get volume profile
- `POST /api/volume-profile?symbol=PAXGUSDT` - Save volume profile

## Trading Modes

### ⚡ Scalping
- Fast signals, lower threshold
- Requires 1+ optional conditions
- Alert at 20%+ pass rate
- Best for: M1/M5 timeframes

### 📊 Day Trading (Default)
- Balanced signals, moderate frequency
- Requires 2+ optional conditions
- Alert at 40%+ pass rate
- Best for: M5/M15 timeframes

### 🎯 Swing Trading
- High quality signals, fewer trades
- Requires 3+ optional conditions
- Alert at 60%+ pass rate
- Best for: H1/H4 timeframes

## Troubleshooting

### App won't start
```bash
rm -rf node_modules .next
npm install
npm run dev
```

### Supabase connection errors
- Check `.env.local` has correct credentials
- Verify tables exist in Supabase
- Check Supabase logs for errors

### No market data
- Check internet connection
- Binance API may be rate limited (wait 1 minute)
- Try switching symbols (PAXG ↔ BTC)

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Charts**: Lightweight Charts by TradingView
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Market Data**: Binance API

## License

MIT
