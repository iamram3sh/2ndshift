#!/bin/bash
# Quick deployment script for 2ndShift Platform

echo "🚀 Deploying 2ndShift to Vercel..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel
echo "🔐 Login to Vercel..."
vercel login

# Deploy to production
echo "🚀 Deploying to production..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "📝 Your site is now live!"
echo ""
echo "Next steps:"
echo "1. Go to your Vercel dashboard"
echo "2. Add environment variables (if not already added)"
echo "3. Test your live site"
echo ""
