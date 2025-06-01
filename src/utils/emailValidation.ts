/**
 * Email validation utility
 * Provides consistent email validation across the application
 */

// List of suggested domains that are valid
export const SUGGESTED_DOMAINS = [
  'gmail.com',
  'outlook.com',
  'hotmail.com',
  'yahoo.com'
];

export interface EmailValidationResult {
  valid: boolean;
  message: string;
}

/**
 * Validates an email address for format
 * @param email Email address to validate
 * @returns Validation result with status and message
 */
export const validateEmail = (email: string): EmailValidationResult => {
  // Remove spaces and convert to lowercase
  const normalizedEmail = email.trim().toLowerCase();
  
  if (!normalizedEmail) {
    return { valid: false, message: "" };
  }
  
  // Check basic email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return {
      valid: false,
      message: "Formato de e-mail inválido."
    };
  }
  
  // Email is valid - removed the domain blocking checks
  return { valid: true, message: "" };
};

/**
 * Gets a suggestion message for valid email domains
 * @returns Message with suggested domains
 */
export const getEmailSuggestion = (): string => {
  return `Use um e-mail pessoal válido como ${SUGGESTED_DOMAINS.join(' ou ')}`;
};

/**
 * Normalizes an email by trimming spaces and converting to lowercase
 * @param email Email to normalize
 * @returns Normalized email
 */
export const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
}; 