#!/bin/bash
# Comprehensive QA Test Runner

set -e

PREVIEW_URL="${PREVIEW_URL:-https://2ndshift-git-revenue-system-v1-iamram3sh.vercel.app}"
PROD_URL="${PROD_URL:-https://2ndshift.vercel.app}"
TEST_ENV="${TEST_ENV:-preview}"

if [ "$TEST_ENV" = "production" ]; then
  TEST_URL="$PROD_URL"
else
  TEST_URL="$PREVIEW_URL"
fi

TIMESTAMP=$(date +%Y-%m-%d-%H%M%S)
REPORT_DIR="qa-reports/$TIMESTAMP"

mkdir -p "$REPORT_DIR/screenshots"
mkdir -p "$REPORT_DIR/playwright"
mkdir -p "$REPORT_DIR/lighthouse"

echo "🚀 Starting Comprehensive QA Test Suite..."
echo "📊 Test URL: $TEST_URL"
echo "🌍 Environment: $TEST_ENV"
echo "📁 Report Directory: $REPORT_DIR"
echo ""

export TEST_URL
export TEST_ENV

# Step 1: Smoke Tests
echo "1️⃣ Running Smoke Tests..."
if npx playwright test __tests__/e2e/qa-smoke.spec.ts --reporter=list,json --output-dir="$REPORT_DIR/playwright"; then
  echo "✅ Smoke tests passed"
else
  echo "❌ Smoke tests failed - stopping"
  exit 1
fi

echo ""

# Step 2: Comprehensive Tests
echo "2️⃣ Running Comprehensive QA Tests..."
npx playwright test __tests__/e2e/qa-comprehensive.spec.ts __tests__/e2e/qa-navigation.spec.ts __tests__/e2e/qa-commission-pricing.spec.ts \
  --reporter=html,json,list \
  --output-dir="$REPORT_DIR/playwright" || true

echo ""
echo "✅ Tests completed"
echo "📁 Reports saved to: $REPORT_DIR"
