/**
 * Migration Helpers
 * Utilities to help migrate from old API to v1 API
 */

import apiClient from './apiClient';

/**
 * Migrate old shifts API calls to v1 credits API
 */
export async function migrateShiftsToCredits(userId: string) {
  // Old: /api/shifts/balance
  // New: /api/v1/credits/balance
  const result = await apiClient.getCreditsBalance();
  return result;
}

/**
 * Migrate old projects API to v1 jobs API
 */
export async function migrateProjectsToJobs() {
  // Old: /api/projects
  // New: /api/v1/jobs
  const result = await apiClient.listJobs();
  return result;
}

/**
 * Check if user is authenticated via v1 API
 */
export async function checkV1Auth(): Promise<boolean> {
  const result = await apiClient.getCurrentUser();
  return result.data !== null;
}
