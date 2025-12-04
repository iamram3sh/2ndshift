# QA Test Runner - PowerShell
$ErrorActionPreference = "Stop"

$TEST_URL = if ($env:TEST_URL) { $env:TEST_URL } else { "https://2ndshift.vercel.app" }
$TIMESTAMP = Get-Date -Format "yyyy-MM-dd-HHmmss"
$REPORT_DIR = "qa-reports\$TIMESTAMP"

Write-Host "🚀 Starting QA Test Suite..." -ForegroundColor Cyan
Write-Host "📊 Test URL: $TEST_URL" -ForegroundColor Yellow
Write-Host "📁 Report Directory: $REPORT_DIR" -ForegroundColor Yellow
Write-Host ""

New-Item -ItemType Directory -Force -Path "$REPORT_DIR\screenshots" | Out-Null
New-Item -ItemType Directory -Force -Path "$REPORT_DIR\playwright" | Out-Null

$env:TEST_URL = $TEST_URL

# Run smoke tests
Write-Host "1️⃣ Running Smoke Tests..." -ForegroundColor Cyan
npx playwright test __tests__/e2e/qa-smoke.spec.ts --reporter=list,json --output-dir="$REPORT_DIR/playwright"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Smoke tests failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Smoke tests passed" -ForegroundColor Green
Write-Host ""

# Run comprehensive tests
Write-Host "2️⃣ Running Comprehensive Tests..." -ForegroundColor Cyan
npx playwright test __tests__/e2e/qa-comprehensive.spec.ts __tests__/e2e/qa-navigation.spec.ts __tests__/e2e/qa-commission-pricing.spec.ts --reporter=html,json,list --output-dir="$REPORT_DIR/playwright"

Write-Host ""
Write-Host "📁 Reports saved to: $REPORT_DIR" -ForegroundColor Cyan
