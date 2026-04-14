#!/bin/bash

# Setup GitHub Repository and Vercel Deployment

echo "🚀 Setting up Order Flow Terminal for GitHub + Vercel deployment"
echo ""
echo "Step 1: Create GitHub Repository"
echo "-----------------------------------"
echo "Please create a new public repository on GitHub:"
echo "1. Go to https://github.com/new"
echo "2. Repository name: orderflow-terminal"
echo "3. Description: Real-time Order Flow Analysis Terminal"
echo "4. Make it Public"
echo "5. DO NOT initialize with README (we already have one)"
echo "6. Click 'Create repository'"
echo ""
read -p "Press Enter after you've created the repository..."

echo ""
echo "Step 2: Push to GitHub"
echo "----------------------"
cd /Users/mac/orderflow
git remote set-url origin git@github.com:everez009/orderflow-terminal.git
git push -u origin main

echo ""
echo "Step 3: Deploy to Vercel"
echo "------------------------"
echo "1. Go to https://vercel.com/new"
echo "2. Click 'Import Git Repository'"
echo "3. Select 'orderflow-terminal' from your GitHub repositories"
echo "4. Framework Preset: Next.js"
echo "5. Root Directory: ./ (leave as is)"
echo "6. Build Command: next build"
echo "7. Output Directory: .next"
echo "8. Click 'Deploy'"
echo ""
echo "After deployment, Vercel will give you a URL like:"
echo "https://orderflow-terminal.vercel.app"
echo ""
echo "✅ Setup complete! Your project will auto-deploy on every push to main branch."
