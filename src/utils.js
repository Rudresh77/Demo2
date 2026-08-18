/**
 * Core utility functions for validation, escaping, and formatting.
 */

/**
 * Escapes HTML characters in a string to prevent XSS.
 * @param {string} str 
 * @returns {string}
 */
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g,
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag])
  );
}

/**
 * Validates whether an email format is correct.
 * @param {string} email 
 * @returns {boolean}
 */
function validateEmail(email) {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Formats a date string or object to YYYY-MM-DD .
 * @param {string|Date} date 
 * @returns {string}
 */
function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

module.exports = {
  escapeHtml,
  validateEmail,
  formatDate
};
