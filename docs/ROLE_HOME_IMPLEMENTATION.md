# Role-Targeted Homepage Implementation

## Overview
This document describes the implementation of role-targeted homepage content filtering for 2ndShift, allowing users to see personalized content based on their intent selection ("I want to work" or "I want to hire").

## Feature Flag
The feature is controlled by the `FEATURE_ROLE_HOME` environment variable:
```env
FEATURE_ROLE_HOME=false  # Default: disabled
```

## Architecture

### Core Components

1. **RoleContextProvider** (`components/role/RoleContextProvider.tsx`)
   - Manages role state across the application
   - Persists role selection in localStorage (`2ndshift.role`)
   - Respects query parameter precedence (`?role=worker|client`)
   - Provides `useRole()` hook for accessing role state

2. **RoleToggle** (`components/role/RoleToggle.tsx`)
   - Hero variant: Large side-by-side buttons for initial selection
   - Header variant: Compact pill toggle for switching roles
   - Fully accessible with ARIA attributes and keyboard navigation
   - Announces role changes via aria-live region

3. **RoleSection** (`components/role/RoleSection.tsx`)
   - Conditional wrapper component
   - Renders children only when role matches
   - Supports `role="worker"|"client"|"both"` prop
   - Falls back gracefully when feature is disabled

4. **RoleAwareNav** (`components/role/RoleAwareNav.tsx`)
   - Dynamic navigation based on selected role
   - Worker nav: Jobs, Starter Packs, How it Works, My Profile
   - Client nav: Post a Job, Hire Specialists, Pricing, Client Dashboard
   - Default nav when no role selected

### Utilities

1. **roleAwareLinks.ts** (`lib/utils/roleAwareLinks.ts`)
   - `withRoleParam()`: Appends role query param to URLs
   - `getRoleFromQuery()`: Extracts role from URL query params
   - `persistRole()`: Saves role to localStorage
   - `getInitialRole()`: Gets role with proper precedence

2. **roleEvents.ts** (`lib/analytics/roleEvents.ts`)
   - `trackRoleSelected()`: Tracks role selection events
   - `trackRoleSectionView()`: Tracks section visibility
   - `trackRoleCTA()`: Tracks CTA clicks with role context
   - `trackRoleChange()`: Tracks role switching

## Content Strategy

### Worker-Only Sections
- Hero: "Earn from Anywhere" messaging
- Live Opportunities: Job listings with apply CTAs
- "For Professionals" value prop card
- Worker-focused CTAs: "Get Remote Work", "Browse Jobs", "Start Earning"

### Client-Only Sections
- Hero: "Hire Talent Fast" messaging
- Live Opportunities: "Post Your First Job" CTA
- "For Businesses" value prop card
- Client-focused CTAs: "Hire a Worker", "Browse Talent", "Post a Requirement"

### Shared Sections
- "What You Can Do" (both perspectives)
- "Why 2ndShift" (all features)
- "How It Works" (generic process)
- "Future Vision"
- Footer

## Persistence & Precedence

1. **Query Parameter** (`?role=worker|client`) - Highest precedence
   - Overrides localStorage for that session
   - Useful for sharing role-specific URLs
   - SSR-friendly for SEO

2. **localStorage** (`2ndshift.role`) - Fallback
   - Persists across page navigations
   - Cleared when user explicitly switches roles

3. **No Selection** - Default state
   - Shows neutral homepage with both CTAs
   - After first selection, role is persisted

## Accessibility

- **Keyboard Navigation**: Tab, Arrow keys, Enter/Space
- **Screen Reader**: ARIA tablist/tab pattern, aria-live announcements
- **Visual Indicators**: Icons + labels (not color-only)
- **Focus Management**: Proper focus handling on role changes

## Analytics Events

### role_selected
```javascript
{
  action: 'role_selected',
  category: 'Role',
  label: 'worker_hero' | 'client_header' | 'worker_query',
  role: 'worker' | 'client',
  source: 'hero' | 'header' | 'query'
}
```

### role_section_view
```javascript
{
  action: 'role_section_view',
  category: 'Role',
  label: 'worker_hero' | 'client_opportunities',
  role: 'worker' | 'client',
  section_id: string
}
```

### role_cta_clicked
```javascript
{
  action: 'cta_clicked',
  category: 'Conversion',
  label: 'Get Remote Work_worker',
  role: 'worker' | 'client',
  cta_name: string
}
```

## Usage

### Enabling the Feature
1. Set `FEATURE_ROLE_HOME=true` in environment variables
2. Deploy or restart development server
3. Feature will be active on homepage

### Using Role Context
```tsx
import { useRole } from '@/components/role/RoleContextProvider'

function MyComponent() {
  const { role, setRole } = useRole()
  
  if (role === 'worker') {
    // Show worker content
  }
}
```

### Wrapping Content
```tsx
import { RoleSection } from '@/components/role/RoleSection'

<RoleSection role="worker">
  <div>Only visible to workers</div>
</RoleSection>

<RoleSection role="both">
  <div>Visible to everyone</div>
</RoleSection>
```

### Adding Role-Aware Links
```tsx
import { withRoleParam } from '@/lib/utils/roleAwareLinks'
import { useRole } from '@/components/role/RoleContextProvider'

function MyLink() {
  const { role } = useRole()
  return <Link href={withRoleParam("/jobs", role)}>Jobs</Link>
}
```

## Mobile Considerations

- Role toggle buttons stack vertically on mobile
- Header pill uses icon-only on small screens (text hidden)
- Reduced padding for compact header variant
- Touch-friendly button sizes maintained

## Testing Checklist

- [ ] Click "I want to work" → shows only worker sections
- [ ] Click "I want to hire" → shows only client sections
- [ ] Role persists after page navigation
- [ ] `?role=worker` query param loads worker view
- [ ] Keyboard navigation works (Tab, Arrows, Enter)
- [ ] Screen reader announces role changes
- [ ] Analytics events fire correctly
- [ ] Feature flag disables feature when false
- [ ] No hydration mismatches on SSR

## Files Modified

### New Files
- `lib/role/feature-flag.ts`
- `lib/utils/roleAwareLinks.ts`
- `lib/analytics/roleEvents.ts`
- `components/role/RoleContextProvider.tsx`
- `components/role/RoleProviderWrapper.tsx`
- `components/role/RoleToggle.tsx`
- `components/role/RoleSection.tsx`
- `components/role/RoleAwareNav.tsx`

### Modified Files
- `app/layout.tsx` - Added RoleProviderWrapper
- `app/page.tsx` - Wrapped sections with RoleSection, updated nav
- `lib/feature-gate.ts` - Added ROLE_HOME feature

## Migration Notes

- Existing homepage links will continue to work
- When feature is disabled, homepage behaves as before
- No breaking changes to existing functionality
- Role selection is opt-in (user must click a button)

## Future Enhancements

- [ ] Server-side role detection from user profile
- [ ] Role-specific meta tags for SEO
- [ ] A/B testing different role selection flows
- [ ] Role-based email campaigns
- [ ] Analytics dashboard for role conversion rates
