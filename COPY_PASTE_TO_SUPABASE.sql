-- =====================================================
-- Dynamic Skills System - Learn from Users
-- Auto-populates skills from all projects and profiles
-- =====================================================

-- =====================================================
-- SKILLS MASTER TABLE (Optional but Recommended)
-- =====================================================
CREATE TABLE IF NOT EXISTS skills_master (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_name TEXT UNIQUE NOT NULL,
  category TEXT, -- e.g., 'Programming', 'Design', 'Marketing', 'Construction', etc.
  usage_count INTEGER DEFAULT 1,
  first_used_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  is_verified BOOLEAN DEFAULT false, -- Admin can verify legitimate skills
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_skills_master_name ON skills_master(LOWER(skill_name));
CREATE INDEX IF NOT EXISTS idx_skills_master_category ON skills_master(category);
CREATE INDEX IF NOT EXISTS idx_skills_master_usage ON skills_master(usage_count DESC);

-- =====================================================
-- SKILL CATEGORIES (Predefined but extensible)
-- =====================================================
CREATE TABLE IF NOT EXISTS skill_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT, -- Icon name for UI
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert common categories
INSERT INTO skill_categories (category_name, description, icon) VALUES
  ('Technology & IT', 'Programming, Software Development, IT Support', 'code'),
  ('Design & Creative', 'Graphic Design, UI/UX, Video Editing', 'palette'),
  ('Writing & Content', 'Content Writing, Copywriting, Translation', 'pen-tool'),
  ('Marketing & Sales', 'Digital Marketing, SEO, Social Media', 'trending-up'),
  ('Business & Finance', 'Accounting, Business Analysis, Consulting', 'briefcase'),
  ('Construction & Trades', 'Plumbing, Electrical, Carpentry, HVAC', 'hard-hat'),
  ('Healthcare', 'Nursing, Medical Assistance, Therapy', 'heart'),
  ('Education & Training', 'Teaching, Tutoring, Course Creation', 'book-open'),
  ('Legal & Compliance', 'Legal Consulting, Contract Review', 'scale'),
  ('Engineering', 'Civil, Mechanical, Electrical Engineering', 'cpu'),
  ('Hospitality & Events', 'Event Planning, Catering, Hotel Management', 'calendar'),
  ('Transportation & Logistics', 'Delivery, Supply Chain, Warehousing', 'truck'),
  ('Customer Service', 'Support, Help Desk, Client Relations', 'headphones'),
  ('Data & Analytics', 'Data Analysis, Statistics, Business Intelligence', 'bar-chart'),
  ('Other', 'Skills that don''t fit other categories', 'more-horizontal')
ON CONFLICT (category_name) DO NOTHING;

-- =====================================================
-- POPULAR SKILLS BY CATEGORY (Seed Data)
-- =====================================================
CREATE TABLE IF NOT EXISTS popular_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_name TEXT NOT NULL,
  category TEXT REFERENCES skill_categories(category_name),
  is_trending BOOLEAN DEFAULT false,
  UNIQUE(skill_name, category)
);

-- Technology & IT
INSERT INTO popular_skills (skill_name, category) VALUES
  ('JavaScript', 'Technology & IT'),
  ('Python', 'Technology & IT'),
  ('React', 'Technology & IT'),
  ('Node.js', 'Technology & IT'),
  ('TypeScript', 'Technology & IT'),
  ('Java', 'Technology & IT'),
  ('PHP', 'Technology & IT'),
  ('SQL', 'Technology & IT'),
  ('HTML/CSS', 'Technology & IT'),
  ('AWS', 'Technology & IT'),
  ('Docker', 'Technology & IT'),
  ('Git', 'Technology & IT'),
  ('MongoDB', 'Technology & IT'),
  ('Vue.js', 'Technology & IT'),
  ('Angular', 'Technology & IT')
ON CONFLICT DO NOTHING;

-- Design & Creative
INSERT INTO popular_skills (skill_name, category) VALUES
  ('Adobe Photoshop', 'Design & Creative'),
  ('Adobe Illustrator', 'Design & Creative'),
  ('Figma', 'Design & Creative'),
  ('UI/UX Design', 'Design & Creative'),
  ('Graphic Design', 'Design & Creative'),
  ('Video Editing', 'Design & Creative'),
  ('Adobe After Effects', 'Design & Creative'),
  ('3D Modeling', 'Design & Creative'),
  ('Animation', 'Design & Creative'),
  ('Branding', 'Design & Creative')
ON CONFLICT DO NOTHING;

-- Writing & Content
INSERT INTO popular_skills (skill_name, category) VALUES
  ('Content Writing', 'Writing & Content'),
  ('Copywriting', 'Writing & Content'),
  ('Technical Writing', 'Writing & Content'),
  ('Proofreading', 'Writing & Content'),
  ('Creative Writing', 'Writing & Content'),
  ('Translation', 'Writing & Content'),
  ('Blog Writing', 'Writing & Content')
ON CONFLICT DO NOTHING;

-- Marketing & Sales
INSERT INTO popular_skills (skill_name, category) VALUES
  ('Digital Marketing', 'Marketing & Sales'),
  ('SEO', 'Marketing & Sales'),
  ('Social Media Marketing', 'Marketing & Sales'),
  ('Google Ads', 'Marketing & Sales'),
  ('Facebook Ads', 'Marketing & Sales'),
  ('Email Marketing', 'Marketing & Sales'),
  ('Content Marketing', 'Marketing & Sales'),
  ('Sales', 'Marketing & Sales')
ON CONFLICT DO NOTHING;

-- Construction & Trades
INSERT INTO popular_skills (skill_name, category) VALUES
  ('Plumbing', 'Construction & Trades'),
  ('Electrical Work', 'Construction & Trades'),
  ('Carpentry', 'Construction & Trades'),
  ('HVAC', 'Construction & Trades'),
  ('Welding', 'Construction & Trades'),
  ('Painting', 'Construction & Trades'),
  ('Roofing', 'Construction & Trades'),
  ('Masonry', 'Construction & Trades'),
  ('Flooring', 'Construction & Trades'),
  ('Landscaping', 'Construction & Trades')
ON CONFLICT DO NOTHING;

-- Data & Analytics
INSERT INTO popular_skills (skill_name, category) VALUES
  ('Data Analysis', 'Data & Analytics'),
  ('Excel', 'Data & Analytics'),
  ('Power BI', 'Data & Analytics'),
  ('Tableau', 'Data & Analytics'),
  ('Statistics', 'Data & Analytics'),
  ('Machine Learning', 'Data & Analytics'),
  ('Data Visualization', 'Data & Analytics')
ON CONFLICT DO NOTHING;

-- =====================================================
-- FUNCTION: Get Skill Suggestions
-- =====================================================
CREATE OR REPLACE FUNCTION get_skill_suggestions(
  search_term TEXT,
  limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
  skill_name TEXT,
  category TEXT,
  usage_count INTEGER,
  source TEXT
) AS $$
BEGIN
  RETURN QUERY
  -- First, get from popular skills (predefined)
  SELECT 
    ps.skill_name,
    ps.category,
    0 as usage_count,
    'popular' as source
  FROM popular_skills ps
  WHERE LOWER(ps.skill_name) LIKE LOWER('%' || search_term || '%')
  
  UNION
  
  -- Then, get from skills master (learned from users)
  SELECT 
    sm.skill_name,
    sm.category,
    sm.usage_count,
    'learned' as source
  FROM skills_master sm
  WHERE LOWER(sm.skill_name) LIKE LOWER('%' || search_term || '%')
  
  UNION
  
  -- Get from existing project skills
  SELECT 
    DISTINCT unnest(required_skills) as skill_name,
    'Other' as category,
    COUNT(*) OVER (PARTITION BY unnest(required_skills))::INTEGER as usage_count,
    'projects' as source
  FROM projects
  WHERE LOWER(unnest(required_skills)) LIKE LOWER('%' || search_term || '%')
  
  UNION
  
  -- Get from worker profile skills
  SELECT 
    DISTINCT unnest(skills) as skill_name,
    'Other' as category,
    COUNT(*) OVER (PARTITION BY unnest(skills))::INTEGER as usage_count,
    'workers' as source
  FROM worker_profiles
  WHERE LOWER(unnest(skills)) LIKE LOWER('%' || search_term || '%')
  
  ORDER BY usage_count DESC, skill_name ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- FUNCTION: Add Skill to Master (Learn from usage)
-- =====================================================
CREATE OR REPLACE FUNCTION add_or_update_skill(
  skill_name_param TEXT,
  category_param TEXT DEFAULT 'Other'
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO skills_master (skill_name, category, usage_count, last_used_at)
  VALUES (skill_name_param, category_param, 1, NOW())
  ON CONFLICT (skill_name) 
  DO UPDATE SET 
    usage_count = skills_master.usage_count + 1,
    last_used_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION: Track Skills Usage (Auto-learn)
-- =====================================================
CREATE OR REPLACE FUNCTION track_skills_usage()
RETURNS TRIGGER AS $$
DECLARE
  skill TEXT;
BEGIN
  -- Track skills from projects
  IF TG_TABLE_NAME = 'projects' THEN
    FOREACH skill IN ARRAY NEW.required_skills
    LOOP
      PERFORM add_or_update_skill(skill, 'Other');
    END LOOP;
  END IF;
  
  -- Track skills from worker profiles
  IF TG_TABLE_NAME = 'worker_profiles' THEN
    FOREACH skill IN ARRAY NEW.skills
    LOOP
      PERFORM add_or_update_skill(skill, 'Other');
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to auto-learn skills
DROP TRIGGER IF EXISTS trigger_track_project_skills ON projects;
CREATE TRIGGER trigger_track_project_skills
  AFTER INSERT OR UPDATE OF required_skills ON projects
  FOR EACH ROW
  EXECUTE FUNCTION track_skills_usage();

DROP TRIGGER IF EXISTS trigger_track_worker_skills ON worker_profiles;
CREATE TRIGGER trigger_track_worker_skills
  AFTER INSERT OR UPDATE OF skills ON worker_profiles
  FOR EACH ROW
  EXECUTE FUNCTION track_skills_usage();

-- =====================================================
-- FUNCTION: Get Top Skills (Most Used)
-- =====================================================
CREATE OR REPLACE FUNCTION get_top_skills(
  category_filter TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
  skill_name TEXT,
  category TEXT,
  usage_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sm.skill_name,
    sm.category,
    sm.usage_count
  FROM skills_master sm
  WHERE (category_filter IS NULL OR sm.category = category_filter)
  ORDER BY sm.usage_count DESC, sm.skill_name ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- FUNCTION: Get Trending Skills (Recently Popular)
-- =====================================================
CREATE OR REPLACE FUNCTION get_trending_skills(
  days_back INTEGER DEFAULT 30,
  limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
  skill_name TEXT,
  category TEXT,
  recent_usage INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sm.skill_name,
    sm.category,
    sm.usage_count as recent_usage
  FROM skills_master sm
  WHERE sm.last_used_at >= NOW() - (days_back || ' days')::INTERVAL
  ORDER BY sm.usage_count DESC, sm.last_used_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- VIEW: Skill Analytics
-- =====================================================
CREATE OR REPLACE VIEW skill_analytics AS
SELECT 
  sm.skill_name,
  sm.category,
  sm.usage_count,
  (
    SELECT COUNT(*) 
    FROM projects p 
    WHERE sm.skill_name = ANY(p.required_skills)
  ) as projects_requiring,
  (
    SELECT COUNT(*) 
    FROM worker_profiles wp 
    WHERE sm.skill_name = ANY(wp.skills)
  ) as workers_with_skill,
  (
    SELECT COUNT(*) 
    FROM applications a
    JOIN projects p ON p.id = a.project_id
    WHERE sm.skill_name = ANY(p.required_skills)
  ) as total_applications,
  sm.last_used_at
FROM skills_master sm
ORDER BY sm.usage_count DESC;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_popular_skills_name ON popular_skills(LOWER(skill_name));
CREATE INDEX IF NOT EXISTS idx_popular_skills_category ON popular_skills(category);

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Dynamic Skills System created successfully!';
  RAISE NOTICE '📊 Tables: skills_master, skill_categories, popular_skills';
  RAISE NOTICE '🔍 Functions: get_skill_suggestions, add_or_update_skill, get_top_skills, get_trending_skills';
  RAISE NOTICE '🤖 Auto-learning: Skills are automatically tracked from projects and profiles';
  RAISE NOTICE '💡 Usage: Call get_skill_suggestions(''search_term'') for autocomplete';
END $$;
