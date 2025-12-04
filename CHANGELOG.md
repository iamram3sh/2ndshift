# Changelog

All notable changes to the 2ndShift platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added

#### Frontend
- **TanStack Query Integration**: Centralized data fetching with React Query for all job/task operations
- **TaskCard Component**: Premium task display component with verified badges, price badges, category chips, and skill tags
- **BidModal Component**: Full-featured bidding interface with React Hook Form + Zod validation, credits balance display, and form validation
- **PostTaskForm Component**: Employer task creation form with category selection, pricing, and delivery window options
- **TaskFilters Component**: Advanced filtering component with search, minimum price slider, and category chips
- **QueryProvider**: React Query provider wrapper for app-wide data fetching

#### Pages
- **Worker Dashboard** (`/worker`): Complete redesign with high-value task feed, filters, and stats summary
- **Client Tasks Page** (`/client/tasks`): New page for managing posted tasks with status filters and task creation
- **Task Detail Page** (`/task/[id]`): New page showing full task details, bids list (for clients), and accept bid functionality

#### Data Layer
- **React Query Hooks** (`lib/queries.ts`):
  - `useOpenTasks`: Fetch open tasks with filters (category, minPrice, search)
  - `useJob`: Fetch job details by ID
  - `useClientJobs`: Fetch jobs for client (their posted tasks)
  - `useCreateJob`: Create new task mutation
  - `usePlaceBid`: Place bid on task mutation
  - `useAcceptBid`: Accept bid mutation (client)
  - `useReleaseEscrow`: Release escrow payment mutation
  - `useCategories`: Fetch all categories
  - `useCurrentUser`: Fetch current user
  - `useCreditsBalance`: Fetch user's credits balance

#### API Enhancements
- Added `minPrice` query parameter to `/api/v1/jobs` GET endpoint for server-side price filtering
- Enhanced `apiClient.listJobs()` to support `minPrice`, `limit`, and `offset` parameters

#### Seed Data
- **High-Value IT Tasks Seed** (`database/seed/v1-high-value-it-tasks.sql`):
  - 3 verified workers (DevOps Engineer, ML/AI Engineer, Security Specialist) with trust scores 85-95
  - 10 high-value IT tasks (₹90-₹350 range) across Frontend, Backend, DevOps, ML/AI, Security, Database categories
  - 3 sample bids from verified workers
  - IT-focused categories setup

#### Testing
- **Unit Tests**:
  - `TaskCard.test.tsx`: Comprehensive tests for TaskCard component (rendering, badges, interactions)
  - `BidModal.test.tsx`: Tests for BidModal component (validation, form submission, user interactions)
- **E2E Tests**:
  - `worker-bid-flow.spec.ts`: Complete end-to-end test for worker bid flow (view tasks, filter, place bid)

#### Types
- **Job Types** (`types/jobs.ts`): Complete TypeScript type definitions for:
  - `Job`: Job/task entity with all fields and joined data
  - `Application`: Bid/proposal entity
  - `CreateJobPayload`: Task creation payload
  - `ApplyToJobPayload`: Bid placement payload
  - `JobFilters`: Filter options for task queries
  - Enums: `JobStatus`, `ApplicationStatus`, `DeliveryWindow`, `Urgency`

### Changed

#### Worker Dashboard
- Complete redesign to focus on high-value IT tasks
- Integrated React Query for data fetching
- Added advanced filtering (search, price, category)
- Added stats summary (available tasks, credits balance, total value, verified employers)
- Improved task card display with verified badges and premium styling

#### API Client
- Enhanced `listJobs()` method to support `minPrice`, `limit`, and `offset` parameters
- Improved type safety for job-related API calls

#### API Routes
- Updated `/api/v1/jobs` GET endpoint to support `minPrice` query parameter with server-side filtering

### Fixed

- N/A (new feature implementation)

### Security

- All user inputs validated with Zod schemas
- Server-side price filtering to prevent client-side manipulation
- Proper authentication checks for all mutations

### Performance

- React Query caching reduces unnecessary API calls
- Optimistic updates for better UX
- Stale-while-revalidate strategy for data freshness
- Efficient filtering on both client and server side

### Accessibility

- Proper ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly components
- WCAG 2.1 AA compliance in form components

## [Unreleased]

### Planned
- Real-time bid updates via WebSocket
- Advanced task recommendations based on worker skills
- Task templates for common IT microtasks
- Bulk task management for clients
- Analytics dashboard for task performance

---

## Release Notes for v1.0.0

### 🎉 What's New

**High-Value IT Marketplace Launch**

We're excited to launch the V1 high-value IT microtasks marketplace! This release focuses exclusively on premium, verified-talent IT microtasks ($50–$500+, 1–4 hour gigs) with a polished, professional UX.

### ✨ Key Features

1. **Premium Task Feed**: Browse high-value IT tasks with advanced filtering
2. **Fast Bidding**: Place bids in under 5 minutes with streamlined UI
3. **Trust Signals**: Verified badges for employers with high trust scores
4. **Task Management**: Clients can post, manage, and accept bids on tasks
5. **Real-time Updates**: Automatic data refresh with React Query

### 🚀 Getting Started

1. **For Workers**:
   - Visit `/worker` to browse available high-value tasks
   - Use filters to find tasks matching your skills
   - Place bids directly from task cards
   - Track your credits balance

2. **For Clients**:
   - Visit `/client/tasks` to manage your posted tasks
   - Post new tasks with detailed requirements
   - Review and accept bids from verified professionals
   - Track task status and progress

### 📊 Seed Data

We've included seed data with:
- 3 verified workers (DevOps, ML/AI, Security)
- 10 high-value IT tasks (₹90-₹350)
- Sample bids to demonstrate the flow

Run the seed script in Supabase SQL Editor:
```sql
\i database/seed/v1-high-value-it-tasks.sql
```

### 🧪 Testing

All components are fully tested:
- Unit tests for TaskCard and BidModal
- E2E test for complete worker bid flow
- Manual testing checklist included in PR

### 📚 Documentation

- Component documentation in JSDoc comments
- Type definitions in `types/jobs.ts`
- API documentation in `docs/backend-schema-v1.md`

### 🔧 Technical Details

- **Framework**: Next.js 14 (App Router)
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS with custom design system
- **Testing**: Jest + React Testing Library + Playwright

### 🎯 What's Next

Future enhancements planned:
- Real-time bid updates
- AI-powered task matching
- Task templates
- Advanced analytics

---

**Version**: 1.0.0  
**Release Date**: 2024-01-XX  
**Status**: ✅ Ready for Production
