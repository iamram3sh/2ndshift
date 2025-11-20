# 2ndShift - Technical Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  Next.js 16 (App Router) + React 19 + TypeScript 5          │
│  • Server Components (RSC)                                   │
│  • Client Components ('use client')                          │
│  • Server Actions (planned)                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      ROUTING LAYER                           │
├─────────────────────────────────────────────────────────────┤
│  • Public Routes: /, /login, /register                       │
│  • Protected Routes: /worker, /client, /admin, /profile     │
│  • Dynamic Routes: /projects/[id]                            │
│  • API Routes: /api/payments/*                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    COMPONENT LAYER                           │
├─────────────────────────────────────────────────────────────┤
│  UI Components:                                              │
│  • Button, Input, Card                                       │
│                                                              │
│  Shared Components:                                          │
│  • Navbar                                                    │
│                                                              │
│  Page Components:                                            │
│  • 10 unique pages with layouts                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     SERVICE LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  • Supabase Client (Auth + Database)                         │
│  • Supabase Server (SSR operations)                          │
│  • Razorpay (Payment processing)                             │
│  • Payment Calculator (Tax compliance)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
├─────────────────────────────────────────────────────────────┤
│  Supabase (PostgreSQL)                                       │
│  • users                                                     │
│  • projects                                                  │
│  • worker_profiles                                           │
│  • contracts                                                 │
│  • payments                                                  │
│                                                              │
│  Row Level Security (RLS) enabled                            │
└─────────────────────────────────────────────────────────────┘
```

## 📂 Directory Structure

```
2ndshift/
│
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   └── register/
│   │       └── page.tsx          # Registration page
│   │
│   ├── (dashboard)/              # Dashboard route group
│   │   ├── worker/
│   │   │   └── page.tsx          # Worker dashboard
│   │   ├── client/
│   │   │   └── page.tsx          # Client dashboard
│   │   └── admin/
│   │       └── page.tsx          # Admin dashboard
│   │
│   ├── projects/                 # Project routes
│   │   ├── page.tsx              # Browse projects
│   │   ├── create/
│   │   │   └── page.tsx          # Create project
│   │   └── [id]/
│   │       └── page.tsx          # Project details
│   │
│   ├── profile/
│   │   └── page.tsx              # User profile
│   │
│   ├── api/                      # API routes
│   │   └── payments/
│   │       └── create-order/
│   │           ├── route.ts      # Payment API (stub)
│   │           └── backup_route.ts  # Full implementation
│   │
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   └── favicon.ico               # App icon
│
├── components/                   # React components
│   ├── ui/                       # UI primitives
│   │   ├── Button.tsx            # Button component
│   │   ├── Input.tsx             # Input component
│   │   └── Card.tsx              # Card components
│   │
│   └── shared/                   # Shared components
│       └── Navbar.tsx            # Navigation bar
│
├── lib/                          # Utilities & configs
│   ├── supabase/
│   │   ├── client.ts             # Client-side Supabase
│   │   └── server.ts             # Server-side Supabase
│   │
│   ├── razorpay.ts               # Razorpay utilities
│   └── constants/                # Constants (empty)
│
├── types/                        # TypeScript types
│   └── database.types.ts         # Database types
│
├── public/                       # Static assets
│   ├── *.svg                     # Icons
│   └── favicon.ico               # Favicon
│
├── node_modules/                 # Dependencies
├── .next/                        # Build output
│
├── package.json                  # Dependencies
├── package-lock.json             # Lock file
├── tsconfig.json                 # TypeScript config
├── next.config.ts                # Next.js config
├── tailwind.config.js            # Tailwind config
├── postcss.config.mjs            # PostCSS config
├── eslint.config.mjs             # ESLint config
├── .gitignore                    # Git ignore
├── .env.example                  # Env template
│
└── Documentation/
    ├── README.md                 # Main documentation
    ├── QUICKSTART.md             # Quick start guide
    ├── DEVELOPMENT.md            # Development guide
    ├── PROJECT_SUMMARY.md        # Project summary
    └── ARCHITECTURE.md           # This file
```

## 🔄 Data Flow

### Authentication Flow
```
User Input → Form Validation → Supabase Auth
                                      ↓
                              Create Auth User
                                      ↓
                              Create User Profile
                                      ↓
                              Return Session Token
                                      ↓
                              Store in Cookie
                                      ↓
                              Redirect to Dashboard
```

### Project Creation Flow
```
Client Dashboard → Create Project Button
                                      ↓
                              Project Form
                                      ↓
                              Form Validation
                                      ↓
                              Supabase Insert
                                      ↓
                              Update UI
                                      ↓
                              Redirect to Dashboard
```

### Project Browse Flow
```
Worker Dashboard → Browse Projects
                                      ↓
                              Fetch Open Projects
                                      ↓
                              Apply Filters
                                      ↓
                              Display Results
                                      ↓
                              Click Project
                                      ↓
                              Show Details
```

## 🔐 Security Architecture

### Authentication
```
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │ Credentials
       ▼
┌──────────────┐
│  Supabase    │ ← Handles auth logic
│    Auth      │ ← Issues JWT tokens
└──────┬───────┘
       │ Session Token
       ▼
┌──────────────┐
│    Cookie    │ ← Stored securely
│   (httpOnly)  │
└──────────────┘
```

### Authorization (Row Level Security)
```
Request → Check Session Token → Extract User ID
                                       ↓
                               Check RLS Policy
                                       ↓
                     ┌─────────────────┴──────────────────┐
                     ▼                                    ▼
                  ALLOW                                 DENY
                     ↓                                    ▼
              Return Data                          Return Error
```

### RLS Policies
```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Anyone can view open projects
CREATE POLICY "Anyone can view open projects"
  ON projects FOR SELECT
  USING (status = 'open' OR client_id = auth.uid());

-- Clients can create projects
CREATE POLICY "Clients can create projects"
  ON projects FOR INSERT
  WITH CHECK (client_id = auth.uid());
```

## 💳 Payment Architecture

### Payment Flow (Planned)
```
Client Creates Contract
         ↓
Calculate Amounts:
  • Contract Amount
  • Platform Fee (10%)
  • TDS (10%)
  • GST on Fee (18%)
         ↓
Create Razorpay Order
         ↓
Client Pays via Razorpay
         ↓
Webhook Notification
         ↓
Verify Payment
         ↓
Update Database:
  • Mark payment complete
  • Update contract status
  • Release funds to worker
         ↓
Generate Invoice & Form 16A
```

### Payment Calculation
```typescript
function calculatePaymentBreakdown(amount: number) {
  const platformFee = amount * 0.10      // 10%
  const tds = amount * 0.10              // 10%
  const gst = platformFee * 0.18         // 18%
  const workerPayout = amount - platformFee - tds
  
  return {
    grossAmount: amount,
    platformFee,
    tds,
    gst,
    netAmount: workerPayout
  }
}
```

## 🎨 Component Architecture

### Component Hierarchy
```
Page Component
  └── Layout Component
      ├── Navbar Component
      │   ├── Logo
      │   ├── Navigation Links
      │   └── User Menu
      │
      └── Main Content
          ├── Hero/Header Section
          │
          ├── Content Cards
          │   ├── Card Component
          │   │   ├── Card Header
          │   │   ├── Card Title
          │   │   ├── Card Description
          │   │   └── Card Content
          │   │
          │   └── Buttons & Inputs
          │       ├── Button Component
          │       └── Input Component
          │
          └── Footer (planned)
```

### Component Props Pattern
```typescript
// Type-safe props
interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  onClick?: () => void
  disabled?: boolean
  className?: string
}

// Flexible, reusable component
export function Button({ 
  variant = 'primary',
  size = 'md',
  ...props 
}: ButtonProps) {
  // Implementation
}
```

## 🔌 API Architecture

### REST API Pattern
```
POST /api/payments/create-order
  Body: { contractId, amount }
  Response: { orderId, amount, currency, breakdown }

GET /api/applications/[projectId] (planned)
  Response: { applications: [...] }

POST /api/applications/create (planned)
  Body: { projectId, workerId, proposal }
  Response: { success: true, applicationId }
```

### Error Handling
```typescript
try {
  const result = await operation()
  return NextResponse.json({ success: true, data: result })
} catch (error) {
  console.error('Operation failed:', error)
  return NextResponse.json(
    { error: 'Operation failed' },
    { status: 500 }
  )
}
```

## 📊 State Management

### Client-Side State
```typescript
// React useState for local state
const [formData, setFormData] = useState({ ... })
const [isLoading, setIsLoading] = useState(false)
const [errors, setErrors] = useState({})

// Supabase for server state
const { data: user } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single()
```

### State Flow
```
User Action → Update Local State → API Call
                                      ↓
                              Update Database
                                      ↓
                              Return New Data
                                      ↓
                              Update Local State
                                      ↓
                              Re-render UI
```

## 🚀 Build & Deploy Pipeline

### Build Process
```
Source Code
    ↓
TypeScript Compilation
    ↓
Next.js Build
    ↓
Static Generation (where possible)
    ↓
Server Component Bundling
    ↓
Client Component Bundling
    ↓
Optimization (minify, tree-shake)
    ↓
Output (.next folder)
```

### Deployment (Recommended: Vercel)
```
Git Push
    ↓
Vercel Detects Change
    ↓
Run Build Process
    ↓
Run Tests (when added)
    ↓
Deploy to Preview URL
    ↓
Manual Approval
    ↓
Deploy to Production
```

## 📈 Performance Strategy

### Current Optimizations
- Server-side rendering for faster initial load
- Static generation for public pages
- Code splitting by route
- Tree shaking unused code
- Image optimization (Next.js Image)

### Planned Optimizations
- Database query optimization with indexes
- Redis caching for frequently accessed data
- CDN for static assets
- Lazy loading for heavy components
- Skeleton loaders for better UX

## 🔍 Monitoring & Analytics (To Implement)

### Application Monitoring
```
┌──────────────────────────────────────┐
│     Client-Side Monitoring           │
│  • Page views                        │
│  • User interactions                 │
│  • Error tracking                    │
└─────────────┬────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│     Server-Side Monitoring           │
│  • API response times                │
│  • Database query performance        │
│  • Error rates                       │
└─────────────┬────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│         Analytics Platform           │
│  • Google Analytics / PostHog        │
│  • Custom dashboards                 │
└──────────────────────────────────────┘
```

## 🧪 Testing Strategy (To Implement)

### Testing Pyramid
```
        ┌─────┐
        │ E2E │ ← Full user journeys
        └─────┘
       ┌────────┐
       │ Integ- │ ← API + Database
       │ ration │
       └────────┘
     ┌────────────┐
     │    Unit    │ ← Components + Utils
     └────────────┘
```

## 🔄 Future Scalability

### Horizontal Scaling
- Stateless server architecture
- Database read replicas
- CDN for static assets
- Load balancer for API routes

### Vertical Scaling
- Database optimization
- Query caching
- Connection pooling
- Background job processing

---

**Architecture Status**: Foundation Complete ✅  
**Scalability**: Designed for Growth 📈  
**Security**: Enterprise-Ready 🔒  
**Performance**: Optimized 🚀
