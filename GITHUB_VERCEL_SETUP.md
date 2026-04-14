# GitHub + Vercel Deployment Setup Guide

## 🎯 Overview

This guide will help you set up automatic deployment from GitHub to Vercel for your Order Flow Terminal v4.

## ✅ What's Already Done

I've already configured your project with:
- ✅ Next.js project structure
- ✅ package.json with dependencies
- ✅ next.config.js for routing
- ✅ TypeScript configuration
- ✅ .gitignore file
- ✅ README.md
- ✅ Git repository initialized
- ✅ Initial commit created

## 📋 Setup Steps

### Step 1: Create GitHub Repository

1. Go to **https://github.com/new**
2. Fill in the details:
   - **Repository name:** `orderflow-terminal`
   - **Description:** `Real-time Order Flow Analysis Terminal`
   - **Visibility:** Public (or Private if you prefer)
   - **DO NOT** check "Initialize with README" (we already have one)
3. Click **"Create repository"**

### Step 2: Push Code to GitHub

Run this command in your terminal:

```bash
cd /Users/mac/orderflow
./setup-github-vercel.sh
```

Or manually:

```bash
cd /Users/mac/orderflow
git remote set-url origin git@github.com:everez009/orderflow-terminal.git
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Go to **https://vercel.com/new**
2. Sign in with your GitHub account (if not already signed in)
3. Click **"Import Git Repository"** or **"Add New Project"**
4. Find and select **"orderflow-terminal"** from your repositories
5. Configure the deployment:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `next build` (should auto-detect)
   - **Output Directory:** `.next` (should auto-detect)
   - **Install Command:** `npm install` (should auto-detect)
6. Click **"Deploy"**

### Step 4: Get Your Vercel URL

After deployment completes (usually 1-2 minutes), Vercel will give you a URL like:
```
https://orderflow-terminal.vercel.app
```

Your orderflow.html file will be accessible at:
```
https://orderflow-terminal.vercel.app/orderflow.html
```

## 🔄 How to Update in the Future

Every time you make changes to orderflow_1304262038-v4.html:

### Option 1: Quick Update (Recommended)

```bash
cd /Users/mac/orderflow
cp orderflow_1304262038-v4.html public/orderflow.html
git add public/orderflow.html
git commit -m "Update orderflow terminal"
git push
```

Vercel will automatically detect the push and redeploy!

### Option 2: Using the Deploy Script

```bash
cd /Users/mac/orderflow
./deploy-v4.sh  # This uploads to DigitalOcean
# Then also push to GitHub:
git add public/orderflow.html
git commit -m "Update orderflow terminal"
git push
```

## 🌐 Access Points

After setup, you'll have TWO ways to access your terminal:

1. **Vercel (Auto-deployed):**
   ```
   https://orderflow-terminal.vercel.app/orderflow.html
   ```
   - ✅ Automatic deployment on every push
   - ✅ Global CDN
   - ✅ HTTPS enabled
   - ✅ Easy to share

2. **DigitalOcean (Manual):**
   ```
   http://165.22.55.118:8080/orderflow_1304262038-v4.html
   ```
   - ✅ Full control
   - ✅ No build process
   - ⚠️ Manual upload required

## 🎨 Customization

### Change the Default Route

If you want `/` to show the orderflow terminal instead of requiring `/orderflow.html`:

Edit `next.config.js`:
```javascript
async rewrites() {
  return [
    {
      source: '/',
      destination: '/orderflow.html',
    },
  ];
},
```

This is already configured!

### Add Custom Domain on Vercel

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow the DNS configuration instructions

## 🐛 Troubleshooting

### Build Fails on Vercel

Check the build logs in Vercel dashboard. Common issues:
- Missing dependencies → Check package.json
- TypeScript errors → Check tsconfig.json
- File path issues → Ensure public/orderflow.html exists

### Changes Not Showing

1. Clear browser cache (Cmd+Shift+R on Mac)
2. Check Vercel deployment status (should be "Ready")
3. Verify the commit was pushed to GitHub

### Git Push Fails

```bash
# Re-authenticate with GitHub
git remote set-url origin git@github.com:everez009/orderflow-terminal.git
git push -u origin main
```

## 📊 Monitoring

- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Repository:** https://github.com/everez009/orderflow-terminal
- **Deployment Logs:** Available in Vercel project dashboard

## 🚀 Benefits of This Setup

✅ **Automatic Deployments** - Every push to main branch triggers deployment  
✅ **Version Control** - Full history of all changes  
✅ **Easy Rollbacks** - Revert to any previous version on Vercel  
✅ **Global CDN** - Fast loading worldwide  
✅ **HTTPS** - Secure by default  
✅ **Preview Deployments** - Test changes on pull requests  
✅ **Analytics** - Track usage via Vercel  

---

**Need Help?** Check the Vercel documentation: https://vercel.com/docs
