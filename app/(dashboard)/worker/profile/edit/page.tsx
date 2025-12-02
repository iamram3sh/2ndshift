'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import apiClient from '@/lib/apiClient'
import { Camera, Mail, Phone, MapPin, Calendar, User, Briefcase, Award, Globe, Save, ArrowLeft, Building2 } from 'lucide-react'
import { IndustrySelector } from '@/components/categories/IndustrySelector'
import { SkillSelector } from '@/components/categories/SkillSelector'
import { SuggestCategoryModal } from '@/components/categories/SuggestCategoryModal'
import HomeButton from '@/components/worker/HomeButton'
import OutcomeBasedSkillsSection from '@/components/worker/OutcomeBasedSkillsSection'

export default function EditWorkerProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [showSuggestModal, setShowSuggestModal] = useState(false)
  const [industries, setIndustries] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    city: '',
    state: '',
    country: 'India',
    address: '',
    industry_id: '',
    profession: '',
    tagline: '',
    bio: '',
    hourly_rate: '',
    experience_years: '',
    years_in_industry: '',
    skills: [] as string[], // Legacy simple skills array
    languages: [] as string[],
    education: '',
    portfolio_url: '',
    linkedin_url: '',
    github_url: '',
    website_url: '',
    // New outcome-based skills
    outcomeSkills: [] as any[],
    workingPattern: 'flexible' as 'night' | 'weekend' | 'task_based' | 'flexible',
    availability: ''
  })

  useEffect(() => {
    fetchProfile()
    fetchIndustries()
  }, [])

  const fetchIndustries = async () => {
    try {
      const response = await fetch('/api/industries')
      const data = await response.json()
      setIndustries(data.industries || [])
    } catch (error) {
      console.error('Error fetching industries:', error)
    }
  }

  const getSelectedIndustrySlug = () => {
    const industry = industries.find(i => i.id === formData.industry_id)
    return industry?.slug || undefined
  }

  const fetchProfile = async () => {
    try {
      // Use v1 API for authentication
      const result = await apiClient.getCurrentUser()
      if (result.error || !result.data?.user) {
        router.push('/login')
        return
      }

      const currentUser = result.data.user
      
      // Check if user is a worker
      if (currentUser.role !== 'worker') {
        const routes: Record<string, string> = {
          client: '/client',
          admin: '/dashboard/admin',
          superadmin: '/dashboard/admin'
        }
        router.push(routes[currentUser.role] || '/login')
        return
      }

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      const { data: profileData } = await supabase
        .from('worker_profiles')
        .select('*')
        .eq('user_id', currentUser.id)
        .single()

      if (userData) {
        setUser(userData)
        setFormData(prev => ({
          ...prev,
          full_name: userData.full_name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          date_of_birth: userData.date_of_birth || '',
          gender: userData.gender || '',
          city: userData.city || '',
          state: userData.state || '',
          country: userData.country || 'India',
          address: userData.address || ''
        }))
      }

      if (profileData) {
        setProfile(profileData)
        
        // Parse outcome-based skills from availability_hours JSONB or separate field
        const availabilityData = profileData.availability_hours || {}
        const outcomeSkills = availabilityData.outcome_skills || []
        const workingPattern = availabilityData.working_pattern || 'flexible'
        const availability = availabilityData.availability || ''
        
        setFormData(prev => ({
          ...prev,
          industry_id: profileData.industry_id || '',
          profession: profileData.profession || '',
          tagline: profileData.tagline || '',
          bio: profileData.bio || '',
          hourly_rate: profileData.hourly_rate || '',
          experience_years: profileData.experience_years || '',
          years_in_industry: profileData.years_in_industry || '',
          skills: profileData.skills || [],
          languages: profileData.languages || [],
          education: profileData.education || '',
          portfolio_url: profileData.portfolio_url || '',
          linkedin_url: profileData.linkedin_url || '',
          github_url: profileData.github_url || '',
          website_url: profileData.website_url || '',
          outcomeSkills: outcomeSkills,
          workingPattern: workingPattern,
          availability: availability
        }))
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      console.log('Starting profile save...')
      
      // Prepare user data - only include non-empty values
      const userData: any = {
        full_name: formData.full_name,
      }
      
      // Add optional fields only if they have values
      if (formData.phone) userData.phone = formData.phone
      if (formData.date_of_birth) userData.date_of_birth = formData.date_of_birth
      if (formData.gender) userData.gender = formData.gender
      if (formData.city) userData.city = formData.city
      if (formData.state) userData.state = formData.state
      if (formData.country) userData.country = formData.country
      if (formData.address) userData.address = formData.address
      
      console.log('Updating users table with data:', userData)
      
      // Update users table
      const { error: userError } = await supabase
        .from('users')
        .update(userData)
        .eq('id', user.id)

      if (userError) {
        console.error('User update error:', userError)
        throw new Error(`Failed to update user info: ${userError.message}`)
      }

      console.log('Users table updated successfully')

      // Prepare worker profile data
      const profileData: any = {
        user_id: user.id,
        // Always include arrays (even if empty) to avoid NOT NULL constraint issues
        skills: formData.skills && formData.skills.length > 0 ? formData.skills : [],
        languages: formData.languages && formData.languages.length > 0 ? formData.languages : [],
      }
      
      // Add fields with proper type handling
      if (formData.profession) profileData.profession = formData.profession
      if (formData.tagline) profileData.tagline = formData.tagline
      if (formData.bio) profileData.bio = formData.bio
      
      // Handle industry
      if (formData.industry_id) profileData.industry_id = formData.industry_id
      
      // Handle numeric fields - only set if valid number
      if (formData.hourly_rate && formData.hourly_rate !== '') {
        const rate = parseFloat(formData.hourly_rate)
        if (!isNaN(rate) && rate >= 0) profileData.hourly_rate = rate
      }
      
      if (formData.experience_years && formData.experience_years !== '') {
        const years = parseInt(formData.experience_years)
        if (!isNaN(years) && years >= 0) profileData.experience_years = years
      }
      
      if (formData.years_in_industry && formData.years_in_industry !== '') {
        const years = parseInt(formData.years_in_industry)
        if (!isNaN(years) && years >= 0) profileData.years_in_industry = years
      }
      
      // URLs and text fields
      if (formData.education) profileData.education = formData.education
      if (formData.portfolio_url) profileData.portfolio_url = formData.portfolio_url
      if (formData.linkedin_url) profileData.linkedin_url = formData.linkedin_url
      if (formData.github_url) profileData.github_url = formData.github_url
      if (formData.website_url) profileData.website_url = formData.website_url
      
      // Store outcome-based skills in availability_hours JSONB field
      // Get existing availability data from profile state or initialize empty
      const existingAvailability = (profile && typeof profile.availability_hours === 'object' && profile.availability_hours) || {}
      profileData.availability_hours = {
        ...existingAvailability,
        outcome_skills: formData.outcomeSkills || [],
        working_pattern: formData.workingPattern || 'flexible',
        availability: formData.availability || ''
      }

      console.log('Upserting worker_profiles with data:', profileData)

      // Upsert worker_profiles table (insert or update)
      const { error: profileError } = await supabase
        .from('worker_profiles')
        .upsert(profileData, {
          onConflict: 'user_id'
        })

      if (profileError) {
        console.error('Worker profile update error:', profileError)
        throw new Error(`Failed to update worker profile: ${profileError.message}`)
      }

      console.log('Worker profile updated successfully')
      window.alert('Profile updated successfully!')
      router.push('/worker')
    } catch (error: any) {
      console.error('Error saving profile:', error)
      
      // Show detailed error message
      const errorMessage = error?.message || 'Unknown error occurred'
      window.alert(`Failed to save profile\n\nError: ${errorMessage}\n\nPlease check the browser console for more details.`)
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file)

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName)

      // Update user profile
      await supabase
        .from('users')
        .update({ profile_photo_url: publicUrl })
        .eq('id', user.id)

      window.alert('Photo uploaded successfully!')
      fetchProfile()
    } catch (error) {
      console.error('Error uploading photo:', error)
      window.alert('Failed to upload photo. You may need to set up Supabase Storage first.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-[#111] rounded-full animate-spin" />
          <span className="text-[#333]">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4 border-b border-slate-200 pb-6">
          <HomeButton variant="icon" />
          <div>
            <h1 className="text-3xl font-bold text-[#111]">Edit Profile</h1>
            <p className="text-[#333] mt-1">Complete your profile to increase your chances</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-8">
          {/* Profile Photo */}
          <div id="photo">
            <h3 className="text-lg font-bold text-[#111] mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Profile Photo
            </h3>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                {user?.profile_photo_url ? (
                  <img src={user.profile_photo_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <div>
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                <button
                  onClick={() => document.getElementById('photo-upload')?.click()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Upload Photo
                </button>
                <p className="text-sm text-[#333] mt-2">JPG, PNG or GIF. Max 5MB.</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div id="address">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">State *</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Full Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Industry Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Industry *
            </h3>
            <IndustrySelector
              selected={formData.industry_id}
              onSelect={(id) => setFormData({...formData, industry_id: id || ''})}
              onSuggestNew={() => setShowSuggestModal(true)}
              showSuggestOption={true}
            />
            <p className="text-sm text-[#333] mt-2">
              Select your primary industry. This helps clients find you for relevant projects.
            </p>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Professional Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Profession *</label>
                <input
                  type="text"
                  value={formData.profession}
                  onChange={(e) => setFormData({...formData, profession: e.target.value})}
                  placeholder="e.g., Full Stack Developer"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Professional Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                  placeholder="e.g., Building scalable web applications"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div id="rate">
                  <label className="block text-sm font-medium mb-2">Hourly Rate (₹) *</label>
                  <input
                    type="number"
                    value={formData.hourly_rate}
                    onChange={(e) => setFormData({...formData, hourly_rate: e.target.value})}
                    placeholder="500"
                    className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Total Experience (Years) *</label>
                  <input
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({...formData, experience_years: e.target.value})}
                    placeholder="5"
                    className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Years in This Industry</label>
                  <input
                    type="number"
                    value={formData.years_in_industry}
                    onChange={(e) => setFormData({...formData, years_in_industry: e.target.value})}
                    placeholder="3"
                    className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Outcome-Based Skills Section */}
          <div id="skills">
            <OutcomeBasedSkillsSection
              skills={formData.outcomeSkills}
              onSkillsChange={(skills) => setFormData({...formData, outcomeSkills: skills})}
              workingPattern={formData.workingPattern}
              onWorkingPatternChange={(pattern) => setFormData({...formData, workingPattern: pattern})}
              availability={formData.availability}
              onAvailabilityChange={(availability) => setFormData({...formData, availability})}
            />
          </div>

          {/* Legacy Skills (Hidden but kept for backward compatibility) */}
          <div className="hidden">
            <SkillSelector
              selectedSkills={formData.skills}
              onSkillsChange={(skills) => setFormData({...formData, skills})}
              industrySlug={getSelectedIndustrySlug()}
              placeholder="Search or add skills..."
              maxSkills={20}
              onSuggestNew={() => setShowSuggestModal(true)}
            />
          </div>

          {/* Bio */}
          <div id="bio">
            <h3 className="text-lg font-semibold mb-4">Professional Bio *</h3>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              rows={6}
              placeholder="Tell clients about your experience, expertise, and what makes you unique..."
              className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700"
            />
            <p className="text-sm text-[#333] mt-2">
              {formData.bio.length} / 100 characters minimum
            </p>
          </div>

          {/* Links */}
          <div id="portfolio">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Online Presence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Portfolio URL</label>
                <input
                  type="url"
                  value={formData.portfolio_url}
                  onChange={(e) => setFormData({...formData, portfolio_url: e.target.value})}
                  placeholder="https://yourportfolio.com"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">GitHub</label>
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                  placeholder="https://github.com/yourusername"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              onClick={() => router.push('/worker')}
              className="px-6 py-2 border rounded-lg hover:bg-gray-100  transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Suggest Category Modal */}
      <SuggestCategoryModal
        isOpen={showSuggestModal}
        onClose={() => setShowSuggestModal(false)}
        userId={user?.id || ''}
      />
    </div>
  )
}
