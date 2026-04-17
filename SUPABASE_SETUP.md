# Supabase Integration Setup Guide

## Overview
The OrderFlow Terminal now has Supabase integration for persistent storage of:
- ✅ Trade Journal (all trades with P&L tracking)
- ✅ Volume Profile data (session-based)
- ✅ User settings and preferences

## Current Status
- ✅ Supabase client configured in `lib/supabase.ts`
- ✅ API routes created (`/api/trades`, `/api/volume-profile`)
- ✅ Database schema ready (`supabase-schema.sql`)
- ⚠️ **Action Required**: You need to set up your own Supabase project

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Choose your organization
4. Set project name: `orderflow-terminal`
5. Set database password (save it!)
6. Choose region closest to you
7. Wait for project to be created (~2 minutes)

## Step 2: Get Your Credentials

After project creation:
1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbG...` (starts with eyJ)
   - **service_role key**: `eyJhbG...` (keep this secret!)

## Step 3: Run Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the contents of `supabase-schema.sql` from this repo
4. Paste and click **Run**
5. Verify tables created: `trades` and `volume_profiles`

## Step 4: Update Environment Variables

### Option A: Vercel Dashboard (Recommended)

1. Go to https://vercel.com/realedesigns-3159s-projects/orderflow-terminal/settings/environment-variables
2. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

3. Set all to **Production** environment
4. Click **Save**
5. Redeploy: `npx vercel --prod --yes`

### Option B: Edit .env.production

Edit `.env.production` file with your credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Then commit and push:
```bash
git add .env.production
git commit -m "Update Supabase credentials"
git push
npx vercel --prod --yes
```

⚠️ **WARNING**: Never commit `.env.production` to Git if it contains real keys!

## Step 5: Verify Integration

Test the API endpoints:

```bash
# Check health
curl https://orderflow-terminal.vercel.app/api/health

# Test trades endpoint
curl https://orderflow-terminal.vercel.app/api/trades

# Should return: []
```

## How It Works

### Trade Journal Flow

1. **User makes a trade** in the terminal
2. **JavaScript saves to localStorage** (immediate, offline)
3. **API call to `/api/trades`** (background sync to Supabase)
4. **Data persisted in cloud** (accessible from any device)

### Current Limitation

The HTML file currently uses **localStorage only**. To enable Supabase sync:

**Option 1**: Convert HTML to Next.js React app (recommended for full integration)
**Option 2**: Add Supabase CDN script to HTML and make direct calls
**Option 3**: Keep localStorage + periodic API sync (hybrid approach)

## Recommended: Hybrid Approach

Add this to `orderflow_1304262038-v4.html`:

```javascript
// After saving to localStorage, also sync to Supabase
async function syncTradeToSupabase(trade) {
  try {
    await fetch('/api/trades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trade)
    });
    console.log('✅ Trade synced to Supabase');
  } catch (err) {
    console.error('❌ Sync failed:', err);
  }
}

// Call this after every trade
syncTradeToSupabase(newTrade);
```

## Testing Locally

```bash
cd /Users/mac/orderflow
npm run dev
# Open http://localhost:3011
```

## Troubleshooting

### Error: "Invalid API key"
- Check that `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Verify it's the **anon** key, not service_role

### Error: "Relation 'trades' does not exist"
- Run the `supabase-schema.sql` in Supabase SQL Editor
- Check table names match exactly

### CORS Errors
- API routes handle CORS automatically
- Make sure you're calling `/api/trades` not direct Supabase

## Support

For issues:
1. Check Vercel logs: https://vercel.com/realedesigns-3159s-projects/orderflow-terminal
2. Check Supabase logs: Dashboard → Logs → Postgres Logs
3. Test API directly: `curl https://orderflow-terminal.vercel.app/api/health`
