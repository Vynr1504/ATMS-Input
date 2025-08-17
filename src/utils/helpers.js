// Utility functions used across the application

/**
 * Format date to DD/MM/YYYY format
 * @param {Date} date - Date object to format
 * @returns {string} - Formatted date string
 */
export const formatDateStr = (date) =>
  `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;

/**
 * Parse date from DD/MM/YYYY format to Date object
 * @param {string} dateStr - Date string in DD/MM/YYYY format
 * @returns {Date} - Parsed Date object
 */
export const parseDateStr = (dateStr) => {
  const dateParts = dateStr?.split("/") || [];
  return dateParts.length === 3 
    ? new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`) 
    : new Date();
};

/**
 * Check if message indicates attendance already filled (case-insensitive)
 * @param {string} msg - Message to check
 * @returns {boolean} - True if message indicates already filled
 */
export const isAlreadyFilledMessage = (msg) => {
  return typeof msg === "string" && msg.trim().toLowerCase() === "already filled";
};

/**
 * Get last two digits of a number, padded with zeros
 * @param {number|string} num - Number to get last two digits from
 * @returns {string} - Last two digits padded with zeros
 */
export const getLastTwoDigits = (num) => {
  const numStr = num.toString();
  return numStr.slice(-2).padStart(2, '0');
};

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};
