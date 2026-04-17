#!/bin/bash

echo "╔══════════════════════════════════════════════╗"
echo "║  Adding Supabase Credentials to Vercel      ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# Supabase credentials from signal-analyzer project
SUPABASE_URL="https://xhribnozqrdgqvmdzbck.supabase.co"
SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4aHJpYm5venFyZGdxdm1kemJjayIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE3NzM0Njc2MDgsImV4cCI6MjA4OTA0MzYwOH0.wJ76Tm2ZBrFRm_fy4Tyx_j4MrINJHYxNIUeXYTtZjeQ"

echo "📋 Found Supabase credentials:"
echo "   URL: $SUPABASE_URL"
echo "   Service Key: [HIDDEN]"
echo ""
echo "⚠️  You need to get the ANON key from:"
echo "   https://supabase.com/dashboard/project/xhribnozqrdgqvmdzbck/settings/api"
echo ""
read -p "Enter your SUPABASE ANON KEY: " SUPABASE_ANON_KEY

if [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ Anon key is required!"
    exit 1
fi

echo ""
echo "🔧 Adding environment variables to Vercel..."
echo ""

# Add to production
npx vercel env add NEXT_PUBLIC_SUPABASE_URL "$SUPABASE_URL" production
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY "$SUPABASE_ANON_KEY" production  
npx vercel env add SUPABASE_SERVICE_ROLE_KEY "$SUPABASE_SERVICE_KEY" production

echo ""
echo "✅ Environment variables added!"
echo ""
echo "🚀 Redeploying to apply changes..."
npx vercel --prod --yes

echo ""
echo "✨ Done! Check your deployment at:"
echo "   https://orderflow-terminal.vercel.app"
