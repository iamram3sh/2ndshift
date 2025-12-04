-- ============================================
-- 2ndShift V1 - High-Value IT Tasks Seed Data
-- ============================================
-- This seed file creates verified workers, high-value IT tasks, and sample bids
-- Run this after the main schema migration

-- ============================================
-- IMPORTANT: This seed script requires existing users in auth.users
-- ============================================
-- Before running this script:
-- 1. Create users via the registration API or Supabase Auth Dashboard
-- 2. OR use existing users from your database
-- 3. Update the user IDs below to match your actual users
-- ============================================

-- Get or use existing client users (create jobs with first available client)
DO $$
DECLARE
  existing_client_id UUID;
  existing_worker_id UUID;
BEGIN
  -- Get first client user, or use a placeholder
  SELECT id INTO existing_client_id 
  FROM users 
  WHERE user_type = 'client' 
  LIMIT 1;
  
  -- Get first worker user for bids
  SELECT id INTO existing_worker_id 
  FROM users 
  WHERE user_type = 'worker' 
  LIMIT 1;
  
  -- If no users exist, we'll create jobs that can be assigned later
  -- For now, we'll skip user creation and just create categories and jobs
  -- Jobs will need to be created with actual client IDs from your database
END $$;

-- ============================================
-- NOTE: User creation skipped - use existing users or create via API
-- ============================================
-- Worker profiles will be created/updated for existing worker users
-- Uncomment and update with your actual worker user IDs if needed:
-- ============================================
/*
-- Example: Update worker profile for existing worker
UPDATE worker_profiles SET
  skills = ARRAY['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Linux'],
  experience_years = 8,
  hourly_rate = 3500,
  bio = 'Senior DevOps engineer with 8+ years of experience in cloud infrastructure, containerization, and automation. Expert in AWS, Kubernetes, and CI/CD pipelines.',
  is_verified = true
WHERE user_id = 'YOUR_WORKER_USER_ID_HERE';
*/

-- Worker profiles are commented out since they require existing users
-- To update worker profiles for existing users, use UPDATE statements like:
/*
UPDATE worker_profiles SET
  skills = ARRAY['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'NLP', 'Computer Vision'],
  experience_years = 6,
  hourly_rate = 4000,
  bio = 'ML/AI engineer specializing in deep learning, NLP, and computer vision.',
  is_verified = true
WHERE user_id = 'YOUR_WORKER_USER_ID_HERE';
*/

-- Update trust scores for workers (assuming trust_scores table exists or add to user_rating_summaries)
-- For now, we'll assume trust_score is calculated from ratings

-- ============================================
-- NOTE: Client users must be created via registration API or Supabase Auth
-- ============================================
-- The seed script will use existing client users from your database
-- Make sure you have at least one client user before running this script

-- ============================================
-- CATEGORIES (IT-focused)
-- ============================================

-- Get or create categories (assuming they exist, otherwise create)
DO $$
DECLARE
  frontend_id UUID;
  backend_id UUID;
  devops_id UUID;
  ml_ai_id UUID;
  security_id UUID;
  database_id UUID;
BEGIN
  -- Frontend Development
  INSERT INTO categories (id, slug, name, description, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), 'frontend', 'Frontend Development', 'React, Vue, Angular, Next.js development', true, NOW(), NOW())
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO frontend_id;

  -- Backend Development
  INSERT INTO categories (id, slug, name, description, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), 'backend', 'Backend Development', 'Node.js, Python, Go, API development', true, NOW(), NOW())
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO backend_id;

  -- DevOps
  INSERT INTO categories (id, slug, name, description, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), 'devops', 'DevOps & Infrastructure', 'Docker, Kubernetes, CI/CD, Cloud infrastructure', true, NOW(), NOW())
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO devops_id;

  -- ML/AI
  INSERT INTO categories (id, slug, name, description, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), 'ml-ai', 'ML/AI Engineering', 'Machine Learning, Deep Learning, NLP, Computer Vision', true, NOW(), NOW())
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO ml_ai_id;

  -- Security
  INSERT INTO categories (id, slug, name, description, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), 'security', 'Security & Penetration Testing', 'Security audits, penetration testing, compliance', true, NOW(), NOW())
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO security_id;

  -- Database
  INSERT INTO categories (id, slug, name, description, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), 'database', 'Database Administration', 'PostgreSQL, MongoDB, Redis, Database optimization', true, NOW(), NOW())
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO database_id;
END $$;

-- ============================================
-- HIGH-VALUE IT TASKS (₹90-₹350 range)
-- ============================================
-- These tasks will be created with the first available client user
-- If no client exists, tasks will fail to create (client_id is required)
-- ============================================

-- Task 1: Kubernetes Migration
INSERT INTO jobs (
  id, client_id, title, description, category_id, status, price_fixed, price_currency,
  delivery_window, required_skills, created_at, updated_at
)
SELECT 
  '770e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM users WHERE user_type = 'client' LIMIT 1),
  'Migrate Docker Compose Setup to Kubernetes',
  'We need to migrate our existing Docker Compose application to Kubernetes. The application consists of 5 microservices (Node.js, Python, PostgreSQL, Redis, Nginx). Requirements: 1) Design Kubernetes manifests (Deployments, Services, ConfigMaps, Secrets), 2) Set up Helm charts, 3) Configure ingress and load balancing, 4) Implement health checks and auto-scaling, 5) Document the migration process. Expected delivery: 1-2 weeks.',
  id,
  'open',
  25000, -- ₹250
  'INR',
  '1-4w',
  ARRAY['Kubernetes', 'Docker', 'Helm', 'CI/CD', 'AWS EKS'],
  NOW(),
  NOW()
FROM categories WHERE slug = 'devops'
ON CONFLICT (id) DO NOTHING;

-- Task 2: React Performance Optimization
INSERT INTO jobs (
  id, client_id, title, description, category_id, status, price_fixed, price_currency,
  delivery_window, required_skills, created_at, updated_at
)
SELECT 
  '770e8400-e29b-41d4-a716-446655440002',
  (SELECT id FROM users WHERE user_type = 'client' LIMIT 1),
  'Code Review & Performance Optimization for React App',
  'Our React application (Next.js 14, TypeScript) is experiencing performance issues. Need an expert to: 1) Review codebase and identify bottlenecks, 2) Optimize component rendering (memoization, code splitting), 3) Fix bundle size issues, 4) Improve Core Web Vitals (LCP, FID, CLS), 5) Provide recommendations for long-term performance. Codebase size: ~50 components, 3 main pages. Budget: ₹150-₹200.',
  id,
  'open',
  18000, -- ₹180
  'INR',
  '3-7d',
  ARRAY['React', 'Next.js', 'TypeScript', 'Performance Optimization', 'Web Vitals'],
  NOW(),
  NOW()
FROM categories WHERE slug = 'frontend'
ON CONFLICT (id) DO NOTHING;

-- Task 3: ML Model Deployment Pipeline
INSERT INTO jobs (
  id, client_id, title, description, category_id, status, price_fixed, price_currency,
  delivery_window, required_skills, created_at, updated_at
)
SELECT 
  '770e8400-e29b-41d4-a716-446655440003',
  (SELECT id FROM users WHERE user_type = 'client' LIMIT 1),
  'Build MLOps Pipeline for Production ML Model',
  'We have a trained PyTorch model (image classification) and need a complete MLOps pipeline: 1) Model versioning (MLflow/DVC), 2) API endpoint (FastAPI) with model serving, 3) A/B testing framework, 4) Monitoring and alerting (model drift, performance metrics), 5) CI/CD integration. Infrastructure: AWS S3, ECS, CloudWatch. Timeline: 2-3 weeks.',
  id,
  'open',
  35000, -- ₹350
  'INR',
  '1-4w',
  ARRAY['MLOps', 'PyTorch', 'FastAPI', 'AWS', 'Docker', 'MLflow'],
  NOW(),
  NOW()
FROM categories WHERE slug = 'ml-ai'
ON CONFLICT (id) DO NOTHING;

-- Task 4: Security Audit
INSERT INTO jobs (
  id, client_id, title, description, category_id, status, price_fixed, price_currency,
  delivery_window, required_skills, created_at, updated_at
)
SELECT 
  '770e8400-e29b-41d4-a716-446655440004',
  (SELECT id FROM users WHERE user_type = 'client' LIMIT 1),
  'Security Audit & Penetration Testing for Web Application',
  'Comprehensive security audit for our Node.js/Express REST API and React frontend. Scope: 1) OWASP Top 10 vulnerability assessment, 2) Penetration testing (authorized), 3) Code review for security issues, 4) API security testing, 5) Detailed report with remediation steps. Application handles sensitive user data (PII). Compliance: GDPR, SOC 2.',
  id,
  'open',
  30000, -- ₹300
  'INR',
  '3-7d',
  ARRAY['Penetration Testing', 'OWASP', 'Security Audits', 'Node.js', 'API Security'],
  NOW(),
  NOW()
FROM categories WHERE slug = 'security'
ON CONFLICT (id) DO NOTHING;

-- Task 5: Database Optimization
INSERT INTO jobs (
  id, client_id, title, description, category_id, status, price_fixed, price_currency,
  delivery_window, required_skills, created_at, updated_at
)
SELECT 
  '770e8400-e29b-41d4-a716-446655440005',
  (SELECT id FROM users WHERE user_type = 'client' LIMIT 1),
  'PostgreSQL Database Performance Optimization',
  'Our PostgreSQL database (v14) is experiencing slow query performance. Need expert to: 1) Analyze slow queries and execution plans, 2) Optimize indexes and query structure, 3) Review schema design, 4) Implement connection pooling, 5) Provide recommendations for scaling. Database size: ~50GB, 10M+ rows. Current issues: N+1 queries, missing indexes, inefficient joins.',
  id,
  'open',
  12000, -- ₹120
  'INR',
  '3-7d',
  ARRAY['PostgreSQL', 'Database Optimization', 'Query Optimization', 'Indexing'],
  NOW(),
  NOW()
FROM categories WHERE slug = 'database'
ON CONFLICT (id) DO NOTHING;

-- Task 6: API Development
INSERT INTO jobs (
  id, client_id, title, description, category_id, status, price_fixed, price_currency,
  delivery_window, required_skills, created_at, updated_at
)
SELECT 
  '770e8400-e29b-41d4-a716-446655440006',
  (SELECT id FROM users WHERE user_type = 'client' LIMIT 1),
  'Build RESTful API with Authentication & Rate Limiting',
  'Develop a production-ready REST API using Node.js/Express or Python/FastAPI. Features: 1) JWT authentication, 2) Role-based access control (RBAC), 3) Rate limiting, 4) Input validation, 5) API documentation (OpenAPI/Swagger), 6) Error handling and logging. Database: PostgreSQL. Expected endpoints: 10-15 routes.',
  id,
  'open',
  15000, -- ₹150
  'INR',
  '1-4w',
  ARRAY['Node.js', 'Express', 'REST API', 'JWT', 'PostgreSQL', 'OpenAPI'],
  NOW(),
  NOW()
FROM categories WHERE slug = 'backend'
ON CONFLICT (id) DO NOTHING;

-- Task 7: CI/CD Pipeline Setup
INSERT INTO jobs (
  id, client_id, title, description, category_id, status, price_fixed, price_currency,
  delivery_window, required_skills, created_at, updated_at
)
SELECT 
  '770e8400-e29b-41d4-a716-446655440007',
  (SELECT id FROM users WHERE user_type = 'client' LIMIT 1),
  'Set up CI/CD Pipeline with GitHub Actions',
  'Configure a complete CI/CD pipeline for our monorepo (React frontend + Node.js backend). Requirements: 1) Automated testing (unit, integration), 2) Linting and code quality checks, 3) Build and Docker image creation, 4) Automated deployment to staging/production, 5) Slack notifications. Infrastructure: AWS ECS, Docker Hub.',
  id,
  'open',
  10000, -- ₹100
  'INR',
  '3-7d',
  ARRAY['GitHub Actions', 'CI/CD', 'Docker', 'AWS', 'Node.js'],
  NOW(),
  NOW()
FROM categories WHERE slug = 'devops'
ON CONFLICT (id) DO NOTHING;

-- Task 8: Microservices Architecture Review
INSERT INTO jobs (
  id, client_id, title, description, category_id, status, price_fixed, price_currency,
  delivery_window, required_skills, created_at, updated_at
)
SELECT 
  '770e8400-e29b-41d4-a716-446655440008',
  (SELECT id FROM users WHERE user_type = 'client' LIMIT 1),
  'Architecture Review: Microservices Design & Best Practices',
  'Review our microservices architecture (5 services, Node.js/Python) and provide recommendations: 1) Service boundaries and communication patterns, 2) Data consistency strategies, 3) API gateway design, 4) Observability (logging, tracing, metrics), 5) Deployment and scaling strategies. Deliverable: Architecture review document with diagrams and recommendations.',
  id,
  'open',
  20000, -- ₹200
  'INR',
  '1-4w',
  ARRAY['Microservices', 'System Design', 'Architecture', 'Node.js', 'Python'],
  NOW(),
  NOW()
FROM categories WHERE slug = 'backend'
ON CONFLICT (id) DO NOTHING;

-- Task 9: Frontend Component Library
INSERT INTO jobs (
  id, client_id, title, description, category_id, status, price_fixed, price_currency,
  delivery_window, required_skills, created_at, updated_at
)
SELECT 
  '770e8400-e29b-41d4-a716-446655440009',
  (SELECT id FROM users WHERE user_type = 'client' LIMIT 1),
  'Build Reusable React Component Library',
  'Create a design system component library using React, TypeScript, and Storybook. Components needed: Button, Input, Select, Modal, Table, Form, Card, Badge, Toast. Requirements: 1) TypeScript types, 2) Storybook documentation, 3) Unit tests (Jest + React Testing Library), 4) Accessibility (WCAG 2.1 AA), 5) NPM package setup.',
  id,
  'open',
  22000, -- ₹220
  'INR',
  '1-4w',
  ARRAY['React', 'TypeScript', 'Storybook', 'Component Library', 'Jest'],
  NOW(),
  NOW()
FROM categories WHERE slug = 'frontend'
ON CONFLICT (id) DO NOTHING;

-- Task 10: Data Pipeline ETL
INSERT INTO jobs (
  id, client_id, title, description, category_id, status, price_fixed, price_currency,
  delivery_window, required_skills, created_at, updated_at
)
SELECT 
  '770e8400-e29b-41d4-a716-446655440010',
  (SELECT id FROM users WHERE user_type = 'client' LIMIT 1),
  'Build ETL Pipeline for Data Processing',
  'Design and implement an ETL pipeline to process daily data from multiple sources (CSV, JSON, APIs) and load into data warehouse. Requirements: 1) Data validation and cleaning, 2) Transformations and aggregations, 3) Error handling and retry logic, 4) Monitoring and alerting, 5) Documentation. Tech stack: Python (Pandas/Airflow), PostgreSQL, AWS S3.',
  id,
  'open',
  18000, -- ₹180
  'INR',
  '1-4w',
  ARRAY['ETL', 'Python', 'Airflow', 'PostgreSQL', 'AWS', 'Data Processing'],
  NOW(),
  NOW()
FROM categories WHERE slug = 'backend'
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SAMPLE BIDS (Optional - requires existing workers)
-- ============================================
-- Uncomment and update with your actual worker IDs if you want sample bids
-- ============================================
/*
-- Initialize shift credits for existing workers
INSERT INTO shift_credits (user_id, balance, reserved, created_at, updated_at)
SELECT id, 50, 0, NOW(), NOW()
FROM users 
WHERE user_type = 'worker'
ON CONFLICT (user_id) DO NOTHING;

-- Sample bid (update worker_id with actual worker user ID)
INSERT INTO applications (
  id, project_id, worker_id, cover_text, proposed_price, credits_used, status, submitted_at
)
SELECT 
  '880e8400-e29b-41d4-a716-446655440001',
  '770e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM users WHERE user_type = 'worker' LIMIT 1),
  'I have extensive experience migrating Docker Compose setups to Kubernetes. I''ve completed 10+ similar migrations for production applications.',
  25000,
  3,
  'pending',
  NOW() - INTERVAL '2 days'
WHERE EXISTS (SELECT 1 FROM users WHERE user_type = 'worker' LIMIT 1)
ON CONFLICT (id) DO NOTHING;
*/

-- ============================================
-- VERIFICATION
-- ============================================
DO $$
DECLARE
  client_count INT;
  task_count INT;
  category_count INT;
BEGIN
  SELECT COUNT(*) INTO client_count FROM users WHERE user_type = 'client';
  SELECT COUNT(*) INTO task_count FROM jobs WHERE status = 'open' AND price_fixed >= 9000;
  SELECT COUNT(*) INTO category_count FROM categories WHERE is_active = true;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Seed data verification:';
  RAISE NOTICE '  Client users: %', client_count;
  RAISE NOTICE '  High-value tasks (₹90+): %', task_count;
  RAISE NOTICE '  Active categories: %', category_count;
  RAISE NOTICE '========================================';
  
  IF client_count = 0 THEN
    RAISE WARNING 'No client users found! Tasks require a client user.';
    RAISE WARNING 'Please create at least one client user via registration or Supabase Auth.';
  END IF;
  
  IF task_count = 0 THEN
    RAISE WARNING 'No tasks created! This may be because:';
    RAISE WARNING '  1. No client users exist';
    RAISE WARNING '  2. Categories do not exist';
    RAISE WARNING '  3. Jobs already exist with same IDs';
  END IF;
END $$;
