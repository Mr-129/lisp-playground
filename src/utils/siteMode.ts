import { Problem, ProblemTier } from '../types';

export const LIMITED_FREE_CAMPAIGN = true;
export const COMMERCIAL_FEATURES_ENABLED = !LIMITED_FREE_CAMPAIGN;
export const CONTACT_PAGE_ENABLED = COMMERCIAL_FEATURES_ENABLED;
export const WAITLIST_ENABLED = COMMERCIAL_FEATURES_ENABLED;

export function getPublicProblemTier(problem: Pick<Problem, 'catalog'> | null | undefined): ProblemTier {
  if (LIMITED_FREE_CAMPAIGN) {
    return 'free';
  }

  return problem?.catalog?.tier ?? 'free';
}