#!/bin/bash

# =====================================================
# 2ndShift Deployment Script
# =====================================================

echo "🚀 2ndShift Deployment Script"
echo "=============================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if environment variables are set
check_env() {
    echo -e "\n${YELLOW}Checking environment variables...${NC}"
    
    required_vars=(
        "NEXT_PUBLIC_SUPABASE_URL"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
        "SUPABASE_SERVICE_ROLE_KEY"
        "RAZORPAY_KEY_ID"
        "RAZORPAY_KEY_SECRET"
    )
    
    missing=0
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            echo -e "${RED}❌ Missing: $var${NC}"
            missing=1
        else
            echo -e "${GREEN}✅ Set: $var${NC}"
        fi
    done
    
    if [ $missing -eq 1 ]; then
        echo -e "\n${RED}Please set all required environment variables before deploying.${NC}"
        echo "See .env.example for reference."
        exit 1
    fi
}

# Build the project
build() {
    echo -e "\n${YELLOW}Building project...${NC}"
    npm run build
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Build successful!${NC}"
    else
        echo -e "${RED}❌ Build failed. Please fix errors and try again.${NC}"
        exit 1
    fi
}

# Run type check
typecheck() {
    echo -e "\n${YELLOW}Running type check...${NC}"
    npx tsc --noEmit
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Type check passed!${NC}"
    else
        echo -e "${RED}❌ Type errors found. Please fix and try again.${NC}"
        exit 1
    fi
}

# Main deployment steps
main() {
    echo -e "\n${YELLOW}Starting deployment process...${NC}\n"
    
    # Step 1: Install dependencies
    echo "📦 Installing dependencies..."
    npm install
    
    # Step 2: Type check
    typecheck
    
    # Step 3: Build
    build
    
    # Step 4: Success message
    echo -e "\n${GREEN}=============================="
    echo "🎉 Deployment preparation complete!"
    echo "=============================="
    echo -e "${NC}"
    echo "Next steps:"
    echo "1. Push to GitHub: git push origin main"
    echo "2. Vercel will auto-deploy from main branch"
    echo ""
    echo "Or deploy manually:"
    echo "  npx vercel --prod"
    echo ""
    echo "Database setup:"
    echo "  1. Go to Supabase SQL Editor"
    echo "  2. Run: database/schema/complete_schema.sql"
    echo "  3. Run: database/migrations/shifts_and_subscriptions.sql"
    echo "  4. Run: database/migrations/innovative_features.sql"
    echo "  5. Run: database/migrations/payment_escrow_system.sql"
}

# Parse command line arguments
case "$1" in
    --check)
        check_env
        ;;
    --build)
        build
        ;;
    --typecheck)
        typecheck
        ;;
    *)
        main
        ;;
esac
