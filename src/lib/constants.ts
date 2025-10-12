// Application constants
export const RESUME_LIMIT = 4;
export const EDUCATIONAL_RESUME_LIMIT = 8;

// Educational email domain patterns
export const EDUCATIONAL_DOMAINS = [
  '.edu',          // United States
  '.ac.in',        // India  
  '.edu.in',       // India
  '.ac.uk',        // United Kingdom
  '.edu.au',       // Australia
  '.edu.de',       // Germany
  '.edu.fr',       // France
  '.ac.kr',        // South Korea
  '.ac.jp',        // Japan
];

// Helper function to check if email is educational
export function isEducationalEmail(email?: string | null): boolean {
  if (!email) return false;
  
  const emailLower = email.toLowerCase();
  return EDUCATIONAL_DOMAINS.some(domain => emailLower.endsWith(domain));
}

// Get the appropriate resume limit based on email
export function getResumeLimit(email?: string | null): number {
  return isEducationalEmail(email) ? EDUCATIONAL_RESUME_LIMIT : RESUME_LIMIT;
}
