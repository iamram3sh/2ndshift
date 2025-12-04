/**
 * TanStack Query (React Query) hooks for 2ndShift V1
 * Centralized data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from './apiClient'
import type { Job, Application, CreateJobPayload, ApplyToJobPayload, JobFilters } from '@/types/jobs'

// ============================================
// QUERY KEYS
// ============================================

export const queryKeys = {
  jobs: {
    all: ['jobs'] as const,
    lists: () => [...queryKeys.jobs.all, 'list'] as const,
    list: (filters?: JobFilters) => [...queryKeys.jobs.lists(), filters] as const,
    details: () => [...queryKeys.jobs.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.jobs.details(), id] as const,
  },
  applications: {
    all: ['applications'] as const,
    byJob: (jobId: string) => [...queryKeys.applications.all, 'job', jobId] as const,
  },
  categories: {
    all: ['categories'] as const,
    list: () => [...queryKeys.categories.all, 'list'] as const,
  },
  user: {
    current: ['user', 'current'] as const,
    credits: ['user', 'credits'] as const,
  },
}

// ============================================
// JOBS QUERIES
// ============================================

/**
 * Fetch open tasks (filterable by category and minPrice ≥ 50)
 */
export function useOpenTasks(filters?: JobFilters) {
  return useQuery({
    queryKey: queryKeys.jobs.list({ ...(filters || {}), status: 'open', role: 'worker' }),
    queryFn: async () => {
      const params: any = {
        role: 'worker',
        status: 'open',
        ...(filters || {}),
      }
      
      const result = await apiClient.listJobs(params)
      
      if (result.error) {
        const errorMessage = result.error.message || result.error.error || 'Failed to fetch tasks'
        console.error('Error fetching tasks:', result.error)
        throw new Error(errorMessage)
      }
      
      // Ensure we have data
      if (!result.data) {
        console.warn('No data returned from API, returning empty array')
        return []
      }
      
      // Filter by minPrice if provided
      let jobs = result.data.jobs || []
      if (filters?.minPrice && filters.minPrice >= 50) {
        jobs = jobs.filter((job: Job) => {
          const price = job.price_fixed || 0
          return price >= filters.minPrice!
        })
      }
      
      // Filter by search query if provided
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase()
        jobs = jobs.filter((job: Job) => 
          job.title.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower)
        )
      }
      
      return jobs as Job[]
    },
    enabled: !!filters, // Only run when filters are provided (user is authenticated)
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
    retry: 1, // Only retry once on failure
  })
}

/**
 * Fetch job details by ID
 */
export function useJob(jobId: string | null) {
  return useQuery({
    queryKey: queryKeys.jobs.detail(jobId || ''),
    queryFn: async () => {
      if (!jobId) return null
      
      const result = await apiClient.getJob(jobId)
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to fetch job')
      }
      
      return result.data?.job as Job
    },
    enabled: !!jobId,
    staleTime: 30000,
  })
}

/**
 * Fetch jobs for client (their posted tasks)
 */
export function useClientJobs(filters?: JobFilters) {
  return useQuery({
    queryKey: queryKeys.jobs.list({ ...filters, role: 'client' }),
    queryFn: async () => {
      const params: any = {
        role: 'client',
        ...filters,
      }
      
      const result = await apiClient.listJobs(params)
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to fetch jobs')
      }
      
      return result.data?.jobs as Job[]
    },
    staleTime: 30000,
  })
}

// ============================================
// JOBS MUTATIONS
// ============================================

/**
 * Create a new task (employer)
 */
export function useCreateJob() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (payload: CreateJobPayload) => {
      const result = await apiClient.createJob(payload)
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to create task')
      }
      
      return result.data?.job as Job
    },
    onSuccess: () => {
      // Invalidate and refetch jobs lists
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() })
    },
  })
}

/**
 * Place a bid on a job (worker)
 */
export function usePlaceBid() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ jobId, payload }: { jobId: string; payload: ApplyToJobPayload }) => {
      const result = await apiClient.applyToJob(jobId, payload)
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to place bid')
      }
      
      return result.data?.application as Application
    },
    onSuccess: (_, variables) => {
      // Invalidate job details and applications
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(variables.jobId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.byJob(variables.jobId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.user.credits })
    },
  })
}

/**
 * Accept a bid (employer)
 */
export function useAcceptBid() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ jobId, applicationId }: { jobId: string; applicationId: string }) => {
      const result = await apiClient.acceptProposal(jobId, applicationId)
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to accept bid')
      }
      
      return result.data?.job as Job
    },
    onSuccess: (_, variables) => {
      // Invalidate job details and lists
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(variables.jobId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.byJob(variables.jobId) })
    },
  })
}

/**
 * Release escrow payment (employer)
 */
export function useReleaseEscrow() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (jobId: string) => {
      const result = await apiClient.approveJob(jobId)
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to release payment')
      }
      
      return result.data?.job as Job
    },
    onSuccess: (_, jobId) => {
      // Invalidate job details
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() })
    },
  })
}

// ============================================
// CATEGORIES QUERIES
// ============================================

/**
 * Fetch all categories
 */
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: async () => {
      const result = await apiClient.listCategories()
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to fetch categories')
      }
      
      return result.data?.categories || []
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// ============================================
// USER QUERIES
// ============================================

/**
 * Fetch current user
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.user.current,
    queryFn: async () => {
      const result = await apiClient.getCurrentUser({ skipRedirect: true })
      
      if (result.error) {
        return null
      }
      
      return result.data?.user || null
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}

/**
 * Fetch user's credits balance
 */
export function useCreditsBalance() {
  return useQuery({
    queryKey: queryKeys.user.credits,
    queryFn: async () => {
      const result = await apiClient.getCreditsBalance()
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to fetch credits')
      }
      
      if (result.data && typeof result.data === 'object' && 'balance' in result.data) {
        return (result.data as any).balance || 0
      }
      
      return 0
    },
    staleTime: 30000,
  })
}
