-- =====================================================
-- 2ndShift - MICROTASKS SEED DATA
-- Initial microtasks for skill verification
-- =====================================================

-- Note: created_by will be NULL for system-created tasks
-- In production, set to an admin user ID

-- =====================================================
-- BEGINNER LEVEL MICROTASKS
-- =====================================================

-- Task 1: Simple API Endpoint
INSERT INTO microtasks (title, description, skill_category, difficulty, test_input, expected_output, grader_script, time_limit_minutes, is_active)
VALUES (
  'Create a Simple REST API Endpoint',
  'Create a REST API endpoint that accepts a POST request with JSON data containing a "name" field and returns a JSON response with a greeting message.',
  'backend',
  'beginner',
  '{"name": "John"}'::jsonb,
  '{"message": "Hello, John!"}'::jsonb,
  'function grade(submission) { 
    // Mock grader - in production, this would test the actual endpoint
    return { passed: true, score: 100, feedback: "Endpoint created successfully" };
  }',
  60,
  true
) ON CONFLICT DO NOTHING;

-- Task 2: HTML Form Validation
INSERT INTO microtasks (title, description, skill_category, difficulty, test_input, expected_output, grader_script, time_limit_minutes, is_active)
VALUES (
  'HTML Form with JavaScript Validation',
  'Create an HTML form with email and password fields. Add JavaScript validation to ensure email format is correct and password is at least 8 characters.',
  'frontend',
  'beginner',
  '{"email": "test@example.com", "password": "password123"}'::jsonb,
  '{"valid": true}'::jsonb,
  'function grade(submission) {
    return { passed: true, score: 100, feedback: "Form validation implemented" };
  }',
  45,
  true
) ON CONFLICT DO NOTHING;

-- Task 3: Database Query
INSERT INTO microtasks (title, description, skill_category, difficulty, test_input, expected_output, grader_script, time_limit_minutes, is_active)
VALUES (
  'Write a SQL Query',
  'Write a SQL query to select all users from a "users" table where the "status" column equals "active", ordered by "created_at" descending.',
  'database',
  'beginner',
  '{"table": "users", "status": "active"}'::jsonb,
  '{"query": "SELECT * FROM users WHERE status = ''active'' ORDER BY created_at DESC"}'::jsonb,
  'function grade(submission) {
    return { passed: true, score: 100, feedback: "Query written correctly" };
  }',
  30,
  true
) ON CONFLICT DO NOTHING;

-- =====================================================
-- INTERMEDIATE LEVEL MICROTASKS
-- =====================================================

-- Task 4: React Component
INSERT INTO microtasks (title, description, skill_category, difficulty, test_input, expected_output, grader_script, time_limit_minutes, is_active)
VALUES (
  'Build a React Todo Component',
  'Create a React component that displays a list of todos. Include functionality to add new todos, mark todos as complete, and delete todos. Use React hooks (useState).',
  'frontend',
  'intermediate',
  '{"todos": [{"id": 1, "text": "Test todo", "completed": false}]}'::jsonb,
  '{"component": "rendered", "functionality": "working"}'::jsonb,
  'function grade(submission) {
    return { passed: true, score: 100, feedback: "Component built successfully" };
  }',
  90,
  true
) ON CONFLICT DO NOTHING;

-- Task 5: API with Authentication
INSERT INTO microtasks (title, description, skill_category, difficulty, test_input, expected_output, grader_script, time_limit_minutes, is_active)
VALUES (
  'Create an Authenticated API Endpoint',
  'Create a REST API endpoint that requires JWT authentication. The endpoint should return user profile data when a valid JWT token is provided in the Authorization header.',
  'backend',
  'intermediate',
  '{"token": "valid_jwt_token"}'::jsonb,
  '{"user": {"id": 1, "name": "John"}}'::jsonb,
  'function grade(submission) {
    return { passed: true, score: 100, feedback: "Authentication implemented" };
  }',
  120,
  true
) ON CONFLICT DO NOTHING;

-- Task 6: Database Migration
INSERT INTO microtasks (title, description, skill_category, difficulty, test_input, expected_output, grader_script, time_limit_minutes, is_active)
VALUES (
  'Create a Database Migration',
  'Write a database migration script that adds a new "email_verified" boolean column to an existing "users" table, with a default value of false.',
  'database',
  'intermediate',
  '{"table": "users", "column": "email_verified"}'::jsonb,
  '{"migration": "created"}'::jsonb,
  'function grade(submission) {
    return { passed: true, score: 100, feedback: "Migration created" };
  }',
  45,
  true
) ON CONFLICT DO NOTHING;

-- =====================================================
-- ADVANCED LEVEL MICROTASKS
-- =====================================================

-- Task 7: Full-Stack Feature
INSERT INTO microtasks (title, description, skill_category, difficulty, test_input, expected_output, grader_script, time_limit_minutes, is_active)
VALUES (
  'Build a Full-Stack Feature',
  'Create a complete feature with frontend and backend: A user dashboard that displays user statistics fetched from an API. Include loading states, error handling, and responsive design.',
  'fullstack',
  'advanced',
  '{"userId": 1}'::jsonb,
  '{"dashboard": "rendered", "data": "loaded"}'::jsonb,
  'function grade(submission) {
    return { passed: true, score: 100, feedback: "Feature implemented" };
  }',
  180,
  true
) ON CONFLICT DO NOTHING;

-- Task 8: CI/CD Pipeline
INSERT INTO microtasks (title, description, skill_category, difficulty, test_input, expected_output, grader_script, time_limit_minutes, is_active)
VALUES (
  'Set Up CI/CD Pipeline',
  'Create a CI/CD pipeline configuration (GitHub Actions, GitLab CI, or similar) that runs tests, builds the application, and deploys to a staging environment on push to main branch.',
  'devops',
  'advanced',
  '{"branch": "main"}'::jsonb,
  '{"pipeline": "configured", "deployed": true}'::jsonb,
  'function grade(submission) {
    return { passed: true, score: 100, feedback: "Pipeline configured" };
  }',
  120,
  true
) ON CONFLICT DO NOTHING;

-- Task 9: Performance Optimization
INSERT INTO microtasks (title, description, skill_category, difficulty, test_input, expected_output, grader_script, time_limit_minutes, is_active)
VALUES (
  'Optimize Database Query Performance',
  'Given a slow SQL query, optimize it by adding appropriate indexes, rewriting the query if necessary, and explaining the performance improvements.',
  'database',
  'advanced',
  '{"query": "SELECT * FROM orders o JOIN users u ON o.user_id = u.id WHERE o.created_at > NOW() - INTERVAL ''30 days''"}'::jsonb,
  '{"optimized": true, "performance_improved": true}'::jsonb,
  'function grade(submission) {
    return { passed: true, score: 100, feedback: "Query optimized" };
  }',
  90,
  true
) ON CONFLICT DO NOTHING;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Microtasks seed data inserted successfully!';
  RAISE NOTICE 'Total microtasks: 9 (3 beginner, 3 intermediate, 3 advanced)';
END $$;

