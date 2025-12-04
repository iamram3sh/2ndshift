/**
 * Comprehensive QA Test Suite Runner
 * Runs all QA tests and generates reports
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const PREVIEW_URL = process.env.PREVIEW_URL || 'https://2ndshift-git-revenue-system-v1-iamram3sh.vercel.app';
const PROD_URL = process.env.PROD_URL || 'https://2ndshift.vercel.app';
const TEST_ENV = process.env.TEST_ENV || 'preview';

const TEST_URL = TEST_ENV === 'production' ? PROD_URL : PREVIEW_URL;
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
const reportDir = path.join(process.cwd(), 'qa-reports', timestamp);

// Create report directories
const dirs = [
  reportDir,
  path.join(reportDir, 'screenshots'),
  path.join(reportDir, 'playwright'),
  path.join(reportDir, 'lighthouse'),
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log('🚀 Starting Comprehensive QA Test Suite...');
console.log(`📊 Test URL: ${TEST_URL}`);
console.log(`🌍 Environment: ${TEST_ENV}`);
console.log(`📁 Report Directory: ${reportDir}\n`);

const issues: Array<{
  priority: 'P0' | 'P1';
  title: string;
  steps: string[];
  expected: string;
  actual: string;
  screenshot?: string;
  logs?: string[];
}> = [];

try {
  // Step 1: Run Smoke Tests
  console.log('1️⃣ Running Smoke Tests...');
  try {
    execSync(
      `npx playwright test __tests__/e2e/qa-smoke.spec.ts --reporter=list,json --output-dir=${reportDir}/playwright`,
      { 
        stdio: 'inherit', 
        env: { ...process.env, TEST_URL, TEST_ENV },
        cwd: process.cwd()
      }
    );
    console.log('✅ Smoke tests passed\n');
  } catch (error) {
    console.error('❌ Smoke tests failed - stopping');
    process.exit(1);
  }

  // Step 2: Run Comprehensive Tests
  console.log('2️⃣ Running Comprehensive QA Tests...');
  try {
    execSync(
      `npx playwright test __tests__/e2e/qa-comprehensive.spec.ts __tests__/e2e/qa-navigation.spec.ts __tests__/e2e/qa-commission-pricing.spec.ts --reporter=html,json,list --output-dir=${reportDir}/playwright`,
      { 
        stdio: 'inherit', 
        env: { ...process.env, TEST_URL, TEST_ENV },
        cwd: process.cwd()
      }
    );
    console.log('✅ Comprehensive tests completed\n');
  } catch (error) {
    console.error('⚠️ Some tests failed - continuing to generate report\n');
  }

  // Step 3: Load issues if generated
  const issuesPath = path.join(process.cwd(), 'qa-reports', 'issues.json');
  if (fs.existsSync(issuesPath)) {
    const loadedIssues = JSON.parse(fs.readFileSync(issuesPath, 'utf-8'));
    issues.push(...loadedIssues);
  }

  // Step 4: Generate Summary
  const p0Count = issues.filter(i => i.priority === 'P0').length;
  const p1Count = issues.filter(i => i.priority === 'P1').length;

  const summary = `# QA Test Summary

**Generated:** ${new Date().toISOString()}
**Test URL:** ${TEST_URL}
**Environment:** ${TEST_ENV}

## Results

- **P0 Issues (Blocking):** ${p0Count}
- **P1 Issues (High Priority):** ${p1Count}
- **Total Issues:** ${issues.length}

## Critical Issues (P0) ${p0Count > 0 ? '🚨' : '✅'}

${p0Count > 0 
  ? issues.filter(i => i.priority === 'P0').map((i, idx) => `
### P0-${idx + 1}: ${i.title}

**Steps to Reproduce:**
${i.steps.map((s, sIdx) => `${sIdx + 1}. ${s}`).join('\n')}

**Expected:** ${i.expected}

**Actual:** ${i.actual}

${i.screenshot ? `**Screenshot:** \`${i.screenshot}\`` : ''}
`).join('\n')
  : 'None ✅'
}

## High Priority Issues (P1)

${p1Count > 0 
  ? issues.filter(i => i.priority === 'P1').map((i, idx) => `
### P1-${idx + 1}: ${i.title}

**Steps to Reproduce:**
${i.steps.map((s, sIdx) => `${sIdx + 1}. ${s}`).join('\n')}

**Expected:** ${i.expected}

**Actual:** ${i.actual}
`).join('\n')
  : 'None ✅'
}

## Test Artifacts

- **Playwright Report:** \`${reportDir}/playwright/\`
- **Screenshots:** \`${reportDir}/screenshots/\`
- **Issues JSON:** \`qa-reports/issues.json\`

## Next Steps

${p0Count > 0 
  ? '**🚨 BLOCKING:** P0 issues must be fixed before production deployment. Review issues above and fix immediately.'
  : '✅ No blocking issues found. Review P1 issues for improvements.'
}

${p0Count === 0 && p1Count > 0 
  ? '**Note:** P1 issues should be addressed but do not block deployment.'
  : ''
}
`;

  fs.writeFileSync(path.join(reportDir, 'summary.md'), summary);
  fs.writeFileSync(path.join(reportDir, 'issues.json'), JSON.stringify(issues, null, 2));

  console.log('\n📊 Test Summary:');
  console.log(`   P0 Issues: ${p0Count}`);
  console.log(`   P1 Issues: ${p1Count}`);
  console.log(`   Total Issues: ${issues.length}`);
  console.log(`\n📁 Reports saved to: ${reportDir}`);

  if (p0Count > 0) {
    console.log('\n🚨 BLOCKING: P0 issues found. Review qa-reports/issues.json');
    process.exit(1);
  } else {
    console.log('\n✅ No blocking issues found');
  }

} catch (error: any) {
  console.error('❌ Test execution failed:', error.message);
  process.exit(1);
}
