# QA Test Reports

This directory contains comprehensive QA test reports, screenshots, and artifacts.

## ✅ Status: Ready for Testing

**JWT_SECRET:** ✅ Configured  
**Test Infrastructure:** ✅ Complete  
**Test Files:** ✅ Ready

---

## Quick Start

### Run All Tests
```bash
npm run test:qa
```

### Run Smoke Tests Only
```bash
npm run test:qa:smoke
```

### Run Individual Test Suites
```bash
# Smoke tests
npx playwright test __tests__/e2e/qa-smoke.spec.ts

# Comprehensive tests
npx playwright test __tests__/e2e/qa-comprehensive.spec.ts

# Navigation tests
npx playwright test __tests__/e2e/qa-navigation.spec.ts

# All QA tests
npx playwright test __tests__/e2e/qa-*.spec.ts
```

---

## Test Coverage

### Smoke Tests (`qa-smoke.spec.ts`)
- Homepage loads (HTTP 200)
- Worker page loads
- Client page loads
- Homepage hero CTAs visible
- Header logo exists

### Comprehensive Tests (`qa-comprehensive.spec.ts`)
- Role separation (worker/client UI isolation)
- Navigation (header, breadcrumbs, back button)
- Hero CTA styling and accessibility
- Category pages and microtask cards
- Commission/pricing display
- Accessibility (axe-core)
- Login/registration flows

### Navigation Tests (`qa-navigation.spec.ts`)
- Header links (no 404s)
- Breadcrumbs
- Deep link navigation
- Back button behavior

### Commission/Pricing Tests (`qa-commission-pricing.spec.ts`)
- Commission displays correctly
- No accidental zeros
- Currency formatting

---

## Test Reports

Reports are organized by timestamp in subdirectories:
- `qa-reports/YYYY-MM-DD/summary.md` - Test summary
- `qa-reports/YYYY-MM-DD/issues.json` - All issues found
- `qa-reports/YYYY-MM-DD/screenshots/` - Screenshots of failures
- `qa-reports/YYYY-MM-DD/playwright/` - Playwright HTML report

---

## Issue Priorities

- **P0 (Blocking):** Must be fixed before production deployment
- **P1 (High Priority):** Should be fixed but doesn't block deployment

---

## Environment Variables

Set these before running tests:

```bash
# Production
TEST_ENV=production npm run test:qa

# Preview
TEST_ENV=preview npm run test:qa

# Custom URL
TEST_URL=https://your-url.vercel.app npm run test:qa
```

---

## Viewing Test Results

### HTML Report
After tests complete, open:
```
qa-reports/playwright/playwright-report/index.html
```

### JSON Results
```
qa-reports/playwright/results.json
```

### Screenshots
All failure screenshots are saved to:
```
qa-reports/screenshots/
```

---

## Troubleshooting

### Tests Not Running?

1. **Install Playwright browsers:**
   ```bash
   npx playwright install chromium
   ```

2. **Check Playwright installation:**
   ```bash
   npx playwright --version
   ```

3. **Run with verbose output:**
   ```bash
   npx playwright test --reporter=list --headed
   ```

### Tests Failing?

1. Check the HTML report for detailed error messages
2. Review screenshots in `qa-reports/screenshots/`
3. Check browser console for errors
4. Verify environment variables are set correctly

---

## Files in This Directory

- `README.md` - This file
- `QA_STATUS.md` - Current test status
- `QA_EXECUTION_REPORT.md` - Detailed execution report
- `FINAL_QA_REPORT.md` - Final comprehensive report
- `summary.md` - Test summary
- `issues.json` - Issues found (JSON format)

---

## Next Steps

1. **Run the test suite:**
   ```bash
   npm run test:qa
   ```

2. **Review results:**
   - Open HTML report
   - Check `issues.json` for any issues
   - Review screenshots

3. **Fix any issues found:**
   - P0 issues must be fixed immediately
   - P1 issues should be addressed

4. **Re-run tests after fixes**

---

## Support

For issues with the test suite itself, check:
- Playwright documentation: https://playwright.dev
- Test files in `__tests__/e2e/qa-*.spec.ts`
- Configuration in `playwright.config.ts`
