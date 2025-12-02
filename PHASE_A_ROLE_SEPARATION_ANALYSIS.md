# PHASE A — ROLE SEPARATION ANALYSIS & SPECIFICATION

## Executive Summary

**Current State:** The 2ndShift homepage (`app/page.tsx`) uses `RoleSection` components to conditionally show worker/client content, but **both sections render on the same page** and are filtered client-side. This causes:
- Client pages showing worker hero/sections
- Worker pages showing client hero/sections  
- Poor SEO (both content types in DOM)
- Slower initial render (unnecessary content)

**Target State:** Role-specific pages (`/client`, `/worker`) should **only render their respective content on first paint (SSR)**, with proper role persistence and navigation context.

---

## 1. REPOSITORY SCAN — EXACT FILES TO CHANGE

### Core Pages
- ✅ `app/page.tsx` - Homepage (currently shows both roles)
- ✅ `app/(dashboard)/client/page.tsx` - Client dashboard (no role separation needed, already role-specific)
- ✅ `app/(dashboard)/worker/page.tsx` - Worker dashboard (no role separation needed, already role-specific)
- ⚠️ **NEW:** `app/client/page.tsx` - **CREATE** - Client-focused landing page
- ⚠️ **NEW:** `app/worker/page.tsx` - **CREATE** - Worker-focused landing page

### Layout & Providers
- ✅ `app/layout.tsx` - Root layout (wraps with RoleProviderWrapper)
- ✅ `components/role/RoleProviderWrapper.tsx` - Suspense wrapper for RoleContext
- ✅ `components/role/RoleContextProvider.tsx` - Role state management
- ✅ `components/role/RoleSection.tsx` - Conditional rendering component
- ✅ `components/role/RoleToggle.tsx` - Role switcher UI
- ✅ `components/role/RoleAwareNav.tsx` - Navigation with role context

### Utilities & Config
- ✅ `lib/utils/roleAwareLinks.ts` - Role-aware link helpers
- ✅ `lib/role/feature-flag.ts` - Feature flag (FEATURE_ROLE_HOME)
- ✅ `lib/analytics/roleEvents.ts` - Analytics tracking
- ⚠️ **MODIFY:** `next.config.ts` - May need redirects for `/client` → `/client` (if needed)

### Tests
- ✅ `__tests__/role/RoleContext.test.tsx` - Unit tests
- ✅ `__tests__/role/RoleSection.test.tsx` - Unit tests
- ✅ `__tests__/e2e/homepage-role.spec.ts` - E2E tests
- ⚠️ **UPDATE:** All test files to cover SSR scenarios

---

## 2. SSR FRAMEWORK DETECTION

**Framework:** Next.js 16.0.3 with **App Router** (not Pages Router)

**Current SSR Pattern:**
- ❌ **No `getServerSideProps`** (Pages Router pattern, not used)
- ❌ **No `getInitialProps`** (Pages Router pattern, not used)
- ✅ **App Router** uses Server Components and `searchParams` prop
- ✅ **Current implementation:** Client-side only role detection

**SSR Injection Points:**
1. **Server Component Pages** - Can read `searchParams` in page component
2. **Layout Metadata** - Can generate dynamic metadata per route
3. **Route-based role detection** - `/client` route → `initialRole='client'`, `/worker` route → `initialRole='worker'`

**Recommended Approach:**
```typescript
// app/client/page.tsx (Server Component)
export default function ClientPage({ searchParams }: { searchParams: { role?: string } }) {
  // Server-side: role is always 'client' for this route
  const initialRole: UserRole = 'client'
  
  return (
    <ClientPageContent initialRole={initialRole} />
  )
}

// app/worker/page.tsx (Server Component)
export default function WorkerPage({ searchParams }: { searchParams: { role?: string } }) {
  // Server-side: role is always 'worker' for this route
  const initialRole: UserRole = 'worker'
  
  return (
    <WorkerPageContent initialRole={initialRole} />
  )
}
```

---

## 3. ROLE/STATE STORAGE ANALYSIS

### Current Storage Mechanism

**Primary Storage:** `localStorage['2ndshift.role']`
- **Location:** `lib/utils/roleAwareLinks.ts`
- **Key:** `ROLE_STORAGE_KEY = '2ndshift.role'`
- **Values:** `'worker' | 'client' | null`

**Precedence Order (Current):**
1. ✅ `?role=` query param (highest) - Read via `useSearchParams()`
2. ✅ `localStorage['2ndshift.role']` (fallback)
3. ✅ `null` (default)

**Context Provider:** `RoleContextProvider.tsx`
- Uses `useSearchParams()` hook (client-side only)
- Initializes on client mount
- Persists to localStorage when role changes

**Issues:**
- ❌ No SSR role injection - role is `null` on initial server render
- ❌ Route-based role detection not implemented (`/client` doesn't set role)
- ❌ No cookie support (localStorage only, not available on SSR)

---

## 4. DETAILED CHANGE LIST

### A. Components to Add

#### 1. **RolePill Component** (NEW)
- **File:** `components/role/RolePill.tsx`
- **Purpose:** Visual indicator showing current role in header/nav
- **Props:** `role: 'worker' | 'client'`, `variant?: 'header' | 'inline'`
- **Features:** Accessible, keyboard navigable

#### 2. **ClientPageContent Component** (NEW)
- **File:** `app/client/ClientPageContent.tsx` (Client Component)
- **Purpose:** Client-specific homepage content
- **Props:** `initialRole?: 'client'` (from SSR)
- **Features:** Only renders client sections, no worker content

#### 3. **WorkerPageContent Component** (NEW)
- **File:** `app/worker/WorkerPageContent.tsx` (Client Component)
- **Purpose:** Worker-specific homepage content
- **Props:** `initialRole?: 'worker'` (from SSR)
- **Features:** Only renders worker sections, no client content

### B. Files to Modify

#### 1. **RoleContextProvider.tsx** (MODIFY)
- **Change:** Accept `initialRole` prop for SSR hydration
- **Location:** `components/role/RoleContextProvider.tsx`
- **Changes:**
  ```typescript
  interface RoleContextProviderProps {
    children: React.ReactNode
    initialRole?: UserRole | null  // NEW: SSR-injected role
  }
  
  export function RoleContextProvider({ children, initialRole }: RoleContextProviderProps) {
    // Use initialRole if provided (SSR), otherwise check query/localStorage
    const [role, setRoleState] = useState<UserRole | null>(initialRole ?? null)
    // ... rest of logic
  }
  ```

#### 2. **RoleProviderWrapper.tsx** (MODIFY)
- **Change:** Pass `initialRole` from page props to RoleContextProvider
- **Location:** `components/role/RoleProviderWrapper.tsx`
- **Changes:**
  ```typescript
  interface RoleProviderWrapperProps {
    children: React.ReactNode
    initialRole?: UserRole | null  // NEW: SSR-injected role
  }
  
  export function RoleProviderWrapper({ children, initialRole }: RoleProviderWrapperProps) {
    // Pass initialRole to RoleContextProvider
  }
  ```

#### 3. **app/layout.tsx** (MODIFY)
- **Change:** Cannot pass props from pages to layout in App Router
- **Alternative:** Use route-based detection or context injection
- **Solution:** Keep layout as-is, inject role at page level

#### 4. **app/page.tsx** (MODIFY)
- **Change:** Keep as neutral homepage with role toggle
- **Action:** Ensure fallback content shows when no role selected
- **Status:** ✅ Already correct

#### 5. **RoleSection.tsx** (MODIFY)
- **Change:** Accept `ssrRole` prop for server-side rendering
- **Location:** `components/role/RoleSection.tsx`
- **Changes:**
  ```typescript
  interface RoleSectionProps {
    role: 'worker' | 'client' | 'both'
    ssrRole?: UserRole | null  // NEW: Server-side role
    fallback?: React.ReactNode
    children: React.ReactNode
    // ... existing props
  }
  
  export function RoleSection({ role, ssrRole, ...props }: RoleSectionProps) {
    const { role: clientRole } = useRole()
    const effectiveRole = ssrRole ?? clientRole  // Use SSR role if available
    
    // Render logic using effectiveRole
  }
  ```

### C. Files to Create

#### 1. **app/client/page.tsx** (NEW - Server Component)
```typescript
import { Metadata } from 'next'
import { ClientPageContent } from './ClientPageContent'

export const metadata: Metadata = {
  title: 'Hire Verified Talent Fast | 2ndShift',
  description: 'Get remote workers, micro-teams, and on-demand task execution within hours. All compliance handled automatically.',
  // ... role-specific SEO
}

export default function ClientPage() {
  return <ClientPageContent initialRole="client" />
}
```

#### 2. **app/client/ClientPageContent.tsx** (NEW - Client Component)
- Extract client-specific sections from `app/page.tsx`
- Only render `RoleSection role="client"` content
- Hide all `RoleSection role="worker"` content

#### 3. **app/worker/page.tsx** (NEW - Server Component)
```typescript
import { Metadata } from 'next'
import { WorkerPageContent } from './WorkerPageContent'

export const metadata: Metadata = {
  title: 'Find Remote Work in India | 2ndShift',
  description: 'Earn from anywhere with verified remote jobs. Get paid within 24 hours. Zero platform fees.',
  // ... role-specific SEO
}

export default function WorkerPage() {
  return <WorkerPageContent initialRole="worker" />
}
```

#### 4. **app/worker/WorkerPageContent.tsx** (NEW - Client Component)
- Extract worker-specific sections from `app/page.tsx`
- Only render `RoleSection role="worker"` content
- Hide all `RoleSection role="client"` content

### D. Server-Side Rendering Changes

#### 1. **Route-Based Role Detection**
- `/client` → Always sets `initialRole='client'` on server
- `/worker` → Always sets `initialRole='worker'` on server
- `/` → No initial role (neutral homepage)

#### 2. **Metadata Generation**
- Dynamic metadata per route (already supported in App Router)
- Role-specific Open Graph tags
- Role-specific canonical URLs

#### 3. **Hydration Strategy**
- Server renders with `initialRole` prop
- Client hydrates and checks query param (overrides if present)
- Falls back to localStorage if no query param

---

## 5. ACCEPTANCE CRITERIA

### Must Pass (All Required)

#### ✅ AC1: Route-Based Role Separation
- **`/client` route shows ZERO worker-specific sections on first paint (SSR)**
  - No worker hero
  - No worker CTAs
  - No worker job listings
  - Only client content visible
  
- **`/worker` route shows ZERO client-specific sections on first paint (SSR)**
  - No client hero
  - No client CTAs
  - No client job posting prompts
  - Only worker content visible

#### ✅ AC2: Role Persistence
- Role persists across navigation (localStorage)
- Role persists on page reload
- Query param `?role=` overrides persisted role
- Route-based role (`/client`, `/worker`) overrides query param

#### ✅ AC3: Navigation Context
- All nav links maintain role context
- `withRoleParam()` helper adds `?role=` to links
- Role toggle switches between `/client` and `/worker` routes
- Homepage (`/`) shows neutral content with role toggle

#### ✅ AC4: SSR/SEO
- Server renders correct content for `/client` and `/worker`
- No hydration mismatches
- Role-specific meta tags per route
- Canonical URLs per route

#### ✅ AC5: Accessibility
- `aria-live` region announces role changes
- RoleToggle keyboard accessible
- Screen reader announces "Showing client view" or "Showing worker view"
- All interactive elements have proper ARIA labels

#### ✅ AC6: Tests
- Unit tests for `RoleSection` with `ssrRole` prop
- Unit tests for SSR hydration of role
- E2E test: `/client` loads without worker content
- E2E test: Click "I want to work" → role switches, only worker content visible
- E2E test: Reload persists role

---

## 6. TESTS TO ADD

### Unit Tests

#### 1. **RoleSection SSR Test**
```typescript
// __tests__/role/RoleSection.test.tsx
describe('RoleSection with SSR role', () => {
  it('renders content when ssrRole matches', () => {
    // Test SSR role prop
  })
  
  it('uses client role when ssrRole not provided', () => {
    // Test client-side fallback
  })
})
```

#### 2. **RoleContextProvider SSR Test**
```typescript
// __tests__/role/RoleContextProvider.test.tsx
describe('RoleContextProvider with initialRole', () => {
  it('initializes with initialRole prop', () => {
    // Test SSR hydration
  })
  
  it('query param overrides initialRole', () => {
    // Test precedence
  })
})
```

### E2E Tests

#### 1. **Route-Based Separation Test**
```typescript
// __tests__/e2e/role-separation.spec.ts
test(' /client shows only client content', async ({ page }) => {
  await page.goto('/client')
  // Assert: No worker hero visible
  // Assert: Client hero visible
  // Assert: No worker sections in DOM
})

test('/worker shows only worker content', async ({ page }) => {
  await page.goto('/worker')
  // Assert: No client hero visible
  // Assert: Worker hero visible
  // Assert: No client sections in DOM
})
```

#### 2. **Role Persistence Test**
```typescript
test('role persists across navigation', async ({ page }) => {
  await page.goto('/client')
  await page.click('text=Home')
  // Assert: Role still 'client'
  await page.reload()
  // Assert: Role still 'client'
})
```

#### 3. **Role Toggle Test**
```typescript
test('role toggle switches routes', async ({ page }) => {
  await page.goto('/')
  await page.click('text=I Want to Work')
  // Assert: URL is /worker
  // Assert: Only worker content visible
})
```

---

## 7. ROLLOUT PLAN

### Feature Flag: `FEATURE_ROLE_PAGES`

**Location:** `lib/role/feature-flag.ts`

**Implementation:**
```typescript
export const FEATURE_ROLE_PAGES = process.env.FEATURE_ROLE_PAGES === 'true'

export function isRolePagesEnabled(): boolean {
  return FEATURE_ROLE_PAGES
}
```

**Default:** `false` (OFF)

**Rollout Stages:**

1. **Stage 1: Development** (Feature Flag OFF)
   - Implement all changes
   - Test locally
   - Unit & E2E tests passing

2. **Stage 2: Staging** (Feature Flag ON for staging)
   - Deploy to staging
   - Manual QA
   - Performance testing
   - SEO validation

3. **Stage 3: Production (Canary)** (Feature Flag ON for 10% users)
   - A/B test with feature flag
   - Monitor analytics
   - Check error rates

4. **Stage 4: Production (Full)** (Feature Flag ON for 100%)
   - Full rollout
   - Monitor for 48 hours
   - Remove feature flag if stable

**Environment Variables:**
```bash
# .env.local (development)
FEATURE_ROLE_PAGES=false

# .env.staging
FEATURE_ROLE_PAGES=true

# .env.production (canary)
FEATURE_ROLE_PAGES=true
```

---

## 8. MIGRATION NOTES

### Breaking Changes
- ⚠️ **None** - Feature is additive, existing routes still work

### Backward Compatibility
- ✅ Homepage (`/`) still works with role toggle
- ✅ Query params (`/?role=worker`) still work
- ✅ Existing localStorage role persists

### Redirects (Optional)
- Consider redirecting `/?role=client` → `/client` (301)
- Consider redirecting `/?role=worker` → `/worker` (301)
- **Decision:** Keep both for flexibility, add redirects later if needed

---

## 9. PERFORMANCE CONSIDERATIONS

### Current Issues
- ❌ Both role sections render (hidden via CSS/JS)
- ❌ Larger initial HTML payload
- ❌ Unnecessary DOM nodes

### After Implementation
- ✅ Only relevant content renders on server
- ✅ Smaller HTML payload per route
- ✅ Faster Time to Interactive (TTI)
- ✅ Better Core Web Vitals

### Metrics to Track
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)

---

## 10. SEO CONSIDERATIONS

### Current State
- ⚠️ Both role contents in DOM (hidden)
- ⚠️ Generic meta tags
- ⚠️ No role-specific structured data

### After Implementation
- ✅ Role-specific content in DOM
- ✅ Role-specific meta tags per route
- ✅ Cleaner HTML structure
- ✅ Better crawlability

### Recommended Additions
1. **Structured Data (JSON-LD)**
   - JobPosting schema for `/worker`
   - Service schema for `/client`

2. **Canonical URLs**
   - `/client` → Canonical: `https://2ndshift.com/client`
   - `/worker` → Canonical: `https://2ndshift.com/worker`

3. **Sitemap Updates**
   - Add `/client` and `/worker` to sitemap
   - Mark as high priority

---

## 11. ACCESSIBILITY CHECKLIST

- [x] `aria-live` region for role announcements
- [x] Keyboard navigation for RoleToggle
- [x] `aria-selected` on role tabs
- [x] Screen reader announcements
- [ ] Focus management on role change
- [ ] Skip links for role-specific content
- [ ] High contrast mode support

---

## 12. ANALYTICS EVENTS

### Current Events (Already Implemented)
- `role_page_view` - Tracks role-specific page views
- `role_toggle_click` - Tracks role toggle interactions
- `role_section_view` - Tracks section visibility

### New Events to Add
- `role_route_navigation` - Track navigation to `/client` or `/worker`
- `role_ssr_hydration` - Track SSR role injection success

---

## 13. FILE CHANGE SUMMARY

### Files to CREATE (4)
1. `app/client/page.tsx` - Server Component
2. `app/client/ClientPageContent.tsx` - Client Component
3. `app/worker/page.tsx` - Server Component
4. `app/worker/WorkerPageContent.tsx` - Client Component
5. `components/role/RolePill.tsx` - NEW component (optional)

### Files to MODIFY (5)
1. `components/role/RoleContextProvider.tsx` - Add `initialRole` prop
2. `components/role/RoleProviderWrapper.tsx` - Pass `initialRole`
3. `components/role/RoleSection.tsx` - Add `ssrRole` prop
4. `lib/role/feature-flag.ts` - Add `FEATURE_ROLE_PAGES` flag
5. `__tests__/role/*.test.tsx` - Update tests

### Files to REVIEW (No Changes Needed)
1. `app/page.tsx` - Keep as neutral homepage
2. `app/layout.tsx` - No changes needed
3. `components/role/RoleToggle.tsx` - Update to navigate to routes
4. `components/role/RoleAwareNav.tsx` - Update links

---

## 14. ESTIMATED EFFORT

- **Phase B (Design & Component Spec):** 2-3 hours
- **Phase C (Implementation):** 6-8 hours
- **Phase D (Analytics & QA):** 2-3 hours
- **Phase E (PR & Release):** 1-2 hours

**Total:** 11-16 hours

---

## 15. RISKS & MITIGATION

### Risk 1: Hydration Mismatches
- **Mitigation:** Use `initialRole` prop, ensure SSR and client match
- **Testing:** Comprehensive E2E tests

### Risk 2: SEO Impact
- **Mitigation:** Proper meta tags, structured data, canonical URLs
- **Testing:** Google Search Console validation

### Risk 3: User Confusion
- **Mitigation:** Clear navigation, role indicators, smooth transitions
- **Testing:** User testing, analytics monitoring

---

## NEXT STEPS

**Wait for approval before proceeding to Phase B.**

Once approved, I will:
1. Implement `RoleContextProvider` with `initialRole` support
2. Create `/client` and `/worker` route pages
3. Extract role-specific content into separate components
4. Add SSR role injection
5. Update tests
6. Add feature flag

---

**END OF PHASE A ANALYSIS**

