// This file contains validation helpers for form inputs

// Validation rules
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const URL_REGEX = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;

// More comprehensive phone regex that handles international formats
// Supports formats like:
// - US: (123) 456-7890, 123-456-7890, 123.456.7890
// - International: +1 123 456 7890, +44 20 1234 5678
const PHONE_REGEX = /^(\+\d{1,4}[ -]?)?((\(\d{1,4}\))|\d{1,4})[ -]?\d{1,4}[ -]?\d{1,9}( *[x/#]\d{1,6})?$/;

// LinkedIn URL regex
const LINKEDIN_REGEX = /^(https?:\/\/)?(www\.)?linkedin\.com\/((in\/[a-zA-Z0-9_-]+)|(company\/[a-zA-Z0-9_-]+))?\/?$/;

// Date validation regex (YYYY-MM-DD format)
const DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

// Individual field validation functions
export const validateRequired = (value: string): string => {
  return value && value.trim() ? '' : 'This field is required';
};

export const validateEmail = (value: string): string => {
  if (!value) return 'Email is required';
  return EMAIL_REGEX.test(value) ? '' : 'Please enter a valid email address';
};

export const validateUrl = (value: string): string => {
  if (!value) return '';
  return URL_REGEX.test(value) ? '' : 'Please enter a valid URL (e.g., https://example.com)';
};

export const validatePhone = (value: string): string => {
  if (!value) return '';
  
  // Clean up the phone number for validation (remove spaces, dashes, etc.)
  const cleanedValue = value.replace(/\s+/g, '').replace(/-/g, '').replace(/\(/g, '').replace(/\)/g, '');
  
  // Perform basic length check first
  if (cleanedValue.length < 7 || cleanedValue.length > 15) {
    return 'Phone number must be between 7 and 15 digits';
  }
  
  // Now check the full pattern
  return PHONE_REGEX.test(value) ? '' : 'Please enter a valid phone number (e.g., +1 123-456-7890)';
};

export const validateLinkedIn = (value: string): string => {
  if (!value) return '';
  
  // First check if it's a valid URL
  if (!URL_REGEX.test(value)) {
    return 'Please enter a valid URL';
  }
  
  // Then check if it's specifically a LinkedIn URL
  if (value.includes('linkedin.com')) {
    return LINKEDIN_REGEX.test(value) ? '' : 'Please enter a valid LinkedIn profile URL (e.g., https://www.linkedin.com/in/username)';
  }
  
  return '';
};

export const validateDate = (value: string, compareDate?: string, isBefore = false): string => {
  if (!value) return '';
  
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return 'Please enter a valid date';
    }
    
    if (compareDate && isBefore) {
      const compareValue = new Date(compareDate);
      if (date > compareValue) {
        return 'Start date must be before end date';
      }
    }
    
    if (compareDate && !isBefore) {
      const compareValue = new Date(compareDate);
      if (date < compareValue) {
        return 'End date must be after start date';
      }
    }
    
    return '';
  } catch (error) {
    return 'Please enter a valid date';
  }
};

// Form object validation
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface PersonalInfoValidation {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedin: string;
  website: string;
}

export const validatePersonalInfo = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};
  
  errors.firstName = validateRequired(data.firstName);
  errors.lastName = validateRequired(data.lastName);
  errors.email = validateEmail(data.email);
  errors.phone = validatePhone(data.phone);
  errors.linkedin = validateUrl(data.linkedin);
  errors.website = validateUrl(data.website);
  
  // Remove empty error messages
  Object.keys(errors).forEach(key => {
    if (!errors[key]) {
      delete errors[key];
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateWorkExperience = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};
  
  errors.title = validateRequired(data.title);
  errors.company = validateRequired(data.company);
  errors.location = validateRequired(data.location);
  errors.startDate = validateRequired(data.startDate);
  
  if (!data.current) {
    errors.endDate = validateRequired(data.endDate);
    if (data.startDate && data.endDate) {
      const dateError = validateDate(data.startDate, data.endDate, true);
      if (dateError) {
        errors.startDate = dateError;
      }
    }
  }
  
  // Remove empty error messages
  Object.keys(errors).forEach(key => {
    if (!errors[key]) {
      delete errors[key];
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateEducation = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};
  
  errors.degree = validateRequired(data.degree);
  errors.school = validateRequired(data.school);
  errors.startDate = validateRequired(data.startDate);
  errors.endDate = validateRequired(data.endDate);
  
  if (data.startDate && data.endDate) {
    const dateError = validateDate(data.startDate, data.endDate, true);
    if (dateError) {
      errors.startDate = dateError;
    }
  }
  
  // Remove empty error messages
  Object.keys(errors).forEach(key => {
    if (!errors[key]) {
      delete errors[key];
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateSkill = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};
  
  errors.name = validateRequired(data.name);
  
  // Remove empty error messages
  Object.keys(errors).forEach(key => {
    if (!errors[key]) {
      delete errors[key];
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateProject = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};
  
  errors.title = validateRequired(data.title);
  errors.description = validateRequired(data.description);
  errors.link = validateUrl(data.link);
  
  // Remove empty error messages
  Object.keys(errors).forEach(key => {
    if (!errors[key]) {
      delete errors[key];
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
