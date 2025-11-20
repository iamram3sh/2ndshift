'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Camera, Mail, Phone, MapPin, Calendar, User, Briefcase, Award, Globe, Save, ArrowLeft } from 'lucide-react'
import SkillAutocomplete from '@/components/shared/SkillAutocomplete'

export default function EditWorkerProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  
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
    profession: '',
    tagline: '',
    bio: '',
    hourly_rate: '',
    experience_years: '',
    skills: [] as string[],
    languages: [] as string[],
    education: '',
    portfolio_url: '',
    linkedin_url: '',
    github_url: '',
    website_url: ''
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/login')
        return
      }

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      const { data: profileData } = await supabase
        .from('worker_profiles')
        .select('*')
        .eq('user_id', authUser.id)
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
        setFormData(prev => ({
          ...prev,
          profession: profileData.profession || '',
          tagline: profileData.tagline || '',
          bio: profileData.bio || '',
          hourly_rate: profileData.hourly_rate || '',
          experience_years: profileData.experience_years || '',
          skills: profileData.skills || [],
          languages: profileData.languages || [],
          education: profileData.education || '',
          portfolio_url: profileData.portfolio_url || '',
          linkedin_url: profileData.linkedin_url || '',
          github_url: profileData.github_url || '',
          website_url: profileData.website_url || ''
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
      // Update users table
      const { error: userError } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          address: formData.address
        })
        .eq('id', user.id)

      if (userError) throw userError

      // Upsert worker_profiles table (insert or update)
      const { error: profileError } = await supabase
        .from('worker_profiles')
        .upsert({
          user_id: user.id,
          profession: formData.profession,
          tagline: formData.tagline,
          bio: formData.bio,
          hourly_rate: parseFloat(formData.hourly_rate) || 0,
          experience_years: parseInt(formData.experience_years) || 0,
          skills: formData.skills,
          languages: formData.languages,
          education: formData.education,
          portfolio_url: formData.portfolio_url,
          linkedin_url: formData.linkedin_url,
          github_url: formData.github_url,
          website_url: formData.website_url
        }, {
          onConflict: 'user_id'
        })

      if (profileError) throw profileError

      alert('Profile updated successfully!')
      router.push('/worker')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile')
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

      alert('Photo uploaded successfully!')
      fetchProfile()
    } catch (error) {
      console.error('Error uploading photo:', error)
      alert('Failed to upload photo. You may need to set up Supabase Storage first.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => router.push('/worker')}
            className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
            <p className="text-gray-600 dark:text-gray-400">Complete your profile to increase your chances</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-8">
          {/* Profile Photo */}
          <div id="photo">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Profile Photo
            </h3>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
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
                <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF. Max 5MB.</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium mb-2">Years of Experience *</label>
                  <input
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({...formData, experience_years: e.target.value})}
                    placeholder="5"
                    className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div id="skills">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Skills *
            </h3>
            <SkillAutocomplete
              selectedSkills={formData.skills}
              onSkillsChange={(skills) => setFormData({...formData, skills})}
              placeholder="Search or add skills..."
              maxSkills={20}
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
            <p className="text-sm text-gray-500 mt-2">
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
              className="px-6 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition"
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
    </div>
  )
}
