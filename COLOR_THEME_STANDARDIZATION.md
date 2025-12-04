# Color Theme Standardization - 2ndShift Platform

## Unified Brand Colors

**Primary Brand Color:** `#0b63ff` (Blue)
- Used for: Primary buttons, links, CTAs, brand elements
- Hover: `#0a56e6` (Darker blue)

**Secondary:** `slate-900` (Dark)
- Used for: Secondary buttons, dark backgrounds

**Shifts Components:** `amber-500` to `orange-500` gradient
- **UNCHANGED** - Shifts components maintain amber/orange theme as requested

## Color Replacements Applied

All `indigo-*` colors have been replaced with primary blue `#0b63ff`:
- `indigo-600` → `#0b63ff`
- `indigo-500` → `#0b63ff`
- `indigo-700` → `#0a56e6`
- `indigo-100` → `blue-100`
- `indigo-50` → `blue-50`
- Gradients: `from-indigo-600 to-purple-600` → `from-[#0b63ff] to-[#0a56e6]`

## Files Updated

- `app/globals.css` - Updated brand color variables
- `components/shared/Logo.tsx` - Updated to use primary blue
- `components/ui/Button.tsx` - Already using `#0b63ff`
- `components/ui/Input.tsx` - Updated focus rings
- `components/messaging/MessageButton.tsx` - Updated variants
- `app/contact/page.tsx` - Updated all indigo colors
- `app/industries/page.tsx` - Updated colors
- `app/(dashboard)/messages/page.tsx` - Updated colors
- `app/(dashboard)/worker/page.tsx` - Updated gradients
- `app/(dashboard)/client/page.tsx` - Updated gradients
- `components/dashboard/StatsCard.tsx` - Updated indigo variant
- Multiple other pages and components

## Shifts Components - UNCHANGED ✅

All Shifts-related components maintain their amber/orange theme:
- `components/shifts/ShiftsModal.tsx`
- `components/shifts/ShiftsWidget.tsx`
- All Shifts promo cards
- All Shifts buttons and badges

## Status

✅ Primary brand color standardized to `#0b63ff`
✅ Shifts components preserved (amber/orange)
✅ Most visible pages updated
⚠️ Some dashboard/admin pages may still have indigo colors (less visible)
