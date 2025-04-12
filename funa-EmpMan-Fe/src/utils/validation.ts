/**
 * Validate an email address
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate a phone number (simple validation)
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  // Remove spaces, dashes, and parentheses
  const cleaned = phoneNumber.replace(/[\s\-()]/g, '');
  // Check if it's all digits and has a reasonable length
  return /^\d{9,15}$/.test(cleaned);
};

/**
 * Validate a password (at least 8 characters, with at least one uppercase, one lowercase, and one number)
 */
export const isValidPassword = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  );
};

/**
 * Check if a string is empty or only whitespace
 */
export const isEmptyString = (str: string): boolean => {
  return str === null || str === undefined || str.trim() === '';
};

/**
 * Validate a date string (YYYY-MM-DD format)
 */
export const isValidDateString = (dateStr: string): boolean => {
  // Check format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;

  // Check if it's a valid date
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;

  // Check if the date string matches the parsed date
  const [year, month, day] = dateStr.split('-').map(Number);
  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
};
