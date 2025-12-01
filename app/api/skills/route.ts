import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Mock skills data
const MOCK_SKILLS: Record<string, string[]> = {
  it: [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'React Native', 
    'Node.js', 'Angular', 'Vue.js', 'Next.js', 'Django', 'Flask',
    'Spring Boot', 'PostgreSQL', 'MongoDB', 'MySQL', 'Redis',
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
    'Terraform', 'CI/CD', 'GraphQL', 'REST API', 'Machine Learning',
    'TensorFlow', 'PyTorch', 'Data Science', 'Figma', 'Adobe XD',
    'Swift', 'Kotlin', 'Flutter', 'Go', 'Rust', 'PHP', 'Ruby',
    'C#', '.NET', 'Solidity', 'Unity', 'Unreal Engine'
  ],
  design: [
    'UI Design', 'UX Design', 'Graphic Design', 'Logo Design', 'Branding',
    'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InDesign',
    'After Effects', 'Motion Graphics', '3D Modeling', 'Blender', 'Cinema 4D',
    'Illustration', 'Typography', 'Web Design', 'Mobile Design', 'Print Design',
    'Product Design', 'Design Systems', 'Prototyping', 'Wireframing'
  ],
  marketing: [
    'Digital Marketing', 'SEO', 'SEM', 'Google Ads', 'Facebook Ads',
    'Social Media Marketing', 'Content Marketing', 'Email Marketing',
    'Marketing Automation', 'HubSpot', 'Mailchimp', 'Analytics',
    'Google Analytics', 'Copywriting', 'Brand Strategy', 'PR',
    'Influencer Marketing', 'Affiliate Marketing', 'Growth Hacking',
    'Market Research', 'Lead Generation', 'CRM', 'Salesforce'
  ],
  finance: [
    'Accounting', 'Bookkeeping', 'Tax Planning', 'GST', 'TDS',
    'Financial Analysis', 'Financial Modeling', 'Excel', 'Tally',
    'QuickBooks', 'Audit', 'Budgeting', 'Forecasting', 'Investment Analysis',
    'Risk Management', 'Payroll', 'Accounts Payable', 'Accounts Receivable',
    'Cost Accounting', 'Management Accounting', 'IFRS', 'GAAP'
  ],
  healthcare: [
    'Nursing', 'Patient Care', 'Medical Coding', 'Medical Billing',
    'Healthcare Administration', 'Clinical Research', 'Pharmacy',
    'Telemedicine', 'Health Informatics', 'Medical Writing',
    'Nutrition', 'Physical Therapy', 'Mental Health', 'Public Health',
    'Hospital Management', 'EMR/EHR', 'HIPAA Compliance'
  ],
  hospitality: [
    'Hotel Management', 'Front Office', 'Housekeeping', 'F&B Management',
    'Restaurant Management', 'Event Planning', 'Catering',
    'Travel Planning', 'Tour Operations', 'Customer Service',
    'Revenue Management', 'Hospitality Sales', 'Guest Relations',
    'Banquet Management', 'Reservation Systems'
  ],
  legal: [
    'Contract Law', 'Corporate Law', 'Intellectual Property', 'Litigation',
    'Legal Research', 'Legal Writing', 'Compliance', 'Regulatory Affairs',
    'Employment Law', 'Real Estate Law', 'Tax Law', 'Banking Law',
    'Mergers & Acquisitions', 'Due Diligence', 'Drafting', 'Negotiation'
  ],
  hr: [
    'Recruitment', 'Talent Acquisition', 'Employee Relations', 'Training',
    'Performance Management', 'Compensation & Benefits', 'HRIS',
    'Payroll Management', 'Labor Law', 'Organizational Development',
    'Change Management', 'Employer Branding', 'HR Analytics',
    'Succession Planning', 'Employee Engagement'
  ],
  engineering: [
    'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering',
    'AutoCAD', 'SolidWorks', 'CATIA', 'MATLAB', 'Structural Analysis',
    'Project Management', 'Quality Control', 'Manufacturing',
    'Robotics', 'PLC Programming', 'SCADA', 'Industrial Automation',
    'Process Engineering', 'Safety Engineering'
  ],
  telecom: [
    'Network Engineering', '5G', 'LTE', 'Fiber Optics', 'VoIP',
    'Network Security', 'Cisco', 'Juniper', 'RF Engineering',
    'Telecommunications', 'OSS/BSS', 'Network Operations',
    'Infrastructure', 'Cloud Networking', 'SDN', 'NFV'
  ],
  education: [
    'Teaching', 'Curriculum Development', 'E-Learning', 'Instructional Design',
    'Educational Technology', 'Assessment', 'Special Education',
    'STEM Education', 'Language Teaching', 'Online Teaching',
    'LMS Administration', 'Academic Writing', 'Research'
  ],
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const industrySlug = searchParams.get('industry')
    const search = searchParams.get('search')?.toLowerCase()

    // Return mock data for development
    if (!supabaseUrl || !supabaseServiceKey) {
      let skills: string[] = []
      
      if (industrySlug && MOCK_SKILLS[industrySlug]) {
        skills = MOCK_SKILLS[industrySlug]
      } else {
        // Return all skills
        skills = Object.values(MOCK_SKILLS).flat()
      }

      if (search) {
        skills = skills.filter(s => s.toLowerCase().includes(search))
      }

      // Remove duplicates and sort
      skills = [...new Set(skills)].sort()

      return NextResponse.json({ 
        skills: skills.map((name, i) => ({ 
          id: `${i}`, 
          name, 
          slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        }))
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    let query = supabase
      .from('skills')
      .select('*')
      .eq('is_active', true)

    if (industrySlug) {
      const { data: industry } = await supabase
        .from('industries')
        .select('id')
        .eq('slug', industrySlug)
        .single()

      if (industry) {
        query = query.eq('industry_id', industry.id)
      }
    }

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    const { data, error } = await query
      .order('usage_count', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error fetching skills:', error)
      return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 })
    }

    return NextResponse.json({ skills: data || [] })
  } catch (error) {
    console.error('Error in skills API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
