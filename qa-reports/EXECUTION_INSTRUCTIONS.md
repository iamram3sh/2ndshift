# QA Test Execution Instructions

## ✅ Prerequisites Met

- ✅ JWT_SECRET configured
- ✅ REFRESH_SECRET configured
- ✅ Test infrastructure complete
- ✅ Test files created

---

## Step 1: Install Playwright Browsers (if needed)

```bash
npx playwright install chromium
```

---

## Step 2: Run Tests

### Option A: Full QA Suite (Recommended)
```bash
npm run test:qa
```

### Option B: Smoke Tests Only (Quick Check)
```bash
npm run test:qa:smoke
```

### Option C: Individual Test Files
```bash
# Smoke tests
npx playwright test __tests__/e2e/qa-smoke.spec.ts --reporter=list

# Comprehensive tests
npx playwright test __tests__/e2e/qa-comprehensive.spec.ts --reporter=html,list

# Navigation tests
npx playwright test __tests__/e2e/qa-navigation.spec.ts --reporter=list

# All QA tests
npx playwright test __tests__/e2e/qa-*.spec.ts --reporter=html,json,list
```

---

## Step 3: View Results

### HTML Report (Best for Review)
```bash
# Open in browser
npx playwright show-report qa-reports/playwright/playwright-report
```

Or manually open:
```
qa-reports/playwright/playwright-report/index.html
```

### Check Issues
```bash
# View issues JSON
cat qa-reports/issues.json
```

### View Screenshots
```
qa-reports/screenshots/
```

---

## Step 4: Review and Fix Issues

1. **Check `qa-reports/issues.json`** for all issues found
2. **Review HTML report** for detailed test results
3. **Fix P0 issues** (blocking) immediately
4. **Address P1 issues** (high priority)
5. **Re-run tests** after fixes

---

## Test Environment

### Production
```bash
TEST_ENV=production npm run test:qa
```

### Preview
```bash
TEST_ENV=preview npm run test:qa
```

### Custom URL
```bash
TEST_URL=https://your-url.vercel.app npm run test:qa
```

---

## Expected Test Duration

- **Smoke Tests:** ~30 seconds
- **Full QA Suite:** ~2-5 minutes
- **With Screenshots:** ~5-10 minutes

---

## What Gets Tested

### ✅ Smoke Tests
- Basic page loads
- Hero CTAs visibility
- Header logo presence

### ✅ Comprehensive Tests
- Role separation
- Navigation
- Accessibility
- Login/registration
- Category pages
- Commission/pricing

### ✅ Navigation Tests
- Link validation
- Breadcrumbs
- Back button
- Deep links

---

## Troubleshooting

### Issue: Tests not running
**Solution:** Install Playwright browsers
```bash
npx playwright install chromium
```

### Issue: No output shown
**Solution:** Use verbose reporter
```bash
npx playwright test --reporter=list --headed
```

### Issue: Tests timing out
**Solution:** Increase timeout in `playwright.config.ts` or use:
```bash
npx playwright test --timeout=60000
```

### Issue: Can't find test files
**Solution:** Verify you're in project root
```bash
ls __tests__/e2e/qa-*.spec.ts
```

---

## Success Criteria

✅ All smoke tests pass  
✅ No P0 issues found  
✅ Role separation working  
✅ Navigation links working  
✅ Accessibility passes (no critical violations)  
✅ Login/registration working  

---

## Next Steps After Tests

1. **Review all issues** in `qa-reports/issues.json`
2. **Fix P0 issues** immediately
3. **Address P1 issues** before next release
4. **Re-run tests** to verify fixes
5. **Update documentation** if needed

---

## Need Help?

- Check `qa-reports/QA_STATUS.md` for current status
- Review `qa-reports/FINAL_QA_REPORT.md` for detailed findings
- Check Playwright docs: https://playwright.dev

---

## Ready to Run?

```bash
npm run test:qa
```

Good luck! 🚀
