/**
 * Shared code between client and server
 * API interfaces and constants for the ATS Resume Scoring application
 */

// Authentication constants
export const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup'
};

// Analysis endpoints
export const ANALYSIS_ENDPOINTS = {
  ANALYZE: '/api/analyze',
  HISTORY: '/api/history'
};

// User model structure (for reference)
export const USER_FIELDS = {
  id: 'string',
  username: 'string',
  createdAt: 'string'
};

// Resume analysis model structure (for reference)
export const RESUME_ANALYSIS_FIELDS = {
  id: 'string',
  userId: 'string',
  fileName: 'string',
  jobDescription: 'string',
  atsScore: 'number',
  suggestions: 'array',
  improvements: 'array',
  matchedSkills: 'array',
  missingSkills: 'array',
  createdAt: 'string'
};

// Helper functions for API responses
export const createAuthResponse = (success, user = null, token = null, message = null) => ({
  success,
  user,
  token,
  message
});

export const createAnalysisResponse = (success, analysis = null, message = null) => ({
  success,
  analysis,
  message
});

export const createHistoryResponse = (success, analyses = []) => ({
  success,
  analyses
});

// Validation helpers
export const validateLoginRequest = (data) => {
  const { username, password } = data;
  return username && password;
};

export const validateSignupRequest = (data) => {
  const { username, password } = data;
  // Require username and password with minimum length 6
  return username && password && password.length >= 6;
};

export const validateAnalyzeRequest = (data) => {
  const { resumeText, jobDescription } = data;
  return resumeText && jobDescription;
};
