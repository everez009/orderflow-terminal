#!/bin/bash

echo "╔══════════════════════════════════════════════╗"
echo "║  Adding Supabase Credentials to Vercel      ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# New Supabase credentials
SUPABASE_URL="https://vtjtecfkehmapspqufyr.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0anRlY2ZrZWhtYXBzcHF1ZnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MjI4NTMsImV4cCI6MjA5MTk5ODg1M30.iHnMfltBrrg5LfxRnch0EWvPOxeCOvGT1dG6jxGJ9Oc"
SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0anRlY2ZrZWhtYXBzcHF1ZnlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQyMjg1MywiZXhwIjoyMDkxOTk4ODUzfQ.TOR31nbY3SPsAWoACV1caO2wu2SBq65HN5Cr4sIk24U"

echo "📋 Adding Supabase credentials:"
echo "   URL: $SUPABASE_URL"
echo "   Anon Key: [CONFIGURED]"
echo "   Service Key: [CONFIGURED]"
echo ""

# Add to production environment
echo "🔧 Adding to Vercel production environment..."
npx vercel env add NEXT_PUBLIC_SUPABASE_URL "$SUPABASE_URL" production --yes
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY "$SUPABASE_ANON_KEY" production --yes
npx vercel env add SUPABASE_SERVICE_ROLE_KEY "$SUPABASE_SERVICE_KEY" production --yes

echo ""
echo "✅ Environment variables added!"
echo ""
echo "🚀 Redeploying to apply changes..."
npx vercel --prod --yes

echo ""
echo "✨ Done! Trade journal will now sync to Supabase"
echo "   https://orderflow-terminal.vercel.app"
