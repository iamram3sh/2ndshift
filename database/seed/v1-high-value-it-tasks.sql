-- ============================================
-- 2ndShift V1 - High-Value IT Tasks Seed Data
-- ============================================
-- This seed file creates verified workers, high-value IT tasks, and sample bids
-- Run this after the main schema migration

-- ============================================
-- VERIFIED WORKERS (Trust Score 85-95)
-- ============================================

-- Worker 1: Senior DevOps Engineer
INSERT INTO users (id, email, full_name, user_type, created_at, updated_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'devops.senior@example.com', 'Rajesh Kumar', 'worker', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO worker_profiles (user_id, skills, experience_years, hourly_rate, bio, is_verified, verification_status, profile_completion, created_at, updated_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 
   ARRAY['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Linux'], 
   8, 3500, 
   'Senior DevOps engineer with 8+ years of experience in cloud infrastructure, containerization, and automation. Expert in AWS, Kubernetes, and CI/CD pipelines.',
   true, 'approved', 95, NOW(), NOW())
ON CONFLICT (user_id) DO UPDATE SET
  skills = EXCLUDED.skills,
  experience_years = EXCLUDED.experience_years,
  hourly_rate = EXCLUDED.hourly_rate,
  bio = EXCLUDED.bio,
  is_verified = EXCLUDED.is_verified,
  verification_status = EXCLUDED.verification_status,
  profile_completion = EXCLUDED.profile_completion;

-- Worker 2: ML/AI Engineer
INSERT INTO users (id, email, full_name, user_type, created_at, updated_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440002', 'ml.engineer@example.com', 'Priya Sharma', 'worker', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO worker_profiles (user_id, skills, experience_years, hourly_rate, bio, is_verified, verification_status, profile_completion, created_at, updated_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440002', 
   ARRAY['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'NLP', 'Computer Vision'], 
   6, 4000, 
   'ML/AI engineer specializing in deep learning, NLP, and computer vision. Built production ML systems for Fortune 500 companies.',
   true, 'approved', 92, NOW(), NOW())
ON CONFLICT (user_id) DO UPDATE SET
  skills = EXCLUDED.skills,
  experience_years = EXCLUDED.experience_years,
  hourly_rate = EXCLUDED.hourly_rate,
  bio = EXCLUDED.bio,
  is_verified = EXCLUDED.is_verified,
  verification_status = EXCLUDED.verification_status,
  profile_completion = EXCLUDED.profile_completion;

-- Worker 3: Security Specialist
INSERT INTO users (id, email, full_name, user_type, created_at, updated_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440003', 'security.expert@example.com', 'Amit Patel', 'worker', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO worker_profiles (user_id, skills, experience_years, hourly_rate, bio, is_verified, verification_status, profile_completion, created_at, updated_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440003', 
   ARRAY['Penetration Testing', 'OWASP', 'Security Audits', 'Vulnerability Assessment', 'Compliance'], 
   7, 4500, 
   'Certified security specialist (CEH, CISSP) with expertise in penetration testing, security audits, and compliance (SOC 2, ISO 27001).',
   true, 'approved', 90, NOW(), NOW())
ON CONFLICT (user_id) DO UPDATE SET
  skills = EXCLUDED.skills,
  experience_years = EXCLUDED.experience_years,
  hourly_rate = EXCLUDED.hourly_rate,
  bio = EXCLUDED.bio,
  is_verified = EXCLUDED.is_verified,
  verification_status = EXCLUDED.verification_status,
  profile_completion = EXCLUDED.profile_completion;

-- Update trust scores for workers (assuming trust_scores table exists or add to user_rating_summaries)
-- For now, we'll assume trust_score is calculated from ratings

-- ============================================
-- VERIFIED CLIENTS (High Trust Score)
-- ============================================

-- Client 1: Tech Startup
INSERT INTO users (id, email, full_name, user_type, created_at, updated_at)
VALUES 
  ('660e8400-e29b-41d4-a716-446655440001', 'client1@techstartup.com', 'Tech Startup Inc', 'client', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Client 2: Enterprise Company
INSERT INTO users (id, email, full_name, user_type, created_at, updated_at)
VALUES 
  ('660e8400-e29b-41d4-a716-446655440002', 'client2@enterprise.com', 'Enterprise Solutions Ltd', 'client', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

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

-- Task 1: Kubernetes Migration
INSERT INTO jobs (
  id, client_id, title, description, category_id, status, price_fixed, price_currency,
  delivery_window, required_skills, urgency, created_at, updated_at
)
SELECT 
  '770e8400-e29b-41d4-a716-446655440001',
  '660e8400-e29b-41d4-a716-446655440001',
  'Migrate Docker Compose Setup to Kubernetes',
  'We need to migrate our existing Docker Compose application to Kubernetes. The application consists of 5 microservices (Node.js, Python, PostgreSQL, Redis, Nginx). Requirements: 1) Design Kubernetes manifests (Deployments, Services, ConfigMaps, Secrets), 2) Set up Helm charts, 3) Configure ingress and load balancing, 4) Implement health checks and auto-scaling, 5) Document the migration process. Expected delivery: 1-2 weeks.',
  id,
  'open',
  25000, -- ₹250
  'INR',
  'oneTo4w',
  ARRAY['Kubernetes', 'Docker', 'Helm', 'CI/CD', 'AWS EKS'],
  'normal',
  NOW(),
  NOW()
FROM categories WHERE slug = 'devops'
ON CONFLICT (id) DO NOTHING;

-- Task 2: React Performance Optimization
INSERT INTO jobs (
  id, client_id, title, description, category_id, status, price_fixed, price_currency,
  delivery_window, required_skills, urgency, created_at, updated_at
)
SELECT 
  '770e8400-e29b-41d4-a716-446655440002',
  '660e8400-e29b-41d4-a716-446655440001',
  'Code Review & Performance Optimization for React App',
  'Our React application (Next.js 14, TypeScript) is experiencing performance issues. Need an expert to: 1) Review codebase and identify bottlenecks, 2) Optimize component rendering (memoization, code splitting), 3) Fix bundle size issues, 4) Improve Core Web Vitals (LCP, FID, CLS), 5) Provide recommendations for long-term performance. Codebase size: ~50 components, 3 main pages. Budget: ₹150-₹200.',
  id,
  'open',
  18000, -- ₹180
  'INR',
  'threeTo7d',
  ARRAY['React', 'Next.js', 'TypeScript', 'Performance Optimization', 'Web Vitals'],
  'urgent',
  NOW(),
  NOW()
FROM categories WHERE slug = 'frontend'
ON CONFLICT (id) DO NOTHING;

-- Task 3: ML Model Deployment Pipeline
INSERT INTO jobs (
  id, client_id, title, description, category_id, status, price_fixed, price_currency,
  delivery_window, required_skills, urgency, created_at, updated_at
)
SELECT 
  '770e8400-e29b-41d4-a716-446655440003',
  '660e8400-e29b-41d4-a716-446655440002',
  'Build MLOps Pipeline for Production ML Model',
  'We have a trained PyTorch model (image classification) and need a complete MLOps pipeline: 1) Model versioning (MLflow/DVC), 2) API endpoint (FastAPI) with model serving, 3) A/B testing framework, 4) Monitoring and alerting (model drift, performance metrics), 5) CI/CD integration. Infrastructure: AWS S3, ECS, CloudWatch. Timeline: 2-3 weeks.',
  id,
  'open',
  35000, -- ₹350
  'INR',
  'oneTo4w',
  ARRAY['MLOps', 'PyTorch', 'FastAPI', 'AWS', 'Docker', 'MLflow'],
  'normal',
  NOW(),
  NOW()
FROM categories WHERE slug = 'ml-ai'
ON CONFLICT (id) DO NOTHING;

-- Task 4: Security Audit
INSERT INTO jobs (
  id, client_id, title, description, category_id, status, price_fixed, price_currency,
  delivery_window, required_skills, urgency, created_at, updated_at
)
SELECT 
  '770e8400-e29b-41d4-a716-446655440004',
  '660e8400-e29b-41d4-a716-446655440002',
  'Security Audit & Penetration Testing for Web Application',
  'Comprehensive security audit for our Node.js/Express REST API and React frontend. Scope: 1) OWASP Top 10 vulnerability assessment, 2) Penetration testing (authorized), 3) Code review for security issues, 4) API security testing, 5) Detailed report with remediation steps. Application handles sensitive user data (PII). Compliance: GDPR, SOC 2.',
  id,
  'open',
  30000, -- ₹300
  'INR',
  'threeTo7d',
  ARRAY['Penetration Testing', 'OWASP', 'Security Audits', 'Node.js', 'API Security'],
  'urgent',
  NOW(),
  NOW()
FROM categories WHERE slug = 'security'
ON CONFLICT (id) DO NOTHING;

-- Task 5: Database Optimization
INSERT INTO jobs (
  id, client_id, title, description, category_id, status, price_fixed, price_currency,
  delivery_window, required_skills, urgency, created_at, updated_at
)
SELECT 
  '770e8400-e29b-41d4-a716-446655440005',
  '660e8400-e29b-41d4-a716-446655440001',
  'PostgreSQL Database Performance Optimization',
  'Our PostgreSQL database (v14) is experiencing slow query performance. Need expert to: 1) Analyze slow queries and execution plans, 2) Optimize indexes and query structure, 3) Review schema design, 4) Implement connection pooling, 5) Provide recommendations for scaling. Database size: ~50GB, 10M+ rows. Current issues: N+1 queries, missing indexes, inefficient joins.',
  id,
  'open',
  12000, -- ₹120
  'INR',
  'threeTo7d',
  ARRAY['PostgreSQL', 'Database Optimization', 'Query Optimization', 'Indexing'],
  'normal',
  NOW(),
  NOW()
FROM categories WHERE slug = 'database'
ON CONFLICT (id) DO NOTHING;

-- Task 6: API Development
INSERT INTO jobs (
  id, client_id, title, description, category_id, status, price_fixed, price_currency,
  delivery_window, required_skills, urgency, created_at, updated_at
)
SELECT 
  '770e8400-e29b-41d4-a716-446655440006',
  '660e8400-e29b-41d4-a716-446655440002',
  'Build RESTful API with Authentication & Rate Limiting',
  'Develop a production-ready REST API using Node.js/Express or Python/FastAPI. Features: 1) JWT authentication, 2) Role-based access control (RBAC), 3) Rate limiting, 4) Input validation, 5) API documentation (OpenAPI/Swagger), 6) Error handling and logging. Database: PostgreSQL. Expected endpoints: 10-15 routes.',
  id,
  'open',
  15000, -- ₹150
  'INR',
  'oneTo4w',
  ARRAY['Node.js', 'Express', 'REST API', 'JWT', 'PostgreSQL', 'OpenAPI'],
  'normal',
  NOW(),
  NOW()
FROM categories WHERE slug = 'backend'
ON CONFLICT (id) DO NOTHING;

-- Task 7: CI/CD Pipeline Setup
INSERT INTO jobs (
  id, client_id, title, description, category_id, status, price_fixed, price_currency,
  delivery_window, required_skills, urgency, created_at, updated_at
)
SELECT 
  '770e8400-e29b-41d4-a716-446655440007',
  '660e8400-e29b-41d4-a716-446655440001',
  'Set up CI/CD Pipeline with GitHub Actions',
  'Configure a complete CI/CD pipeline for our monorepo (React frontend + Node.js backend). Requirements: 1) Automated testing (unit, integration), 2) Linting and code quality checks, 3) Build and Docker image creation, 4) Automated deployment to staging/production, 5) Slack notifications. Infrastructure: AWS ECS, Docker Hub.',
  id,
  'open',
  10000, -- ₹100
  'INR',
  'threeTo7d',
  ARRAY['GitHub Actions', 'CI/CD', 'Docker', 'AWS', 'Node.js'],
  'normal',
  NOW(),
  NOW()
FROM categories WHERE slug = 'devops'
ON CONFLICT (id) DO NOTHING;

-- Task 8: Microservices Architecture Review
INSERT INTO jobs (
  id, client_id, title, description, category_id, status, price_fixed, price_currency,
  delivery_window, required_skills, urgency, created_at, updated_at
)
SELECT 
  '770e8400-e29b-41d4-a716-446655440008',
  '660e8400-e29b-41d4-a716-446655440002',
  'Architecture Review: Microservices Design & Best Practices',
  'Review our microservices architecture (5 services, Node.js/Python) and provide recommendations: 1) Service boundaries and communication patterns, 2) Data consistency strategies, 3) API gateway design, 4) Observability (logging, tracing, metrics), 5) Deployment and scaling strategies. Deliverable: Architecture review document with diagrams and recommendations.',
  id,
  'open',
  20000, -- ₹200
  'INR',
  'oneTo4w',
  ARRAY['Microservices', 'System Design', 'Architecture', 'Node.js', 'Python'],
  'normal',
  NOW(),
  NOW()
FROM categories WHERE slug = 'backend'
ON CONFLICT (id) DO NOTHING;

-- Task 9: Frontend Component Library
INSERT INTO jobs (
  id, client_id, title, description, category_id, status, price_fixed, price_currency,
  delivery_window, required_skills, urgency, created_at, updated_at
)
SELECT 
  '770e8400-e29b-41d4-a716-446655440009',
  '660e8400-e29b-41d4-a716-446655440001',
  'Build Reusable React Component Library',
  'Create a design system component library using React, TypeScript, and Storybook. Components needed: Button, Input, Select, Modal, Table, Form, Card, Badge, Toast. Requirements: 1) TypeScript types, 2) Storybook documentation, 3) Unit tests (Jest + React Testing Library), 4) Accessibility (WCAG 2.1 AA), 5) NPM package setup.',
  id,
  'open',
  22000, -- ₹220
  'INR',
  'oneTo4w',
  ARRAY['React', 'TypeScript', 'Storybook', 'Component Library', 'Jest'],
  'normal',
  NOW(),
  NOW()
FROM categories WHERE slug = 'frontend'
ON CONFLICT (id) DO NOTHING;

-- Task 10: Data Pipeline ETL
INSERT INTO jobs (
  id, client_id, title, description, category_id, status, price_fixed, price_currency,
  delivery_window, required_skills, urgency, created_at, updated_at
)
SELECT 
  '770e8400-e29b-41d4-a716-446655440010',
  '660e8400-e29b-41d4-a716-446655440002',
  'Build ETL Pipeline for Data Processing',
  'Design and implement an ETL pipeline to process daily data from multiple sources (CSV, JSON, APIs) and load into data warehouse. Requirements: 1) Data validation and cleaning, 2) Transformations and aggregations, 3) Error handling and retry logic, 4) Monitoring and alerting, 5) Documentation. Tech stack: Python (Pandas/Airflow), PostgreSQL, AWS S3.',
  id,
  'open',
  18000, -- ₹180
  'INR',
  'oneTo4w',
  ARRAY['ETL', 'Python', 'Airflow', 'PostgreSQL', 'AWS', 'Data Processing'],
  'normal',
  NOW(),
  NOW()
FROM categories WHERE slug = 'backend'
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SAMPLE BIDS
-- ============================================

-- Initialize shift credits for workers
INSERT INTO shift_credits (user_id, balance, reserved, created_at, updated_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 50, 0, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 50, 0, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', 50, 0, NOW(), NOW())
ON CONFLICT (user_id) DO NOTHING;

-- Bid 1: DevOps worker on Kubernetes task
INSERT INTO applications (
  id, project_id, worker_id, cover_text, proposed_price, credits_used, status, submitted_at
)
VALUES (
  '880e8400-e29b-41d4-a716-446655440001',
  '770e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440001',
  'I have extensive experience migrating Docker Compose setups to Kubernetes. I''ve completed 10+ similar migrations for production applications. I can deliver this in 1.5 weeks with comprehensive documentation and Helm charts. I''ll also set up monitoring and auto-scaling configurations.',
  25000,
  3,
  'pending',
  NOW() - INTERVAL '2 days'
)
ON CONFLICT (id) DO NOTHING;

-- Bid 2: ML engineer on MLOps task
INSERT INTO applications (
  id, project_id, worker_id, cover_text, proposed_price, credits_used, status, submitted_at
)
VALUES (
  '880e8400-e29b-41d4-a716-446655440002',
  '770e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440002',
  'I specialize in MLOps and have built production ML pipelines for multiple companies. I''ll use MLflow for model versioning, FastAPI for serving, and integrate with AWS services. I can deliver a complete, production-ready pipeline in 2 weeks with comprehensive monitoring.',
  35000,
  3,
  'pending',
  NOW() - INTERVAL '1 day'
)
ON CONFLICT (id) DO NOTHING;

-- Bid 3: Security expert on security audit
INSERT INTO applications (
  id, project_id, worker_id, cover_text, proposed_price, credits_used, status, submitted_at
)
VALUES (
  '880e8400-e29b-41d4-a716-446655440003',
  '770e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440003',
  'Certified security specialist (CEH, CISSP) with 7+ years of experience. I''ll conduct a thorough security audit following OWASP guidelines, perform authorized penetration testing, and provide a detailed report with prioritized remediation steps. I can complete this in 5-7 days.',
  30000,
  3,
  'pending',
  NOW() - INTERVAL '3 hours'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VERIFICATION
-- ============================================

-- Verify seed data
DO $$
DECLARE
  worker_count INT;
  task_count INT;
  bid_count INT;
BEGIN
  SELECT COUNT(*) INTO worker_count FROM worker_profiles WHERE is_verified = true;
  SELECT COUNT(*) INTO task_count FROM jobs WHERE status = 'open' AND price_fixed >= 9000;
  SELECT COUNT(*) INTO bid_count FROM applications WHERE status = 'pending';
  
  RAISE NOTICE 'Seed data verification:';
  RAISE NOTICE '  Verified workers: %', worker_count;
  RAISE NOTICE '  High-value tasks (₹90+): %', task_count;
  RAISE NOTICE '  Pending bids: %', bid_count;
END $$;
