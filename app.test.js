const { escapeHtml, validateEmail, formatDate } = require('./src/utils');

describe('Utility Functions', () => {

  describe('escapeHtml', () => {
    test('should return empty string if input is falsy', () => {
      expect(escapeHtml('')).toBe('');
      expect(escapeHtml(null)).toBe('');
      expect(escapeHtml(undefined)).toBe('');
    });

    test('should escape special HTML characters', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
      expect(escapeHtml('John & Jane\'s App')).toBe('John &amp; Jane&#39;s App');
    });

    test('should not modify text without HTML characters', () => {
      expect(escapeHtml('Hello World 123')).toBe('Hello World 123');
    });
  });

  describe('validateEmail', () => {
    test('should return false for falsy or empty inputs', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
    });

    test('should return false if input is not a string type', () => {
      expect(validateEmail(12345)).toBe(false);
      expect(validateEmail({})).toBe(false);
    });

    test('should return true for valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@sub.domain.co')).toBe(true);
    });

    test('should return false for invalid emails', () => {
      expect(validateEmail('test')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@example')).toBe(false);
    });
  });

  describe('formatDate', () => {
    test('should return empty string for falsy inputs', () => {
      expect(formatDate('')).toBe('');
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
    });

    test('should format valid date strings and Date objects to YYYY-MM-DD', () => {
      expect(formatDate('2026-08-17T21:40:17')).toBe('2026-08-17');
      expect(formatDate(new Date('2026-09-15'))).toBe('2026-09-15');
    });

    test('should return empty string for invalid dates', () => {
      expect(formatDate('invalid-date')).toBe('');
    });
  });

});
