-- =====================================================
-- Worker Job Discovery Dashboard - Database Enhancements
-- Features: Job Alerts, Recommendations, Search History
-- =====================================================

-- =====================================================
-- JOB ALERTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS job_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  alert_name TEXT NOT NULL,
  keywords TEXT[],
  required_skills TEXT[],
  min_budget NUMERIC(12,2),
  max_budget NUMERIC(12,2),
  min_duration_hours INTEGER,
  max_duration_hours INTEGER,
  is_active BOOLEAN DEFAULT true,
  notification_enabled BOOLEAN DEFAULT true,
  email_enabled BOOLEAN DEFAULT false,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for job_alerts
ALTER TABLE job_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own job alerts" ON job_alerts
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- PROJECT VIEWS TRACKING (for analytics)
-- =====================================================
CREATE TABLE IF NOT EXISTS project_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  view_duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for project_views
ALTER TABLE project_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create own project views" ON project_views
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own project views" ON project_views
  FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- SEARCH HISTORY (for better recommendations)
-- =====================================================
CREATE TABLE IF NOT EXISTS search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  search_query TEXT NOT NULL,
  filters JSONB DEFAULT '{}',
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for search_history
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own search history" ON search_history
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- PROJECT RECOMMENDATIONS (computed)
-- =====================================================
CREATE TABLE IF NOT EXISTS project_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
  match_reasons TEXT[],
  computed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(worker_id, project_id)
);

-- RLS for project_recommendations
ALTER TABLE project_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workers can view own recommendations" ON project_recommendations
  FOR SELECT USING (auth.uid() = worker_id);

CREATE POLICY "System can manage recommendations" ON project_recommendations
  FOR ALL USING (true);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_job_alerts_user_id ON job_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_job_alerts_active ON job_alerts(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_project_views_project_id ON project_views(project_id);
CREATE INDEX IF NOT EXISTS idx_project_views_user_id ON project_views(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_project_recommendations_worker_id ON project_recommendations(worker_id);
CREATE INDEX IF NOT EXISTS idx_project_recommendations_project_id ON project_recommendations(project_id);
CREATE INDEX IF NOT EXISTS idx_project_recommendations_score ON project_recommendations(match_score DESC);

-- For better project search
CREATE INDEX IF NOT EXISTS idx_projects_required_skills ON projects USING GIN(required_skills);
CREATE INDEX IF NOT EXISTS idx_projects_budget ON projects(budget);
CREATE INDEX IF NOT EXISTS idx_projects_duration ON projects(duration_hours);
CREATE INDEX IF NOT EXISTS idx_projects_deadline ON projects(deadline);
CREATE INDEX IF NOT EXISTS idx_worker_profiles_skills ON worker_profiles USING GIN(skills);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE TRIGGER update_job_alerts_updated_at BEFORE UPDATE ON job_alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Calculate skill match percentage
CREATE OR REPLACE FUNCTION calculate_skill_match(
  worker_skills TEXT[],
  project_skills TEXT[]
)
RETURNS INTEGER AS $$
DECLARE
  matched_skills INTEGER := 0;
  total_skills INTEGER := array_length(project_skills, 1);
  skill TEXT;
BEGIN
  IF total_skills IS NULL OR total_skills = 0 THEN
    RETURN 0;
  END IF;
  
  FOREACH skill IN ARRAY project_skills
  LOOP
    IF EXISTS (
      SELECT 1 FROM unnest(worker_skills) ws 
      WHERE LOWER(ws) = LOWER(skill)
    ) THEN
      matched_skills := matched_skills + 1;
    END IF;
  END LOOP;
  
  RETURN (matched_skills * 100) / total_skills;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Get recommended projects for a worker
CREATE OR REPLACE FUNCTION get_recommended_projects(
  worker_uuid UUID,
  limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
  project_id UUID,
  title TEXT,
  description TEXT,
  budget NUMERIC,
  required_skills TEXT[],
  duration_hours INTEGER,
  deadline TIMESTAMPTZ,
  match_score INTEGER,
  match_reasons TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  WITH worker_data AS (
    SELECT 
      wp.skills,
      wp.hourly_rate,
      wp.experience_years
    FROM worker_profiles wp
    WHERE wp.user_id = worker_uuid
  ),
  project_scores AS (
    SELECT 
      p.id as project_id,
      p.title,
      p.description,
      p.budget,
      p.required_skills,
      p.duration_hours,
      p.deadline,
      calculate_skill_match(wd.skills, p.required_skills) as skill_match,
      CASE 
        WHEN p.budget >= (wd.hourly_rate * p.duration_hours * 0.8) 
        AND p.budget <= (wd.hourly_rate * p.duration_hours * 1.5)
        THEN 20 ELSE 0 
      END as budget_match,
      CASE 
        WHEN p.duration_hours <= 40 THEN 10
        WHEN p.duration_hours <= 160 THEN 15
        ELSE 5
      END as duration_score
    FROM projects p
    CROSS JOIN worker_data wd
    WHERE p.status = 'open'
    AND NOT EXISTS (
      SELECT 1 FROM applications a 
      WHERE a.project_id = p.id AND a.worker_id = worker_uuid
    )
    AND NOT EXISTS (
      SELECT 1 FROM contracts c 
      WHERE c.project_id = p.id AND c.worker_id = worker_uuid
    )
  )
  SELECT 
    ps.project_id,
    ps.title,
    ps.description,
    ps.budget,
    ps.required_skills,
    ps.duration_hours,
    ps.deadline,
    (ps.skill_match + ps.budget_match + ps.duration_score)::INTEGER as match_score,
    ARRAY[
      CASE WHEN ps.skill_match >= 70 THEN 'Strong skill match' END,
      CASE WHEN ps.budget_match > 0 THEN 'Budget matches your rate' END,
      CASE WHEN ps.duration_score >= 15 THEN 'Ideal project duration' END
    ]::TEXT[] as match_reasons
  FROM project_scores ps
  WHERE (ps.skill_match + ps.budget_match + ps.duration_score) >= 30
  ORDER BY (ps.skill_match + ps.budget_match + ps.duration_score) DESC, ps.deadline ASC NULLS LAST
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Check if project matches job alert
CREATE OR REPLACE FUNCTION check_job_alert_match(
  alert_id_param UUID,
  project_id_param UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  alert_record RECORD;
  project_record RECORD;
  skill_match BOOLEAN := false;
  budget_match BOOLEAN := true;
  duration_match BOOLEAN := true;
  keyword_match BOOLEAN := true;
BEGIN
  -- Get alert details
  SELECT * INTO alert_record FROM job_alerts WHERE id = alert_id_param;
  
  -- Get project details
  SELECT * INTO project_record FROM projects WHERE id = project_id_param;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Check skills
  IF alert_record.required_skills IS NOT NULL AND array_length(alert_record.required_skills, 1) > 0 THEN
    SELECT EXISTS (
      SELECT 1 FROM unnest(alert_record.required_skills) alert_skill
      WHERE EXISTS (
        SELECT 1 FROM unnest(project_record.required_skills) project_skill
        WHERE LOWER(project_skill) LIKE '%' || LOWER(alert_skill) || '%'
      )
    ) INTO skill_match;
    
    IF NOT skill_match THEN
      RETURN false;
    END IF;
  END IF;
  
  -- Check budget
  IF alert_record.min_budget IS NOT NULL THEN
    budget_match := project_record.budget >= alert_record.min_budget;
  END IF;
  
  IF alert_record.max_budget IS NOT NULL THEN
    budget_match := budget_match AND project_record.budget <= alert_record.max_budget;
  END IF;
  
  IF NOT budget_match THEN
    RETURN false;
  END IF;
  
  -- Check duration
  IF alert_record.min_duration_hours IS NOT NULL THEN
    duration_match := project_record.duration_hours >= alert_record.min_duration_hours;
  END IF;
  
  IF alert_record.max_duration_hours IS NOT NULL THEN
    duration_match := duration_match AND project_record.duration_hours <= alert_record.max_duration_hours;
  END IF;
  
  IF NOT duration_match THEN
    RETURN false;
  END IF;
  
  -- Check keywords
  IF alert_record.keywords IS NOT NULL AND array_length(alert_record.keywords, 1) > 0 THEN
    SELECT EXISTS (
      SELECT 1 FROM unnest(alert_record.keywords) keyword
      WHERE LOWER(project_record.title) LIKE '%' || LOWER(keyword) || '%'
      OR LOWER(project_record.description) LIKE '%' || LOWER(keyword) || '%'
    ) INTO keyword_match;
    
    IF NOT keyword_match THEN
      RETURN false;
    END IF;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql STABLE;

-- Trigger to create notifications when new projects match alerts
CREATE OR REPLACE FUNCTION notify_matching_job_alerts()
RETURNS TRIGGER AS $$
DECLARE
  alert_record RECORD;
BEGIN
  -- Only process open projects
  IF NEW.status != 'open' THEN
    RETURN NEW;
  END IF;
  
  -- Check all active alerts
  FOR alert_record IN 
    SELECT ja.*, u.email 
    FROM job_alerts ja
    JOIN users u ON u.id = ja.user_id
    WHERE ja.is_active = true 
    AND ja.notification_enabled = true
  LOOP
    -- Check if project matches this alert
    IF check_job_alert_match(alert_record.id, NEW.id) THEN
      -- Create notification
      INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        link,
        data
      ) VALUES (
        alert_record.user_id,
        'system',
        'New Job Alert Match!',
        'A new project "' || NEW.title || '" matches your job alert "' || alert_record.alert_name || '"',
        '/projects/' || NEW.id,
        jsonb_build_object(
          'project_id', NEW.id,
          'alert_id', alert_record.id,
          'alert_name', alert_record.alert_name
        )
      );
      
      -- Update last triggered
      UPDATE job_alerts 
      SET last_triggered_at = NOW() 
      WHERE id = alert_record.id;
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on projects table
DROP TRIGGER IF EXISTS trigger_notify_job_alerts ON projects;
CREATE TRIGGER trigger_notify_job_alerts
  AFTER INSERT OR UPDATE OF status ON projects
  FOR EACH ROW
  EXECUTE FUNCTION notify_matching_job_alerts();

-- =====================================================
-- WORKER DISCOVERY ANALYTICS VIEW
-- =====================================================
CREATE OR REPLACE VIEW worker_discovery_stats AS
SELECT
  u.id as worker_id,
  u.full_name,
  COUNT(DISTINCT pv.project_id) as projects_viewed,
  COUNT(DISTINCT a.project_id) as applications_submitted,
  COUNT(DISTINCT sh.search_query) as unique_searches,
  COUNT(DISTINCT sp.project_id) as saved_projects,
  COUNT(DISTINCT ja.id) as active_alerts,
  (
    SELECT COUNT(*) 
    FROM project_recommendations pr 
    WHERE pr.worker_id = u.id 
    AND pr.match_score >= 70
  ) as high_match_recommendations
FROM users u
LEFT JOIN project_views pv ON pv.user_id = u.id
LEFT JOIN applications a ON a.worker_id = u.id
LEFT JOIN search_history sh ON sh.user_id = u.id
LEFT JOIN saved_projects sp ON sp.user_id = u.id
LEFT JOIN job_alerts ja ON ja.user_id = u.id AND ja.is_active = true
WHERE u.user_type = 'worker'
GROUP BY u.id, u.full_name;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Worker Job Discovery enhancements created successfully!';
  RAISE NOTICE '📊 New tables: job_alerts, project_views, search_history, project_recommendations';
  RAISE NOTICE '🔍 New functions: calculate_skill_match, get_recommended_projects, check_job_alert_match';
  RAISE NOTICE '🔔 Job alert notifications enabled';
  RAISE NOTICE '📈 Worker discovery analytics view created';
END $$;
