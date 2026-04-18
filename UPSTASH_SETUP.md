# Upstash Redis Setup for Order Flow Tracking

## Quick Setup

### Option 1: Create New Upstash Database (Recommended)

1. **Visit**: [https://console.upstash.io](https://console.upstash.io)
2. **Sign up** or log in
3. **Click "Create Database"**
4. **Choose settings**:
   - Name: `orderflow-redis`
   - Region: Choose closest to your users (e.g., `us-east-1`)
   - Provider: AWS, GCP, or Azure (doesn't matter much)
   - TLS: Enabled (default)
5. **Click "Create"**
6. **Copy the connection string** from the "Connect" tab:
   - Look for **"REST API"** section
   - Copy the URL that looks like: `https://xxx.us-east-1-1.upstash.io`
   - Copy the token below it

### Option 2: Use Existing Upstash (if you have one)

If you already have an Upstash database from another project, you can reuse it.

---

## Add to Vercel

Once you have your Upstash credentials:

```bash
cd /Users/mac/orderflow

# Add the REST URL (format: https://xxx.region.provider.upstash.io)
npx vercel env add UPSTASH_REDIS_REST_URL production

# Add the REST Token
npx vercel env add UPSTASH_REDIS_REST_TOKEN production
```

**Note**: The ioredis library uses a different format. Convert your credentials:

```
Format: rediss://default:TOKEN@HOST:6379

Example:
rediss://default:AbCdEfGhIjKlMnOpQrStUvWxYz@your-db-name.us-east-1-1.upstash.io:6379
```

So when Vercel asks for `UPSTASH_REDIS_URL`, construct it as:
```
rediss://default:<YOUR_TOKEN>@<YOUR_HOST>:6379
```

---

## Test Connection

After adding the environment variables and redeploying:

```bash
curl https://orderflow-flax.vercel.app/api/orderflow-status?symbol=BTCUSDT
```

Expected response:
```json
{
  "timestamp": 1234567890,
  "symbol": "BTCUSDT",
  "walls": [],
  "spoofs": [],
  "icebergs": [],
  "metrics": {
    "totalActiveWalls": 0,
    "spoofCount": 0,
    "icebergCount": 0
  }
}
```

---

## Troubleshooting

### Error: "Redis not configured"
- Check that `UPSTASH_REDIS_URL` is set in Vercel
- Verify the format is correct: `rediss://default:TOKEN@HOST:6379`

### Error: "Connection timeout"
- Check your Upstash database is active in the console
- Verify the region is accessible from Vercel

### Error: "Authentication failed"
- Double-check the token is correct
- Make sure you're using the REST token, not the CLI token

---

## Cost

Upstash has a **generous free tier**:
- 10,000 commands/day free
- 256 MB storage free
- Perfect for this use case (we only store ~60 seconds of data)

You likely won't pay anything unless you have massive traffic.
