// ============================================
// 2NDSHIFT - SMART MATCH AI SERVICE
// Intelligent job-worker matching algorithm
// ============================================

import { supabaseAdmin } from './supabase/admin'

interface MatchFactors {
  skillMatch: number      // 0-100
  experienceMatch: number // 0-100
  rateMatch: number       // 0-100
  availabilityMatch: number // 0-100
  successRateMatch: number // 0-100
  locationMatch: number   // 0-100
}

interface WorkerProfile {
  user_id: string
  skills: string[]
  experience_years: number
  hourly_rate: number
  availability_status: string
  is_verified: boolean
  rating?: number
  completed_projects?: number
  location?: string
}

interface Project {
  id: string
  title: string
  required_skills: string[]
  budget: number
  duration_hours: number
  experience_level?: string
  location_preference?: string
  client_id: string
}

// Weights for each matching factor (must sum to 100)
const MATCH_WEIGHTS = {
  skillMatch: 35,
  experienceMatch: 15,
  rateMatch: 20,
  availabilityMatch: 10,
  successRateMatch: 15,
  locationMatch: 5,
}

/**
 * Calculate match score between a worker and a project
 */
export function calculateMatchScore(
  worker: WorkerProfile,
  project: Project
): { score: number; factors: MatchFactors } {
  const factors: MatchFactors = {
    skillMatch: calculateSkillMatch(worker.skills, project.required_skills),
    experienceMatch: calculateExperienceMatch(worker.experience_years, project.experience_level),
    rateMatch: calculateRateMatch(worker.hourly_rate, project.budget, project.duration_hours),
    availabilityMatch: calculateAvailabilityMatch(worker.availability_status),
    successRateMatch: calculateSuccessRateMatch(worker.rating, worker.completed_projects, worker.is_verified),
    locationMatch: calculateLocationMatch(worker.location, project.location_preference),
  }

  const weightedScore = 
    (factors.skillMatch * MATCH_WEIGHTS.skillMatch +
     factors.experienceMatch * MATCH_WEIGHTS.experienceMatch +
     factors.rateMatch * MATCH_WEIGHTS.rateMatch +
     factors.availabilityMatch * MATCH_WEIGHTS.availabilityMatch +
     factors.successRateMatch * MATCH_WEIGHTS.successRateMatch +
     factors.locationMatch * MATCH_WEIGHTS.locationMatch) / 100

  return {
    score: Math.round(weightedScore),
    factors,
  }
}

/**
 * Calculate skill match percentage
 */
function calculateSkillMatch(workerSkills: string[], requiredSkills: string[]): number {
  if (!requiredSkills.length) return 100
  if (!workerSkills.length) return 0

  const normalizedWorkerSkills = workerSkills.map(s => s.toLowerCase().trim())
  const normalizedRequiredSkills = requiredSkills.map(s => s.toLowerCase().trim())

  let matchCount = 0
  for (const required of normalizedRequiredSkills) {
    // Check for exact or partial match
    const hasMatch = normalizedWorkerSkills.some(ws => 
      ws === required || 
      ws.includes(required) || 
      required.includes(ws) ||
      areSimilarSkills(ws, required)
    )
    if (hasMatch) matchCount++
  }

  return Math.round((matchCount / normalizedRequiredSkills.length) * 100)
}

/**
 * Check if two skills are similar (handles variations)
 */
function areSimilarSkills(skill1: string, skill2: string): boolean {
  const skillMappings: Record<string, string[]> = {
    'javascript': ['js', 'es6', 'es2015', 'ecmascript'],
    'typescript': ['ts'],
    'react': ['reactjs', 'react.js'],
    'node': ['nodejs', 'node.js'],
    'python': ['py', 'python3'],
    'machine learning': ['ml', 'deep learning', 'ai'],
    'css': ['css3', 'styles', 'styling'],
    'html': ['html5'],
    'database': ['db', 'sql', 'nosql'],
    'aws': ['amazon web services', 'cloud'],
    'ui': ['user interface', 'interface design'],
    'ux': ['user experience'],
  }

  for (const [main, aliases] of Object.entries(skillMappings)) {
    const allVariants = [main, ...aliases]
    if (allVariants.includes(skill1) && allVariants.includes(skill2)) {
      return true
    }
  }

  return false
}

/**
 * Calculate experience match
 */
function calculateExperienceMatch(workerYears: number, requiredLevel?: string): number {
  if (!requiredLevel) return 80 // No requirement = neutral

  const levelRanges: Record<string, [number, number]> = {
    'entry': [0, 2],
    'junior': [1, 3],
    'intermediate': [2, 5],
    'mid': [3, 6],
    'senior': [5, 10],
    'expert': [8, 20],
    'lead': [7, 15],
  }

  const range = levelRanges[requiredLevel.toLowerCase()]
  if (!range) return 70

  if (workerYears >= range[0] && workerYears <= range[1]) {
    return 100
  } else if (workerYears > range[1]) {
    // Overqualified - still good but slightly lower
    return 85
  } else {
    // Under-experienced
    const deficit = range[0] - workerYears
    return Math.max(0, 100 - (deficit * 25))
  }
}

/**
 * Calculate rate compatibility
 */
function calculateRateMatch(
  workerHourlyRate: number, 
  projectBudget: number, 
  durationHours: number
): number {
  if (!workerHourlyRate || !projectBudget || !durationHours) return 70

  const impliedHourlyRate = projectBudget / durationHours
  const rateDiff = Math.abs(workerHourlyRate - impliedHourlyRate) / impliedHourlyRate

  if (rateDiff <= 0.1) return 100 // Within 10%
  if (rateDiff <= 0.2) return 90  // Within 20%
  if (rateDiff <= 0.3) return 75  // Within 30%
  if (rateDiff <= 0.5) return 50  // Within 50%
  return 25 // More than 50% difference
}

/**
 * Calculate availability score
 */
function calculateAvailabilityMatch(status: string): number {
  const scores: Record<string, number> = {
    'available': 100,
    'open_to_offers': 85,
    'partially_available': 70,
    'busy': 40,
    'not_available': 0,
  }
  return scores[status?.toLowerCase()] ?? 60
}

/**
 * Calculate success rate based on profile
 */
function calculateSuccessRateMatch(
  rating?: number,
  completedProjects?: number,
  isVerified?: boolean
): number {
  let score = 50 // Base score

  if (rating) {
    // Rating contributes up to 30 points (5 stars = 30)
    score += (rating / 5) * 30
  }

  if (completedProjects) {
    // Experience contributes up to 15 points
    const experienceBonus = Math.min(completedProjects * 1.5, 15)
    score += experienceBonus
  }

  if (isVerified) {
    score += 5
  }

  return Math.min(100, Math.round(score))
}

/**
 * Calculate location match
 */
function calculateLocationMatch(workerLocation?: string, preference?: string): number {
  if (!preference || preference === 'remote' || preference === 'any') return 100
  if (!workerLocation) return 70

  const workerLoc = workerLocation.toLowerCase()
  const prefLoc = preference.toLowerCase()

  if (workerLoc.includes(prefLoc) || prefLoc.includes(workerLoc)) {
    return 100
  }

  // Check for same country/region
  const indianCities = ['mumbai', 'delhi', 'bangalore', 'bengaluru', 'chennai', 'hyderabad', 'pune', 'kolkata']
  if (indianCities.some(c => workerLoc.includes(c)) && indianCities.some(c => prefLoc.includes(c))) {
    return 80 // Same country
  }

  return 50
}

/**
 * Generate smart matches for a project
 */
export async function generateMatchesForProject(projectId: string): Promise<void> {
  try {
    // Get project details
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (projectError || !project) {
      console.error('Project not found:', projectError)
      return
    }

    // Get all available workers with profiles
    const { data: workers, error: workersError } = await supabaseAdmin
      .from('worker_profiles')
      .select(`
        *,
        user:users(id, full_name, email)
      `)
      .eq('availability_status', 'available')
      .or('availability_status.eq.open_to_offers')

    if (workersError || !workers) {
      console.error('Error fetching workers:', workersError)
      return
    }

    // Calculate matches for each worker
    const matches = workers.map(worker => {
      const { score, factors } = calculateMatchScore(
        {
          user_id: worker.user_id,
          skills: worker.skills || [],
          experience_years: worker.experience_years || 0,
          hourly_rate: worker.hourly_rate || 0,
          availability_status: worker.availability_status || 'available',
          is_verified: worker.is_verified || false,
          rating: worker.rating,
          completed_projects: worker.completed_projects,
          location: worker.location,
        },
        project
      )

      return {
        worker_id: worker.user_id,
        project_id: projectId,
        match_score: score,
        skill_match_score: factors.skillMatch,
        experience_match_score: factors.experienceMatch,
        rate_match_score: factors.rateMatch,
        availability_score: factors.availabilityMatch,
        success_rate_score: factors.successRateMatch,
        location_score: factors.locationMatch,
        is_featured: score >= 80,
      }
    })

    // Filter to only good matches (score >= 50)
    const goodMatches = matches.filter(m => m.match_score >= 50)

    // Insert or update matches
    if (goodMatches.length > 0) {
      const { error: insertError } = await supabaseAdmin
        .from('smart_matches')
        .upsert(goodMatches, { onConflict: 'worker_id,project_id' })

      if (insertError) {
        console.error('Error inserting matches:', insertError)
      }
    }
  } catch (error) {
    console.error('Error generating matches:', error)
  }
}

/**
 * Get top matches for a worker
 */
export async function getMatchesForWorker(
  workerId: string,
  limit: number = 10
): Promise<any[]> {
  const { data, error } = await supabaseAdmin
    .from('smart_matches')
    .select(`
      *,
      project:projects(*)
    `)
    .eq('worker_id', workerId)
    .gte('match_score', 50)
    .order('match_score', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching matches for worker:', error)
    return []
  }

  return data || []
}

/**
 * Get top worker matches for a project
 */
export async function getMatchesForProject(
  projectId: string,
  limit: number = 20
): Promise<any[]> {
  const { data, error } = await supabaseAdmin
    .from('smart_matches')
    .select(`
      *,
      worker:users!smart_matches_worker_id_fkey(
        id,
        full_name,
        email
      )
    `)
    .eq('project_id', projectId)
    .gte('match_score', 50)
    .order('match_score', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching matches for project:', error)
    return []
  }

  return data || []
}
