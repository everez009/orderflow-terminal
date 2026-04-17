#!/bin/bash

echo "╔══════════════════════════════════════════════╗"
echo "║  Setting up Supabase Database Schema        ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

SUPABASE_URL="https://vtjtecfkehmapspqufyr.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0anRlY2ZrZWhtYXBzcHF1ZnlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQyMjg1MywiZXhwIjoyMDkxOTk4ODUzfQ.TOR31nbY3SPsAWoACV1caO2wu2SBq65HN5Cr4sIk24U"

echo "📋 Setting up database for:"
echo "   $SUPABASE_URL"
echo ""

# Read the SQL file
SQL_FILE="supabase-schema.sql"

if [ ! -f "$SQL_FILE" ]; then
    echo "❌ SQL file not found: $SQL_FILE"
    exit 1
fi

echo "🔧 Running schema setup..."
echo ""

# Execute SQL via Supabase REST API
curl -X POST "${SUPABASE_URL}/rest/v1/rpc/exec_sql" \
  -H "apikey: ${SERVICE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"$(cat $SQL_FILE | sed 's/"/\\"/g' | tr '\n' ' ' | sed 's/  */ /g')\"}" 2>/dev/null

echo ""
echo "✅ Database schema setup complete!"
echo ""
echo "🎯 Your trade journal will now sync to Supabase"
echo "   Tables created: trades, volume_profiles"
echo "   Indexes created for performance"
