-- ============================================
-- 2NDSHIFT - PROFESSIONAL CATEGORIES & RATINGS
-- Multi-industry support with category suggestions
-- ============================================

-- ============================================
-- INDUSTRY CATEGORIES
-- ============================================

CREATE TABLE IF NOT EXISTS industries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- Icon name for UI
  color TEXT, -- Brand color for UI
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  professional_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert industries
INSERT INTO industries (name, slug, description, icon, color, display_order) VALUES
  -- Technology
  ('Information Technology', 'it', 'Software development, IT services, and tech solutions', 'Monitor', 'sky', 1),
  ('Telecom', 'telecom', 'Telecommunications, networking, and connectivity', 'Radio', 'violet', 2),
  ('Cybersecurity', 'cybersecurity', 'Security, compliance, and data protection', 'Shield', 'red', 3),
  
  -- Creative & Media
  ('Design & Creative', 'design', 'UI/UX, graphic design, branding, and visual arts', 'Palette', 'pink', 4),
  ('Media & Entertainment', 'media', 'Video, audio, content creation, and production', 'Film', 'purple', 5),
  ('Marketing & Advertising', 'marketing', 'Digital marketing, SEO, social media, and ads', 'Megaphone', 'orange', 6),
  
  -- Business Services
  ('Finance & Accounting', 'finance', 'Accounting, bookkeeping, financial analysis', 'Calculator', 'emerald', 7),
  ('Legal', 'legal', 'Legal services, contracts, and compliance', 'Scale', 'slate', 8),
  ('Human Resources', 'hr', 'Recruitment, training, and HR management', 'Users', 'cyan', 9),
  ('Consulting', 'consulting', 'Business strategy, management consulting', 'Briefcase', 'amber', 10),
  
  -- Healthcare
  ('Healthcare', 'healthcare', 'Medical, nursing, healthcare administration', 'Heart', 'rose', 11),
  ('Pharmaceuticals', 'pharma', 'Drug development, clinical trials, regulatory', 'Pill', 'teal', 12),
  
  -- Hospitality & Services
  ('Hospitality', 'hospitality', 'Hotels, restaurants, travel, and tourism', 'Hotel', 'yellow', 13),
  ('Real Estate', 'realestate', 'Property management, construction, architecture', 'Building', 'stone', 14),
  ('Retail & E-commerce', 'retail', 'Retail operations, e-commerce, supply chain', 'ShoppingBag', 'fuchsia', 15),
  
  -- Education & Training
  ('Education', 'education', 'Teaching, tutoring, curriculum development', 'GraduationCap', 'indigo', 16),
  ('Training & Development', 'training', 'Corporate training, skill development', 'BookOpen', 'blue', 17),
  
  -- Engineering & Manufacturing
  ('Engineering', 'engineering', 'Mechanical, electrical, civil engineering', 'Wrench', 'zinc', 18),
  ('Manufacturing', 'manufacturing', 'Production, quality control, operations', 'Factory', 'neutral', 19),
  ('Automotive', 'automotive', 'Automobile industry, EV, automotive tech', 'Car', 'gray', 20),
  
  -- Other
  ('Agriculture', 'agriculture', 'Farming, agritech, food processing', 'Leaf', 'lime', 21),
  ('Energy & Utilities', 'energy', 'Power, renewable energy, utilities', 'Zap', 'green', 22),
  ('Logistics & Supply Chain', 'logistics', 'Transportation, warehousing, distribution', 'Truck', 'brown', 23),
  ('Government & Public Sector', 'government', 'Government services, public administration', 'Landmark', 'blue', 24),
  ('Non-Profit', 'nonprofit', 'NGOs, social enterprises, foundations', 'HeartHandshake', 'rose', 25),
  ('Other', 'other', 'Other industries and services', 'MoreHorizontal', 'slate', 99)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SKILL CATEGORIES (within industries)
-- ============================================

CREATE TABLE IF NOT EXISTS skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_id UUID NOT NULL REFERENCES industries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  skill_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(industry_id, slug)
);

-- Insert skill categories for IT
INSERT INTO skill_categories (industry_id, name, slug, description, display_order)
SELECT id, name, slug, description, display_order FROM (
  VALUES
    ('Web Development', 'web-dev', 'Frontend, backend, and full-stack web development', 1),
    ('Mobile Development', 'mobile-dev', 'iOS, Android, and cross-platform mobile apps', 2),
    ('Cloud & DevOps', 'cloud-devops', 'AWS, Azure, GCP, CI/CD, containerization', 3),
    ('Data Science & AI', 'data-ai', 'Machine learning, data analytics, AI solutions', 4),
    ('Database', 'database', 'SQL, NoSQL, database administration', 5),
    ('QA & Testing', 'qa-testing', 'Manual testing, automation, quality assurance', 6),
    ('UI/UX Design', 'ui-ux', 'User interface and experience design', 7),
    ('Project Management', 'project-mgmt', 'Agile, Scrum, project delivery', 8),
    ('Blockchain', 'blockchain', 'Web3, smart contracts, DeFi', 9),
    ('Game Development', 'game-dev', 'Unity, Unreal, game design', 10)
) AS v(name, slug, description, display_order)
CROSS JOIN industries WHERE industries.slug = 'it';

-- Insert skill categories for Design
INSERT INTO skill_categories (industry_id, name, slug, description, display_order)
SELECT id, name, slug, description, display_order FROM (
  VALUES
    ('Graphic Design', 'graphic-design', 'Logos, branding, print design', 1),
    ('UI/UX Design', 'ui-ux-design', 'Digital interfaces and user experience', 2),
    ('Motion Graphics', 'motion-graphics', 'Animation, video effects', 3),
    ('Illustration', 'illustration', 'Digital and traditional illustration', 4),
    ('3D Design', '3d-design', '3D modeling, rendering, visualization', 5),
    ('Product Design', 'product-design', 'Physical and digital product design', 6)
) AS v(name, slug, description, display_order)
CROSS JOIN industries WHERE industries.slug = 'design';

-- Insert skill categories for Marketing
INSERT INTO skill_categories (industry_id, name, slug, description, display_order)
SELECT id, name, slug, description, display_order FROM (
  VALUES
    ('Digital Marketing', 'digital-marketing', 'Online marketing strategies', 1),
    ('SEO & SEM', 'seo-sem', 'Search engine optimization and marketing', 2),
    ('Social Media', 'social-media', 'Social media management and marketing', 3),
    ('Content Marketing', 'content-marketing', 'Content strategy and creation', 4),
    ('Email Marketing', 'email-marketing', 'Email campaigns and automation', 5),
    ('Analytics', 'analytics', 'Marketing analytics and reporting', 6),
    ('Brand Strategy', 'brand-strategy', 'Brand development and positioning', 7)
) AS v(name, slug, description, display_order)
CROSS JOIN industries WHERE industries.slug = 'marketing';

-- Insert skill categories for Finance
INSERT INTO skill_categories (industry_id, name, slug, description, display_order)
SELECT id, name, slug, description, display_order FROM (
  VALUES
    ('Accounting', 'accounting', 'Bookkeeping, financial statements', 1),
    ('Tax', 'tax', 'Tax planning and compliance', 2),
    ('Financial Analysis', 'financial-analysis', 'Financial modeling and analysis', 3),
    ('Audit', 'audit', 'Internal and external audit', 4),
    ('Investment', 'investment', 'Investment analysis and portfolio management', 5),
    ('Payroll', 'payroll', 'Payroll processing and management', 6)
) AS v(name, slug, description, display_order)
CROSS JOIN industries WHERE industries.slug = 'finance';

-- Insert skill categories for Healthcare
INSERT INTO skill_categories (industry_id, name, slug, description, display_order)
SELECT id, name, slug, description, display_order FROM (
  VALUES
    ('Nursing', 'nursing', 'Registered nurses, nurse practitioners', 1),
    ('Medical Practice', 'medical-practice', 'Physicians, specialists', 2),
    ('Allied Health', 'allied-health', 'Therapists, technicians', 3),
    ('Healthcare Admin', 'healthcare-admin', 'Hospital and clinic administration', 4),
    ('Medical Coding', 'medical-coding', 'Medical billing and coding', 5),
    ('Telemedicine', 'telemedicine', 'Remote healthcare services', 6)
) AS v(name, slug, description, display_order)
CROSS JOIN industries WHERE industries.slug = 'healthcare';

-- Insert skill categories for Hospitality
INSERT INTO skill_categories (industry_id, name, slug, description, display_order)
SELECT id, name, slug, description, display_order FROM (
  VALUES
    ('Hotel Management', 'hotel-mgmt', 'Hotel operations and management', 1),
    ('Food & Beverage', 'food-beverage', 'Restaurant, catering, F&B', 2),
    ('Travel & Tourism', 'travel-tourism', 'Travel planning, tour operations', 3),
    ('Event Management', 'event-mgmt', 'Event planning and coordination', 4),
    ('Customer Service', 'customer-service', 'Guest relations, front desk', 5)
) AS v(name, slug, description, display_order)
CROSS JOIN industries WHERE industries.slug = 'hospitality';

-- ============================================
-- SKILLS DATABASE
-- ============================================

CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES skill_categories(id) ON DELETE SET NULL,
  industry_id UUID REFERENCES industries(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  aliases TEXT[] DEFAULT '{}', -- Alternative names
  is_verified BOOLEAN DEFAULT TRUE, -- Admin verified
  is_active BOOLEAN DEFAULT TRUE,
  usage_count INTEGER DEFAULT 0, -- How many profiles use this
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert common IT skills
INSERT INTO skills (industry_id, name, slug, aliases) 
SELECT i.id, v.name, v.slug, v.aliases::TEXT[] FROM (
  VALUES
    ('JavaScript', 'javascript', ARRAY['JS', 'ES6', 'ECMAScript']),
    ('TypeScript', 'typescript', ARRAY['TS']),
    ('Python', 'python', ARRAY['Python3', 'Py']),
    ('Java', 'java', ARRAY['J2EE', 'JavaSE']),
    ('React', 'react', ARRAY['ReactJS', 'React.js']),
    ('React Native', 'react-native', ARRAY['RN']),
    ('Node.js', 'nodejs', ARRAY['Node', 'NodeJS']),
    ('Angular', 'angular', ARRAY['AngularJS', 'Angular2+']),
    ('Vue.js', 'vuejs', ARRAY['Vue', 'VueJS']),
    ('Next.js', 'nextjs', ARRAY['Next']),
    ('Django', 'django', ARRAY['Django REST']),
    ('Flask', 'flask', ARRAY[]),
    ('Spring Boot', 'spring-boot', ARRAY['Spring', 'Spring Framework']),
    ('PostgreSQL', 'postgresql', ARRAY['Postgres', 'PG']),
    ('MongoDB', 'mongodb', ARRAY['Mongo']),
    ('MySQL', 'mysql', ARRAY['MariaDB']),
    ('Redis', 'redis', ARRAY[]),
    ('AWS', 'aws', ARRAY['Amazon Web Services']),
    ('Azure', 'azure', ARRAY['Microsoft Azure']),
    ('Google Cloud', 'gcp', ARRAY['GCP', 'Google Cloud Platform']),
    ('Docker', 'docker', ARRAY['Containerization']),
    ('Kubernetes', 'kubernetes', ARRAY['K8s']),
    ('Terraform', 'terraform', ARRAY['IaC']),
    ('CI/CD', 'cicd', ARRAY['Jenkins', 'GitHub Actions']),
    ('GraphQL', 'graphql', ARRAY['GQL']),
    ('REST API', 'rest-api', ARRAY['RESTful', 'API Development']),
    ('Machine Learning', 'machine-learning', ARRAY['ML']),
    ('TensorFlow', 'tensorflow', ARRAY['TF']),
    ('PyTorch', 'pytorch', ARRAY[]),
    ('Data Science', 'data-science', ARRAY['Data Analytics']),
    ('Figma', 'figma', ARRAY[]),
    ('Adobe XD', 'adobe-xd', ARRAY['XD']),
    ('Photoshop', 'photoshop', ARRAY['PS', 'Adobe Photoshop']),
    ('Illustrator', 'illustrator', ARRAY['AI', 'Adobe Illustrator']),
    ('Swift', 'swift', ARRAY['iOS Development']),
    ('Kotlin', 'kotlin', ARRAY['Android Development']),
    ('Flutter', 'flutter', ARRAY['Dart']),
    ('Go', 'golang', ARRAY['Golang']),
    ('Rust', 'rust', ARRAY[]),
    ('PHP', 'php', ARRAY['Laravel', 'Symfony']),
    ('Ruby', 'ruby', ARRAY['Ruby on Rails', 'RoR']),
    ('C#', 'csharp', ARRAY['.NET', 'dotnet']),
    ('Solidity', 'solidity', ARRAY['Smart Contracts', 'Ethereum']),
    ('Unity', 'unity', ARRAY['Unity3D', 'Game Development']),
    ('Unreal Engine', 'unreal', ARRAY['UE4', 'UE5'])
) AS v(name, slug, aliases)
CROSS JOIN industries i WHERE i.slug = 'it'
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- CATEGORY SUGGESTIONS (User submitted)
-- ============================================

CREATE TYPE suggestion_status AS ENUM (
  'pending',
  'approved',
  'rejected',
  'merged'
);

CREATE TABLE IF NOT EXISTS category_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  suggestion_type TEXT NOT NULL CHECK (suggestion_type IN ('industry', 'category', 'skill')),
  parent_id UUID, -- industry_id for category, category_id for skill
  suggested_name TEXT NOT NULL,
  suggested_description TEXT,
  reason TEXT, -- Why this should be added
  status suggestion_status DEFAULT 'pending',
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  merged_into_id UUID, -- If merged into existing
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROFESSIONAL RATINGS
-- ============================================

CREATE TABLE IF NOT EXISTS professional_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES contracts(id),
  
  -- Overall
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  
  -- Detailed ratings
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  timeliness_rating INTEGER CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
  professionalism_rating INTEGER CHECK (professionalism_rating >= 1 AND professionalism_rating <= 5),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
  
  review_title TEXT,
  review_text TEXT,
  would_hire_again BOOLEAN,
  
  -- Skills demonstrated
  skills_demonstrated TEXT[] DEFAULT '{}',
  
  -- Visibility
  is_public BOOLEAN DEFAULT TRUE,
  
  -- Response from professional
  response_text TEXT,
  response_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(contract_id, client_id)
);

-- ============================================
-- COMPANY/CLIENT RATINGS (by professionals)
-- ============================================

CREATE TABLE IF NOT EXISTS company_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES contracts(id),
  
  -- Overall
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  
  -- Detailed ratings
  payment_rating INTEGER CHECK (payment_rating >= 1 AND payment_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  requirements_clarity_rating INTEGER CHECK (requirements_clarity_rating >= 1 AND requirements_clarity_rating <= 5),
  respect_rating INTEGER CHECK (respect_rating >= 1 AND respect_rating <= 5),
  
  review_title TEXT,
  review_text TEXT,
  would_work_again BOOLEAN,
  
  -- Payment details
  paid_on_time BOOLEAN,
  payment_issues TEXT,
  
  -- Visibility
  is_public BOOLEAN DEFAULT TRUE,
  
  -- Response from company
  response_text TEXT,
  response_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(contract_id, professional_id)
);

-- ============================================
-- AGGREGATED RATINGS
-- ============================================

CREATE TABLE IF NOT EXISTS user_rating_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL CHECK (user_type IN ('worker', 'client')),
  
  -- Aggregate scores
  overall_rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  
  -- Worker ratings (by clients)
  avg_quality DECIMAL(3,2) DEFAULT 0,
  avg_communication DECIMAL(3,2) DEFAULT 0,
  avg_timeliness DECIMAL(3,2) DEFAULT 0,
  avg_professionalism DECIMAL(3,2) DEFAULT 0,
  avg_value DECIMAL(3,2) DEFAULT 0,
  
  -- Client ratings (by workers)
  avg_payment DECIMAL(3,2) DEFAULT 0,
  avg_clarity DECIMAL(3,2) DEFAULT 0,
  avg_respect DECIMAL(3,2) DEFAULT 0,
  
  -- Stats
  five_star_count INTEGER DEFAULT 0,
  four_star_count INTEGER DEFAULT 0,
  three_star_count INTEGER DEFAULT 0,
  two_star_count INTEGER DEFAULT 0,
  one_star_count INTEGER DEFAULT 0,
  
  would_recommend_percent DECIMAL(5,2) DEFAULT 0,
  on_time_payment_percent DECIMAL(5,2) DEFAULT 0, -- For clients
  
  last_review_at TIMESTAMPTZ,
  last_calculated_at TIMESTAMPTZ DEFAULT NOW(),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- ============================================
-- UPDATE WORKER PROFILES TABLE
-- ============================================

-- Add industry and category to worker profiles
ALTER TABLE worker_profiles 
  ADD COLUMN IF NOT EXISTS industry_id UUID REFERENCES industries(id),
  ADD COLUMN IF NOT EXISTS skill_categories UUID[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS years_in_industry INTEGER DEFAULT 0;

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_skill_categories_industry ON skill_categories(industry_id);
CREATE INDEX IF NOT EXISTS idx_skills_industry ON skills(industry_id);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category_id);
CREATE INDEX IF NOT EXISTS idx_skills_name ON skills(name);
CREATE INDEX IF NOT EXISTS idx_category_suggestions_status ON category_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_professional_ratings_professional ON professional_ratings(professional_id);
CREATE INDEX IF NOT EXISTS idx_company_ratings_company ON company_ratings(company_id);
CREATE INDEX IF NOT EXISTS idx_user_rating_summary_user ON user_rating_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_user_rating_summary_rating ON user_rating_summary(overall_rating DESC);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to recalculate user rating summary
CREATE OR REPLACE FUNCTION recalculate_user_ratings(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_user_type TEXT;
  v_ratings RECORD;
BEGIN
  -- Get user type
  SELECT user_type INTO v_user_type FROM users WHERE id = p_user_id;
  
  IF v_user_type = 'worker' THEN
    -- Calculate from professional_ratings
    SELECT 
      COALESCE(AVG(overall_rating), 0) as overall,
      COUNT(*) as total,
      COALESCE(AVG(quality_rating), 0) as quality,
      COALESCE(AVG(communication_rating), 0) as communication,
      COALESCE(AVG(timeliness_rating), 0) as timeliness,
      COALESCE(AVG(professionalism_rating), 0) as professionalism,
      COALESCE(AVG(value_rating), 0) as value,
      COUNT(*) FILTER (WHERE overall_rating = 5) as five_star,
      COUNT(*) FILTER (WHERE overall_rating = 4) as four_star,
      COUNT(*) FILTER (WHERE overall_rating = 3) as three_star,
      COUNT(*) FILTER (WHERE overall_rating = 2) as two_star,
      COUNT(*) FILTER (WHERE overall_rating = 1) as one_star,
      COALESCE(100.0 * COUNT(*) FILTER (WHERE would_hire_again = true) / NULLIF(COUNT(*), 0), 0) as recommend_pct,
      MAX(created_at) as last_review
    INTO v_ratings
    FROM professional_ratings
    WHERE professional_id = p_user_id;
    
    INSERT INTO user_rating_summary (
      user_id, user_type, overall_rating, total_reviews,
      avg_quality, avg_communication, avg_timeliness, avg_professionalism, avg_value,
      five_star_count, four_star_count, three_star_count, two_star_count, one_star_count,
      would_recommend_percent, last_review_at, last_calculated_at
    ) VALUES (
      p_user_id, 'worker', v_ratings.overall, v_ratings.total,
      v_ratings.quality, v_ratings.communication, v_ratings.timeliness, v_ratings.professionalism, v_ratings.value,
      v_ratings.five_star, v_ratings.four_star, v_ratings.three_star, v_ratings.two_star, v_ratings.one_star,
      v_ratings.recommend_pct, v_ratings.last_review, NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
      overall_rating = EXCLUDED.overall_rating,
      total_reviews = EXCLUDED.total_reviews,
      avg_quality = EXCLUDED.avg_quality,
      avg_communication = EXCLUDED.avg_communication,
      avg_timeliness = EXCLUDED.avg_timeliness,
      avg_professionalism = EXCLUDED.avg_professionalism,
      avg_value = EXCLUDED.avg_value,
      five_star_count = EXCLUDED.five_star_count,
      four_star_count = EXCLUDED.four_star_count,
      three_star_count = EXCLUDED.three_star_count,
      two_star_count = EXCLUDED.two_star_count,
      one_star_count = EXCLUDED.one_star_count,
      would_recommend_percent = EXCLUDED.would_recommend_percent,
      last_review_at = EXCLUDED.last_review_at,
      last_calculated_at = NOW(),
      updated_at = NOW();
      
  ELSE
    -- Calculate from company_ratings
    SELECT 
      COALESCE(AVG(overall_rating), 0) as overall,
      COUNT(*) as total,
      COALESCE(AVG(payment_rating), 0) as payment,
      COALESCE(AVG(communication_rating), 0) as communication,
      COALESCE(AVG(requirements_clarity_rating), 0) as clarity,
      COALESCE(AVG(respect_rating), 0) as respect,
      COUNT(*) FILTER (WHERE overall_rating = 5) as five_star,
      COUNT(*) FILTER (WHERE overall_rating = 4) as four_star,
      COUNT(*) FILTER (WHERE overall_rating = 3) as three_star,
      COUNT(*) FILTER (WHERE overall_rating = 2) as two_star,
      COUNT(*) FILTER (WHERE overall_rating = 1) as one_star,
      COALESCE(100.0 * COUNT(*) FILTER (WHERE would_work_again = true) / NULLIF(COUNT(*), 0), 0) as recommend_pct,
      COALESCE(100.0 * COUNT(*) FILTER (WHERE paid_on_time = true) / NULLIF(COUNT(*), 0), 0) as on_time_pct,
      MAX(created_at) as last_review
    INTO v_ratings
    FROM company_ratings
    WHERE company_id = p_user_id;
    
    INSERT INTO user_rating_summary (
      user_id, user_type, overall_rating, total_reviews,
      avg_payment, avg_communication, avg_clarity, avg_respect,
      five_star_count, four_star_count, three_star_count, two_star_count, one_star_count,
      would_recommend_percent, on_time_payment_percent, last_review_at, last_calculated_at
    ) VALUES (
      p_user_id, 'client', v_ratings.overall, v_ratings.total,
      v_ratings.payment, v_ratings.communication, v_ratings.clarity, v_ratings.respect,
      v_ratings.five_star, v_ratings.four_star, v_ratings.three_star, v_ratings.two_star, v_ratings.one_star,
      v_ratings.recommend_pct, v_ratings.on_time_pct, v_ratings.last_review, NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
      overall_rating = EXCLUDED.overall_rating,
      total_reviews = EXCLUDED.total_reviews,
      avg_payment = EXCLUDED.avg_payment,
      avg_communication = EXCLUDED.avg_communication,
      avg_clarity = EXCLUDED.avg_clarity,
      avg_respect = EXCLUDED.avg_respect,
      five_star_count = EXCLUDED.five_star_count,
      four_star_count = EXCLUDED.four_star_count,
      three_star_count = EXCLUDED.three_star_count,
      two_star_count = EXCLUDED.two_star_count,
      one_star_count = EXCLUDED.one_star_count,
      would_recommend_percent = EXCLUDED.would_recommend_percent,
      on_time_payment_percent = EXCLUDED.on_time_payment_percent,
      last_review_at = EXCLUDED.last_review_at,
      last_calculated_at = NOW(),
      updated_at = NOW();
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to recalculate after new rating
CREATE OR REPLACE FUNCTION trigger_recalculate_ratings()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'professional_ratings' THEN
    PERFORM recalculate_user_ratings(NEW.professional_id);
  ELSIF TG_TABLE_NAME = 'company_ratings' THEN
    PERFORM recalculate_user_ratings(NEW.company_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_professional_rating_update
  AFTER INSERT OR UPDATE ON professional_ratings
  FOR EACH ROW
  EXECUTE FUNCTION trigger_recalculate_ratings();

CREATE TRIGGER trigger_company_rating_update
  AFTER INSERT OR UPDATE ON company_ratings
  FOR EACH ROW
  EXECUTE FUNCTION trigger_recalculate_ratings();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rating_summary ENABLE ROW LEVEL SECURITY;

-- Public read for reference data
CREATE POLICY industries_read_policy ON industries FOR SELECT USING (is_active = true);
CREATE POLICY skill_categories_read_policy ON skill_categories FOR SELECT USING (is_active = true);
CREATE POLICY skills_read_policy ON skills FOR SELECT USING (is_active = true);

-- Suggestions - users can create and view their own
CREATE POLICY category_suggestions_user_policy ON category_suggestions
  FOR ALL USING (auth.uid() = user_id);

-- Ratings - public view for public ratings
CREATE POLICY professional_ratings_read_policy ON professional_ratings
  FOR SELECT USING (is_public = true OR auth.uid() = professional_id OR auth.uid() = client_id);

CREATE POLICY company_ratings_read_policy ON company_ratings
  FOR SELECT USING (is_public = true OR auth.uid() = company_id OR auth.uid() = professional_id);

-- Rating summaries are public
CREATE POLICY user_rating_summary_read_policy ON user_rating_summary
  FOR SELECT USING (true);
