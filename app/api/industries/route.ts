import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Mock data for development
const MOCK_INDUSTRIES = [
  { id: '1', name: 'Information Technology', slug: 'it', icon: 'Monitor', color: 'sky', professional_count: 0 },
  { id: '2', name: 'Telecom', slug: 'telecom', icon: 'Radio', color: 'violet', professional_count: 0 },
  { id: '3', name: 'Cybersecurity', slug: 'cybersecurity', icon: 'Shield', color: 'red', professional_count: 0 },
  { id: '4', name: 'Design & Creative', slug: 'design', icon: 'Palette', color: 'pink', professional_count: 0 },
  { id: '5', name: 'Media & Entertainment', slug: 'media', icon: 'Film', color: 'purple', professional_count: 0 },
  { id: '6', name: 'Marketing & Advertising', slug: 'marketing', icon: 'Megaphone', color: 'orange', professional_count: 0 },
  { id: '7', name: 'Finance & Accounting', slug: 'finance', icon: 'Calculator', color: 'emerald', professional_count: 0 },
  { id: '8', name: 'Legal', slug: 'legal', icon: 'Scale', color: 'slate', professional_count: 0 },
  { id: '9', name: 'Human Resources', slug: 'hr', icon: 'Users', color: 'cyan', professional_count: 0 },
  { id: '10', name: 'Consulting', slug: 'consulting', icon: 'Briefcase', color: 'amber', professional_count: 0 },
  { id: '11', name: 'Healthcare', slug: 'healthcare', icon: 'Heart', color: 'rose', professional_count: 0 },
  { id: '12', name: 'Pharmaceuticals', slug: 'pharma', icon: 'Pill', color: 'teal', professional_count: 0 },
  { id: '13', name: 'Hospitality', slug: 'hospitality', icon: 'Hotel', color: 'yellow', professional_count: 0 },
  { id: '14', name: 'Real Estate', slug: 'realestate', icon: 'Building', color: 'stone', professional_count: 0 },
  { id: '15', name: 'Retail & E-commerce', slug: 'retail', icon: 'ShoppingBag', color: 'fuchsia', professional_count: 0 },
  { id: '16', name: 'Education', slug: 'education', icon: 'GraduationCap', color: 'indigo', professional_count: 0 },
  { id: '17', name: 'Training & Development', slug: 'training', icon: 'BookOpen', color: 'blue', professional_count: 0 },
  { id: '18', name: 'Engineering', slug: 'engineering', icon: 'Wrench', color: 'zinc', professional_count: 0 },
  { id: '19', name: 'Manufacturing', slug: 'manufacturing', icon: 'Factory', color: 'neutral', professional_count: 0 },
  { id: '20', name: 'Automotive', slug: 'automotive', icon: 'Car', color: 'gray', professional_count: 0 },
  { id: '21', name: 'Agriculture', slug: 'agriculture', icon: 'Leaf', color: 'lime', professional_count: 0 },
  { id: '22', name: 'Energy & Utilities', slug: 'energy', icon: 'Zap', color: 'green', professional_count: 0 },
  { id: '23', name: 'Logistics & Supply Chain', slug: 'logistics', icon: 'Truck', color: 'amber', professional_count: 0 },
  { id: '24', name: 'Government & Public Sector', slug: 'government', icon: 'Landmark', color: 'blue', professional_count: 0 },
  { id: '25', name: 'Non-Profit', slug: 'nonprofit', icon: 'HeartHandshake', color: 'rose', professional_count: 0 },
  { id: '99', name: 'Other', slug: 'other', icon: 'MoreHorizontal', color: 'slate', professional_count: 0 },
]

export async function GET() {
  try {
    // Return mock data for development
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ industries: MOCK_INDUSTRIES })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('industries')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching industries:', error)
      return NextResponse.json({ industries: MOCK_INDUSTRIES })
    }

    return NextResponse.json({ industries: data || MOCK_INDUSTRIES })
  } catch (error) {
    console.error('Error in industries API:', error)
    return NextResponse.json({ industries: MOCK_INDUSTRIES })
  }
}
