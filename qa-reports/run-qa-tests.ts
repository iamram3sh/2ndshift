/**
 * QA Test Runner Script
 * Runs comprehensive QA tests and generates reports
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const PREVIEW_URL = process.env.PREVIEW_URL || 'http://localhost:3000';
const PROD_URL = process.env.PROD_URL || 'https://2ndshift.vercel.app';
const TEST_ENV = process.env.TEST_ENV || 'preview';

const TEST_URL = TEST_ENV === 'production' ? PROD_URL : PREVIEW_URL;
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const reportDir = path.join(process.cwd(), 'qa-reports', timestamp);

// Create report directory
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

console.log('🚀 Starting Comprehensive QA Test Suite...');
console.log(`📊 Test URL: ${TEST_URL}`);
console.log(`📁 Report Directory: ${reportDir}\n`);

try {
  // Run Playwright tests
  console.log('1️⃣ Running Playwright E2E tests...');
  execSync(
    `npx playwright test __tests__/e2e/qa-comprehensive.spec.ts __tests__/e2e/qa-navigation.spec.ts __tests__/e2e/qa-commission-pricing.spec.ts --reporter=html,json --output-dir=${reportDir}/playwright`,
    { stdio: 'inherit', env: { ...process.env, TEST_URL, TEST_ENV } }
  );

  console.log('\n✅ Playwright tests completed');
} catch (error) {
  console.error('\n❌ Playwright tests failed');
  process.exit(1);
}

// Generate summary
const issuesPath = path.join(process.cwd(), 'qa-reports', 'issues.json');
let issues: any[] = [];

if (fs.existsSync(issuesPath)) {
  issues = JSON.parse(fs.readFileSync(issuesPath, 'utf-8'));
}

const p0Count = issues.filter((i: any) => i.priority === 'P0').length;
const p1Count = issues.filter((i: any) => i.priority === 'P1').length;

console.log('\n📊 Test Summary:');
console.log(`   P0 Issues: ${p0Count}`);
console.log(`   P1 Issues: ${p1Count}`);
console.log(`   Total Issues: ${issues.length}`);

if (p0Count > 0) {
  console.log('\n🚨 BLOCKING: P0 issues found. Review qa-reports/issues.json');
  process.exit(1);
} else {
  console.log('\n✅ No blocking issues found');
}
