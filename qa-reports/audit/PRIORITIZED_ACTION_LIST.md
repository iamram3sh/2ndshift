# Prioritized Action List - 2ndShift Audit

**For Engineering Team**

---

## 🚨 P0 - CRITICAL (Fix Immediately - 24-48 hours)

### P0-001: Password Reset 404
**Owner:** Frontend  
**Effort:** 6 hours  
**Action:**
1. Create `app/(auth)/forgot-password/page.tsx`
2. Add email input form
3. Connect to password reset API endpoint
4. Test full flow: email → reset link → new password
5. Verify no 404 errors in console

**Acceptance:**
- `/forgot-password` returns 200 OK
- Form submits successfully
- No console errors

---

### P0-002: Homepage CTA Navigation
**Owner:** Frontend  
**Effort:** 3 hours  
**Action:**
1. Update `app/page.tsx` hero CTAs
2. Change from `onClick` handlers to proper `Link` components with `href`
3. Set `href='/work?role=worker'` for "I want to work"
4. Set `href='/clients?role=client'` for "I want to hire"
5. Remove role context update from onClick (let navigation handle it)
6. Test browser back button, bookmarking, deep links

**Acceptance:**
- Clicking CTAs navigates to correct URLs
- Browser back button works
- Bookmarks work
- URL reflects current page state

---

## ⚠️ P1 - HIGH PRIORITY (Fix Within 72 hours)

### P1-001: Add Breadcrumbs to Category Pages
**Owner:** Frontend  
**Effort:** 4 hours  
**Action:**
1. Create breadcrumb component
2. Add to `/category/[slug]` pages
3. Format: Home / Category / [Category Name]
4. Make Home clickable
5. Test mobile responsiveness

**Acceptance:**
- Breadcrumb visible on all category pages
- Home link navigates correctly
- Mobile view works

---

### P1-002: Remove Contradictory Categories
**Owner:** Frontend  
**Effort:** 1 hour  
**Action:**
1. Open `/workers` page filter component
2. Remove "Design" and "Mobile" from Skill Categories
3. Keep only: Development, DevOps & Cloud, Data & Analytics, QA & Testing
4. Verify filter still functions

**Acceptance:**
- Only high-value categories shown
- Filter functionality intact

---

### P1-003: Add Commission Display to Job Cards
**Owner:** Frontend + Backend  
**Effort:** 8-16 hours  
**Action:**
1. Verify commission calculation in backend
2. Add commission display to job card component
3. Format: "Platform fee: 10%" or "Commission: ₹X"
4. Add to job detail pages
5. Ensure fallback to default 10% if not set

**Acceptance:**
- Commission visible on job cards
- Commission shown on job detail pages
- No 0% unless promotional flag set

---

### P1-004: Verify CTA Spacing
**Owner:** Frontend  
**Effort:** 2 hours  
**Action:**
1. Inspect hero CTAs CSS
2. Verify gap >= 16px (preferably 24px)
3. Test mobile stacking
4. Verify keyboard navigation

**Acceptance:**
- Desktop spacing >= 16px
- Mobile spacing adequate
- Keyboard navigation works

---

## 📋 P2 - MEDIUM PRIORITY (Fix When Convenient)

### P2-001: Console Errors
**Owner:** Frontend  
**Effort:** Resolved by P0-001  
**Action:** Fixing password reset will resolve 404 errors

---

## 📊 Summary

| Priority | Count | Total Effort |
|----------|-------|--------------|
| P0 | 2 | 9 hours |
| P1 | 4 | 15-23 hours |
| P2 | 1 | 0 hours (resolved) |
| **Total** | **7** | **24-32 hours** |

---

## 🎯 Recommended Fix Order

1. **Day 1:** P0-001 (Password Reset) + P0-002 (Navigation) = 9 hours
2. **Day 2:** P1-002 (Categories) + P1-004 (Spacing) = 3 hours
3. **Day 3:** P1-001 (Breadcrumbs) + P1-003 (Commission) = 12-20 hours

**Total Timeline:** 3 days to production-ready state.

---

## ✅ Definition of Done

- All P0 issues fixed and tested
- All P1 issues fixed and tested
- No console errors
- All acceptance criteria met
- Manual QA pass
- Deployed to production
