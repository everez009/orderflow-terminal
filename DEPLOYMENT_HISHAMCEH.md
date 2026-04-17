# Deployment Guide - HishamCeh Vercel Project

## Current Status
✅ GitHub repo connected to Vercel (hishamceh-5204s-projects)
✅ Auto-deployment enabled on push to main branch
✅ Latest commit: `da4d97e` - 3+ star filter for notifications

## How It Works

### Automatic Deployment
Every time you push to the `main` branch on GitHub, Vercel will automatically:
1. Detect the change
2. Build the Next.js app
3. Deploy to production
4. Update: https://orderflow-terminal-git-main-hishamceh-5204s-projects.vercel.app

### Manual Trigger (if needed)
If auto-deployment doesn't trigger:
1. Go to https://vercel.com/hishamceh-5204s-projects/orderflow-terminal
2. Click **Deployments** tab
3. Click **Redeploy** on the latest commit

## Environment Variables Setup

You need to add these environment variables in Vercel Dashboard:

### Required for Supabase Integration:
1. Go to: **Settings** → **Environment Variables**
2. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

3. Set all to **Production**, **Preview**, and **Development** environments
4. Click **Save**

### Optional (for notifications):
Add Telegram/WhatsApp config if you want cloud-based notifications:
```
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
WHATSAPP_NUMBER=your-number
WHATSAPP_KEY=your-key
```

## Verify Deployment

After pushing code, check:
1. **Build Status**: https://vercel.com/hishamceh-5204s-projects/orderflow-terminal/deployments
2. **Live URL**: https://orderflow-terminal-git-main-hishamceh-5204s-projects.vercel.app
3. **API Health**: https://orderflow-terminal-git-main-hishamceh-5204s-projects.vercel.app/api/health

## Recent Changes Deployed

### Latest Update (da4d97e)
- ✅ Filter Telegram/WhatsApp notifications to 3+ star signals only
- ✅ 1-2 star signals still show on chart but don't send notifications
- ✅ Whale/institutional alerts continue to send (not filtered by stars)

### Previous Updates
- Larger font sizes (18px base)
- Collapsible mobile panels
- Full page scrolling on mobile
- Alert drag & drop functionality
- M5 default timeframe

## Troubleshooting

### Auto-deployment not triggering?
1. Check GitHub webhook: Repo Settings → Webhooks
2. Verify Vercel GitHub integration is active
3. Try making a small commit to trigger it

### Build fails?
1. Check build logs in Vercel dashboard
2. Verify `package.json` dependencies are correct
3. Ensure `vercel.json` configuration is present

### Environment variables not working?
1. Redeploy after adding env vars (they don't apply retroactively)
2. Check variable names match exactly (case-sensitive)
3. Verify they're set for the correct environment

## Quick Commands

```bash
# Make changes, then:
git add .
git commit -m "Your changes"
git push

# Vercel will auto-deploy within 1-2 minutes
```

## Support

- Vercel Dashboard: https://vercel.com/hishamceh-5204s-projects/orderflow-terminal
- GitHub Repo: https://github.com/everez009/orderflow-terminal
- Build Logs: Check Deployments tab in Vercel
