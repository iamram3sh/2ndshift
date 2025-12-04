# QA Test Reports

This directory contains comprehensive QA test reports, screenshots, and artifacts.

## Running QA Tests

### Quick Smoke Tests
```bash
npm run test:qa:smoke
```

### Full QA Suite
```bash
# Test against preview
TEST_ENV=preview npm run test:qa

# Test against production
TEST_ENV=production npm run test:qa

# Test against custom URL
TEST_URL=https://your-preview.vercel.app npm run test:qa
```

### Using Playwright directly
```bash
# Smoke tests only
npx playwright test __tests__/e2e/qa-smoke.spec.ts

# All QA tests
npx playwright test __tests__/e2e/qa-*.spec.ts

# With custom URL
TEST_URL=https://2ndshift.vercel.app npx playwright test __tests__/e2e/qa-smoke.spec.ts
```

## Test Reports

Reports are organized by timestamp in subdirectories:
- `qa-reports/YYYY-MM-DD/summary.md` - Test summary
- `qa-reports/YYYY-MM-DD/issues.json` - All issues found
- `qa-reports/YYYY-MM-DD/screenshots/` - Screenshots of failures
- `qa-reports/YYYY-MM-DD/playwright/` - Playwright HTML report

## Issue Priorities

- **P0 (Blocking):** Must be fixed before production deployment
- **P1 (High Priority):** Should be fixed but doesn't block deployment

## Test Coverage

### Smoke Tests
- Homepage loads
- Worker page loads
- Client page loads
- Hero CTAs visible
- Header logo exists

### Comprehensive Tests
- Role separation (worker/client UI isolation)
- Navigation (header, breadcrumbs, back button)
- Hero CTA styling and accessibility
- Category pages and microtask cards
- Commission/pricing display
- Accessibility (axe-core)
- Login/registration flows

### Navigation Tests
- Header links (no 404s)
- Breadcrumbs
- Deep link navigation
- Back button behavior

### Commission/Pricing Tests
- Commission displays correctly
- No accidental zeros
- Currency formatting
