# Development Guide - 2ndShift

## 🎯 Current Status

### ✅ Completed Features

#### Authentication & User Management
- [x] User registration with role selection (Worker/Client)
- [x] Login with email/password
- [x] Role-based dashboard redirects
- [x] Profile management (name, phone, PAN)
- [x] User profile page

#### Worker Features
- [x] Worker dashboard with stats
- [x] Browse available projects
- [x] View project details
- [x] Profile page

#### Client Features
- [x] Client dashboard with project overview
- [x] Create new projects
- [x] View posted projects
- [x] Project management

#### Admin Features
- [x] Admin dashboard with platform stats
- [x] User and project analytics
- [x] Revenue tracking

#### Project Management
- [x] Project creation form with skills
- [x] Project listing with filters
- [x] Project detail view
- [x] Search and skill-based filtering

#### UI Components
- [x] Reusable Button component
- [x] Reusable Input component
- [x] Reusable Card components
- [x] Responsive navigation
- [x] Landing page

### 🔄 In Progress

- [ ] Worker profile completion (skills, experience, portfolio)
- [ ] Project application system
- [ ] File upload (resume, portfolio)

### 📋 Backlog

#### High Priority
1. **Application System**
   - Worker applies to project
   - Client reviews applications
   - Accept/reject applications

2. **Contract Management**
   - Generate work contract
   - NDA signing
   - Conflict of interest declaration
   - Contract status tracking

3. **Payment Integration**
   - Complete Razorpay integration
   - Payment processing
   - TDS calculation and deduction
   - Platform fee collection

4. **Document Generation**
   - Invoice generation (PDF)
   - Form 16A generation
   - Contract documents
   - Payment receipts

#### Medium Priority
5. **Messaging System**
   - Client-worker chat
   - Notification system
   - Email notifications

6. **Worker Profile Enhancement**
   - Portfolio upload
   - Resume upload
   - Skills endorsement
   - Work history

7. **Advanced Search**
   - Budget range filter
   - Location-based search
   - Availability filter
   - Experience level filter

8. **Reviews & Ratings**
   - Worker ratings by clients
   - Client ratings by workers
   - Review moderation

#### Low Priority
9. **Analytics & Reporting**
   - Earnings reports for workers
   - Spending reports for clients
   - Tax reports (TDS summary)
   - Platform analytics for admin

10. **Advanced Features**
    - Milestone-based payments
    - Escrow system
    - Dispute resolution
    - Automated matching

## 🗂️ Database Schema

### Existing Tables
- `users` - User accounts and profiles
- `projects` - Project listings
- `worker_profiles` - Worker-specific data
- `contracts` - Work agreements
- `payments` - Payment records

### Tables to Create
- `applications` - Project applications
- `messages` - Chat messages
- `reviews` - User reviews
- `notifications` - User notifications
- `documents` - Uploaded files

## 🔌 API Routes

### Existing
- `POST /api/payments/create-order` - Create Razorpay order (stub)

### To Implement
- `POST /api/applications/create` - Submit application
- `GET /api/applications/[projectId]` - Get applications
- `POST /api/contracts/create` - Create contract
- `POST /api/documents/upload` - Upload document
- `POST /api/messages/send` - Send message
- `GET /api/messages/[userId]` - Get messages

## 📝 Component Library

### UI Components (`components/ui/`)
- `Button.tsx` - Primary UI button
- `Input.tsx` - Form input field
- `Card.tsx` - Content card with variants

### Shared Components (`components/shared/`)
- `Navbar.tsx` - Navigation bar

### Components to Create
- `FileUpload.tsx` - File upload component
- `Modal.tsx` - Modal dialog
- `Dropdown.tsx` - Dropdown menu
- `Badge.tsx` - Status badges
- `Alert.tsx` - Alert messages
- `Pagination.tsx` - Page navigation
- `Table.tsx` - Data table

## 🎨 Design System

### Colors
- Primary: Indigo (600)
- Secondary: Purple (600)
- Success: Green (600)
- Warning: Yellow (600)
- Danger: Red (600)

### Typography
- Font: Inter (Google Font)
- Headings: Bold, varying sizes
- Body: Regular, 16px

### Spacing
- Use Tailwind's spacing scale
- Consistent padding: 4, 6, 8
- Consistent gaps: 4, 6, 8

## 🧪 Testing Strategy

### Unit Tests (To Implement)
- Payment calculations
- Form validation
- Utility functions

### Integration Tests (To Implement)
- Authentication flow
- Project creation flow
- Payment flow

### E2E Tests (To Implement)
- Complete user journey
- Worker finds and applies to project
- Client posts project and hires worker

## 🚀 Deployment

### Environment Setup
- Development: Local with Supabase
- Staging: Vercel with test database
- Production: Vercel with production database

### CI/CD Pipeline (To Implement)
- Automated testing on PR
- Automated deployment to staging
- Manual approval for production

## 📊 Performance Considerations

### Current Optimizations
- Server-side rendering for public pages
- Static generation where possible
- Optimized images (Next.js Image)

### Future Optimizations
- Database indexing on frequently queried fields
- Caching for project listings
- CDN for static assets
- Image optimization for uploads

## 🔒 Security Considerations

### Implemented
- Row Level Security in Supabase
- Environment variable protection
- Client-side auth state management

### To Implement
- Rate limiting on API routes
- Input sanitization
- CSRF protection
- File upload validation
- PAN number encryption

## 📦 Dependencies

### Core
- Next.js 16 - React framework
- React 19 - UI library
- TypeScript 5 - Type safety

### Database & Auth
- Supabase - Backend and auth
- @supabase/auth-helpers-nextjs - Auth helpers

### UI & Styling
- Tailwind CSS 4 - Styling
- Lucide React - Icons
- clsx - Class name utility

### Forms & Validation
- react-hook-form - Form management
- zod - Schema validation

### Payments & Documents
- Razorpay - Payment processing
- jsPDF - PDF generation
- jsPDF-AutoTable - PDF tables

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 📖 Coding Standards

### File Naming
- Components: PascalCase (e.g., `Button.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Pages: lowercase with hyphens (e.g., `create-project/`)

### Component Structure
```tsx
'use client' // If needed

import statements...

interface Props {
  // Props definition
}

export default function ComponentName({ props }: Props) {
  // Hooks
  // State
  // Effects
  // Handlers
  
  // Render
  return (...)
}
```

### Best Practices
- Use TypeScript types for all props
- Keep components small and focused
- Use meaningful variable names
- Add comments for complex logic
- Handle loading and error states
- Use proper ARIA attributes

## 🎓 Learning Resources

- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase Quickstart](https://supabase.com/docs/guides/getting-started)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

Last Updated: 2024
