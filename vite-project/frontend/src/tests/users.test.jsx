import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import Users from '../pages/Users';

// Mock localStorage
vi.stubGlobal('localStorage', {
  getItem: vi.fn(() => 'mocked-token'),
});

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        { user_id: 1, name: 'Dino Turak', username: 'dturak', role: 'ADMIN' },
        { user_id: 2, name: 'Oscar Piastri', username: 'opiastri', role: 'USER' },
      ]),
  })
);

describe('Users komponenta', () => {
  it('prikazuje korisnike nakon dohvaćanja', async () => {
    await act(async () => {
      render(<Users />);
    });

    // Naslov
    expect(screen.getByText(/users/i)).toBeInTheDocument();

    // Čekamo da se podaci pojave u tablici
    await waitFor(() => {
      expect(screen.getByText('Dino Turak')).toBeInTheDocument();
      expect(screen.getByText('dturak')).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: 'ADMIN' })).toBeInTheDocument();

      expect(screen.getByText('Oscar Piastri')).toBeInTheDocument();
      expect(screen.getByText('opiastri')).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: 'USER' })).toBeInTheDocument();
    });
  });
});
