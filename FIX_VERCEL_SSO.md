# Fix Vercel SSO Authentication Issue

## Problem
Your Vercel deployment is showing a 401 Unauthorized error because SSO (Single Sign-On) authentication is enabled on your Vercel team/organization.

## Solution Options

### Option 1: Disable SSO Protection (Recommended)

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard

2. **Select Your Project:** Click on `orderflow-terminal`

3. **Go to Settings:**
   - Click "Settings" tab at the top
   - Click "General" in the left sidebar

4. **Disable SSO:**
   - Scroll down to "Security & Privacy" or "SSO Protection"
   - Toggle OFF "SSO Protection" or "Password Protection"
   - Save changes

5. **Wait 1-2 minutes** for the change to take effect

6. **Test your URL again:**
   ```
   https://orderflow-terminal-m8k4vhxbt-realedesigns-3159s-projects.vercel.app/orderflow.html
   ```

---

### Option 2: Deploy to Personal Account (Not Team)

If you can't disable SSO on the team account:

1. **Leave the team project** or create a new deployment on your personal account

2. **Go to:** https://vercel.com/new

3. **Make sure you're on your PERSONAL account** (not a team)
   - Check the account selector at the top

4. **Import the repository again:**
   - Select `everez009/orderflow-terminal`
   - Deploy to personal account

5. **You'll get a new URL** like:
   ```
   https://orderflow-terminal.vercel.app
   ```

---

### Option 3: Use Vercel CLI with Personal Account

```bash
# Install Vercel CLI
npm install -g vercel

# Login with personal account
vercel login

# Link to your project
cd /Users/mac/orderflow
vercel link

# Deploy to production
vercel --prod
```

---

## Quick Fix Checklist

- [ ] Go to Vercel Dashboard
- [ ] Select `orderflow-terminal` project
- [ ] Go to Settings → General
- [ ] Find "SSO Protection" or "Password Protection"
- [ ] Turn it OFF
- [ ] Save changes
- [ ] Wait 1-2 minutes
- [ ] Test the URL

---

## After Fixing

Once SSO is disabled, your URL should work:
```
https://orderflow-terminal-m8k4vhxbt-realedesigns-3159s-projects.vercel.app/orderflow.html
```

Or if you redeploy to personal account:
```
https://orderflow-terminal.vercel.app/orderflow.html
```

---

## Why This Happens

Vercel enables SSO protection by default for team/organization accounts to protect internal projects. Since your orderflow terminal is meant to be public, you need to disable this protection.

---

## Need Help?

If you still have issues:
1. Check Vercel's docs: https://vercel.com/docs/security/deployment-protection
2. Contact Vercel support through their dashboard
3. Or deploy to your personal account instead of team
