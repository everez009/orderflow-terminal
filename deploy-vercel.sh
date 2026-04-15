#!/bin/bash

echo "╔══════════════════════════════════════════╗"
echo "║   Deploying OrderFlow Terminal to Vercel ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🚀 Building and deploying..."
echo ""

# Deploy to production
vercel --prod --yes

echo ""
echo "✅ Deployment complete!"
echo "📊 Check the URL above to access your app"
