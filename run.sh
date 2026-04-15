#!/bin/bash

echo "╔══════════════════════════════════════════╗"
echo "║   OrderFlow Terminal v4 - Setup & Run    ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env.local is configured
if grep -q "your-project.supabase.co" .env.local || [ -z "$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d'=' -f2)" ]; then
    echo "⚠️  Supabase not configured yet!"
    echo ""
    echo "Choose an option:"
    echo "1. Use mock mode (no database, localStorage only)"
    echo "2. Setup Supabase (recommended for full features)"
    echo ""
    read -p "Enter choice (1 or 2): " choice
    
    if [ "$choice" = "1" ]; then
        echo ""
        echo "✅ Running in mock mode (localStorage only)"
        echo "   - Trades will be saved to browser localStorage"
        echo "   - No database required"
        echo ""
    else
        echo ""
        echo "📋 To setup Supabase:"
        echo "   1. Go to https://supabase.com and create a project"
        echo "   2. Copy your Project URL and Anon Key"
        echo "   3. Update .env.local with your credentials"
        echo "   4. Run the SQL from supabase-schema.sql in Supabase SQL Editor"
        echo ""
        read -p "Press Enter when ready to continue..."
    fi
fi

echo "🚀 Starting OrderFlow Terminal..."
echo ""
npm run dev
