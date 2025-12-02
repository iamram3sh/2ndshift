# Role-Based Filtering Audit

## Sections Currently Showing Both Roles (Need Fixing)

### Homepage (`app/page.tsx`)
1. **Two-Column Value Prop** (lines 444-539) - Shows both "For Professionals" and "For Businesses"
   - Status: ❌ Needs splitting into role-specific sections
   
2. **CTA Section** (lines 698-727) - Shows both "I want to earn" and "I want to hire"
   - Status: ❌ Needs role-specific CTAs

### Client Page (`app/clients/ClientPageContent.tsx`)
1. **Two-Column Value Prop** (lines 219-301) - Shows "For Businesses" + "Why Choose 2ndShift"
   - Status: ⚠️ Second column is generic, should be client-specific module
   - Needs: Hiring Models, AI Job Wizard, Client Dashboard preview, Escrow explainer, Case study, Pricing CTA

2. **CTA Section** (lines 405-432) - Already client-specific ✅

### Worker Page (`app/work/WorkerPageContent.tsx`)
1. **Two-Column Value Prop** (lines 324-406) - Shows "For Professionals" + "Why Choose 2ndShift"
   - Status: ⚠️ Second column is generic, should be worker-specific module
   - Needs: Starter Packs, Verification explainer, Earnings calculator, Worker success stories

2. **CTA Section** (lines 510-537) - Already worker-specific ✅

## Sections Correctly Marked as "both" (Keep As-Is)
- "What You Can Do" (Quick Tasks, Project-Based, Full-Time Hire)
- "Why 2ndShift" (feature grid)
- "How It Works" (3-step process)
- "Future Vision" (on homepage only)

## Action Items
1. Replace paired bottom blocks with role-specific modules
2. Make CTA sections role-specific (remove dual CTAs)
3. Ensure all sections have proper RoleSection wrappers
4. Fix contrast on dark sections
5. Add data-role attributes for E2E testing

