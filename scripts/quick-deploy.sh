#!/bin/bash

# 🚀 2ndShift Quick Deploy Script
# Run this after setting up Vercel and Supabase

echo "🚀 2ndShift Deployment Helper"
echo "=============================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git..."
    git init
    git add .
    git commit -m "Initial commit - 2ndShift platform"
fi

echo ""
echo "✅ Prerequisites Checklist:"
echo "   [ ] Supabase project created"
echo "   [ ] Razorpay account created"
echo "   [ ] Vercel account created"
echo ""

echo "📋 Environment Variables Needed:"
echo "================================="
echo ""
echo "Copy these to Vercel Dashboard → Settings → Environment Variables:"
echo ""
echo "NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here"
echo "SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here"
echo "RAZORPAY_KEY_ID=rzp_test_xxxxx"
echo "RAZORPAY_KEY_SECRET=your_razorpay_secret"
echo "NEXT_PUBLIC_APP_URL=https://your-domain.com"
echo ""

echo "📦 Database Setup:"
echo "=================="
echo ""
echo "Run these SQL files in Supabase SQL Editor (in order):"
echo "1. database/schema/complete_schema.sql"
echo "2. database/migrations/shifts_and_subscriptions.sql"  
echo "3. database/migrations/innovative_features.sql"
echo ""

echo "🔗 Quick Links:"
echo "==============="
echo "• Vercel: https://vercel.com/new"
echo "• Supabase: https://supabase.com/dashboard"
echo "• Razorpay: https://dashboard.razorpay.com"
echo ""

echo "📱 Next Steps:"
echo "=============="
echo "1. Push code to GitHub: git push origin main"
echo "2. Import repo in Vercel"
echo "3. Add environment variables"
echo "4. Deploy!"
echo ""

echo "🎉 You're ready to launch!"
