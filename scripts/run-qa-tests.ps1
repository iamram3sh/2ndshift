# Comprehensive QA Test Runner (PowerShell)

$PREVIEW_URL = if ($env:PREVIEW_URL) { $env:PREVIEW_URL } else { "https://2ndshift-git-revenue-system-v1-iamram3sh.vercel.app" }
$PROD_URL = if ($env:PROD_URL) { $env:PROD_URL } else { "https://2ndshift.vercel.app" }
$TEST_ENV = if ($env:TEST_ENV) { $env:TEST_ENV } else { "preview" }

if ($TEST_ENV -eq "production") {
    $TEST_URL = $PROD_URL
} else {
    $TEST_URL = $PREVIEW_URL
}

$TIMESTAMP = Get-Date -Format "yyyy-MM-dd-HHmmss"
$REPORT_DIR = "qa-reports\$TIMESTAMP"

New-Item -ItemType Directory -Force -Path "$REPORT_DIR\screenshots" | Out-Null
New-Item -ItemType Directory -Force -Path "$REPORT_DIR\playwright" | Out-Null
New-Item -ItemType Directory -Force -Path "$REPORT_DIR\lighthouse" | Out-Null

Write-Host "🚀 Starting Comprehensive QA Test Suite..." -ForegroundColor Cyan
Write-Host "📊 Test URL: $TEST_URL" -ForegroundColor Yellow
Write-Host "🌍 Environment: $TEST_ENV" -ForegroundColor Yellow
Write-Host "📁 Report Directory: $REPORT_DIR" -ForegroundColor Yellow
Write-Host ""

$env:TEST_URL = $TEST_URL
$env:TEST_ENV = $TEST_ENV

# Step 1: Smoke Tests
Write-Host "1️⃣ Running Smoke Tests..." -ForegroundColor Cyan
try {
    npx playwright test __tests__/e2e/qa-smoke.spec.ts --reporter=list,json --output-dir="$REPORT_DIR/playwright"
    Write-Host "✅ Smoke tests passed" -ForegroundColor Green
} catch {
    Write-Host "❌ Smoke tests failed - stopping" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Comprehensive Tests
Write-Host "2️⃣ Running Comprehensive QA Tests..." -ForegroundColor Cyan
try {
    npx playwright test __tests__/e2e/qa-comprehensive.spec.ts __tests__/e2e/qa-navigation.spec.ts __tests__/e2e/qa-commission-pricing.spec.ts `
        --reporter=html,json,list `
        --output-dir="$REPORT_DIR/playwright"
    Write-Host "✅ Comprehensive tests completed" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Some tests failed - continuing to generate report" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📁 Reports saved to: $REPORT_DIR" -ForegroundColor Cyan
