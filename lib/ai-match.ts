import { ensureServerSide, supabaseAdmin } from '@/lib/supabase/admin'
import type { TalentRecommendation } from '@/types/database.types'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-large'

interface CandidateProfile {
  user_id: string
  full_name: string
  skills: string[]
  experience_years: number
  is_verified: boolean
  hourly_rate: number | null
  trust_score?: number | null
}

async function fetchProject(projectId: string) {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (error) {
    throw new Error(`Unable to load project ${projectId}: ${error.message}`)
  }

  return data
}

async function fetchCandidatePool(limit = 200): Promise<CandidateProfile[]> {
  const { data, error } = await supabaseAdmin
    .from('worker_profiles')
    .select('user_id, skills, experience_years, hourly_rate, is_verified, users(full_name, trust_score)')
    .order('updated_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Unable to fetch candidate pool: ${error.message}`)
  }

  return (
    data?.map((profile: any) => ({
      user_id: profile.user_id,
      full_name: profile.users?.full_name ?? 'Unnamed candidate',
      skills: profile.skills ?? [],
      experience_years: profile.experience_years ?? 0,
      is_verified: profile.is_verified ?? false,
      hourly_rate: profile.hourly_rate ?? null,
      trust_score: profile.users?.trust_score
    })) ?? []
  )
}

async function generateEmbedding(input: string): Promise<number[] | undefined> {
  if (!OPENAI_API_KEY) return undefined
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      input,
      model: EMBEDDING_MODEL
    })
  })

  if (!response.ok) {
    console.warn(`Embedding request failed: ${response.status} ${await response.text()}`)
    return undefined
  }

  const json = await response.json()
  return json?.data?.[0]?.embedding
}

function scoreCandidate(project: any, candidate: CandidateProfile) {
  const requiredSkills = project.required_skills ?? []
  const overlap = candidate.skills.filter((skill: string) =>
    requiredSkills.includes(skill)
  )
  const skillScore = requiredSkills.length ? overlap.length / requiredSkills.length : 0.3
  const experienceScore = Math.min(candidate.experience_years / 10, 1)
  const verificationBoost = candidate.is_verified ? 0.15 : 0
  const trustBoost = (candidate.trust_score ?? 50) / 500

  const score = Math.min((skillScore * 0.6 + experienceScore * 0.2 + verificationBoost + trustBoost), 1)
  return {
    score: Number((score * 100).toFixed(2)),
    explanation: `Skill overlap ${Math.round(skillScore * 100)}%, experience ${candidate.experience_years}y, trust ${candidate.trust_score ?? 'n/a'}`
  }
}

async function upsertRecommendation(payload: {
  projectId: string
  workerId: string
  score: number
  explanation: string
  embedding?: number[]
}) {
  const { error } = await supabaseAdmin.from('talent_recommendations').upsert(
    {
      project_id: payload.projectId,
      worker_id: payload.workerId,
      score: payload.score,
      explanation: payload.explanation,
      embedding: payload.embedding,
      metadata: { updated_at: new Date().toISOString() }
    },
    { onConflict: 'project_id,worker_id' }
  )

  if (error) {
    throw new Error(`Unable to save recommendation: ${error.message}`)
  }
}

export async function recomputeRecommendations(projectId: string) {
  ensureServerSide()

  const [project, candidates] = await Promise.all([fetchProject(projectId), fetchCandidatePool()])

  const projectSummary = `${project.title} ${project.description} ${project.required_skills?.join(', ') ?? ''}`
  const projectEmbedding = await generateEmbedding(projectSummary)

  await Promise.all(
    candidates.map(async (candidate) => {
      const candidateSummary = `${candidate.full_name} skills: ${candidate.skills.join(', ')} experience: ${candidate.experience_years} years`
      const embedding = projectEmbedding
        ? await generateEmbedding(`${projectSummary}\nCandidate:${candidateSummary}`)
        : undefined
      const { score, explanation } = scoreCandidate(project, candidate)
      await upsertRecommendation({
        projectId,
        workerId: candidate.user_id,
        score,
        explanation,
        embedding: embedding ?? projectEmbedding
      })
    })
  )
}

export async function getTopRecommendations(projectId: string, limit = 10): Promise<TalentRecommendation[]> {
  ensureServerSide()

  const { data, error } = await supabaseAdmin
    .from('talent_recommendations')
    .select('*')
    .eq('project_id', projectId)
    .order('score', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Unable to load recommendations: ${error.message}`)
  }

  return data as TalentRecommendation[]
}
