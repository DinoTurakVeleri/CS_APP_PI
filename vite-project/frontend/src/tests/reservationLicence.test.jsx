import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ReservationLicence from '../pages/ReservationLicence';
import '@testing-library/jest-dom';

vi.stubGlobal('localStorage', {
  getItem: vi.fn((key) => {
    if (key === 'token') return 'mock-token';
    if (key === 'reservedLicence') return null;
    return null;
  }),
  setItem: vi.fn(),
  removeItem: vi.fn(),
});

describe('ReservationLicence komponenta', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Mock fetch za /api/users/me i /api/free-licences
    vi.stubGlobal('fetch', vi.fn((url) => {
      if (url.includes('/api/users/me')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ username: 'trainer1' }),
        });
      }

      if (url.includes('/api/free-licences')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { id: 1, name: 'Photoshop', type: 'Design' },
              { id: 2, name: 'Excel', type: 'Office' },
            ]),
        });
      }

      return Promise.reject(new Error('Nepoznat endpoint'));
    }));
  });

  it('prikazuje naslov, gumb i licence', async () => {
    render(<ReservationLicence />);

    // Naslov
    expect(
      screen.getByRole('heading', { name: /reserve a licence/i })
    ).toBeInTheDocument();

    // Gumb "Reserve"
    expect(
      screen.getByRole('button', { name: /^reserve$/i })
    ).toBeInTheDocument();

    // Licence iz selecta
    await waitFor(() => {
      expect(screen.getByText(/photoshop/i)).toBeInTheDocument();
      expect(screen.getByText(/excel/i)).toBeInTheDocument();
    });
  });
});
