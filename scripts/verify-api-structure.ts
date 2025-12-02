/**
 * API Structure Verification Script
 * Verifies all API endpoints are properly structured
 */

import * as fs from 'fs';
import * as path from 'path';

const API_DIR = path.join(process.cwd(), 'app', 'api', 'v1');

interface EndpointInfo {
  path: string;
  methods: string[];
  exists: boolean;
}

const expectedEndpoints: EndpointInfo[] = [
  // Auth
  { path: 'auth/register/route.ts', methods: ['POST'], exists: false },
  { path: 'auth/login/route.ts', methods: ['POST'], exists: false },
  { path: 'auth/refresh/route.ts', methods: ['POST'], exists: false },
  { path: 'auth/logout/route.ts', methods: ['POST'], exists: false },
  { path: 'auth/me/route.ts', methods: ['GET'], exists: false },
  
  // Jobs
  { path: 'jobs/route.ts', methods: ['GET', 'POST'], exists: false },
  { path: 'jobs/[id]/route.ts', methods: ['GET'], exists: false },
  { path: 'jobs/[id]/apply/route.ts', methods: ['POST'], exists: false },
  { path: 'jobs/[id]/accept-proposal/route.ts', methods: ['POST'], exists: false },
  { path: 'jobs/[id]/deliver/route.ts', methods: ['POST'], exists: false },
  { path: 'jobs/[id]/approve/route.ts', methods: ['POST'], exists: false },
  
  // Credits
  { path: 'credits/balance/route.ts', methods: ['GET'], exists: false },
  { path: 'credits/purchase/route.ts', methods: ['POST'], exists: false },
  
  // Categories
  { path: 'categories/route.ts', methods: ['GET'], exists: false },
  { path: 'categories/[id]/microtasks/route.ts', methods: ['GET'], exists: false },
  
  // Matching
  { path: 'matching/auto-match/route.ts', methods: ['POST'], exists: false },
  { path: 'matching/suggest-workers/route.ts', methods: ['POST'], exists: false },
  
  // Missing Tasks
  { path: 'missing-tasks/route.ts', methods: ['POST'], exists: false },
  
  // Admin
  { path: 'admin/jobs/route.ts', methods: ['GET'], exists: false },
  { path: 'admin/users/route.ts', methods: ['GET'], exists: false },
];

function checkFile(filePath: string): boolean {
  const fullPath = path.join(API_DIR, filePath);
  return fs.existsSync(fullPath);
}

function verifyRouteFile(filePath: string, methods: string[]): { valid: boolean; errors: string[] } {
  const fullPath = path.join(API_DIR, filePath);
  const errors: string[] = [];
  
  if (!fs.existsSync(fullPath)) {
    return { valid: false, errors: ['File does not exist'] };
  }
  
  const content = fs.readFileSync(fullPath, 'utf-8');
  
  // Check for required exports
  for (const method of methods) {
    if (!content.includes(`export async function ${method}`)) {
      errors.push(`Missing export for ${method} method`);
    }
  }
  
  // Check for NextRequest import
  if (!content.includes("from 'next/server'")) {
    errors.push('Missing Next.js server imports');
  }
  
  return { valid: errors.length === 0, errors };
}

function main() {
  console.log('🔍 Verifying API Structure...\n');
  
  let totalEndpoints = 0;
  let validEndpoints = 0;
  let missingEndpoints = 0;
  let invalidEndpoints = 0;
  
  const results: Array<{
    endpoint: string;
    status: 'valid' | 'missing' | 'invalid';
    errors?: string[];
  }> = [];
  
  for (const endpoint of expectedEndpoints) {
    totalEndpoints++;
    const filePath = endpoint.path;
    const exists = checkFile(filePath);
    
    if (!exists) {
      missingEndpoints++;
      results.push({
        endpoint: filePath,
        status: 'missing',
      });
      continue;
    }
    
    const verification = verifyRouteFile(filePath, endpoint.methods);
    
    if (!verification.valid) {
      invalidEndpoints++;
      results.push({
        endpoint: filePath,
        status: 'invalid',
        errors: verification.errors,
      });
    } else {
      validEndpoints++;
      results.push({
        endpoint: filePath,
        status: 'valid',
      });
    }
  }
  
  // Print results
  console.log('='.repeat(80));
  console.log('API STRUCTURE VERIFICATION REPORT');
  console.log('='.repeat(80));
  console.log(`\nTotal Endpoints: ${totalEndpoints}`);
  console.log(`✅ Valid: ${validEndpoints}`);
  console.log(`❌ Missing: ${missingEndpoints}`);
  console.log(`⚠️  Invalid: ${invalidEndpoints}`);
  console.log(`\nSuccess Rate: ${((validEndpoints / totalEndpoints) * 100).toFixed(1)}%`);
  
  console.log('\n' + '-'.repeat(80));
  console.log('DETAILED RESULTS');
  console.log('-'.repeat(80));
  
  for (const result of results) {
    const icon = result.status === 'valid' ? '✅' : result.status === 'missing' ? '❌' : '⚠️';
    console.log(`\n${icon} ${result.endpoint}`);
    
    if (result.status === 'missing') {
      console.log('   Status: FILE MISSING');
    } else if (result.status === 'invalid' && result.errors) {
      console.log('   Status: INVALID');
      result.errors.forEach(error => {
        console.log(`   - ${error}`);
      });
    } else {
      console.log('   Status: VALID');
    }
  }
  
  console.log('\n' + '='.repeat(80));
  
  if (missingEndpoints === 0 && invalidEndpoints === 0) {
    console.log('🎉 All API endpoints are properly structured!');
    process.exit(0);
  } else {
    console.log(`⚠️  Found ${missingEndpoints + invalidEndpoints} issue(s) that need attention.`);
    process.exit(1);
  }
}

main();
