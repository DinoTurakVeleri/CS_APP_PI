import { describe, it, expect } from 'vitest';

// Kopirana funkcija koju testiramo
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

describe('formatDate()', () => {
  it('formats a regular date correctly', () => {
    const input = new Date('2024-05-01');
    expect(formatDate(input)).toBe('2024-05-01');
  });

  it('pads single-digit months and days', () => {
    const input = new Date('2024-01-09');
    expect(formatDate(input)).toBe('2024-01-09');
  });

  it('handles leap year correctly', () => {
    const input = new Date('2024-02-29');
    expect(formatDate(input)).toBe('2024-02-29');
  });
});
